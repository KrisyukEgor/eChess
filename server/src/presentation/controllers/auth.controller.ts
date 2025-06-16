import { Request, Response } from "express";
import { LoginUseCase } from "../../application/use-cases/auth/login.usecase";
import { RegisterUseCase } from "../../application/use-cases/auth/register.usecase";
import { VerifyTokenUseCase } from "../../application/use-cases/auth/verifyToken.usecase";
import { RegisterDTO } from "../dto/auth/register.dto";
import { LoginDTO } from "../dto/auth/login.dto";
import { AuthMapper } from "../mappers/auth.mapper";

export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly verifyTokenUseCase: VerifyTokenUseCase
  ) {}

  register = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as RegisterDTO;

    try {
      const { user, token } = await this.registerUseCase.execute(dto.email,dto.password, dto.userName);

      const response = AuthMapper.toRegisterResponse(user, token);
      res.status(201).json(response);
    } catch (e: any) {
      res.status(400).json({ message: e.message });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as LoginDTO;

    try {
      const { user, token } = await this.loginUseCase.execute(dto.email, dto.password);
      const response = AuthMapper.toLoginResponse(user, token);
      res.status(200).json(response);
    } 
    catch (e: any) {
      res.status(400).json({ message: e.message });
    }
  };

  verifyToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
         res.status(401).json({ message: "Authorization token missing or malformed" });
         return;
      }

      const token = authHeader.split(" ")[1];
  
      const user = await this.verifyTokenUseCase.execute(token);

      if(user) {
        const userDto = AuthMapper.toUserResponse(user);
        res.status(200).json(userDto);
      }
    } 
    catch (e: any) {
      res.status(401).json({ message: e.message || "Invalid token" });
    }
  };
}
