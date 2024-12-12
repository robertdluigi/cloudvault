// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Get the path from the request body
    const { path }: { path: string } = await req.json();

    // Trigger revalidation for the specified path
    await revalidatePath(path);

    return NextResponse.json({ message: 'Page revalidated' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to revalidate page' }, { status: 500 });
  }
}
