import { ClientMeta } from "../value-objects/clientMeta";
import WebSocket from "ws";
import { WebSocketEvent } from "../events/websocketEvent";

export class ClientService {
    private clients = new Set<ClientMeta>();

    addClient(meta: ClientMeta): void {
        this.clients.add(meta);
    }

    removeClient(ws: WebSocket): ClientMeta | null {
        for (const c of this.clients) {
            if (c.socket === ws) {
                this.clients.delete(c);
                return c;
            }
        }
        return null;
    }

    findBySocket(ws: WebSocket): ClientMeta | undefined {
        return [...this.clients].find(c => c.socket === ws);
    }

    getAllClients(): ClientMeta[] {
        return [...this.clients];
    }


    sendToSocket(ws: WebSocket, event: WebSocketEvent): void {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(event));
        }
    }


    sendToClient(clientId: string, event: WebSocketEvent): void {
        const client = [...this.clients].find(c => c.userId === clientId);
        if (client && client.socket.readyState === WebSocket.OPEN) {
            client.socket.send(JSON.stringify(event));
        }
    }


    broadcastToRoom(roomId: string, event: WebSocketEvent): void {
        const data = JSON.stringify(event);
        for (const client of this.clients) {
            if (client.roomId === roomId && client.socket.readyState === WebSocket.OPEN) {
                client.socket.send(data);
            }
        }
    }


}