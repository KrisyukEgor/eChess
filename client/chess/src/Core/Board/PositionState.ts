import { Color } from "../Enums/Color";
import { FigureName } from "../Enums/FigureName";
import { Move } from "../Move/Move";

export interface CastlingRights {
  whiteKingSide: boolean;
  whiteQueenSide: boolean;
  blackKingSide: boolean;
  blackQueenSide: boolean;
}

export class PositionState {
  public turn: Color = Color.WHITE;

  public castling: CastlingRights = {
    whiteKingSide: true,
    whiteQueenSide: true,
    blackKingSide: true,
    blackQueenSide: true,
  };

  public enPassantTarget: { x: number; y: number } | null = null;

  public fullMoveNumber: number = 1;

  public halfMoveClock: number = 0;

  public clone(): PositionState {
    const copy = new PositionState();
    copy.turn = this.turn;
    copy.enPassantTarget = this.enPassantTarget && { ...this.enPassantTarget };
    copy.halfMoveClock = this.halfMoveClock;
    copy.fullMoveNumber = this.fullMoveNumber;
    copy.castling = { ...this.castling };
    return copy;
  }

  public applyMove(move: Move) {
    
      if(move.isCastling || move.figure.name === FigureName.KING) {
        if(move.figure.color === Color.WHITE) {
          this.castling.whiteKingSide = false;
          this.castling.whiteQueenSide = false;
        }
        else {
          this.castling.blackKingSide = false;
          this.castling.blackQueenSide = false;
        }
      }
      else if(move.figure.name === FigureName.ROOK) {
        const {x, y} = move.from;

        if(move.figure.color === Color.WHITE) {
          if (x === 0 && y === 7) this.castling.whiteQueenSide = false;
          if (x === 7 && y === 7) this.castling.whiteKingSide = false;
        }
        else {
          if (x === 0 && y === 0) this.castling.blackQueenSide = false;
          if (x === 7 && y === 0) this.castling.blackKingSide = false;
        }
      }

      if(move.figure.name === FigureName.PAWN && Math.abs(move.to.y - move.from.y) === 2) {
        this.enPassantTarget = {
          x: move.from.x,
          y: (move.from.y + move.to.y) / 2,
        };
      }
      else {
        this.enPassantTarget = null
      }

      if (move.figure.name === FigureName.PAWN || move.captured) {
        this.halfMoveClock = 0;
      } 
      else {
        this.halfMoveClock++;
      }

      if (move.figure.color === Color.BLACK) {
        this.fullMoveNumber++;
      }

      this.turn = this.turn === Color.WHITE ? Color.BLACK : Color.WHITE;
  }
}