import { Board } from "../Core/Board/Board";
import { PositionState } from "../Core/Board/PositionState";
import { Color } from "../Core/Enums/Color";
import { Figure } from "../Core/Figures/Figure";
import { Move } from "../Core/Move/Move";
import { MoveGenerator } from "../Core/Move/MoveGenerator";
import { MoveService } from "../Core/Move/MoveService";
import { GameHistory } from "./GameHistory";
import { MoveApplier } from "../Core/Move/MoveApplier";
import { type IBoardSetupStrategy } from "../Core/SetUp/IBoardSetUp";
import { WhiteSetUp } from "../Core/SetUp/WhiteSetUp";
import { BlackSetUp } from "../Core/SetUp/BlackSetUp";
import { GameStatus } from "../Core/Enums/GameStatus";
import { CheckManager } from '../Managers/CheckManager';

export class GameService {
  public readonly board: Board;
  public readonly state: PositionState;

  private status: GameStatus = GameStatus.Ongoing;

  private readonly service: MoveService;
  private readonly generator: MoveGenerator;
  private readonly history: GameHistory;

  constructor(side: Color, fen?: string) {
    this.board = new Board();
    this.state = new PositionState();
    this.service = new MoveService();
    this.history = new GameHistory();
    this.generator = new MoveGenerator(this.service, this.state);

    if (fen) {
      this.loadFromFEN(fen);
    } else {
      let setUpStrategy: IBoardSetupStrategy = new WhiteSetUp();
      if (side === Color.BLACK) {
        setUpStrategy = new BlackSetUp();
      }

      setUpStrategy.setUp(this.board);
    }
  }

  private loadFromFEN(fen: string): void {
    // TODO: реализовать парсинг FEN в board и state
    // пример: const parser = new FenParser(); parser.parse(fen, this.board, this.state);
  }

  public getLegalMoves(figure: Figure): Move[] {
    return this.generator.generateLegalMovesForFigure(
      this.board,
      this.state.turn,
      figure
    );
  }

  public applyMove(move: Move): void {
    MoveApplier.execute(this.board, this.state, move);

    this.history.record(move);

    this.checkGameEnd();
  }

  //   public toPgn(): string {
  //     return this.history.toPgn();
  //   }

  public get Turn(): Color {
    return this.state.turn;
  }

  private checkGameEnd() {
    
    if (this.status !== GameStatus.Ongoing) return;

    const side = this.state.turn;
    const legal = this.generator.generateLegalMovesForSide(this.board, side);
    const inCheck = CheckManager.isKingCheck(this.board, side);


    if (legal.length === 0) {
      if (inCheck) {
        if (side === Color.WHITE) {
          this.status = GameStatus.BlackWin;
        } else {
          this.status = GameStatus.WhiteWin;
        }
      }
      
      else {
        this.status = GameStatus.Draw;
      }
    }
  }

  public get Status(): GameStatus {
    return this.status;
  }

}
