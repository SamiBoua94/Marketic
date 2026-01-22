import { NextResponse } from 'next/server';

export async function POST() {
    return NextResponse.json(
        {
            error: "Cette route n'est plus utilisée. Utilise NextAuth via signOut() sur /api/auth/[...nextauth].",
        },
        { status: 410 }
    );
}
