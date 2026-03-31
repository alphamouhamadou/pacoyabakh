import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const ADMIN_KEY = 'pacobakh-admin-2024';

function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('admin-key');
  return authHeader === ADMIN_KEY;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;
    const booking = await db.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Erreur lors de la récupération:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération' },
      { status: 500 }
    );
  }
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

    const { status, notes, proposalText, proposalPrice, proposalDate } = body;

    const updateData: Record<string, unknown> = {};
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (proposalText !== undefined) updateData.proposalText = proposalText;
    if (proposalPrice !== undefined) updateData.proposalPrice = proposalPrice;
    if (proposalDate !== undefined) updateData.proposalDate = proposalDate ? new Date(proposalDate) : null;

    const booking = await db.booking.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
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
    await db.booking.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Réservation supprimée' });
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    );
  }
}
