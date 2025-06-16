import { IAuthRepository } from "../../../domain/repositories/IAuthRepository"
import { User } from "../../../domain/entities/User"


export class VerifyTokenUseCase {
  private readonly authRepository: IAuthRepository;

  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(token: string): Promise<User> {
    try {
      const user = await this.authRepository.verifyToken(token);

      if (!user) {
        throw new Error("User not found after token verification");
      }

      console.log(user.Id); 
      return user;
    } 
    catch (error) {
      console.error("Error in VerifyTokenUseCase:", error);
      throw error; 
    }
  }
}
  