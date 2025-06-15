import { Board } from "../../Board/Board";
import { Cell } from "../../Board/Cell";
import { Figure } from "../../Figures/Figure";

export interface IMoveStrategy {
    getMoves(figure: Figure, board: Board): Cell[];
}