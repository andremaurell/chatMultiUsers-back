import { json } from 'express';
import express from 'express';
const app = express();
import cors from 'cors'; 
import http from 'http';
const server = http.createServer(app);
import { Server as SocketIoServer } from 'socket.io';
const io = new SocketIoServer(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});
import { config } from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;
const PORT = process.env.PORT || 3001
import router from './src/routes/routes.js';

app.use(json())
app.use(cors())
app.use(router)

config()

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT || '5432', 10),
});


io.on('connection', (socket) => {

  const userId = socket.handshake.query.userId;

  socket.data.id = userId;

  console.log('Usuário conectado!', socket.data.id);

  socket.on('disconnect', (reason) => {
    console.log('Usuário desconectado!', socket.data.id)
    
  })
  socket.on('message', async (data) => {
    // Emitir para todos os clientes, excluindo o remetente
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


