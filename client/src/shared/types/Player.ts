import type { Color } from "../../../chess/src/Core/Enums/Color";


export interface Player {
  id: string;
  userName: string;
  color: Color
}