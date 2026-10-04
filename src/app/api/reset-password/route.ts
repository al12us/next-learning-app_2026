import { NextRequest, NextResponse } from 'next/server';
import { authController } from '@/controllers/authController';

// GET /api/reset-password?token=xxx — verifică dacă token-ul este valid
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') ?? '';
  const isValid = authController.validateResetToken(token);

  if (!isValid) {
    return NextResponse.json({ valid: false, error: 'Token invalid sau expirat.' }, { status: 400 });
  }

  return NextResponse.json({ valid: true }, { status: 200 });
}

// POST /api/reset-password — aplică noua parolă
export async function POST(request: Request) {
  try {
    const { token, newPassword, confirmPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Token și parolă nouă sunt obligatorii.' }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: 'Parolele nu se potrivesc.' }, { status: 400 });
    }

    await authController.resetPassword(token, newPassword);

    return NextResponse.json({ message: 'Parola a fost resetată cu succes! Te poți loga acum.' }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Eroare internă.' }, { status: 400 });
  }
}
