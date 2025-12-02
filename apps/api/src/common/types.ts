import { Role } from "../generated/prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        role: Role;
      };
    }
  }
}
