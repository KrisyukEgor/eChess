
import { getPlayersUseCase } from '../../application/use-cases/room/getPlayers.usecase';
import express from 'express';
import { RoomController } from '../../presentation/controllers/room.controller';
import { RoomRouter } from '../../presentation/routes/room.router';
import { RoomService } from '../../application/services/RoomService';

export function roomComposition(roomService: RoomService): express.Router {

    const getPlayersUC: getPlayersUseCase = new getPlayersUseCase(roomService);
    const roomController: RoomController = new RoomController(getPlayersUC);

    const roomRouter: RoomRouter = new RoomRouter(roomController);

    return roomRouter.Router;

}