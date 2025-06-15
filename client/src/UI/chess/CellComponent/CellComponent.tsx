import { Cell } from "../../../../chess/src/Core/Board/Cell"
import React, { type JSX } from "react"
import { Color } from "../../../../chess/src/Core/Enums/Color";
import { FigureIconService } from "../../../features/chess/services/FigureIconService";
import styles from "./CellComponent.module.css"

interface CellProps {
  cell: Cell,
  isSelected: boolean,
  isMoveTarget: boolean,
  isInCheck: boolean,
  onClick:(cell: Cell) => void,
}

const CellComponent: React.FC<CellProps> = React.memo(({cell, isSelected, isMoveTarget, isInCheck, onClick}) => {
  const colorClass = cell.color === Color.BLACK ? styles.black : styles.white;
  const selectedClass = isSelected ? styles.emptySelected : "";
  const moveTargetClass = isMoveTarget && cell.figure ? styles.availableFigure : "";
  const checkClass = isInCheck ? styles.check : "";

  let figureIcon: JSX.Element | null = null;


  if(cell.figure) {
    const url = FigureIconService.getIconUrl(cell.figure.name, cell.figure.color);
    figureIcon = <img src={url} alt={cell.figure.name} draggable={false} />;
  }

  return (
    <div
      className={`${styles.cell} ${colorClass} ${selectedClass} ${moveTargetClass} ${checkClass}`}
      onClick={() => {onClick(cell);}}
    >
      {figureIcon}
      {isMoveTarget && !cell.figure && (
        <div className={styles.availableEmptyCell}></div>
      )}
    </div>
  );
}, areEqual);

function areEqual(prevProps: CellProps, currentProps: CellProps) {
  return (
    prevProps.cell === currentProps.cell &&
    prevProps.cell.figure === currentProps.cell.figure &&
    prevProps.isSelected === currentProps.isSelected &&
    prevProps.isInCheck === currentProps.isInCheck &&
    prevProps.isMoveTarget === currentProps.isMoveTarget
  );
}

export default CellComponent