import { Player } from "../../../domain/entities/Player";
import { Room } from "../../../domain/entities/Room";
import { v4 as uuidv4 } from "uuid";
import { RoomService } from "../../services/RoomService";



export class CreateRoomUseCase {

  constructor( private service: RoomService) {}
 execute(hostPlayer: Player): Room {

    const room = new Room(this.createRoomId(), hostPlayer);

    this.service.addRoom(room);
    return room;
  }

  private createRoomId(): string {
    return uuidv4();
  }
}
