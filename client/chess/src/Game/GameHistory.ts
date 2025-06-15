import type { Move } from "../Core/Move/Move";


export class GameHistory {
    
    private moves: Move[] = [];

    public record(move: Move) {
        this.moves.push(move);
    }

    public getHistory(): Move[] {
        return this.moves;
    }
}