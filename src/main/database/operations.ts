import { PrismaClient } from '../../../generated/prisma';
import { app } from 'electron';
import { join } from 'path';

// Singleton Prisma Client
let prisma: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    const isDev = process.env.NODE_ENV === 'development';
    const dbPath = isDev
      ? join(process.cwd(), 'prisma', 'brothers_fitness.db')
      : join(app.getPath('userData'), 'brothers_fitness.db');

    prisma = new PrismaClient({
      datasources: {
        db: {
          url: `file:${dbPath}`
        }
      },
      log: isDev ? ['query', 'error', 'warn'] : ['error']
    });

    console.log('Prisma Client initialized with database at:', dbPath);
  }

  return prisma;
}

export async function disconnectPrisma(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
  }
}