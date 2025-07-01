import { WebSocket } from "ws";
import { Chess } from "chess.js";

export class Game{
    public player1: WebSocket;
    public player2: WebSocket;
    public board : Chess;
    private startTime: Date;


    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
    }
    makeMove(socket: WebSocket, move : {
        from : string, 
        to : string
    }){
        // validation here
        // is it the users move
        //is the move valid
        if (this.board.moves.length % 2 === 0 && this.player1 !== socket) {
            return
        }
        if (this.board.moves.length % 2 === 1 && this.player2 !== socket) {
            return
        }
        try{
            this.board.move(move)
        }catch(e){
            return
        }
        //update the board
        //push the move

        //check if game  over
        if(this.board.isGameOver()){
            this.player1.emit(JSON.stringify({
                type: "GAME_OVER",
                payload: {
                    winner: this.board.turn() === 'w' ? 'black' : 'white'
                }
            }));
        }

        if (this.board.moves.length % 2 === 0) {
            this.player1.send(JSON.stringify({
                type: "move",
                payload: move
            }));
        } else {
            this.player1.emit(JSON.stringify({
                type: "move",
                payload: move
            }));    
        }
        //serve the updated board to both players
    }
}