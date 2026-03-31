import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      whatsapp,
      serviceType,
      shootingType,
      purposes,
      idea,
      referenceLinks,
      date,
      budget,
      needsHelp,
    } = body;

    // Validate required fields
    if (!name || !whatsapp) {
      return NextResponse.json(
        { error: 'Nom et WhatsApp sont requis' },
        { status: 400 }
      );
    }

    // Save to database
    const booking = await db.booking.create({
      data: {
        name,
        whatsapp: `+221 ${whatsapp}`,
        serviceType,
        shootingType,
        purposes: Array.isArray(purposes) ? JSON.stringify(purposes) : purposes || '[]',
        idea: idea || null,
        referenceLinks: referenceLinks || null,
        bookingDate: date ? new Date(date).toISOString() : null,
        budget: budget || null,
        needsHelp: needsHelp === true,
      },
    });

    console.log('📋 Nouvelle demande de réservation:', booking.id);

    return NextResponse.json({
      success: true,
      message: 'Demande de réservation envoyée avec succès',
      booking,
    });
  } catch (error) {
    console.error('Erreur lors de la soumission:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement de votre demande' },
      { status: 500 }
    );
  }
}
