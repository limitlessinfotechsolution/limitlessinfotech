"use client";

import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import React from 'react';

const socket = io();

interface Message {
  user_name: string;
  text: string;
}

interface User {
  id: string;
  name: string;
}

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    socket.on('messages', (initialMessages: Message[]) => {
      setMessages(initialMessages);
    });

    socket.on('message', (msg: Message) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.on('users', (userList: User[]) => {
      setUsers(userList);
    });

    return () => {
      socket.off('messages');
      socket.off('message');
      socket.off('users');
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message) {
      socket.emit('message', message);
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-dark-blue-900 text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex space-x-4">
        <div className="w-1/4 border rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">Users</h2>
          <ul>
            {users.map((user) => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        </div>
        <div className="w-3/4">
          <h1 className="text-2xl font-bold text-center mb-6">Real-time Chat</h1>
          <div className="border rounded-lg p-4 h-64 overflow-y-auto mb-4">
            {messages.map((msg, index) => (
              <div key={index}>
                <strong>{msg.user_name}:</strong> {msg.text}
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="input-field flex-grow"
              placeholder="Type your message..."
            />
            <button type="submit" className="btn-gradient">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}
