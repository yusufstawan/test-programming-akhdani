import express from "express";
import cors from "cors";
import { Request, Response, NextFunction } from "express";

const app = express();

import usersRouter from "./modules/users/users.routes";
import authRouter from "./modules/auth/auth.routes";
import perdinRouter from "./modules/perdin/perdin.routes";
import "./common/types"; 

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/perdin", perdinRouter);

// Health Check
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "API is running" });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

export default app;
