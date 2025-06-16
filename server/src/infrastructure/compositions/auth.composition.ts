
import express from "express";

import { RegisterUseCase } from "../../application/use-cases/auth/register.usecase";
import { LoginUseCase } from "../../application/use-cases/auth/login.usecase";
import { VerifyTokenUseCase } from "../../application/use-cases/auth/verifyToken.usecase";
import { AuthController } from "../../presentation/controllers/auth.controller";
import { AuthRouter } from "../../presentation/routes/auth.router";
import { AuthMiddleware } from "../../presentation/middleware/auth.middleware";
import { FirebaseAuthRepository } from '../persistence/firebase/firebaseAuthRepository';
import { EnvComposition } from "./env.composition";

export function authComposition(): express.Router {
    
    const authRepo = new FirebaseAuthRepository(EnvComposition.FirebaseApiKey);

    const registerUC = new RegisterUseCase(authRepo);
    const loginUC = new LoginUseCase(authRepo);
    const verifyTokenUC = new VerifyTokenUseCase(authRepo);

    const authController = new AuthController(registerUC, loginUC, verifyTokenUC);
    const authMiddleware = new AuthMiddleware(verifyTokenUC);
    
    const authRouter = new AuthRouter(authController);

    return authRouter.Router;
}