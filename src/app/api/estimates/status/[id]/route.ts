import { NextResponse } from 'next/server';

import { EstimateStatus } from '@/app/generated/prisma';
import { getUser } from '@/utils/lib/better-auth/auth-session';
import prisma from '@/utils/lib/prisma/prisma';

interface EstimateRequestBody {
  status: EstimateStatus;
  organizationId: string;
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getUser();
  if (!user?.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const resolvedParams = await params;
    const body: EstimateRequestBody = await req.json();
    const { organizationId, status } = body;

    if (!organizationId || !status) {
      return NextResponse.json(
        { error: 'Organization ID and Status are required' },
        { status: 400 },
      );
    }

    // Validate that the status is a valid EstimateStatus enum value
    const validStatuses = Object.values(EstimateStatus);
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        },
        { status: 400 },
      );
    }

    // Vérifier que le devis existe et appartient à l'utilisateur
    const existingEstimate = await prisma.estimate.findFirst({
      where: {
        id: resolvedParams.id,
        organizationId,
        organization: {
          memberships: {
            some: {
              userId: user.id,
            },
          },
        },
      },
    });

    if (!existingEstimate) {
      return NextResponse.json(
        { error: 'Estimate not found' },
        { status: 404 },
      );
    }

    // Mettre à jour le status du devis
    const updatedEstimate = await prisma.estimate.update({
      where: {
        id: resolvedParams.id,
      },
      data: {
        status,
        updatedAt: new Date(),
      },
    });

    await prisma.$disconnect();
    return NextResponse.json(updatedEstimate);
  } catch (error) {
    console.error('Error updating estimate:', error);
    await prisma.$disconnect();
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
