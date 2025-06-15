// src/UI/BoardComponent.tsx
import React, { useState, useRef } from "react";
import CellComponent from "../CellComponent/CellComponents";
import { Cell } from "../../../../../chess/src/Core/Board/Cell";
import { Move } from "../../../../../chess/src/Core/Move/Move";
import { GameService } from "../../../../../chess/src/Game/GameService";
import { Color } from "../../../../../chess/src/Core/Enums/Color";
import styles from "./BoardComponent.module.css";
import { Board } from "../../../../../chess/src/Core/Board/Board";
import { FigureName } from "../../../../../chess/src/Core/Enums/FigureName";

interface BoardProps {
  side: Color;
}

export function BoardComponent({ side }: BoardProps) {
  const gameRef = useRef(new GameService(side));
  const game = gameRef.current;

  const [board, setBoard] = useState<Board>(game.board);

  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
  const [legalMoves, setLegalMoves] = useState<Move[]>([]);


  const handleClick = (cell: Cell) => {

    if (cell.figure && cell.figure.color === game.Turn) {
      setSelectedCell(cell);

      const moves = game.getLegalMoves(cell.figure);
      setLegalMoves(moves);
      return;
    }
    if (selectedCell) {
      const move = legalMoves.find(
        (m) =>
          m.from.x === selectedCell.x &&
          m.from.y === selectedCell.y &&
          m.to.x === cell.x &&
          m.to.y === cell.y
      );
      if (move) {
        const isPromotion =
          move.figure.name === FigureName.PAWN &&
          (move.to.y === 0 || move.to.y === 7);

        if (isPromotion) {
          const promoteTo = prompt(
            "Выберите фигуру: q, r, b, n"
          )?.toLowerCase();
          switch (promoteTo) {
            case "q":
              move.promotion = FigureName.QUEEN;
              break;
            case "r":
              move.promotion = FigureName.ROOK;
              break;
            case "b":
              move.promotion = FigureName.BISHOP;
              break;
            case "n":
              move.promotion = FigureName.KNIGHT;
              break;
            default:
              move.promotion = FigureName.QUEEN;
              break;
          }
        }

        game.applyMove(move);

        setSelectedCell(null);
        setLegalMoves([]);
        const newBoard = game.board.getCopy();
        setBoard(newBoard);
      }
    }
  };

  const rows = board.getCells();

  return (
    <div className={styles.board}>
      {rows.map((row) =>
        row.map((cell) => {
          const isSelected = selectedCell?.x === cell.x && selectedCell?.y === cell.y;
          const isMoveTarget = legalMoves.some(
            (m) => m.to.x === cell.x && m.to.y === cell.y
          );
          return (
            <CellComponent
              key={cell.id}
              cell={cell}
              isSelected={isSelected}
              isMoveTarget={isMoveTarget}
              isInCheck={false}
              onClick={handleClick}
            />
          );
        })
      )}
    </div>
  );
}

export default BoardComponent;
