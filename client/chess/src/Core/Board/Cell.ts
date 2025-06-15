import { Color } from "../Enums/Color";
import { Figure } from "../Figures/Figure";

export class Cell {
  readonly x: number;
  readonly y: number;
  readonly color: Color;
  figure: Figure | null = null;
  readonly id: string;

  constructor(x: number, y: number, color: Color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.id = `cell-${x}-${y}`;
  }

  public addFigure(figure: Figure): void {
    this.figure = figure;
  }

  public removeFigure(): void {
    this.figure = null;
  }

  public clone(): Cell {
    const copy = new Cell(this.x, this.y, this.color);
    copy.figure = this.figure;
    return copy;
  }
}
