import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

export class AuthRouter {

  private authController: AuthController;
  private router: Router;

  constructor (authController: AuthController) {
      this.authController = authController;

      this.router = Router();
      this.registerRoutes();
  }

  private registerRoutes(): void {
      this.router.post("/register", this.authController.register);
      this.router.post("/login", this.authController.login);
      this.router.post("/me", this.authController.verifyToken)
  }

  public get Router() {
    return this.router;
  }
}
