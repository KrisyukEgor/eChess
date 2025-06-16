
import { Room } from "../../../domain/entities/Room";
import { RoomService } from "../../services/RoomService";

export class LeaveRoomUseCase {

  constructor( private service: RoomService) {}

  execute(roomId: string, playerId: string): Room {
    const room = this.service.findRoomById(roomId);

    if (!room) {
      throw new Error("Cannot find room");
    }

    room.leave(playerId);

    return room;
  }
}
