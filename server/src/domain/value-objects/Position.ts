
export class Position {

    private static readonly FILES = ['a','b','c','d','e','f','g','h'] as const;

    private static readonly MIN_RANK = 1;
    private static readonly MAX_RANK = 8;
  
    public readonly file: typeof Position.FILES[number];
    public readonly rank: number;
  
    constructor(file: string, rank: number) {
      const f = file.toLowerCase();

      if (!Position.FILES.includes(f as any)) {
        throw new Error(`Invalid file “${file}”: must be one of ${Position.FILES.join(', ')}`);
      }

      if (!Number.isInteger(rank) || rank < Position.MIN_RANK || rank > Position.MAX_RANK) {
        throw new Error(`Invalid rank “${rank}”: must be integer between ${Position.MIN_RANK} and ${Position.MAX_RANK}`);
      }
  
      this.file = f as typeof Position.FILES[number];
      this.rank = rank;
      Object.freeze(this); 
    }
  
    public equals(other: Position): boolean {
      return this.file === other.file && this.rank === other.rank;
    }
  
    public toString(): string {
      return `${this.file}${this.rank}`;
    }
  
    public static fromAlgebraic(notation: string): Position {
      if (notation.length !== 2) {
        throw new Error(`Invalid notation “${notation}”: must be 2 chars like "e4"`);
      }
      const [file, rankChar] = notation.split('');
      const rank = Number(rankChar);
      return new Position(file, rank);
    }
  

    public offset(df: number, dr: number): Position | null {
      const fileIndex = Position.FILES.indexOf(this.file);
      const newFileIndex = fileIndex + df;
      const newRank = this.rank + dr;
      
      if (
        newFileIndex < 0 ||
        newFileIndex >= Position.FILES.length ||
        newRank < Position.MIN_RANK ||
        newRank > Position.MAX_RANK
      ) {
        return null; 
      }
      return new Position(Position.FILES[newFileIndex], newRank);
    }
  }
  