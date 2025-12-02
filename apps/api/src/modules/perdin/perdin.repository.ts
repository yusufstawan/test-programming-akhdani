import { Prisma, Perdin } from "../../generated/prisma/client";
import { prisma } from "../../common/prisma";

export class PerdinRepository {
  async create(data: Prisma.PerdinCreateInput): Promise<Perdin> {
    return prisma.perdin.create({
      data,
    });
  }

  async findById(id: string): Promise<Perdin | null> {
    return prisma.perdin.findUnique({
      where: { id },
      include: {
        user: true,
        originCity: true,
        destCity: true,
      },
    });
  }

  async findAll(): Promise<Perdin[]> {
    return prisma.perdin.findMany({
      include: {
        user: true,
        originCity: true,
        destCity: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
