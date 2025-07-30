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

  const estimates = await prisma.estimate.findMany({
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
      createdAt: 'desc',
    },
  });

  await prisma.$disconnect();
  return NextResponse.json(estimates);
}

export async function POST(req: Request) {
  const user = await getUser();
  if (!user?.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { organizationId, entityId, title } = body;

  if (!organizationId || !entityId || !title) {
    return NextResponse.json(
      { error: 'Organization ID, Entity ID and Title are required' },
      { status: 400 },
    );
  }

  const estimate = await prisma.estimate.create({
    data: {
      organizationId,
      entityId,
      status: 'DRAFT',
      totalAmount: body.items.reduce(
        (acc: number, item: any) => acc + item.totalPrice,
        0,
      ),
      updatedAt: new Date(),
      items: {
        create: body.items.map((item: any) => ({
          name: item.name,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        })),
      },
      taxes: {
        create: body.taxes.map((tax: any) => ({
          name: tax.name,
          rate: tax.rate,
          amount: tax.amount,
        })),
      },
    },
    include: {
      organization: true,
      entity: true,
    },
  });

  await prisma.$disconnect();
  return NextResponse.json(estimate);
}
