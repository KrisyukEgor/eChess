import { Board } from "../Board/Board";
import { IBoardSetupStrategy } from "./IBoardSetUp";

export class BoardSetUp{
    constructor(private strategy: IBoardSetupStrategy) {
    }

    public setUp(board: Board) {
        this.strategy.setUp(board);
    }
}