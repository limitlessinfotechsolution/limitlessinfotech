import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auth } from '@/lib/auth';
import { z } from 'zod';
feature/database-auth-integration
import { logError } from '@/lib/logger';

main

const approvalRequestSchema = z.object({
  type: z.enum(['project', 'expense', 'leave', 'access']),
  requester: z.string(),
  details: z.string(),
});

const updateApprovalRequestSchema = z.object({
  id: z.string(),
  status: z.enum(['pending', 'approved', 'rejected']),
});

export async function GET(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
feature/database-auth-integration

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    let query = supabase.from('approval_requests').select('*');

    if (status) {
      query = query.eq('status', status);
    }

    if (type) {
      query = query.eq('type', type);
    }

    const { data: approvalRequests, error } = await query;

    if (error) {
        await logError(error);
      return NextResponse.json({ error: 'Error fetching approval requests' }, { status: 500 });
    }

    return NextResponse.json(approvalRequests);
  } catch (error) {
    await logError(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const type = searchParams.get('type');

  let query = supabase.from('approval_requests').select('*');

  if (status) {
    query = query.eq('status', status);
  }

  if (type) {
    query = query.eq('type', type);
  }

  const { data: approvalRequests, error } = await query;

  if (error) {
    console.error('Error fetching approval requests:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }

  return NextResponse.json(approvalRequests);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
main
  }

feature/database-auth-integration
export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

 main
  try {
    const body = await request.json();
    const { type, requester, details } = approvalRequestSchema.parse(body);

    const { data: newApprovalRequest, error } = await supabase
      .from('approval_requests')
      .insert([
        {
          type,
          requester,
          details,
          status: 'pending',
          requester_id: (session.user as any).id,
        },
      ])
      .select()
      .single();

    if (error) {
 feature/database-auth-integration
        await logError(error);
      return NextResponse.json({ error: 'Error creating approval request' }, { status: 500 });
      
      console.error('Error creating approval request:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
 main
    }

    return NextResponse.json(newApprovalRequest, { status: 201 });
  } catch (error) {
 feature/database-auth-integration
    await logError(error);

main
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status } = updateApprovalRequestSchema.parse(body);

    const { data: updatedApprovalRequest, error } = await supabase
      .from('approval_requests')
      .update({ status, approver_id: (session.user as any).id })
      .eq('id', id)
      .select()
      .single();

    if (error) {
 feature/database-auth-integration
        await logError(error);
      return NextResponse.json({ error: 'Error updating approval request' }, { status: 500 });

      console.error('Error updating approval request:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
 main
    }

    return NextResponse.json(updatedApprovalRequest);
  } catch (error) {
 feature/database-auth-integration
    await logError(error);

main
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
    const session = await auth();

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

feature/database-auth-integration
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing approval ID' }, { status: 400 });
        }

        const { error } = await supabase.from('approval_requests').delete().eq('id', id);

        if (error) {
            await logError(error);
            return NextResponse.json({ error: 'Error deleting approval request' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Approval request deleted successfully' });
    } catch (error) {
        await logError(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Missing approval ID' }, { status: 400 });
    }

    const { error } = await supabase.from('approval_requests').delete().eq('id', id);

    if (error) {
        console.error('Error deleting approval request:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Approval request deleted successfully' });
main
}
