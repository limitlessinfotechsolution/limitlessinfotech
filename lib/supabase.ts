import { createClient } from '@supabase/supabase-js'

// Supabase client with safe dev fallback
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Dev-safe mock to avoid app crash when env vars are missing
  // Only implements methods used in server.js chat feature

  type Message = { id: string; user_id: string; user_name: string; text: string; created_at?: string }
  const messages: Message[] = []

  const mock = {
    from: (table: string) => {
      return {
        // Fetch latest messages (matches usage: select('*').order('created_at', { ascending: false }).limit(50))
        select: (_: string = '*') => ({
          order: (_col: string, _opts?: { ascending?: boolean }) => ({
            limit: async (_n: number) => ({ data: [...messages].slice(-50), error: null as any }),
          }),
        }),
        // Insert a new message (matches usage: insert([...]).select().single())
        insert: async (rows: Message[]) => ({
          select: () => ({
            single: async () => {
              const row = { ...rows[0], created_at: new Date().toISOString() }
              messages.push(row)
              return { data: row, error: null as any }
            },
          }),
        }),
      }
    },
  }

  // Export mock as any to keep TS happy without full types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase: any = mock
} else {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
}

export { supabase }
