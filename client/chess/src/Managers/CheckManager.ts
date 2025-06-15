
import { Board } from '../Core/Board/Board';
import { Cell } from '../Core/Board/Cell';
import { Color } from '../Core/Enums/Color';
import { FigureName } from '../Core/Enums/FigureName';
import { Figure } from '../Core/Figures/Figure';
import { MoveService } from '../Core/Move/MoveService';


export class CheckManager {
  private static moveService: MoveService = new MoveService();

  public static isKingCheck(board: Board, side: Color): boolean {
    const kingCell = this.getKingCell(board, side);

    if (!kingCell) return false;

    for (const row of board.getCells()) {
      for (const cell of row) {
        const figure = cell.figure;

        if (figure && figure.color !== side) {
          const moves = this.moveService.getPotentialMoves(figure, board);

          if (moves.some((m) => m.x === kingCell.x && m.y === kingCell.y)) {
            return true;
          }
        }
      }
    }

    return false;
  }

  public static getCheckingFigures( board: Board, color: Color ): Figure[] {
    const attackers: Figure[] = [];
    const kingCell = this.getKingCell(board, color);
    if (!kingCell) return attackers;

    for (const row of board.getCells()) {
      for (const cell of row) {

        const fig = cell.figure;

        if (fig && fig.color !== color) {
          const moves = this.moveService.getPotentialMoves(fig, board);
          
          if (moves.some((m) => m.x === kingCell.x && m.y === kingCell.y)) {
            attackers.push(fig);
          }
        }
      }
    }
    return attackers;
  }

  public static getKingCell(board: Board, color: Color): Cell | undefined {
    return board
      .getCells()
      .flat()
      .find(
        (cell) =>
          cell.figure?.name === FigureName.KING && cell.figure.color === color
      );
  }
}