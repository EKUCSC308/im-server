import express from 'express'
import http from 'http'
import io from 'socket.io'
import md5 from 'md5'
import models from './models'

const app = express()
const server = http.createServer(app)
const wsServer = io(server)

const EVENT_SCOPE_MESSAGE = 'message'
const EVENT_SCOPE_SESSION = 'session'

app.use('/scripts', express.static(__dirname + '/../node_modules'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

app.post('/create-conversation', (req, res) => {
  models.conversation.create({
    token: md5((new Date()).getTime()).substring(0, 5)
  }).then((conversation) => {
    res.json({
      token: conversation.token
    })
  })
})

wsServer.on('connection', (socket) => {
  console.log('connected')

  socket.on('event', (event) => {
    var message = {
      scope: EVENT_SCOPE_MESSAGE,
      type: event.type,
      content: event.content,
      device_token: event.device_token,
      conversation_token: event.conversation_token
    }

    models.conversation_event.create(message).then(() => {
      socket.broadcast.emit('event', message)
    })
  })

  socket.on('disconnect', () => {
    console.log('disconnected')
  })
})

server.listen(3000);
