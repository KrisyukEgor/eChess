import { Board } from "../Board/Board";
import { PositionState } from "../Board/PositionState";
import { Move } from "./Move";
import { Color } from "../Enums/Color";
import { FigureName } from "../Enums/FigureName";
import { Queen } from "../Figures/Queen";
import { Rook } from "../Figures/Rook";
import { Bishop } from "../Figures/Bishop";
import { Knight } from "../Figures/Knight";
import { Figure } from "../Figures/Figure";

export class MoveApplier {

  public static execute(board: Board, state: PositionState, move: Move): void {
    if (move.isEnPassant) {
      const capY =
        move.figure.color === Color.WHITE ? move.to.y + 1 : move.to.y - 1;
      board.getCell(move.to.x, capY)?.removeFigure();
    }

    if (move.isCastling) {
      const y = move.from.y;
      if (move.to.x === move.from.x + 2) {

        const rookCell = board.getCell(7, y)!;
        const rook = rookCell.figure!;
        rookCell.removeFigure();

        this.addFigure(board, move.to.x - 1, y, rook);
      } 
      else if (move.to.x === move.from.x - 2) {
        const rookCell = board.getCell(0, y)!;
        const rook = rookCell.figure!;
        rookCell.removeFigure();

        this.addFigure(board, move.to.x + 1, y, rook);
      }
    }

    board.getCell(move.from.x, move.from.y)!.removeFigure();

    if (move.promotion && move.figure.name === FigureName.PAWN) {
      const promoted = this.createPromoted(move);
      this.addFigure(board, move.to.x, move.to.y, promoted);
    } else {
      this.addFigure(board, move.to.x, move.to.y, move.figure);
    }

    state.applyMove(move);
  }


  private static addFigure(board: Board, x: number, y: number, figure: Figure) {
    figure.changePosition(x, y);
    board.getCell(x, y)!.addFigure(figure);
  }

  private static createPromoted(move: Move) {
    const { to, figure, promotion } = move;
    switch (promotion) {
      case FigureName.QUEEN:
        return new Queen(to.x, to.y, figure.color);
      case FigureName.ROOK:
        return new Rook(to.x, to.y, figure.color);
      case FigureName.BISHOP:
        return new Bishop(to.x, to.y, figure.color);
      case FigureName.KNIGHT:
        return new Knight(to.x, to.y, figure.color);
      default:
        return figure;
    }
  }
}
