import { WebSocketEvent } from "../events/websocketEvent";
import { WebSocket as WSWebSocket, Server as WSServer } from "ws";
import http from "http";
import { ClientService } from "../services/ClientService";
import { CreateRoomHandler } from '../handlers/room/createRoom.handler';
import { JoinRoomHandler } from '../handlers/room/joinRoom.handler';
import { LeaveRoomHandler } from "../handlers/room/leaveRoom.handler";
import { RoomService } from "../../application/services/RoomService";
import { CreateRoomUseCase } from "../../application/use-cases/room/createRoom.usecase";
import { JoinRoomUseCase } from "../../application/use-cases/room/joinRoom.usecase";
import { LeaveRoomUseCase } from "../../application/use-cases/room/leaveRoom.usecase";
import { ClientMeta } from "../value-objects/clientMeta";
import { WebSocketEventMapper } from "../mappers/webSocketEventMapper";


export class WebsocketAdapter {
    private wss: WSServer;
    private clientService: ClientService;

    private createRoomHandler: CreateRoomHandler;
    private joinRoomHandler: JoinRoomHandler;
    private leaveRoomHandler: LeaveRoomHandler;


    constructor(server: http.Server) {
        this.wss = new WSServer({
            server: server,
        })

        this.clientService = new ClientService();

        const roomService = new RoomService();
        
        const createRoomUC = new CreateRoomUseCase(roomService);
        const joinRoomUC = new JoinRoomUseCase(roomService);
        const leaveRoomUseCase = new LeaveRoomUseCase(roomService);

        this.createRoomHandler = new CreateRoomHandler(this.clientService, createRoomUC);
        this.joinRoomHandler = new JoinRoomHandler(this.clientService, joinRoomUC);
        this.leaveRoomHandler = new LeaveRoomHandler(this.clientService, leaveRoomUseCase);

        this.wss.on("connection", (ws: WSWebSocket) => this.onConnection(ws));

        const address = server.address();
        if (typeof address === "object" && address !== null) {
          console.log(`🟢 WS сервер запущен на ws://localhost:${address.port}`);
        } else {
          console.log("🟡 WS сервер запущен (порт неизвестен)");
          console.log(address)
        }
    }


    private onConnection(ws: WSWebSocket) {

        const meta: ClientMeta = {
            socket: ws,
            roomId: null,
            userId: '',
            userName: '',
        }

        this.clientService.addClient(meta);

        ws.on("message", async (raw) => {
            const event = WebSocketEventMapper.parse(raw);

            if(!event) return;

            try {
                switch(event.type) {
                    case "CREATE_ROOM":
                        this.createRoomHandler.handle(meta, event.payload)
                        break;
                        
                    case "JOIN_ROOM":
                        this.joinRoomHandler.handle(meta, event.payload);
                        break;

                    case "LEAVE_ROOM":
                        this.leaveRoomHandler.handle(meta, event.payload);
                        break;
                    default:
                        console.warn("Неизвестный тип WS-события:", event.type);
                }
            }
            catch (err: any) {
                const message = err instanceof Error ? err.message : "Unknown error in ws"
                this.clientService.sendToSocket(ws, {
                  type: "ROOM_ERROR",
                  payload: { message: message },
                });
              }
        })

        ws.on("close", () => {
            console.log("WS клиент отключился");
        });
    }
}