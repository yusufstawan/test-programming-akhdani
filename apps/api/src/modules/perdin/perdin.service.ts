import { PerdinRepository } from './perdin.repository'
import { Perdin, City, PerdinStatus, Prisma } from '../../generated/prisma/client'
import { prisma } from '../../common/prisma'
import { calculateDistance } from '../../common/utils/distance.util'

export class PerdinService {
  private perdinRepository: PerdinRepository

  constructor() {
    this.perdinRepository = new PerdinRepository()
  }

  private calculateDailyAllowance(distance: number, origin: City, dest: City): number {
    // Rule 5: Perdin Luar Negeri -> USD 50
    // Note: store as 50 (numeric) for now. UI should handle currency display.
    if (dest.isOverseas) {
      return 50
    }

    // Rule 1: 0-60 km -> Rp 0
    if (distance <= 60) {
      return 0
    }

    // Rule 2: >60 km, Same Province -> Rp 200.000
    if (origin.province === dest.province) {
      return 200000
    }

    // Rule 3: >60 km, Different Province, Same Island -> Rp 250.000
    if (origin.island === dest.island) {
      return 250000
    }

    // Rule 4: >60 km, Different Island -> Rp 300.000
    return 300000
  }

  async createPerdin(
    userId: string,
    data: {
      purpose: string
      startDate: string // ISO Date string
      endDate: string // ISO Date string
      originCityId: string
      destCityId: string
    }
  ): Promise<Perdin> {
    const originCity = await prisma.city.findUnique({ where: { id: data.originCityId } })
    const destCity = await prisma.city.findUnique({ where: { id: data.destCityId } })

    if (!originCity || !destCity) {
      throw new Error('Origin or Destination City not found')
    }

    if (data.originCityId === data.destCityId) {
      throw new Error('Origin and Destination City cannot be the same')
    }

    // Calculate Duration
    const start = new Date(data.startDate)
    const end = new Date(data.endDate)

    if (end < start) {
      throw new Error('End date cannot be before start date')
    }
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 // Inclusive count

    // Calculate Distance
    const distance = calculateDistance(
      originCity.latitude,
      originCity.longitude,
      destCity.latitude,
      destCity.longitude
    )

    // Calculate Allowance
    const dailyAllowance = this.calculateDailyAllowance(distance, originCity, destCity)
    const totalAllowance = dailyAllowance * totalDays

    return this.perdinRepository.create({
      purpose: data.purpose,
      startDate: start,
      endDate: end,
      totalDays: totalDays,
      totalAllowance: totalAllowance,
      distance: distance,
      user: { connect: { id: userId } },
      originCity: { connect: { id: data.originCityId } },
      destCity: { connect: { id: data.destCityId } },
      status: 'PENDING',
    })
  }

  async getAllPerdins(userId: string, role: string): Promise<Perdin[]> {
    let where: Prisma.PerdinWhereInput = {}

    if (role === 'PEGAWAI') {
      where = { userId }
    }

    return this.perdinRepository.findAll(where)
  }

  async updatePerdinStatus(id: string, status: PerdinStatus): Promise<Perdin> {
    return this.perdinRepository.update(id, { status })
  }
}
