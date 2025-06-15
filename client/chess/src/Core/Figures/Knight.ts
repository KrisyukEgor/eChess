import { Figure } from "./Figure";
import { FigureName } from "../Enums/FigureName";
import { Color } from "../Enums/Color";

export class Knight extends Figure {
  public readonly name;
  constructor(x: number, y: number, color: Color) {
    super(x, y, color);
    this.name = FigureName.KNIGHT;
  }
}
