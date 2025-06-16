import { FigureColors } from "../enums/FigureColors";
import { FigureType } from "../enums/FigureType";
import { Position } from "./Position";


export class ChessFigure {
  private _position: Position;

  constructor(public readonly id: string, position: Position,public readonly type: FigureType,public readonly color: FigureColors) {
    this._position = position;
  }

  get position(): Position {
    return this._position;
  }

  moveTo(newPos: Position): void {
    if (newPos.equals(this._position)) {
      throw new Error('Piece must move to a different square');
    }
    this._position = newPos;
  }

  public equals(other: ChessFigure): boolean {
    return (
      this.id === other.id &&
      this.type === other.type &&
      this.color === other.color &&
      this.position.equals(other.position)
    );
  }
}