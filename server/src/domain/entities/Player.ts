import { FigureColors } from "../enums/FigureColors";

export class Player {
  private readonly id: string;
  private color: FigureColors;
  private userName: string;

  constructor(userId: string, color: FigureColors, userName: string) {
    this.id = userId;
    this.color = color;
    this.userName = userName;
  }

  get Id(): string {
    return this.id;
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