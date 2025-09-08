const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer);

  const { jwtVerify } = require('jose');
  const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? 'change-me');
  const { parse } = require('cookie');
  const connectedUsers = new Map();
  const { supabase } = require('./lib/supabase');
  const { v4: uuidv4 } = require('uuid');

  io.on('connection', async (socket) => {
    const cookies = parse(socket.request.headers.cookie || '');
    const token = cookies['next-auth.session-token'] || cookies['__Secure-next-auth.session-token'];

    if (!token) {
      socket.disconnect();
      return;
    }

    try {
      const { payload } = await jwtVerify(token, secret);
      const userName = payload.name;
      const userId = payload.sub;

      connectedUsers.set(socket.id, { id: userId, name: userName });
      io.emit('users', Array.from(connectedUsers.values()));

      const { data: messages, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        socket.emit('messages', messages.reverse());
      }



      socket.on('message', async (msg) => {
        const { data: newMessage, error } = await supabase
          .from('chat_messages')
          .insert([{ id: uuidv4(), user_id: userId, user_name: userName, text: msg }])
          .select()
          .single();

        if (error) {
          console.error('Error saving message:', error);
        } else {
          io.emit('message', newMessage);
        }
      });

      socket.on('disconnect', () => {
        connectedUsers.delete(socket.id);
        io.emit('users', Array.from(connectedUsers.values()));
      });
    } catch (error) {
      console.error('Error verifying token:', error);
      socket.disconnect();
    }
  });

  httpServer.listen(3000, (err) => {
    if (err) throw err;
  });
});
