import { Router } from "express";
import { PerdinController } from "./perdin.controller";
import { authenticateToken } from "../auth/auth.middleware";

const router = Router();
const perdinController = new PerdinController();

router.post("/", authenticateToken, perdinController.createPerdin);
router.get("/", authenticateToken, perdinController.getAllPerdins);
router.patch("/:id/status", authenticateToken, perdinController.updateStatus);

export default router;
