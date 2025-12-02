import { PrismaClient, Role } from '../src/generated/prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminUsername = 'admin';
  const adminPassword = 'password123'; // Default password
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const existingAdmin = await prisma.user.findUnique({
    where: { username: adminUsername },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        username: adminUsername,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log(`Admin user created: ${adminUsername} / ${adminPassword}`);
  } else {
    console.log('Admin user already exists.');
    // Optional: Update role to ADMIN if it was changed
    if (existingAdmin.role !== 'ADMIN') {
        await prisma.user.update({
            where: { username: adminUsername },
            data: { role: 'ADMIN' }
        });
        console.log('Updated existing user to ADMIN role.');
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
