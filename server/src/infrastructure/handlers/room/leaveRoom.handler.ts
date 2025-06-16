import { IRoomEventHandler } from "./IRoomEventHandler";
import { LeaveRoomUseCase } from "../../../application/use-cases/room/leaveRoom.usecase";
import { ClientService } from "../../services/ClientService";
import { ClientMeta } from "../../value-objects/clientMeta";
import { PlayerLeftPayload, RoomEvent } from "../../events/roomEvent";

type Payload = {
    roomId: string;
    userId: string;
}
export class LeaveRoomHandler implements IRoomEventHandler<Payload> {

    private service: ClientService;
    private useCase: LeaveRoomUseCase;

    constructor(service: ClientService, useCase: LeaveRoomUseCase) {
        this.service = service;
        this.useCase = useCase;
    }

    handle(meta: ClientMeta, payload: Payload) {

        this.useCase.execute(payload.roomId, payload.roomId);

        meta.roomId = null;

        const resPayload: PlayerLeftPayload = {
            userId: payload.userId,
        }

        const wsEvent: RoomEvent = {
            type: "PLAYER_LEFT",
            payload: resPayload,
        }

        this.service.broadcastToRoom(payload.roomId, wsEvent);
    }
    
}