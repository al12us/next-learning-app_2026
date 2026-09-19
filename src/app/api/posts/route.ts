import { NextResponse } from 'next/server';

export async function GET() {
    const posts = [{ id: 1, title: "Primul meu articol Next.js", author: "Alexutu", content: "Next.js este un framework React fantastic care ne permite sa cream aplicatii web rapide." },
    { id: 2, title: "De ce iubesc Server Components", author: "Alexutu", content: "Server Components imbunatatesc performanta si securitatea aplicatiilor web." }
    ];
    return NextResponse.json(posts);
}

export async function POST(request: Request) {
    const body = await request.json();

    return NextResponse.json({
        message: "Articolul creat cu succes!",
        post: body
    }, { status: 201 })
}
export async function PUT(request: Request) {
    const body = await request.json();
    return NextResponse.json({
        message: "Articolul actualizat cu succes!",
        post: body
    })
}
export async function DELETE(request: Request) {
    const body = await request.json();
    return NextResponse.json({
        message: "Articolul a fost sters cu succes!",
        post: body
    })
}