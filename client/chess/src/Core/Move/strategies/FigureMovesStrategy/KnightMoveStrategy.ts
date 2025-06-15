import { Board } from "../../../Board/Board";
import { Cell } from "../../../Board/Cell";
import { Knight } from "../../../Figures/Knight";
import { type IMoveStrategy } from "../IMoveStrategy";


export class KnightMoveStrategy implements IMoveStrategy {
    private directions = [
        { dx: 2, dy: 1 }, { dx: 2, dy: -1 },
        { dx: -2, dy: 1 }, { dx: -2, dy: -1 },
        { dx: 1, dy: 2 }, { dx: 1, dy: -2 },
        { dx: -1, dy: 2 }, { dx: -1, dy: -2 },
    ]
    public getMoves(figure: Knight, board: Board): Cell[] {

      
        const moves: Cell[] = [];
        for (const { dx, dy } of this.directions) {
          const cell = board.getCell(figure.X + dx, figure.Y + dy);

          if (!cell) continue;

          if (!cell.figure || cell.figure.color !== figure.color) {
            moves.push(cell);
          }
        }
        return moves;
    }
    
}