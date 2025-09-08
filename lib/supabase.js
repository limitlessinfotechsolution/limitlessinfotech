const { createClient } = require('@supabase/supabase-js');

// Supabase client with safe dev fallback
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase;

if (!supabaseUrl || !supabaseAnonKey) {
  // Dev-safe mock to avoid app crash when env vars are missing
  // Only implements methods used in server.js chat feature

  const messages = [];

  const mock = {
    from: (table) => {
      return {
        // Fetch latest messages (matches usage: select('*').order('created_at', { ascending: false }).limit(50))
        select: (_ = '*') => ({
          order: (_col, _opts) => ({
            limit: async (_n) => ({ data: [...messages].slice(-50), error: null }),
          }),
        }),
        // Insert a new message (matches usage: insert([...]).select().single())
        insert: async (rows) => ({
          select: () => ({
            single: async () => {
              const row = { ...rows[0], created_at: new Date().toISOString() };
              messages.push(row);
              return { data: row, error: null };
            },
          }),
        }),
      };
    },
  };

  supabase = mock;
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

module.exports = { supabase };
