import { UserRepository } from './users.repository'
import { Prisma, User } from '../../generated/prisma/client'

export class UserService {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.userRepository.create(data)
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id)
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll()
  }

  async updateUserRole(id: string, role: string): Promise<User> {
    // Cast string to Role enum, validation should be done in controller or here
    return this.userRepository.updateRole(id, role as any)
  }
}
