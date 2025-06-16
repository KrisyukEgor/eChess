import { IRoomEventHandler } from "./IRoomEventHandler";
import { CreateRoomUseCase } from "../../../application/use-cases/room/createRoom.usecase";
import { ClientMeta } from "../../value-objects/clientMeta";
import { ClientService } from "../../services/ClientService";
import { Player } from "../../../domain/entities/Player";
import { FigureColors } from "../../../domain/enums/FigureColors";
import { RoomCreatedPayload, RoomEvent } from "../../events/roomEvent";

type Payload = {
  id: string;
  userName: string;
  color: FigureColors;
};
export class CreateRoomHandler implements IRoomEventHandler<Payload> {

    private service: ClientService;
    private useCase: CreateRoomUseCase;

    constructor(service: ClientService, useCase: CreateRoomUseCase) {
        this.service = service;
        this.useCase = useCase;
    }
    handle(meta: ClientMeta, payload: Payload) {

        meta.userId = payload.id;
        meta.userName = payload.userName;

        const player = new Player(payload.id, payload.color, payload.userName);

        const room = this.useCase.execute(player);

        meta.roomId = room.Id;

        const resPayload: RoomCreatedPayload = {
          roomId: room.Id,
          player: {
            player: player,
            isReady: false,
          }
        };

        const wsEvent: RoomEvent = {
            type: "ROOM_CREATED",
            payload: resPayload
        }

        this.service.sendToSocket(meta.socket, wsEvent);
    }
}
