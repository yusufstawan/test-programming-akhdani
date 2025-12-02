import { Router } from "express";
import { MasterController } from "./master.controller";
import { authenticateToken } from "../auth/auth.middleware";

const router = Router();
const masterController = new MasterController();

router.get("/cities", authenticateToken, masterController.getAllCities);

export default router;
