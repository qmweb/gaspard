import { NextResponse } from 'next/server';

import { getUser } from '@/utils/lib/better-auth/auth-session';
import prisma from '@/utils/lib/prisma/prisma';

export async function GET(req: Request) {
  const user = await getUser();
  if (!user?.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const organizationId = searchParams.get('organizationId');

  if (!organizationId) {
    return NextResponse.json(
      { error: 'Organization ID is required' },
      { status: 400 },
    );
  }

  const entities = await prisma.entity.findMany({
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
  });

  await prisma.$disconnect();
  return NextResponse.json(entities);
}

export async function POST(req: Request) {
  const user = await getUser();
  if (!user?.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, organizationId } = await req.json();

  const category = await prisma.expenseCategory.create({
    data: {
      name,
      organizationId,
    },
  });

  await prisma.$disconnect();
  return NextResponse.json(category);
}
