import express from "express";
import cors from "cors";
import { Request, Response, NextFunction } from "express";

const app = express();

import usersRouter from "./modules/users/users.routes";
import authRouter from "./modules/auth/auth.routes";
import perdinRouter from "./modules/perdin/perdin.routes";
import masterRouter from "./modules/master/master.routes";
import "./common/types"; 

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/perdin", perdinRouter);
app.use("/master", masterRouter);

// Health Check
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "API is running" });
});

// Global Error Handler
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  const message = err instanceof Error ? err.message : "Unknown error";
  res.status(500).json({ message: "Internal Server Error", error: message });
});

export default app;
