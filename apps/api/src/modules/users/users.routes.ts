import { Router } from "express";
import { UserController } from "./users.controller";
import { authenticateToken } from "../auth/auth.middleware";

const router = Router();
const userController = new UserController();

router.get("/", authenticateToken, userController.getAllUsers);
router.get("/:id", authenticateToken, userController.getUserById);
router.patch("/:id/role", authenticateToken, userController.updateUserRole);

export default router;
