// src/Core/Board/Board.ts
import { Cell } from "./Cell";
import { Color } from "../Enums/Color";
import { Figure } from "../Figures/Figure";

export class Board {
  public cells: Cell[][] = [];

  constructor() {
    this.initCells();
  }

  private initCells(): void {
    for (let y = 0; y < 8; y++) {
      const row: Cell[] = [];
      for (let x = 0; x < 8; x++) {
        const squareColor = (x + y) % 2 === 1 ? Color.BLACK : Color.WHITE;
        row.push(new Cell(x, y, squareColor));
      }
      this.cells.push(row);
    }
  }

  public getCells(): Cell[][] {
    return this.cells;
  }

  public getCell(x: number, y: number): Cell | null {
    return x < 0 || x >= 8 || y < 0 || y >= 8 ? null : this.cells[y][x];
  }

  public addFigure(x: number, y: number, figure: Figure): void {
    const cell = this.getCell(x, y);
    cell?.addFigure(figure);
  }

  public getCopy(): Board {
    const newBoard = new Board();
    newBoard.cells = this.cells.map((row) => row.map((cell) => cell.clone()));
    return newBoard;
  }

  public printBoard(): void {
    console.log("Current board state:");
    for (let y = 0; y < 8; y++) {
      let line = "";
      for (let x = 0; x < 8; x++) {
        const cell = this.cells[y][x];

        if (cell.figure) {
          line += ` ${cell.figure.name.charAt(0)}-${cell.figure.color.charAt(0)} `;
        } 
        else {
          line += " . ";
        }
      }
      console.log(line);
    }
  }
}

