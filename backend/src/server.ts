import express from 'express';
import cors from 'cors';
import http from 'http'
import socketIo from 'socket.io'

import {UserController} from './controllers/userController';
import { ChatsController } from './controllers/chatsController';

const server = express();
const httpServer = http.createServer(server);

server.use(cors());



//Socketio Server:
const io = new socketIo.Server(httpServer, 
    {
        cors: {
            origin: '*'
        }
    })
io.on("connection", (userSocket) => chatsController.onSocketConnection(userSocket))


// Express Server:
const userController = new UserController();
const chatsController = new ChatsController(io);


server.use(userController.router);
server.use(chatsController.router)
server.use('/images/', express.static('database/images/' ));


// Run server
httpServer.listen(3000, () => {
    console.log('Listen on 3000');
});
