import { User } from "../../domain/entities/User";
import { UserResponseDTO } from "../dto/auth/UserResponse.dto";
import { AuthResponseDTO } from "../dto/auth/AuthResponse.dto";


export class AuthMapper {
  public static toUserResponse(user: User): UserResponseDTO {
    return {
      id: user.Id,
      email: user.Email,
      userName: user.UserName,
    };
  }

  public static toRegisterResponse(user: User, token: string): AuthResponseDTO {
    return {
      user: this.toUserResponse(user),
      token,
    };
  }

  public static toLoginResponse(user: User, token: string): AuthResponseDTO {
    return {
      user: this.toUserResponse(user),
      token,
    };
  }
}