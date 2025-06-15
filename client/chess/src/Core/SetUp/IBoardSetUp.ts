import { Board } from "../Board/Board";

export interface IBoardSetupStrategy {
  setUp(board: Board): void;
}
