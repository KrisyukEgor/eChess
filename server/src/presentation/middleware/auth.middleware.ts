import { Request, Response, NextFunction } from "express";
import { VerifyTokenUseCase } from "../../application/use-cases/auth/verifyToken.usecase";
import { User } from "../../domain/entities/User";

export class AuthMiddleware {
  private verifyTokenUseCase: VerifyTokenUseCase;

  constructor(verifyTokenUseCase: VerifyTokenUseCase) {
    this.verifyTokenUseCase = verifyTokenUseCase;
  }

  handle = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      res.status(401).send("Access denied: no token");
      return;
    }

    try {
      const user: User = await this.verifyTokenUseCase.execute(token!);

      (req as Request & { user: typeof user }).user = user;

      next();
    } catch (e: any) {
      res.status(401).send(`Access denied: ${e.message}`);
      return;
    }
  };
}
