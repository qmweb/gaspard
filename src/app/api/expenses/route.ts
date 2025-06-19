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

  const expenses = await prisma.expense.findMany({
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
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      organization: true,
    },
    orderBy: {
      date: 'desc',
    },
  });

  await prisma.$disconnect();
  return NextResponse.json(expenses);
}

export async function POST(req: Request) {
  const user = await getUser();
  if (!user?.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const expense = await req.json();
  const newExpense = await prisma.expense.create({
    data: expense,
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  await prisma.$disconnect();
  return NextResponse.json(newExpense);
}
