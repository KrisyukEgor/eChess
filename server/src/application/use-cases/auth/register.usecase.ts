import { IAuthRepository } from "../../../domain/repositories/IAuthRepository"
import { User } from "../../../domain/entities/User"


export class RegisterUseCase{
    private readonly authRepository: IAuthRepository;

    constructor(authRepository: IAuthRepository) {
        this.authRepository = authRepository;
    }

    async execute(email: string, password: string, userName: string): Promise<{user: User, token: string}> {

        return this.authRepository.register(email, password, userName);
    }
}