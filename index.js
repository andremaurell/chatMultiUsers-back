import { json } from 'express';
import express from 'express';
const app = express();
import cors from 'cors'; 
import http from 'http';
const server = http.createServer(app);
import { Server as SocketIoServer } from 'socket.io';

import { config } from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;
const PORT = process.env.PORT || 5000
import router from './src/routes/routes.js';

app.use(json())
app.use(cors())
router.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(router)

config()

const io = new SocketIoServer(server, {
  cors: {
    origin: ['https://chat-multi-users-front.vercel.app:83'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
})


io.on('connection', (socket) => {

  const userId = socket.handshake.query.userId;

  socket.data.id = userId;

  console.log('Usuário conectado!', socket.data.id);

  socket.on('disconnect', (reason) => {
    console.log('Usuário desconectado!', socket.data.id)
    
  })
  socket.on('message', async (data) => {
    io.emit('receive_message', {
      text: data.text,
      authorId: data.authorId,
      author: data.author,
    });

    console.log('Mensagem recebida e emitida', data.authorId, data.author, data.text);
    });
  })

server.listen(PORT, () => 
console.log(`Worker ${process.pid} is running on port ${PORT}`))

export { app, server, io, pool };


