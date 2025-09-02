import { NextResponse } from 'next/server';

import { getUser } from '@/utils/lib/better-auth/auth-session';
import prisma from '@/utils/lib/prisma/prisma';

interface EstimateRequestBody {
  organizationId: string;
  entityId: string;
  date: string;
  validUntil: string;
  validFrom: string;
}

export async function GET(req: Request) {
  const user = await getUser();
  if (!user?.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Get organizationId from query params
  const { searchParams } = new URL(req.url);
  const organizationId = searchParams.get('organizationId');

  if (!organizationId) {
    return NextResponse.json(
      { error: 'Organization ID is required' },
      { status: 400 },
    );
  }

  const estimates = await prisma.estimate.findMany({
    select: {
      number: true,
    },
    where: {
      organizationId,
      organization: {
        memberships: {
          some: {
            userId: user.id,
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 1,
  });

  await prisma.$disconnect();
  return NextResponse.json(estimates);
}
