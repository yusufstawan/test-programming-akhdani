import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password, role } = req.body;

      if (!username || !password) {
        res.status(400).json({ message: "Username and password are required" });
        return;
      }

      const result = await this.authService.register({ username, password, role });
      res.status(201).json(result);
    } catch (error: any) {
      if (error.message === "Username already exists") {
        res.status(409).json({ message: error.message });
      } else {
        next(error);
      }
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;
      const result = await this.authService.login({ username, password });
      res.json(result);
    } catch (error: any) {
      if (error.message === "Invalid credentials") {
        res.status(401).json({ message: error.message });
      } else {
        next(error);
      }
    }
  };
}
