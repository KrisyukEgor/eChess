import { UserResponseDTO } from "./UserResponse.dto";

export interface AuthResponseDTO {
  user: UserResponseDTO;
  token: string;
}
