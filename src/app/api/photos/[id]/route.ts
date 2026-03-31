import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { unlink } from 'fs/promises';
import { join } from 'path';

const ADMIN_KEY = 'pacobakh-admin-2024';

function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('admin-key');
  return authHeader === ADMIN_KEY;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Validate category if provided
    const validCategories = ['studio', 'exterieur', 'evenement', 'produit'];
    if (body.category && !validCategories.includes(body.category)) {
      return NextResponse.json(
        { error: 'Catégorie invalide' },
        { status: 400 }
      );
    }

    const photo = await db.portfolioPhoto.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title || null }),
        ...(body.description !== undefined && { description: body.description || null }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.order !== undefined && { order: body.order }),
        ...(body.active !== undefined && { active: body.active }),
      },
    });

    return NextResponse.json(photo);
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la photo' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;

    // Get photo to find file path
    const photo = await db.portfolioPhoto.findUnique({ where: { id } });
    if (!photo) {
      return NextResponse.json({ error: 'Photo non trouvée' }, { status: 404 });
    }

    // Delete file from disk
    try {
      const filePath = join(process.cwd(), 'public', photo.imageUrl);
      await unlink(filePath);
    } catch {
      // File might not exist, continue with DB deletion
      console.warn('Fichier non trouvé sur le disque:', photo.imageUrl);
    }

    // Delete from database
    await db.portfolioPhoto.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la photo' },
      { status: 500 }
    );
  }
}
