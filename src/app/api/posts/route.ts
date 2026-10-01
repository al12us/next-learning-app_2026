import { NextResponse } from 'next/server';
import { postController } from '@/controllers/postController';

export async function GET() {
    const posts = postController.getAll();
    return NextResponse.json(posts);
}

export async function POST(request: Request) {
    const body = await request.json();
    const newPost = postController.create(body);

    return NextResponse.json({
        message: "Articolul a fost creat cu succes!",
        post: newPost
    }, { status: 201 });
}

export async function PUT(request: Request) {
    const body = await request.json();
    const updatedPost = postController.update(body.id, body);

    if (!updatedPost) {
        return NextResponse.json({ message: "Articolul nu a fost găsit!" }, { status: 404 });
    }

    return NextResponse.json({
        message: "Articolul a fost actualizat cu succes!",
        post: updatedPost
    });
}

export async function DELETE(request: Request) {
    const body = await request.json();
    const deletedPost = postController.delete(body.id);

    if (!deletedPost) {
        return NextResponse.json({ message: "Articolul nu a fost găsit!" }, { status: 404 });
    }

    return NextResponse.json({
        message: "Articolul a fost sters cu succes!",
        post: deletedPost
    });
}