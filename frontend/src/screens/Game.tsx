import { useEffect, useState } from "react";
import { Button } from "../components/Button"
import { ChessBoard } from "../components/ChessBoard"
import { useSocket } from "../hooks/useSocket"
import { Chess } from "chess.js";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";


export const Game = () => {
    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());

    useEffect(() => {
        if (!socket){
            return
        }
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            switch (message.type) {
                case INIT_GAME:
                    setChess(new Chess());
                    setBoard(chess.board());
                    console.log("Game initialized");
                    break;
                case MOVE:
                    const move = message.payload;
                    chess.move(move);
                    setBoard(chess.board());
                    console.log("Move received:", message.data);
                    break;
                case GAME_OVER:
                    console.log("Game over:", message.data);
                    break;
                default:
                    console.warn("Unknown message type:", message.type);
            }
        };


    }, [socket]);

    if (!socket) {
        return <div className="flex justify-center items-center h-screen">
            <h1 className="text-2xl text-white">Connecting to the server...</h1>
        </div>
    }

    return <div className="flex justify-center">
        <div className="pt-8 max-w-screen-lg w-full">
            <div className="grid grid-cols-6 gap-4">
                <div className="col-span-4 w-full flex justify-center">
                    <ChessBoard socket = {socket} board = {board}/>
                </div>
                <div className="col-span-2 bg-slate-800 w-full flex justify-center">
                    <div className="pt-8">
                        <Button onClick = {() => {
                            socket.send(JSON.stringify({
                                type: INIT_GAME
                            }))
                        }}>
                        Start Playing
                        </Button>
                    </div>
                </div>


            </div>
            </div>
        </div>
}