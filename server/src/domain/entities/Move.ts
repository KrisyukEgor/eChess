// src/domain/value-objects/Move.ts

import { Position } from "../value-objects/Position";
import { ChessFigure } from "../value-objects/ChessFigure";
import { FigureType } from "../enums/FigureType";

export interface MoveProps {
  from: Position;
  to: Position;
  piece: ChessFigure;
  captured?: ChessFigure;
  isEnPassant?: boolean;
  isCastling?: boolean;
  promotion?: FigureType;
}

export class Move {
  public readonly from: Position;
  public readonly to: Position;
  public readonly piece: ChessFigure;
  public readonly captured?: ChessFigure;
  public readonly isEnPassant: boolean;
  public readonly isCastling: boolean;
  public readonly promotion?: FigureType;

  constructor(props: MoveProps) {
    const {
      from,
      to,
      piece,
      captured = undefined,
      isEnPassant = false,
      isCastling = false,
      promotion,
    } = props;

    if (from.equals(to)) {
      throw new Error( "Move.from and Move.to must be different positions");
    }

    if (isEnPassant && isCastling) {
      throw new Error("Move cannot be both en passant and castling");
    }

    if (promotion && piece.type !== FigureType.Pawn) {
      throw new Error("Only pawns can be promoted");
    }

    this.from = from;
    this.to = to;
    this.piece = piece;
    this.captured = captured;
    this.isEnPassant = isEnPassant;
    this.isCastling = isCastling;
    this.promotion = promotion;

    Object.freeze(this);
  }


  public equals(other: Move): boolean {
    const sameCaptured = this.captured && other.captured ? this.captured.equals(other.captured) : this.captured === other.captured;

    return (
      this.from.equals(other.from) &&
      this.to.equals(other.to) &&
      this.piece.equals(other.piece) &&

      sameCaptured &&
      this.isEnPassant === other.isEnPassant &&
      this.isCastling === other.isCastling &&
      this.promotion === other.promotion
    );
  }

  public toString(): string {
    const base = `${this.from.toString()}-${this.to.toString()}`;
    const promo = this.promotion
      ? `=${this.promotion.charAt(0).toUpperCase()}`
      : "";
    return base + promo;
  }

//   /**
//    * Если вам нужен фабричный метод, который строит Move из простого DTO,
//    * предполагается, что у ChessFigure есть свой метод восстановления из DTO.
//    */
//   public static fromDTO(dto: {
//     from: { file: string; rank: number };
//     to: { file: string; rank: number };
//     piece: {
//       type: string;
//       color: string;
//       position: { file: string; rank: number };
//     };
//     captured?: {
//       type: string;
//       color: string;
//       position: { file: string; rank: number };
//     };
//     isEnPassant?: boolean;
//     isCastling?: boolean;
//     promotion?: string;
//   }): Move {
//     const fromPos = new Position(dto.from.file, dto.from.rank);
//     const toPos = new Position(dto.to.file, dto.to.rank);
//     const piece = ChessFigure.fromDTO(dto.piece);
//     const captured = dto.captured
//       ? ChessFigure.fromDTO(dto.captured)
//       : undefined;
//     const promotion = dto.promotion as FigureType | undefined;

//     return new Move({
//       from: fromPos,
//       to: toPos,
//       piece,
//       captured,
//       isEnPassant: dto.isEnPassant ?? false,
//       isCastling: dto.isCastling ?? false,
//       promotion,
//     });
//   }
}
