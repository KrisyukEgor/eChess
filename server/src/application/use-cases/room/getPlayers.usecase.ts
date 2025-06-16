import { Player } from "../../../domain/entities/Player";
import { RoomPlayer } from "../../../domain/entities/Room";
import { RoomService } from "../../services/RoomService";


export class getPlayersUseCase {
    private roomService: RoomService;

    constructor(service: RoomService) {
        this.roomService = service;
    }

    execute (roomId: string): RoomPlayer[] {
        
        const room = this.roomService.findRoomById(roomId);

        console.log("room id", roomId);
        console.log("room", room);

        console.log(this.roomService.getRooms());

        if(!room) return [];

        return room.getPlayers();
    }
}