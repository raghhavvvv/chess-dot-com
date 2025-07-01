import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

export class Game {
    public player1: WebSocket; // White
    public player2: WebSocket; // Black
    public board: Chess;
    private startTime: Date;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
        
        // Send initial game state and colors
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: 'white'
            }
        }));
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: 'black'
            }
        }));
    }

    makeMove(socket: WebSocket, move: { from: string, to: string }) {
        // FIX 1: Use board.turn() for robust turn validation
        // 'w' is for White's turn, 'b' for Black's
        if (this.board.turn() === 'w' && socket !== this.player1) {
            return; // Not player1's turn
        }
        if (this.board.turn() === 'b' && socket !== this.player2) {
            return; // Not player2's turn
        }

        try {
            // This will throw an error if the move is illegal
            this.board.move(move);
        } catch (e) {
            console.log("Invalid move received:", move);
            return;
        }

        // FIX 2: Correctly broadcast the GAME_OVER message to both players
        if (this.board.isGameOver()) {
            const gameOverMessage = JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === 'w' ? 'black' : 'white'
                }
            });
            this.player1.send(gameOverMessage);
            this.player2.send(gameOverMessage);
            return;
        }

        // FIX 3: Send the move update to the OPPONENT, not the sender
        const moveMessage = JSON.stringify({
            type: MOVE,
            payload: move
        });

        if (socket === this.player1) {
            // If player1 (White) made the move, send it to player2 (Black)
            this.player2.send(moveMessage);
        } else {
            // If player2 (Black) made the move, send it to player1 (White)
            this.player1.send(moveMessage);
        }
    }
}