import React from "react";
import { Cell } from "../../../../../chess/src/Core/Board/Cell";
import styles from "./CellComponents.module.css";
import { ImageGetService } from "../../services/ImageGetService";
import { Color } from "../../../../../chess/src/Core/Enums/Color";

interface CellProps {
  cell: Cell;
  isSelected: boolean;
  isMoveTarget: boolean;
  isInCheck: boolean;
  onClick: (cell: Cell) => void;
}

const CellComponent: React.FC<CellProps> = React.memo(
  ({ cell, isSelected, isMoveTarget, isInCheck, onClick }) => {
    const figure = cell.figure;

    const colorClass = cell.color === Color.BLACK ? styles.black : styles.white;
    const selectedClass = isSelected ? styles.emptySelected : "";
    const availableClass = isMoveTarget && cell.figure ? styles.availableFigure : "";
    const checkClass = isInCheck ? styles.check : "";

    return (
      <div
        className={`${styles.cell} ${colorClass} ${selectedClass} ${availableClass} ${checkClass}`}
        onClick={() => onClick(cell)}
      >
        {figure && (
          <img
            src={ImageGetService.getImageUrl(figure)}
            alt={figure.name}
            draggable={false}
          />
        )}

        {isMoveTarget && !cell.figure && (
          <div className={styles.availableEmptyCell}></div>
        )}
      </div>
    );
  },
  areEqual
);

function areEqual(prev: CellProps, next: CellProps) {
  return (
    prev.cell === next.cell &&
    prev.cell.figure === next.cell.figure &&
    prev.isSelected === next.isSelected &&
    prev.isMoveTarget === next.isMoveTarget &&
    prev.isInCheck === next.isInCheck
  );
}

export default CellComponent;
