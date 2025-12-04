import { Prisma, Perdin } from '../../generated/prisma/client'
import { prisma } from '../../common/prisma'

export class PerdinRepository {
  async create(data: Prisma.PerdinCreateInput): Promise<Perdin> {
    return prisma.perdin.create({
      data,
    })
  }

  async findById(id: string): Promise<Perdin | null> {
    return prisma.perdin.findUnique({
      where: { id },
      include: {
        user: true,
        originCity: true,
        destCity: true,
      },
    })
  }

  async findAll(where?: Prisma.PerdinWhereInput): Promise<Perdin[]> {
    return prisma.perdin.findMany({
      where,
      include: {
        user: true,
        originCity: true,
        destCity: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async update(id: string, data: Prisma.PerdinUpdateInput): Promise<Perdin> {
    return prisma.perdin.update({
      where: { id },
      data,
      include: {
        user: true,
        originCity: true,
        destCity: true,
      },
    })
  }
}
