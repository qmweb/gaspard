import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

// If your Prisma file is located elsewhere, you can change the path
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_DOCKER_URL,
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
});
