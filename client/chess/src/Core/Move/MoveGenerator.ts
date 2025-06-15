import { Board } from '../Board/Board';
import { Cell } from '../Board/Cell';
import { Color } from '../Enums/Color';
import { FigureName } from '../Enums/FigureName';
import { Figure } from '../Figures/Figure';
import { Move } from './Move';
import { MoveService } from './MoveService';
import { PositionState } from '../Board/PositionState';
import { CheckManager } from '../../Managers/CheckManager';

export class MoveGenerator {
    private readonly moveService: MoveService;
    private readonly state: PositionState;

    constructor(service: MoveService, state: PositionState) {
        this.moveService = service;
        this.state = state;
    }

    public generateLegalMovesForFigure(board: Board, side: Color, figure: Figure): Move[] {
        const moves: Move[] = [];
        const fromCell = board.getCell(figure.X, figure.Y);
        if (!fromCell) return moves;

        const available: Cell[] = [...this.moveService.getPotentialMoves(figure, board)];

        if (figure.name === FigureName.PAWN && this.state.enPassantTarget) {
            const ep = this.state.enPassantTarget;
            const dir = figure.color === Color.WHITE ? -1 : +1;

            if (ep.y === figure.Y + dir && Math.abs(ep.x - figure.X) === 1) {
                const cell = board.getCell(ep.x, ep.y);
                if (cell) available.push(cell);
            }
        }

        if (figure.name === FigureName.KING && figure.X === 4) {
            const y = fromCell.y;
            if (
                (figure.color === Color.WHITE ? this.state.castling.whiteKingSide : this.state.castling.blackKingSide)
            ) {
                const f = board.getCell(5, y);
                const g = board.getCell(6, y);
                if (f?.figure == null && g?.figure == null) {
                    if (this.isSafeSquare(board, side, fromCell, f!) && this.isSafeSquare(board, side, fromCell, g!)) {
                        available.push(g!);
                    }
                }
            }
            if (
                (figure.color === Color.WHITE ? this.state.castling.whiteQueenSide : this.state.castling.blackQueenSide)
            ) {
                const d = board.getCell(3, y);
                const c = board.getCell(2, y);
                const b = board.getCell(1, y);
                if (d?.figure == null && c?.figure == null && b?.figure == null) {
                    if (this.isSafeSquare(board, side, fromCell, d!) && this.isSafeSquare(board, side, fromCell, c!)) {
                        available.push(c!);
                    }
                }
            }
        }

        for (const toCell of available) {
            let captured = toCell.figure || undefined;
            let isEnPassant = false;
            if (
                figure.name === FigureName.PAWN &&
                this.state.enPassantTarget &&
                toCell.x === this.state.enPassantTarget.x &&
                toCell.y === this.state.enPassantTarget.y
            ) {
                isEnPassant = true;
                const capY = figure.color === Color.WHITE ? toCell.y + 1 : toCell.y - 1;
                captured = board.getCell(toCell.x, capY)?.figure || undefined;
            }
            const isCastling = figure.name === FigureName.KING && Math.abs(toCell.x - fromCell.x) === 2;

            const move = new Move(fromCell, toCell, figure, captured, isEnPassant, isCastling);


            if (!CheckManager.isKingCheck(this.simulateMove(board, this.state, move), side)) {
                moves.push(move);
            }
        }
        return moves;
    }

    private isSafeSquare(board: Board, side: Color, from: Cell, to: Cell): boolean {
        const bCopy = this.simulateMove(board, this.state, new Move(from, to, from.figure!));
        return !CheckManager.isKingCheck(bCopy, side);
    }

    private simulateMove(board: Board, state: PositionState, move: Move): Board {

        const bCopy = board.getCopy();
        const sCopy = state.clone();

        if (move.isEnPassant) {
          const capY =
            move.figure.color === Color.WHITE ? move.to.y + 1 : move.to.y - 1;
          bCopy.getCell(move.to.x, capY)?.removeFigure();
        }
        if (move.isCastling) {
          const y = move.from.y;
          if (move.to.x === move.from.x + 2) {
            const rook = bCopy.getCell(7, y)!.figure!;
            bCopy.getCell(7, y)!.removeFigure();
            bCopy.getCell(5, y)!.addFigure(rook);
          } else {
            const rook = bCopy.getCell(0, y)!.figure!;
            bCopy.getCell(0, y)!.removeFigure();
            bCopy.getCell(3, y)!.addFigure(rook);
          }
        }
        bCopy.getCell(move.from.x, move.from.y)!.removeFigure();
        bCopy.getCell(move.to.x, move.to.y)!.addFigure(move.figure);
        sCopy.applyMove(move);

        return bCopy;
    }


    public generateLegalMovesForSide(board: Board, side: Color): Move[] {
        const allMoves: Move[] = [];
    
        for (const row of board.getCells()) {
          for (const cell of row) {
            const fig = cell.figure;
            
            if (fig && fig.color === side) {
              const moves = this.generateLegalMovesForFigure(
                board,
                side,
                fig
              );
              allMoves.push(...moves);
            }
          }
        }
    
        return allMoves;
    }
}
