import { Color } from "../Enums/Color";
import { Figure } from "../Figures/Figure";

export interface FigurePlacement {
    type: new (x: number, y: number, color: Color) => Figure
    x: number,
    y: number, 
    color: Color
}