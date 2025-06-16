import WebSocket from "ws";

export type ClientMeta = {
  socket: WebSocket;
  roomId: string | null;
  userId: string;
  userName: string;
};
