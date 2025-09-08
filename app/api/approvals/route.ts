import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auth } from '@/lib/nextauth';
import { z } from 'zod';
import { logError } from '@/lib/logger';

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
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
          requester_id: session.user?.id,
        },
      ])
      .select()
      .single();

    if (error) {
      await logError(error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    return NextResponse.json(newApprovalRequest, { status: 201 });
  } catch (error) {
    await logError(error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
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
      .update({ status, approver_id: session.user?.id })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      await logError(error);
      return NextResponse.json({ error: 'Error updating approval request' }, { status: 500 });
    }

    return NextResponse.json(updatedApprovalRequest);
  } catch (error) {
    await logError(error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
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
  } catch (error) {
    await logError(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
