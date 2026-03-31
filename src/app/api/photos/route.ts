import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { put } from '@vercel/blob';

const ADMIN_KEY = 'pacobakh-admin-2024';
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('admin-key');
  return authHeader === ADMIN_KEY;
}

export async function GET(request: NextRequest) {
  try {
    const isAdmin = checkAuth(request);

    const photos = await db.portfolioPhoto.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    // Public users only see active photos
    const filtered = isAdmin ? photos : photos.filter((p) => p.active);

    return NextResponse.json(filtered);
  } catch (error) {
    console.error('Erreur lors de la récupération des photos:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des photos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string | null;
    const description = formData.get('description') as string | null;
    const category = (formData.get('category') as string) || 'studio';

    // Validate file
    if (!file) {
      return NextResponse.json({ error: 'Fichier requis' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non autorisé. Utilisez JPG, PNG ou WebP.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux (max 10 Mo)' },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `portfolio-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    // Save to database
    const photo = await db.portfolioPhoto.create({
      data: {
        title: title || null,
        description: description || null,
        category,
        imageUrl: blob.url,
        active: true,
      },
    });

    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de l'upload:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'upload de la photo" },
      { status: 500 }
    );
  }
}
