import { NextResponse } from 'next/server';

import { PrismaClient } from '@/app/generated/prisma';
import { getUser } from '@/utils/lib/auth-session';

export async function GET() {
  const user = await getUser();
  if (!user?.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_DOCKER_URL,
  });
  const memberships = await prisma.membership.findMany({
    where: { userId: user.id },
    include: { organization: true },
  });
  return NextResponse.json(memberships);
}
