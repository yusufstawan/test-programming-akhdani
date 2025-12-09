import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { UserRepository } from '../users/users.repository'
import { Prisma, User } from '../../generated/prisma/client'

export class AuthService {
  private userRepository: UserRepository
  private readonly SALT_ROUNDS = 10
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'supersecret'

  constructor() {
    this.userRepository = new UserRepository()
  }

  async register(
    data: Prisma.UserCreateInput
  ): Promise<{ user: Omit<User, 'password'>; token: string }> {
    const existingUser = await this.userRepository.findByUsername(data.username)
    if (existingUser) {
      throw new Error('Username already exists')
    }

    const hashedPassword = await bcrypt.hash(data.password, this.SALT_ROUNDS)
    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    })

    const token = this.generateToken(user)
    return { user: this.excludePassword(user), token }
  }

  async login(
    data: Pick<Prisma.UserCreateInput, 'username' | 'password'>
  ): Promise<{ user: Omit<User, 'password'>; token: string }> {
    const user = await this.userRepository.findByUsername(data.username)
    if (!user) {
      throw new Error('Invalid credentials')
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password)
    if (!isPasswordValid) {
      throw new Error('Invalid credentials')
    }

    const token = this.generateToken(user)
    return { user: this.excludePassword(user), token }
  }

  private excludePassword(user: User): Omit<User, 'password'> {
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  private generateToken(user: User): string {
    return jwt.sign({ id: user.id, username: user.username, role: user.role }, this.JWT_SECRET, {
      expiresIn: '1d',
    })
  }
}
