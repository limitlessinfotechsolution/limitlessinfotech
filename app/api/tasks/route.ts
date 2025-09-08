import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auth } from '@/lib/auth';
import { z } from 'zod';

const taskSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  assigned_to: z.string(),
  priority: z.enum(['low', 'medium', 'high']),
  due_date: z.string().datetime(),
  tags: z.array(z.string()).optional(),
});

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: tasks, error } = await supabase.from('tasks').select('*');

  if (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }

  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, assigned_to, priority, due_date, tags } = taskSchema.parse(body);

    const { data: newTask, error } = await supabase
      .from('tasks')
      .insert([
        {
          title,
          description,
          assigned_to,
          assigned_by: (session.user as any).id,
          priority,
          due_date,
          tags,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
