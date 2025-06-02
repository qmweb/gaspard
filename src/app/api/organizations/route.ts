import { NextResponse } from 'next/server';

import { PrismaClient } from '@/app/generated/prisma';
import { getUser } from '@/utils/lib/better-auth/auth-session';
import prisma from '@/utils/lib/prisma/prisma';

export async function POST(req: Request) {
  const user = await getUser();
  if (!user?.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { name } = await req.json();
  if (!name || typeof name !== 'string') {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_DOCKER_URL,
  });
  const org = await prisma.organization.create({ data: { name } });
  const membership = await prisma.membership.create({
    data: { userId: user.id, organizationId: org.id, role: 'ADMIN' },
  });
  return NextResponse.json({ organization: org, membership });
}

export async function GET() {
  const user = await getUser();
  if (!user?.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const organizations = await prisma.organization.findMany({
    where: {
      memberships: {
        some: {
          userId: user.id,
        },
      },
    },
  });

  await prisma.$disconnect();
  return NextResponse.json(organizations);
}
