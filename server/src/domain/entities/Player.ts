import { FigureColors } from "../enums/FigureColors";

export class Player {
  private readonly userId: string;
  private color: FigureColors;
  private userName: string;

  constructor(userId: string, color: FigureColors, userName: string) {
    this.userId = userId;
    this.color = color;
    this.userName = userName;
  }

  get Id(): string {
    return this.userId;
  }

  get Color(): FigureColors {
    return this.color;
  }

  set Color(color: FigureColors) {
    this.color = color;
  }

  get UserName(): string {
    return this.userName;
  }
}