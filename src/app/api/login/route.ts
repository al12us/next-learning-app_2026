import { NextResponse } from 'next/server';
import { authController } from '@/controllers/authController';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.email || !body.password) {
      return NextResponse.json({ error: "Email și parolă obligatorii." }, { status: 400 });
    }

    // Verificăm credențialele în controller
    const user = authController.login(body);

    // Răspunsul de succes
    const response = NextResponse.json({ message: "Login cu succes", user }, { status: 200 });

    // 🍪 ATRIBUIRE TOKEN BAZAT PE ROL
    const tokenSecret = user.role === 'ADMIN' ? 'admin-secret' : 'user-secret';

    response.cookies.set('auth-token', tokenSecret, {
      httpOnly: true, // Previned accesul din JavaScript-ul clientului (Securitate XSS)
      secure: process.env.NODE_ENV === 'production', // Doar pe HTTPS în producție
      sameSite: 'strict', // Protecție CSRF
      path: '/', // Valabil pe tot site-ul
      maxAge: 60 * 60 * 24 // Expiră într-o zi
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Eroare internă" }, { status: 401 });
  }
}
