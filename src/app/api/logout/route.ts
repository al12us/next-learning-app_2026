import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: "Logout cu succes" }, { status: 200 });
  
  // Pentru a distruge un cookie, setăm maxAge la 0 sau o valoare goală
  response.cookies.set('auth-token', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0 
  });

  return response;
}
