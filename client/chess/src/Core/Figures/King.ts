import { Color } from "../Enums/Color";
import { FigureName } from "../Enums/FigureName";
import { Figure } from "./Figure";


export class King extends Figure {
    public readonly name;

    constructor(x: number, y: number, color: Color) {
        super(x, y, color);
        this.name = FigureName.KING;
    }
}