import { Request, Response } from "express";
import { PerdinService } from "./perdin.service";

export class PerdinController {
  private perdinService: PerdinService;

  constructor() {
    this.perdinService = new PerdinService();
  }

  createPerdin = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id; // Assuming auth middleware attaches user
      const perdin = await this.perdinService.createPerdin(userId, req.body);
      res.status(201).json(perdin);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  getAllPerdins = async (req: Request, res: Response) => {
    try {
      const perdins = await this.perdinService.getAllPerdins();
      res.status(200).json(perdins);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}
