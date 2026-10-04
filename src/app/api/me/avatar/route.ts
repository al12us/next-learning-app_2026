import { NextRequest, NextResponse } from 'next/server';
import { authController } from '@/controllers/authController';

export async function PUT(request: NextRequest) {
  try {
    const tokenVal = request.cookies.get('auth-token')?.value;

    if (!tokenVal) {
      return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
    }

    // Decodăm token-ul pentru a afla email-ul
    const decoded = Buffer.from(tokenVal, 'base64').toString('ascii');
    const [email, secret] = decoded.split(':');

    if (!email || !secret) {
      return NextResponse.json({ error: 'Token invalid' }, { status: 401 });
    }

    const body = await request.json();
    const { avatar } = body;

    if (!avatar) {
      return NextResponse.json({ error: 'Imagine lipsă' }, { status: 400 });
    }

    // Verificăm dimensiunea (aprox 2MB în base64)
    if (avatar.length > 2.8 * 1024 * 1024) {
      return NextResponse.json({ error: 'Imaginea este prea mare (maxim 2MB).' }, { status: 400 });
    }

    // Salvăm avatarul (base64)
    await authController.updateAvatar(email, avatar);

    return NextResponse.json({ message: 'Avatar actualizat cu succes', avatar }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Eroare internă' }, { status: 500 });
  }
}
