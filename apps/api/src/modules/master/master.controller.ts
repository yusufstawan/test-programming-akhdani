import { Request, Response } from "express";
import { MasterService } from "./master.service";

export class MasterController {
  private masterService: MasterService;

  constructor() {
    this.masterService = new MasterService();
  }

  getAllCities = async (req: Request, res: Response) => {
    try {
      const cities = await this.masterService.getAllCities();
      res.status(200).json(cities);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  createCity = async (req: Request, res: Response) => {
    try {
      const city = await this.masterService.createCity(req.body);
      res.status(201).json(city);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  updateCity = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const city = await this.masterService.updateCity(id, req.body);
      res.status(200).json(city);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  deleteCity = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.masterService.deleteCity(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}
