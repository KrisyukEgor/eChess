import { User } from "../entities/User"

export interface IAuthRepository {
  register(email: string, password: string, userName: string): Promise<{user: User, token: string}>;
  login(email: string, password: string): Promise<{user: User, token: string}>;
  verifyToken(token: string): Promise<User>;
}
