const express = require('express')
const cors = require('cors')
const admin = require('firebase-admin')
const bodyParser = require('body-parser')


const serviceAccount = require('../serviceAccount')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const app = express()

const corsOptions = {
  // origin: 'http://example.com',
  // exposedHeaders: 'pages',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Get token from header
const getBearerToken = authHeader => authHeader.split(' ')[1]

// verify token with firebase SDK
const verifyTokenAndGetUID = token => admin.auth().verifyIdToken(token)
  .then(decodedToken => decodedToken.uid)
  .catch(error => console.error(error))

// Authorization middleware
const isUserAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(403).json({
      status: 403,
      message: 'FORBIDDEN'
    })
  }
  const token = getBearerToken(authHeader)
  if (token) {
    return verifyTokenAndGetUID(token)
      // TODO: Find user in elasticsearch
      .then(userId => Collaborator.findOne({ firebaseId: userId })
        .then((collaborator) => {
          res.locals.user = collaborator
          next()
        }))
      .catch(() => res.status(401).json({
        status: 401,
        message: 'UNAUTHORIZED'
      }))
  }
  return res.status(403).json({
    status: 403,
    message: 'FORBIDDEN'
  })
}

// Forward 404 to error handler
app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

// Error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err)
  res.status(err.status || 500)
  res.send(err.message)
})

// Server
const server = app.listen(8081, () => {
  const { address } = server.address()
  const { port } = server.address()
  console.log('Node server listening at http://%s:%s', address, port) // eslint-disable-line no-console
})
