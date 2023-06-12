const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Crie um worker para cada CPU disponível
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Creating a new worker.`);
    cluster.fork();
  });

  // Escute eventos de fork de novos workers
  cluster.on('fork', (worker) => {
    console.log(`Worker ${worker.process.pid} was forked`);
  });

  // Escute eventos de saída de workers
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
    cluster.fork()
  });

} else {
const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server, {cors: {origin: '*'}})
const PORT = process.env.PORT

io.on('connection', socket => {
  console.log('Usuário conectado!', socket.id);

  socket.on('disconnect', reason => {
    console.log('Usuário desconectado!', socket.id)
  })

  socket.on('set_username', username => {
    socket.data.username = username
  })

  socket.on('message', text => {
    io.emit('receive_message', {
      text,
      authorId: socket.id,
      author: socket.data.username
    })
    console.log('aiai')
  })
})

server.listen(PORT, () => 
console.log(`Worker ${process.pid} is running on port ${PORT}`))
}