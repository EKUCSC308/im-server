import express from 'express'
import http from 'http'
import io from 'socket.io'

const app = express()
const server = http.createServer(app)
const wsServer = io(server)

app.use('/scripts', express.static(__dirname + '/../node_modules'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

wsServer.on('connection', (socket) => {
  console.log('connected')

  socket.emit('event', {
    "scope": "message",
    "data": {
      "type": "text",
      "content": "Welcome!"
    }
  })

  socket.on('event', (event) => {
    console.log('message received', event)
    socket.broadcast.emit('event', event)
  })

  socket.on('disconnect', () => {
    console.log('disconnected')
  })
})

server.listen(3000);
