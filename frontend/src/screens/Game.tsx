import { useEffect } from "react";
import { Button } from "../components/Button"
import { ChessBoard } from "../components/ChessBoard"
import { useSocket } from "../hooks/useSocket"

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";


export const Game = () => {
    const socket = useSocket();

    useEffect(() => {
        if (!socket){
            return
        }
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log("Received message:", message);

            switch (message.type) {
                case INIT_GAME:
                    console.log("Game initialized");
                    break;
                case MOVE:
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
                <div className="col-span-4 bg-red-200 w-full">
                    <ChessBoard />
                </div>
                <div className="col-span-2 bg-green-200">
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
}