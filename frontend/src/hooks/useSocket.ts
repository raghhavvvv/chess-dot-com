import { useEffect, useState } from "react"

const WS_URL = "ws://localhost:8080" 


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