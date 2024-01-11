const numCPUs = require('os').cpus().length;

const express = require('express')
const app = require('express')()
const cors = require('cors'); 
const server = require('http').createServer(app)
const {Server: SocketIoServer} = require('socket.io')
const io = new SocketIoServer(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});
const dotenv = require('dotenv')
const Pool = require('pg').Pool
const PORT = process.env.PORT || 3001
const router = require('./src/routes/routes')



app.use(express.json())
app.use(cors())
app.use(router)

dotenv.config()


const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT || 5432,
})


io.on('connection', (socket) => {
  console.log('Usuário conectado!', socket.data.id);

  socket.on('disconnect', (reason) => {
    console.log('Usuário desconectado!', socket.data.id)
  })
  })

server.listen(PORT, () => 
console.log(`Worker ${process.pid} is running on port ${PORT}`))

module.exports = {
  io,
  pool,
  server,
  app,
}

