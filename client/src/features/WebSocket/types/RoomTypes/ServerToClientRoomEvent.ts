import { type Player } from "../../../../shared/types/Player";

export type ServerToClientRoomEvent =
  | { type: "ROOM_CREATED"; payload: { roomId: string; player: Player } }
  | { type: "PLAYER_JOINED"; payload: { roomId: string, players: Player[] } }
  | { type: "PLAYER_LEFT"; payload: { userId: string } }
  | { type: "ROOM_ERROR"; payload: { message: string } };