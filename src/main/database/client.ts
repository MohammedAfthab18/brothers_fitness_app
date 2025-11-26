import { PrismaClient } from '../../../generated/prisma';
import { app } from 'electron';
import { join } from 'path';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

// Singleton Prisma Client
let prisma: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    const isDev = process.env.NODE_ENV === 'development';
    const dbPath = isDev
      ? join(process.cwd(), 'prisma', 'brothers_fitness.db')
      : join(app.getPath('userData'), 'brothers_fitness.db');

    console.log('Database path:', dbPath);

    // Create adapter with the database path
    const adapter = new PrismaBetterSqlite3({
      url: `file:${dbPath}`
    });

    // Initialize Prisma with the adapter
    prisma = new PrismaClient({ 
      adapter,
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