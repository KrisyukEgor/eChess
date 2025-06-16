import { Router } from "express";
import { RoomController } from "../controllers/room.controller";

export class RoomRouter {

    private roomController: RoomController;
    private router: Router;

    constructor(roomController: RoomController) {
        this.roomController = roomController;
        this.router = Router();

        this.setRoutes();
    }

    private setRoutes() {
        this.router.get("/:roomId/players", this.roomController.getPlayers)
    }

    public get Router() {
        return this.router;
    }
}