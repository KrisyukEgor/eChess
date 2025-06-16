import { IAuthRepository } from "../../../domain/repositories/IAuthRepository";
import { User } from "../../../domain/entities/User";

export class LoginUseCase {
  private readonly authRepository: IAuthRepository;

  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
  }

  async execute( email: string,password: string): Promise<{ user: User; token: string }> {
    return this.authRepository.login(email, password);
  }
}
