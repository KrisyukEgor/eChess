import express from "express";
import cors from "cors"
import http from "http"
import { RoutesEnum } from "./infrastructure/value-objects/routesEnum";

import { authComposition } from "./infrastructure/compositions/auth.composition";
import { WebsocketAdapter } from "./infrastructure/adapters/WebsocketAdapter";
import { EnvComposition } from "./infrastructure/compositions/env.composition";
import { RoomService } from "./application/services/RoomService";
import { roomComposition } from "./infrastructure/compositions/room.composition";

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors())


const roomService: RoomService = new RoomService();

app.use(RoutesEnum.Auth, authComposition());
app.use(RoutesEnum.Room, roomComposition(roomService));

app.get("/", (_req, res) => {
  res.send("server is running");
});


const port = EnvComposition.Port;

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

const wsAdapter = new WebsocketAdapter(server, roomService);
