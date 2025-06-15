import { Board } from "../../../Board/Board";
import { Cell } from "../../../Board/Cell";
import { King } from "../../../Figures/King";
import { type IMoveStrategy } from "../IMoveStrategy";

export class KingMoveStrategy implements IMoveStrategy {

  public getMoves(figure: King, board: Board): Cell[] {
    const moves: Cell[] = [];
    const deltas = [
      { dx:  1, dy:  0 }, { dx:  1, dy:  1 },
      { dx:  0, dy:  1 }, { dx: -1, dy:  1 },
      { dx: -1, dy:  0 }, { dx: -1, dy: -1 },
      { dx:  0, dy: -1 }, { dx:  1, dy: -1 },
    ];

    for (const { dx, dy } of deltas) {
      const x = figure.X + dx;
      const y = figure.Y + dy;

      const cell = board.getCell(x, y);
      if (!cell) continue;

      if (!cell.figure || cell.figure.color !== figure.color) {
        moves.push(cell);
      }
    }

    return moves;
  }
}
