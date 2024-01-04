import { PrismaClient, Prisma } from '@prisma/client';

let $db: PrismaClient;
const log: Prisma.LogLevel[] = ['info'];

declare global {
  var __db: PrismaClient | undefined;
}

if (!global.__db) {
  global.__db = new PrismaClient({ log });
}

$db = global.__db;

export default $db;
