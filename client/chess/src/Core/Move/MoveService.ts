import { Board } from "../Board/Board";
import { FigureName } from "../Enums/FigureName";
import { Figure } from "../Figures/Figure";
import { BishopMoveStrategy } from "./strategies/FigureMovesStrategy/BishopMoveStrategy";
import { KingMoveStrategy } from "./strategies/FigureMovesStrategy/KingMoveStrategy";
import { KnightMoveStrategy } from "./strategies/FigureMovesStrategy/KnightMoveStrategy";
import { PawnMoveStrategy } from "./strategies/FigureMovesStrategy/PawnMoveStrategy";
import { QueenMoveStrategy } from "./strategies/FigureMovesStrategy/QueenMoveStrategy";
import { RookMoveStrategy } from "./strategies/FigureMovesStrategy/RookMoveStrategy";
import { type IMoveStrategy } from "./strategies/IMoveStrategy";


export class MoveService {
    private readonly strategies: Record<FigureName, IMoveStrategy> = {
        [FigureName.ROOK]: new RookMoveStrategy(),
        [FigureName.KNIGHT]: new KnightMoveStrategy(),
        [FigureName.BISHOP]: new BishopMoveStrategy(),
        [FigureName.PAWN]: new PawnMoveStrategy(),
        [FigureName.KING]: new KingMoveStrategy(),
        [FigureName.QUEEN]: new QueenMoveStrategy(),
    }

    public getPotentialMoves(figure: Figure, board: Board) {
        const strategy = this.strategies[figure.name];
        return strategy.getMoves(figure, board);
    }
}

