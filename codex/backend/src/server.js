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

/**
 * USER API
 */
// Create user
app.post('/users', (req, res, next) => {
  db.collection('users').doc(req.body.uid).set({
    nickname: req.body.nickname,
    email: req.body.email
  })
    .then(() => res.sendStatus(201))
    .catch(next)
})

// Get user
app.get('/users/:id', isUserAuthenticated, (req, res, next) => {
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


/**
 * POSTS API
 */
// Create a post
app.post('/posts', (req, res, next) => {
  esclient.index({
    index: 'posts',
    type: 'post',
    body: {
      title: req.body.title,
      description: req.body.description,
      tags: req.body.tags,
      content: req.body.content,
      creator_id: req.body.user_id, // TODO manage users ?
      claps: 0,
      creation_time: Date.now()
    }
  })
    .then(() => {
        res.sendStatus(201)
        
        // add new tags to DB
        esclient.search({
          index: 'tags',
          type: 'tags',
        })
          .then(result => {
            let tags = []; // current tags
            result.hits.hits.forEach(item => tags.push(item._source.tag));
            
            req.body.tags.forEach(tag => {
              if (!tags.find(t => t === tag)) {
                esclient.index({
                  index: 'tags',
                  type: 'tags',
                  body: {
                    tag: tag
                  }
                })
              }
            })
          })
          .catch(next)
    })
})

// Find a post by its id
app.get('/posts/:id', (req, res, next) => {
  esclient.search({
    index: 'posts',
    q: `_id:${req.params.id}`
  })
    .then(post => res.send(JSON.stringify(post.hits.hits[0], null, 2)))
    .catch(next)
})


// Find posts by single field
app.get('/posts/:field/:value', (req, res, next) => {
  const value = decodeURIComponent(req.params.value) // TODO encodeURI frontend
  let searchQuery
  switch (req.params.field) {
    case 'title':
      searchQuery = `title:${value}`
      break
    case 'description':
      searchQuery = `description:${value}`
      break
    case 'author':
      searchQuery = `creator_id:${value}`
      break
    case 'tag':
      searchQuery = `tags:${value}`
      break
    default:
      res.sendStatus(400)
      return
  }
  esclient.search({
    index: 'posts',
    q: searchQuery,
    from: req.query.offset,
    size: req.query.pagesize
  })
    .then(post => {
      res.send(JSON.stringify(post.hits.hits, null, 2))
    })
    .catch(next)
})

// Update
// id and creator_id cannot be modified
app.put('/posts', (req, res, next) => {
  esclient.update({
    index: 'posts',
    type: 'post',
    id: req.body.id,
    body: {
      doc: {
        title: req.body.title,
        description: req.body.description,
        tags: req.body.tags,
        content: req.body.content
      }
    }
  })
    .then(() => res.sendStatus(200))
    .catch(next)
})

/**
 * CLAPS API
 */
// increment claps to a post
app.put('/posts/:id/update-claps', (req, res, next) => {            // TODO prevent from direct access?
   esclient.update({
    index: 'posts',
    type: 'post',
    id: req.params.id,
    body: {
      script: 'ctx._source.claps += 1',
      upsert: {
        counter: 1
      }
    },
    retryOnConflict : 5
  })
    .then(() => res.status(200).send('OK'))
    .catch(next)
})

// Delete
app.delete('/posts/:id', (req, res, next) => {
  esclient.delete({
    index: 'posts',
    type: 'post',
    id: req.params.id
  })
    .then(() => res.sendStatus(200))
    .catch(next)
})

/**
 * TAGS API
 */
// add tag to index of all tags
app.post('/tags/:tag', (req, res, next) => {
  esclient.index({
    index: 'tags',
    type: 'tags',
    body: {
      tag: req.params.tag,
    }
  })
    .then(() => res.sendStatus(201))
    .catch(next)
})

// get all tags
app.get('/tags/', (req, res, next) => {
  esclient.search({
    index: 'tags',
    type: 'tags'
  })
    .then(result => {
      let tags = [];
      result.hits.hits.forEach(item => tags.push(item._source.tag));
      res.status(200).send(tags)
    })
    .catch(next)
})

// get tags like param
app.get('/tags/:tag', (req, res, next) => {
  esclient.search({
    index: 'tags',
    type: 'tags',
    q: `tag:${req.params.tag}*`
  })
    .then(result => {
      let tags = [];
      result.hits.hits.forEach(item => tags.push(item._source.tag));
      res.status(200).send(tags)
    })
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
