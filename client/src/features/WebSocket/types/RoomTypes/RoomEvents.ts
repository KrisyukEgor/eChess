import type { ClientToServerRoomEvent } from "./ClientToServerRoomEvent";
import type { ServerToClientRoomEvent } from "./ServerToClientRoomEvent";


export type RoomEvents = ClientToServerRoomEvent | ServerToClientRoomEvent;
