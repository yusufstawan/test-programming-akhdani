import { Request, Response } from "express";
import { prisma } from "../../common/prisma";

export class MasterController {
  getAllCities = async (req: Request, res: Response) => {
    try {
      const cities = await prisma.city.findMany({
        orderBy: { name: 'asc' }
      });
      res.status(200).json(cities);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}
