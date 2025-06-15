import { Board } from "../../../Board/Board";
import { Cell } from "../../../Board/Cell";
import { Color } from "../../../Enums/Color";
import { Pawn } from "../../../Figures/Pawn";
import { type IMoveStrategy } from "../IMoveStrategy";


export class PawnMoveStrategy implements IMoveStrategy {
    public getMoves (figure: Pawn, board: Board) {
        const moves: Cell[] = []

        const dir = figure.color === Color.WHITE ? -1 : +1;
        const startRow = figure.color === Color.WHITE ? 6 : 1;
        const x = figure.X;
        const y = figure.Y;

        const one = board.getCell(x, y + dir);
        if (one && !one.figure) {
          moves.push(one);

          if (y === startRow) {
            const two = board.getCell(x, y + 2 * dir);
            if (two && !two.figure) {
              moves.push(two);
            }
          }
        }

        for (const dx of [-1, +1] as const) {
          const diag = board.getCell(x + dx, y + dir);
          if (diag && diag.figure && diag.figure.color !== figure.color) {
            moves.push(diag);
          }
        }

        return moves;
    }
}