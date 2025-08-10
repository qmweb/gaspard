import { NextResponse } from 'next/server';

import { getUser } from '@/utils/lib/better-auth/auth-session';
import prisma from '@/utils/lib/prisma/prisma';

interface ArticleItem {
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
}

interface EstimateRequestBody {
  organizationId: string;
  entityId: string;
  date: string;
  expirationDate: string;
  articles: ArticleItem[];
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

  const body: EstimateRequestBody = await req.json();
  const { organizationId, entityId, articles } = body;
  console.log(body);

  if (!organizationId || !entityId) {
    return NextResponse.json(
      { error: 'Organization ID and Entity ID are required' },
      { status: 400 },
    );
  }

  const estimate = await prisma.estimate.create({
    data: {
      organizationId,
      entityId,
      status: 'DRAFT',
      totalAmount: articles.reduce(
        (acc: number, item: ArticleItem) =>
          acc + item.quantity * item.unitPrice,
        0,
      ),
      createdAt: new Date(),
      updatedAt: new Date(),
      items: {
        create: articles.map((item: ArticleItem) => ({
          name: item.name,
          description: item.description || '',
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.quantity * item.unitPrice,
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
