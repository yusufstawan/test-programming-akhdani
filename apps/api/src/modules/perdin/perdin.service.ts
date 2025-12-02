import { PerdinRepository } from "./perdin.repository";
import {  Perdin, City } from "../../generated/prisma/client";
import { prisma } from "../../common/prisma";

export class PerdinService {
  private perdinRepository: PerdinRepository;

  constructor() {
    this.perdinRepository = new PerdinRepository();
  }

  // Haversine Formula to calculate distance in km
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  private calculateDailyAllowance(distance: number, origin: City, dest: City): number {
    // Rule 1: 0-60 km -> Rp 0
    if (distance <= 60) {
      return 0;
    }

    // Rule 5: Perdin Luar Negeri -> USD 50
    // Note: Assuming we store as 50 (numeric) for now. UI should handle currency display.
    if (dest.isOverseas) {
      return 50;
    }

    // Rule 2: >60 km, Same Province -> Rp 200.000
    if (origin.province === dest.province) {
      return 200000;
    }

    // Rule 3: >60 km, Different Province, Same Island -> Rp 250.000
    if (origin.island === dest.island) {
      return 250000;
    }

    // Rule 4: >60 km, Different Island -> Rp 300.000
    return 300000;
  }

  async createPerdin(userId: string, data: {
    purpose: string;
    startDate: string; // ISO Date string
    endDate: string;   // ISO Date string
    originCityId: string;
    destCityId: string;
  }): Promise<Perdin> {
    const originCity = await prisma.city.findUnique({ where: { id: data.originCityId } });
    const destCity = await prisma.city.findUnique({ where: { id: data.destCityId } });

    if (!originCity || !destCity) {
      throw new Error("Origin or Destination City not found");
    }

    // Calculate Duration
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive count

    // Calculate Distance
    const distance = this.calculateDistance(
      originCity.latitude,
      originCity.longitude,
      destCity.latitude,
      destCity.longitude
    );

    // Calculate Allowance
    const dailyAllowance = this.calculateDailyAllowance(distance, originCity, destCity);
    const totalAllowance = dailyAllowance * totalDays;

    return this.perdinRepository.create({
      purpose: data.purpose,
      startDate: start,
      endDate: end,
      totalDays: totalDays,
      totalAllowance: totalAllowance,
      user: { connect: { id: userId } },
      originCity: { connect: { id: data.originCityId } },
      destCity: { connect: { id: data.destCityId } },
      status: 'PENDING'
    });
  }

  async getAllPerdins(): Promise<Perdin[]> {
    return this.perdinRepository.findAll();
  }
}
