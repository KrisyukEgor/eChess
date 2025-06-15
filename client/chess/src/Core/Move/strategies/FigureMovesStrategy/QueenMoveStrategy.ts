import { Board } from "../../../Board/Board";
import { Cell } from "../../../Board/Cell";
import { Queen } from "../../../Figures/Queen";
import { type IMoveStrategy } from "../IMoveStrategy";

export class QueenMoveStrategy implements IMoveStrategy {

  private readonly directions = [
    { dx: 1, dy: 0 },
    { dx: -1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 0, dy: -1 },
    { dx: 1, dy: 1 },
    { dx: 1, dy: -1 },
    { dx: -1, dy: 1 },
    { dx: -1, dy: -1 },
  ];

  public getMoves(figure: Queen, board: Board): Cell[] {
    const moves: Cell[] = [];

    for (const { dx, dy } of this.directions) {
      let x = figure.X + dx;
      let y = figure.Y + dy;

      while (true) {
        const cell = board.getCell(x, y);
        if (!cell) break; 

        if (!cell.figure) {
          moves.push(cell);
        } 
        else {
          if (cell.figure.color !== figure.color) {
            moves.push(cell);
          }
          break;
        }

        x += dx;
        y += dy;
      }
    }

    return moves;
  }
}
