
import { Board } from '../Board/Board';
import { Color } from '../Enums/Color';
import { Bishop } from '../Figures/Bishop';
import { King } from '../Figures/King';
import { Knight } from '../Figures/Knight';
import { Pawn } from '../Figures/Pawn';
import { Queen } from '../Figures/Queen';
import { Rook } from '../Figures/Rook';
import { type FigurePlacement } from './FigurePlacement';
import { type IBoardSetupStrategy } from './IBoardSetUp';

export class WhiteSetUp implements IBoardSetupStrategy{
    public setUp(board: Board) {
        const placements: FigurePlacement[] = [];

        for(let i = 0; i < 8; ++i) {
            placements.push({ type: Pawn, x: i, y: 1, color: Color.BLACK });
            placements.push({ type: Pawn, x: i, y: 6, color: Color.WHITE });
        }

        const order = [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook];
        for (let i = 0; i < order.length; i++) {
          placements.push({ type: order[i], x: i, y: 0, color: Color.BLACK });
          placements.push({ type: order[i], x: i, y: 7, color: Color.WHITE });
        }

        for (const p of placements) {
          const figure = new p.type(p.x, p.y, p.color);
          board.addFigure(p.x, p.y, figure);
        }
    }
}