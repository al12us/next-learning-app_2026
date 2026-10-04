import { NextRequest, NextResponse } from 'next/server';
import { authController } from '@/controllers/authController';

export async function GET(request: NextRequest) {
  const tokenVal = request.cookies.get('auth-token')?.value;

  if (!tokenVal) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    // Dacă token-ul a fost creat înainte de update (vechiul format ex: 'admin-secret'),
    // va eșua aici sau nu va conține ":" — așa că forțăm utilizatorul să se relogheze
    const decoded = Buffer.from(tokenVal, 'base64').toString('ascii');
    const [email, secret] = decoded.split(':');

    if (!email || !secret) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const user = await authController.getUserByEmail(email);

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Validăm secretul pe baza rolului
    const expectedSecret = user.role === 'ADMIN' ? 'admin-secret' : 'user-secret';
    if (secret !== expectedSecret) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true, user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
