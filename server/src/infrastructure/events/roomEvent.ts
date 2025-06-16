import { Player } from "../../domain/entities/Player";
import { FigureColors } from "../../domain/enums/FigureColors";

export interface CreateRoomPayload {
  userId: string;
  userName: string;
  color: FigureColors;
}

export interface JoinRoomPayload {
  roomId: string;
  userId: string;
  userName: string;
  color: FigureColors;
}

export interface LeaveRoomPayload {
  roomId: string;
  userId: string;
}

export interface PlayerPayload {
  id: string;
  color: FigureColors;
  userName: string;
}

export interface RoomJoinedPayload {
  roomId: string;
  players: Player[];
}

export interface RoomCreatedPayload {
  roomId: string;
  player: Player;
}

export interface PlayerLeftPayload {
  userId: string;
}

export interface RoomErrorPayload {
  message: string;
}

export type RoomEvent =
  | { type: "CREATE_ROOM"; payload: CreateRoomPayload }
  | { type: "ROOM_CREATED"; payload: RoomCreatedPayload }
  | { type: "JOIN_ROOM"; payload: JoinRoomPayload }
  | { type: "ROOM_JOINED"; payload: RoomJoinedPayload }
  | { type: "LEAVE_ROOM"; payload: LeaveRoomPayload }
  | { type: "PLAYER_LEFT"; payload: PlayerLeftPayload }
  | { type: "ROOM_ERROR"; payload: RoomErrorPayload };
