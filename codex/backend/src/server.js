const express = require('express')
const cors = require('cors')
const firebase = require('firebase')
require('firebase/firestore')
const admin = require('firebase-admin')
const bodyParser = require('body-parser')
const elasticsearch = require('elasticsearch')

// Firebase configs
const serviceAccount = require('../serviceAccount')
const firebaseConfig = require('../firebaseConfig')

// Auth init
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

// DB init
firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()
db.settings({
  timestampsInSnapshots: true
})

// Elasticsearch client
const esclient = new elasticsearch.Client({
  host: 'localhost:9200'
})

// App init
const app = express()

// CORS options
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
      .then(userId => db.collection('users').doc(userId).get()
        .then((doc) => {
          res.locals.user = doc.data()
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

app.post('/users', (req, res, next) => {
  db.collection('users').doc(req.body.uid).set({
    fullname: req.body.name,
    username: req.body.username
  })
    .then(() => res.sendStatus(200))
    .catch(next)
})

app.get('/users/:id', (req, res, next) => {
  db.collection('users').doc(req.params.id).get()
    .then((doc) => {
      if (doc.exists) {
        res.send(doc.data())
      } else {
        const error = new Error('User not found')
        error.status = 404
        next(error)
      }
    })
})

// Posts API
// Create a post
app.put('/posts', (req, res, next) => {
  esclient.index({
    index: 'posts',
    type: 'post',
    body: {
      title: req.body.title,
      description: req.body.description,
      tags: req.body.tags,
      content: req.bodycontent,
      creator_id: req.body.user_id,                           // TODO manage users ?
      claps: 0,
      creation_time: Date.now()
    }
  })
    .then(() => res.sendStatus(201))
    .catch(next)
})

// Find a post by its id
app.get('/posts/:id', (req, res, next) => {
  esclient.search({
    index: 'posts',
    q: `_id:${req.params.id}`,
  })
    .then(post => res.send(JSON.stringify(post, null, 2)))
    .catch(next)
})


// Find posts by single field
app.get('/posts/:field/:value', (req, res, next) => {
  const value = decodeURIComponent(req.params.value)          // TODO encodeURI frontend
  let searchQuery
  switch (req.params.field) {
    case 'title' :
      searchQuery = `title:${value}`
      break
    case 'description' :
      searchQuery = `description:${value}`
      break
    case 'author':
      searchQuery = `creator_id:${value}`
      break
    case 'tag':
      searchQuery = `tags:${value}`
      break
  }
  esclient.search({
    index: 'posts',
    q: searchQuery,
    from: 0,                                                  // TODO pagination, score? split?
    size: 10
  })
  .then(post => res.send(JSON.stringify(post, null, 2)))
    .catch(next)
})

// default search on all fields
app.get('/posts/', (req, res, next) => {
  esclient.search({
    index: 'posts',
    q: `author:${req.body.query}`, // TODO multi search
    from: 0, // TODO pagination frontend?
    size: 10
  })
    .then(posts => res.send(posts))
    .catch(next)
})

/* TODO 
// Update
app.put('/posts', (req, res, next) => {
  esclient.update({
    index: 'posts',
    id: req.body.id,
    body: {
      doc: {
        title: req.body.title,
        description: req.body.description,
        tags: req.body.tags,
        content: req.bodycontent,
        creator_id: req.body.user_id
      }
    }
  })
    .then(() => res.sendStatus(200))
    .catch(next)
})
*/

// Delete
app.delete('/posts/:id', (req, res, next) => {
  esclient.delete({
    index: 'posts',
    _id: req.params.id
  })
    .then(() => res.sendStatus(200))
    .catch(next)
})

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
