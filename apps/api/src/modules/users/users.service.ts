import { UserRepository } from './users.repository'
import { Prisma, User } from '../../generated/prisma/client'

type SafeUser = Omit<User, 'password'>

export class UserService {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.userRepository.create(data)
  }

  async getUserById(id: string): Promise<SafeUser | null> {
    return this.userRepository.findById(id)
  }

  async getAllUsers(): Promise<SafeUser[]> {
    return this.userRepository.findAll()
  }

  async updateUserRole(id: string, role: string): Promise<SafeUser> {
    return this.userRepository.updateRole(id, role as any)
  }
}
