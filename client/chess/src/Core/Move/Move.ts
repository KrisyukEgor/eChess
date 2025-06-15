import { Cell } from "../Board/Cell";
import { Figure } from "../Figures/Figure";


export class Move {
    constructor (
        public readonly from: Cell,
        public readonly to: Cell,
        public readonly figure: Figure, 

        public readonly captured?: Figure,
        public readonly isEnPassant: boolean = false,
        public readonly isCastling: boolean = false,

        public promotion?: string

    ){}

    public equals(other: Move): boolean {
        return (
          this.from.x === other.from.x &&
          this.from.y === other.from.y &&
          this.to.x === other.to.x &&
          this.to.y === other.to.y &&
          this.isEnPassant === other.isEnPassant &&
          this.isCastling === other.isCastling &&
          this.promotion === other.promotion
        );
    }

    

   
}