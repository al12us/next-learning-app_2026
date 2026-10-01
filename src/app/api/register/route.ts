import { NextResponse } from 'next/server';
import { authController } from '@/controllers/authController';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validare simplă
    if (!body.name || !body.email || !body.password) {
      return NextResponse.json({ error: "Toate câmpurile sunt obligatorii." }, { status: 400 });
    }

    // Creăm utilizatorul
    const newUser = authController.register(body);

    return NextResponse.json({ message: "Cont creat cu succes!", user: newUser }, { status: 201 });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Eroare internă" }, { status: 500 });
  }
}
