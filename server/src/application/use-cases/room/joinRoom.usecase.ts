import { Player } from "../../../domain/entities/Player";
import { Room } from "../../../domain/entities/Room";
import { RoomService } from "../../services/RoomService";


export class JoinRoomUseCase {

  constructor( private service: RoomService) {}

  execute(roomId: string, player: Player): Room {

    console.log(this.service.getRooms())
    const room = this.service.findRoomById(roomId);

    if (!room) {
      throw new Error("Cannot find room");
    }

    room.join(player);

    return room;
  }
}
