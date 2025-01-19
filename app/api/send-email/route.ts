import { NextRequest, NextResponse } from 'next/server';
import { sendMail } from '@/actions/mailer';

export async function POST(req: NextRequest) {
  const { to, subject, text, html } = await req.json();

  try {
    const response = await sendMail(to, subject, text, html);
    return NextResponse.json({ message: 'Email sent', response });
  } catch (error) {
    return NextResponse.json({ error: 'Error sending email' }, { status: 500 });
  }
}
