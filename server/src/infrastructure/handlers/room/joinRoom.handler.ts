import { JoinRoomUseCase } from "../../../application/use-cases/room/joinRoom.usecase"
import { Player } from "../../../domain/entities/Player"
import { FigureColors } from "../../../domain/enums/FigureColors"
import { ClientMeta } from "../../value-objects/clientMeta";
import { RoomEvent, RoomJoinedPayload } from "../../events/roomEvent";
import { ClientService } from "../../services/ClientService";
import { IRoomEventHandler } from "./IRoomEventHandler";

type Payload = {
    roomId: string,
    userId: string,
    userName: string,
    color: FigureColors;
}
export class JoinRoomHandler implements IRoomEventHandler<Payload> {

    private service: ClientService;
    private useCase: JoinRoomUseCase;

    constructor(service: ClientService, useCase: JoinRoomUseCase) {
        this.service = service;
        this.useCase = useCase;
    }

    handle(meta: ClientMeta, payload: Payload) {

        meta.userId = payload.userId;
        meta.userName = payload.userName;
        meta.roomId = payload.roomId;

        console.log("joint payload", payload)

        const player = new Player(payload.userId, payload.color, payload.userName);

        const room = this.useCase.execute(payload.roomId ,player);
        
        const responsePayload: RoomJoinedPayload = {
            roomId: room.Id,
            players: room.getPlayers()
        }
        const wsEvent: RoomEvent = {
          type: "PLAYER_JOINED",
          payload: responsePayload,
        };

        this.service.broadcastToRoom(room.Id, wsEvent);
    }
}