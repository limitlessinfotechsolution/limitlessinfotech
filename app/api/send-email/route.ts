import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { auth } from '@/lib/auth';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import { logError } from '@/lib/logger';

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmailSchema = z.object({
  to: z.string().email(),
  subject: z.string(),
  template: z.string(),
  data: z.record(z.string()),
});

async function getEmailHtml(templateName: string, data: Record<string, string>): Promise<string> {
  const templatePath = path.join(process.cwd(), 'emails', `${templateName}.html`);
  let html = await fs.readFile(templatePath, 'utf-8');
  for (const key in data) {
    html = html.replace(new RegExp(`{{${key}}}`, 'g'), data[key]);
  }
  return html;
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { to, subject, template, data } = sendEmailSchema.parse(body);

    const html = await getEmailHtml(template, data);

    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY is not set. Skipping actual email sending.");
      return NextResponse.json({
        success: true,
        message: "Email sending simulated (RESEND_API_KEY not set).",
      });
    }

    const { data: responseData, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject,
      html,
    });

    if (error) {
        await logError(error);
      return NextResponse.json({ error: error.message || "Failed to send email." }, { status: 500 });
    }

    console.log("Email sent successfully via Resend:", responseData);
    return NextResponse.json({ success: true, message: "Email sent successfully!", data: responseData });
  } catch (error) {
    await logError(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
