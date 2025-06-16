import { Player } from "./Player";
import { RoomStatus } from "../enums/RoomStatus";

interface RoomPlayer {
    player: Player;
    isReady: boolean
}

export class Room {
    private status: RoomStatus = RoomStatus.Waiting_players;
    private hostId: string;
    private id: string;

    private _players: RoomPlayer[] = [];

    constructor(roomId: string, hostPlayer: Player) {
        this.id = roomId;
        this.hostId = hostPlayer.Id;

        this.join(hostPlayer);
    }

    public get HostId() {
        return this.hostId;
    }

    public get Id() {
        return this.id;
    }
    public join(player: Player ): void {

        const roomPlayer: RoomPlayer = {
            player: player,
            isReady: false,
        }
        if (this.status !== RoomStatus.Waiting_players) {
          throw new Error("Cannot join: room is not waiting for players");
        }

        if (this._players.length >= 2) {
          throw new Error("Cannot join: room is already full");
        }
        if (this._players.some((p) => p.player.Id === player.Id)) {
          throw new Error("Player is already in the room");
        }

        this._players.push(roomPlayer);
        
        if(this._players.length == 2) {
            this.status = RoomStatus.WaitingForReady;
        }
    }

    public setPlayerReadyStatus(playerId: string): void {
        const player = this.findPlayer(playerId);
        if (player.isReady) {
          return;
        }

        player.isReady = true;
    
        if (this.status === RoomStatus.WaitingForReady &&
            this._players.every(p => p.isReady)) {
          this.status = RoomStatus.InProgress;
        }
      }

    public leave(playerId: string): void {
        const player = this.findPlayer(playerId);

        this._players = this._players.filter(p => p !== player);

        if (this._players.length < 2) {
          this.status = RoomStatus.Waiting_players;
        }
    }

    private findPlayer(playerId: string): RoomPlayer {
        const player = this._players.find((p) => p.player.Id === playerId);

        if (!player) {
          throw new Error("cannot find player in room");
        }

        return player;
    }


    public getPlayers(): Player[] {
        const players: Player[] = [];

        for(const player of this._players) {
            players.push(player.player)
        }
        return players;
    }
}