import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auth } from '@/lib/nextauth';
import { z } from 'zod';

const commentSchema = z.object({
  project_id: z.string(),
  content: z.string(),
  type: z.enum(['comment', 'review']),
  rating: z.number().min(1).max(5).optional(),
});

export async function GET(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  if (!projectId) {
    return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
  }

  const { data: comments, error } = await supabase
    .from('comments')
    .select('*')
    .eq('project_id', projectId);

  if (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }

  return NextResponse.json(comments);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { project_id, content, type, rating } = commentSchema.parse(body);

    const { data: newComment, error } = await supabase
      .from('comments')
      .insert([
        {
          project_id,
          author_id: session.user?.id,
          content,
          type,
          rating,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding comment:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
