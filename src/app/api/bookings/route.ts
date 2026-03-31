import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const ADMIN_KEY = 'pacobakh-admin-2024';

function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('admin-key');
  return authHeader === ADMIN_KEY;
}

export async function GET(request: NextRequest) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const bookings = await db.booking.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des réservations' },
      { status: 500 }
    );
  }
}
