import { Request, Response } from "express"
import { getPlayersUseCase } from "../../application/use-cases/room/getPlayers.usecase"

export class RoomController {

    private getPlayersUseCase: getPlayersUseCase;

    constructor(useCase: getPlayersUseCase) {
        this.getPlayersUseCase = useCase;
    }

    getPlayers = (req: Request, res: Response): void => {
        const {roomId} = req.params

        const players = this.getPlayersUseCase.execute(roomId);

        res.status(200).json({
            players: players
        })
    }
}