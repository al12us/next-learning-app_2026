import { NextResponse } from 'next/server';
import { authController } from '@/controllers/authController';

// ─── Rate Limiter In-Memory (anti brute-force / bot) ─────────────────────────
// Map<ip, { count, firstAttemptAt }>
const rateLimitMap = new Map<string, { count: number; firstAttemptAt: number }>();

const RATE_LIMIT_MAX = 5;        // max tentative
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minute în ms

function getRealIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? '0.0.0.0';
}

function checkRateLimit(ip: string): { allowed: boolean; remainingMs?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    // Prima tentativă de la acest IP
    rateLimitMap.set(ip, { count: 1, firstAttemptAt: now });
    return { allowed: true };
  }

  const windowElapsed = now - record.firstAttemptAt;

  if (windowElapsed > RATE_LIMIT_WINDOW) {
    // Fereastra a expirat — resetăm contorul
    rateLimitMap.set(ip, { count: 1, firstAttemptAt: now });
    return { allowed: true };
  }

  if (record.count >= RATE_LIMIT_MAX) {
    // Prea multe tentative în fereastra curentă
    const remainingMs = RATE_LIMIT_WINDOW - windowElapsed;
    return { allowed: false, remainingMs };
  }

  // Incrementăm contorul
  record.count++;
  rateLimitMap.set(ip, record);
  return { allowed: true };
}

// Curăță intrările expirate periodic (la fiecare 100 de cereri)
let requestCount = 0;
function maybeCleanup() {
  requestCount++;
  if (requestCount % 100 === 0) {
    const now = Date.now();
    for (const [ip, record] of rateLimitMap.entries()) {
      if (now - record.firstAttemptAt > RATE_LIMIT_WINDOW) {
        rateLimitMap.delete(ip);
      }
    }
  }
}
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const ip = getRealIP(request);
    maybeCleanup();

    // Verificare rate limit
    const rl = checkRateLimit(ip);
    if (!rl.allowed) {
      const minutesLeft = Math.ceil((rl.remainingMs ?? RATE_LIMIT_WINDOW) / 60000);
      return NextResponse.json(
        { error: `Prea multe încercări. Încearcă din nou în ${minutesLeft} minut${minutesLeft !== 1 ? 'e' : ''}.` },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rl.remainingMs ?? RATE_LIMIT_WINDOW) / 1000)),
            'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
          },
        }
      );
    }

    const body = await request.json();

    if (!body.email || !body.password) {
      return NextResponse.json({ error: 'Email și parolă obligatorii.' }, { status: 400 });
    }

    // Verificăm credențialele în controller
    const user = await authController.login(body);

    // La autentificare reușită — resetăm contorul pentru acest IP
    rateLimitMap.delete(ip);

    // Răspunsul de succes
    const response = NextResponse.json({ message: 'Login cu succes', user }, { status: 200 });

    // 🍪 ATRIBUIRE TOKEN BAZAT PE ROL ȘI IDENTITATE
    const tokenSecret = user.role === 'ADMIN' ? 'admin-secret' : 'user-secret';
    
    // Codificăm emailul în token pentru a-l citi la /api/me (simulare JWT simplificată)
    const tokenValue = Buffer.from(`${user.email}:${tokenSecret}`).toString('base64');

    response.cookies.set('auth-token', tokenValue, {
      httpOnly: true,      // Previne accesul din JavaScript-ul clientului (Securitate XSS)
      secure: process.env.NODE_ENV === 'production', // Doar pe HTTPS în producție
      sameSite: 'strict',  // Protecție CSRF
      path: '/',           // Valabil pe tot site-ul
      maxAge: 60 * 60 * 24 // Expiră într-o zi
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Eroare internă' }, { status: 401 });
  }
}
