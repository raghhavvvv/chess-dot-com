import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';

const port = process.env.PORT ? parseInt(process.env.PORT) : 8080;
const wss = new WebSocketServer({ port: port });

const gameManager = new GameManager();

wss.on('connection', function connection(ws) {
    gameManager.addUser(ws)
    ws.on("disconnect", ()=>gameManager.removeUser(ws))
});
