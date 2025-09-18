import { NextResponse } from 'next/server';

import { getUser } from '@/utils/lib/better-auth/auth-session';
import prisma from '@/utils/lib/prisma/prisma';

interface ArticleItem {
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
}

interface EstimateUpdateBody {
  organizationId: string;
  entityId: string;
  date: string;
  expirationDate?: string;
  articles: ArticleItem[];
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getUser();
  if (!user?.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const resolvedParams = await params;
  const { searchParams } = new URL(req.url);
  const organizationId = searchParams.get('organizationId');

  if (!organizationId) {
    return NextResponse.json(
      { error: 'Organization ID is required' },
      { status: 400 },
    );
  }

  try {
    const estimate = await prisma.estimate.findFirst({
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
      include: {
        organization: true,
        entity: true,
        items: true,
      },
    });

    if (!estimate) {
      return NextResponse.json(
        { error: 'Estimate not found' },
        { status: 404 },
      );
    }

    await prisma.$disconnect();
    return NextResponse.json(estimate);
  } catch (error) {
    console.error('Error fetching estimate:', error);
    await prisma.$disconnect();
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
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
    const body: EstimateUpdateBody = await req.json();
    const { organizationId, entityId, articles } = body;

    if (!organizationId || !entityId) {
      return NextResponse.json(
        { error: 'Organization ID and Entity ID are required' },
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
      include: {
        items: true,
      },
    });

    if (!existingEstimate) {
      return NextResponse.json(
        { error: 'Estimate not found' },
        { status: 404 },
      );
    }

    // Calculer le nouveau total
    const totalAmount = articles.reduce(
      (acc: number, item: ArticleItem) => acc + item.quantity * item.unitPrice,
      0,
    );

    // Mettre à jour le devis avec les nouveaux articles
    const updatedEstimate = await prisma.estimate.update({
      where: {
        id: resolvedParams.id,
      },
      data: {
        entityId,
        totalAmount,
        updatedAt: new Date(),
        // Supprimer tous les anciens items et créer les nouveaux
        items: {
          deleteMany: {},
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
        items: true,
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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getUser();
  if (!user?.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const resolvedParams = await params;
  const { searchParams } = new URL(req.url);
  const organizationId = searchParams.get('organizationId');

  if (!organizationId) {
    return NextResponse.json(
      { error: 'Organization ID is required' },
      { status: 400 },
    );
  }

  try {
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

    // Supprimer le devis (les items seront supprimés automatiquement grâce à la cascade)
    await prisma.estimate.delete({
      where: {
        id: resolvedParams.id,
      },
    });

    await prisma.$disconnect();
    return NextResponse.json({ message: 'Estimate deleted successfully' });
  } catch (error) {
    console.error('Error deleting estimate:', error);
    await prisma.$disconnect();
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
