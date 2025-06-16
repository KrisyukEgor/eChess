import { IAuthRepository } from "../../../domain/repositories/IAuthRepository"
import { User } from "../../../domain/entities/User"


export class VerifyTokenUseCase {
  private readonly authRepository: IAuthRepository;

  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(token: string): Promise<User | null> {
    try {

      const user = await this.authRepository.verifyToken(token);

      if (!user) {
        throw new Error("User not found after token verification");
      }

      return user;
    } 
    catch (error) {
      throw error; 
    }
  }
}
  