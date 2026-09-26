import { NextResponse } from 'next/server';

// "Mini-baza de date" în memorie — persistă cât timp serverul rulează
const posts = [
    { id: 1, title: "Primul meu articol Next.js", author: "Alexutu", content: "Next.js este un framework React fantastic care ne permite sa cream aplicatii web rapide." },
    { id: 2, title: "De ce iubesc Server Components", author: "Alexutu", content: "Server Components imbunatatesc performanta si securitatea aplicatiilor web." }
];

export async function GET() {
    return NextResponse.json(posts);
}

export async function POST(request: Request) {
    const body = await request.json();

    // Adăugăm articolul nou în array-ul din memorie
    const newPost = { id: posts.length + 1, ...body };
    posts.push(newPost);

    return NextResponse.json({
        message: "Articolul a fost creat cu succes!",
        post: newPost
    }, { status: 201 });
}

export async function PUT(request: Request) {
    const body = await request.json();
    const { id, ...updatedData } = body;

    const index = posts.findIndex((p) => p.id === id);
    if (index === -1) {
        return NextResponse.json({ message: "Articolul nu a fost găsit!" }, { status: 404 });
    }

    // Actualizăm articolul existent în array
    posts[index] = { ...posts[index], ...updatedData };

    return NextResponse.json({
        message: "Articolul a fost actualizat cu succes!",
        post: posts[index]
    });
}

export async function DELETE(request: Request) {
    const body = await request.json();
    const { id } = body;

    const index = posts.findIndex((p) => p.id === id);
    if (index === -1) {
        return NextResponse.json({ message: "Articolul nu a fost găsit!" }, { status: 404 });
    }

    // Ștergem articolul din array
    const deleted = posts.splice(index, 1)[0];

    return NextResponse.json({
        message: "Articolul a fost sters cu succes!",
        post: deleted
    });
}