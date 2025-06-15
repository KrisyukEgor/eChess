

export type ClientToServerRoomEvent =
  | { type: "CREATE_ROOM"; payload: { userId: string; userName: string } }
  | { type: "JOIN_ROOM";   payload: { roomId: string; userId: string; userName: string } }
  | { type: "LEAVE_ROOM";  payload: { roomId: string; userId: string } }
  ;