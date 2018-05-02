import express from 'express'
import http from 'http'
import io from 'socket.io'
import md5 from 'md5'
import _ from 'lodash'
import JsonWebToken from 'jsonwebtoken'
import bodyParser from 'body-parser'
import models from './models'
import * as passwordHelper from './crypto/password'

const app = express()
const server = http.createServer(app)
const wsServer = io(server)

const EVENT_SCOPE_MESSAGE = 'message'
const EVENT_SCOPE_SESSION = 'session'

app.use('/scripts', express.static(__dirname + '/../node_modules'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

app.post('/auth/register', async (req, res) => {
  if (_.isEmpty(req.body.username) || _.isEmpty(req.body.password)) {
    return res.json({
      success: false,
      error: "Username and password must have value."
    })
  }

  const user = await models.user.findOne({ where: { username: req.body.username }})

  if (!_.isEmpty(user)) {
    return res.json({
      success: false,
      error: "An account with that username already exists."
    })
  }

  await models.user.create({
    username: req.body.username,
    password: passwordHelper.hashPassword(req.body.password)
  })

  res.json({
    "success": true
  })
})

app.post('/auth/login', async (req, res) => {
  if (_.isEmpty(req.body.username) || _.isEmpty(req.body.password)) {
    return res.json({
      success: false,
      error: "Username and password must have value."
    })
  }

  const user = await models.user.findOne({
    where: {
      username: req.body.username,
      password: passwordHelper.hashPassword(req.body.password)
    }
  })

  if (!user) {
    return res.json({
      success: false,
      error: 'Invalid username and password.'
    })
  }

  delete user.password

  const jwt = JsonWebToken.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
    data: user
  }, 'secret')

  res.json({
    "jwt": jwt
  })
})

app.get('/conversations', async (req, res) => {
  await models.conversation.findAll()
    .then((conversations) => {
      res.json({
        "conversations": conversations.map((conversation) => {
          return {
            token: conversation.token,
            label: conversation.label
          }
        })
      })
    })
    .catch(() => {
      return res.json({
        success: false,
        error: "Failed to load conversations."
      })
    })
})

app.post('/conversations/create', (req, res) => {
  models.conversation.create({
    label: req.body.label,
    token: md5((new Date()).getTime()).substring(0, 5)
  }).then((conversation) => {
    res.json({
      label: req.body.label,
      token: conversation.token
    })
  })
})

wsServer.on('connection', (socket) => {
  console.log('connected')

  socket.on('event', (event) => {
    const message = {
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

server.listen(3001)
