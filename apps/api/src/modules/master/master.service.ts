import { prisma } from "../../common/prisma";
import { City } from "../../generated/prisma/client";

export class MasterService {
  async getAllCities(): Promise<City[]> {
    return prisma.city.findMany({
      orderBy: { name: 'asc' }
    });
  }

  async createCity(data: {
    name: string;
    latitude: number;
    longitude: number;
    province: string;
    island: string;
    isOverseas: boolean;
  }): Promise<City> {
    return prisma.city.create({
      data
    });
  }

  async updateCity(id: string, data: {
    name?: string;
    latitude?: number;
    longitude?: number;
    province?: string;
    island?: string;
    isOverseas?: boolean;
  }): Promise<City> {
    return prisma.city.update({
      where: { id },
      data
    });
  }

  async deleteCity(id: string): Promise<City> {
    return prisma.city.delete({
      where: { id }
    });
  }
}
