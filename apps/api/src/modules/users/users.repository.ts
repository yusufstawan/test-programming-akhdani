import { prisma } from '../../common/prisma'
import { Prisma, User, Role } from '../../generated/prisma/client'

type SafeUser = Omit<User, 'password'>

export class UserRepository {
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data })
  }

  async findByUsername(username: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { username } })
  }

  async findById(id: string): Promise<SafeUser | null> {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  async findAll(): Promise<SafeUser[]> {
    return prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  async updateRole(id: string, role: Role): Promise<SafeUser> {
    return prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }
}
