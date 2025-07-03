import { NextResponse } from 'next/server';

import { getUser } from '@/utils/lib/better-auth/auth-session';
import prisma from '@/utils/lib/prisma/prisma';

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

  const incomes = await prisma.income.findMany({
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
    include: {
      organization: true,
      entity: true,
    },
    orderBy: {
      date: 'desc',
    },
  });

  await prisma.$disconnect();
  return NextResponse.json(incomes);
}

export async function POST(req: Request) {
  const user = await getUser();
  if (!user?.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const income = await req.json();
  const newIncome = await prisma.income.create({
    data: income,
  });

  await prisma.$disconnect();
  return NextResponse.json(newIncome);
}
