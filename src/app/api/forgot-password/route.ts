import { NextResponse } from 'next/server';
import { authController } from '@/controllers/authController';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Emailul este obligatoriu.' }, { status: 400 });
    }

    // Generăm token (funcția nu dezvăluie dacă email-ul există — anti-enumerare)
    const token = await authController.createResetToken(email);

    // În producție: trimitem email cu link-ul.
    // În dev: returnăm direct token-ul pentru a-l afișa în UI.
    const resetLink = `/reset-password?token=${token}`;

    return NextResponse.json({
      message: 'Dacă adresa există în sistem, vei primi instrucțiunile de resetare.',
      // Expus DOAR în development pentru testare
      devResetLink: process.env.NODE_ENV !== 'production' ? resetLink : undefined,
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Eroare internă.' }, { status: 500 });
  }
}
