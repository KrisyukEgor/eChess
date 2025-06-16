import type { Data as WSData } from "ws";
import { WebSocketEvent } from "../events/websocketEvent";
import { FigureColors } from "../../domain/enums/FigureColors";
import { CreateRoomPayload, JoinRoomPayload, LeaveRoomPayload } from "../events/roomEvent";

export class WebSocketEventMapper {
  static parse(raw: WSData) : WebSocketEvent | null {
    try {
        const parsed = JSON.parse(raw.toString());

        if (typeof parsed !== "object" || parsed === null || !("type" in parsed)) {
            return null;
        }

        const { type, payload } = parsed as { type: string; payload: any };

        switch(type) {
            case "CREATE_ROOM":

                const createRoomDTO: CreateRoomPayload  = {
                    userId: payload.userId,
                    userName: payload.userName,
                    color: payload.color as FigureColors,
                }

                return {
                  type: "CREATE_ROOM",
                  payload: createRoomDTO,
                };

            case "JOIN_ROOM":
                
                const joinRoomDTO: JoinRoomPayload = {
                    roomId: payload.roomId,
                    userId: payload.userId,
                    userName: payload.userName, 
                    color: payload.color as FigureColors
                }

                return {
                    type: "JOIN_ROOM",
                    payload: joinRoomDTO
                }

            case "LEAVE_ROOM":

                const leaveRoomDTO: LeaveRoomPayload = {
                    roomId: payload.roomId,
                    userId: payload.userId,
                }


                return {
                    type: "LEAVE_ROOM",
                    payload: leaveRoomDTO
                }
            default:
                throw new Error("can not find event type in websocket mapper")
        }
    }
    catch {
        return null;
    }
  }
}
