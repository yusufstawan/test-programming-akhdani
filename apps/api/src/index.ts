import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from Express API!" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
