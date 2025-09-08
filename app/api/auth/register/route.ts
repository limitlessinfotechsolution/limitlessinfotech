import { NextResponse } from 'next/server';
import { createUser } from '@/lib/database';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { createRateLimitMiddleware, rateLimitConfigs } from '@/lib/rate-limit';
import { NextRequest } from 'next/server';
import { logError } from '@/lib/logger';

const registerUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const rateLimitMiddleware = createRateLimitMiddleware(rateLimitConfigs.auth);

export async function POST(req: NextRequest) {
  const isAllowed = rateLimitMiddleware(req);
  if (!isAllowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { email, password } = registerUserSchema.parse(body);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser(email, hashedPassword);

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error: any) {
    await logError(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    if (error.code === '23505') {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
