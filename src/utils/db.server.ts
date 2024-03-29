import { PrismaClient, Prisma } from '@prisma/client';

let $db: PrismaClient;

declare global {
  var __db: PrismaClient | undefined;
}

if (!global.__db) {
  global.__db = new PrismaClient({ log: ['info'] });
}

$db = global.__db;

export default $db;
