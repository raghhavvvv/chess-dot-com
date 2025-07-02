import { useEffect, useState } from "react"

const WS_URL = "wss://chess-dot-com-c8s1.onrender.com" 


export const useSocket  = () => {

    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const newSocket = new WebSocket(WS_URL);

        newSocket.onopen = () => {
            setSocket(newSocket);
        };

        newSocket.onclose = () => {
            setSocket(null);
            };
        return () => {
            newSocket.close();
        };
    }, []);

    return socket;
} 
