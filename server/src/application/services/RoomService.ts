import { Room } from "../../domain/entities/Room";


export class RoomService {
  private readonly _rooms = new Map<string, Room>();

  public addRoom(room: Room) {
    this._rooms.set( room.Id,room);
  }

  public findRoomById(roomId: string): Room | undefined {
    return this._rooms.get(roomId);
  }

  public removeRoom(roomId: string): void {
    if (!this._rooms.delete(roomId)) {
      throw new Error(`Cannot remove: room ${roomId} does not exist`);
    }
  }

  public getRooms(): Room[] {
    return Array.from(this._rooms.values())
  }
}