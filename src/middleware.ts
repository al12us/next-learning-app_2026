import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Verificăm dacă request-ul este pentru rutele API pe care vrem să le protejăm
  if (request.nextUrl.pathname.startsWith('/api/posts')) {
    
    // 2. Lăsăm metodele sigure (GET) să treacă liber
    if (request.method === 'GET') {
      return NextResponse.next();
    }

    // 3. Pentru modificări, verificăm cookie-ul
    const authCookie = request.cookies.get('auth-token');
    const token = authCookie?.value;

    // Blocăm orice utilizator nelogat
    if (!token) {
      return NextResponse.json({ error: 'Neautorizat! Trebuie să fii logat.' }, { status: 401 });
    }

    // 4. Verificăm rolurile pentru anumite metode HTTP
    const isAdmin = token === 'admin-secret';
    const isUser = token === 'user-secret';

    if (request.method === 'POST') {
      // Și USER și ADMIN pot posta
      if (!isAdmin && !isUser) {
        return NextResponse.json({ error: 'Token invalid.' }, { status: 401 });
      }
    } else if (request.method === 'DELETE' || request.method === 'PUT') {
      // DOAR ADMIN-ul poate șterge sau edita
      if (!isAdmin) {
        return NextResponse.json(
          { error: 'Acces interzis! Doar administratorii pot șterge sau edita articole.' },
          { status: 403 } // 403 Forbidden (Ești logat, dar nu ai drepturi)
        );
      }
    }
  }

  // Dacă a trecut de verificări sau nu este ruta /api/posts, mergem mai departe
  return NextResponse.next();
}

// Spunem Next.js pe ce rute să execute acest middleware (optimizare performanță)
export const config = {
  matcher: ['/api/posts/:path*'],
};
