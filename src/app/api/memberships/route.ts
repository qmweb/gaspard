import { NextResponse } from 'next/server';

import { getUser } from '@/utils/lib/better-auth/auth-session';
import prisma from '@/utils/lib/prisma/prisma';

export async function GET() {
  const user = await getUser();
  if (!user?.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const memberships = await prisma.membership.findMany({
    where: {
      userId: user.id,
    },
    include: {
      organization: true,
    },
  });

  await prisma.$disconnect();
  return NextResponse.json(memberships);
}
