import { Color } from "../Enums/Color";
import { FigureName } from "../Enums/FigureName";


export abstract class Figure {
  private x: number;
  private y: number;
  public abstract readonly name: FigureName;
  public readonly color: Color;

  constructor(x: number, y: number, color: Color) {
    this.x = x;
    this.y = y;
    this.color = color;
  }

  public changePosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  public get X(): number {
    return this.x;
  }

  public get Y(): number {
    return this.y;
  }
}
