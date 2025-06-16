import type { Color } from "../../../../../chess/src/Core/Enums/Color";


export type ClientToServerRoomEvent =
  | { type: "CREATE_ROOM"; payload: { userId: string; userName: string, color: Color } }
  | { type: "JOIN_ROOM";   payload: { roomId: string; userId: string; userName: string } }
  | { type: "LEAVE_ROOM";  payload: { roomId: string; userId: string } }
  