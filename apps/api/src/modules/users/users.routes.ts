import { Router } from "express";
import { UserController } from "./users.controller";

const router = Router();
const userController = new UserController();

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);

export default router;
