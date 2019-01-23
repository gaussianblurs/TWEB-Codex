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
db.settings({})

// Elasticsearch client
const esclient = new elasticsearch.Client({
  host: 'elasticsearch:9200'
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
      .then((userId) => {
        // Fetch user in db if not POSTing a new user
        if (req.method !== 'POST' || req.path !== '/users') {
          db.collection('users').doc(userId).get()
            .then((doc) => {
              if (doc.exists) {
                res.locals.user = doc.data()
                res.locals.user.id = doc.id
                next()
              } else {
                const error = new Error('User not found')
                error.status = 404
                next(error)
              }
            })
        } else {
          next()
        }
      })
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
 * USERS API
 */
// Create a user
app.post('/users', isUserAuthenticated, (req, res, next) => {
  console.log(req.body.tags)
  db.collection('users').doc(req.body.uid).set({
    nickname: req.body.nickname,
    tags: req.body.tags
  })
    .then(() => res.sendStatus(201))
    .catch(next)
})

// Get a single user by its id
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

// Update user
app.put('/users', isUserAuthenticated, (req, res, next) => {
  db.collection('users').doc(res.locals.user.id).update({
    nickname: req.body.nickname
    // tags: req.body.tags TODO
  })
    .then(() => res.sendStatus(200))
    .catch(next)
})

// Upload avatar
app.put('/users/avatar', isUserAuthenticated, (req, res, next) => {
  db.collection('users').doc(res.locals.user.id).update({
    avatar: req.body.avatar
  })
    .then(() => res.sendStatus(200))
    .catch(next)
})

// Check if username exists
app.get('/users/nickname/:nickname', (req, res, next) => {
  db.collection('users').where('nickname', '==', req.params.nickname).get()
    .then(snapshot => res.send(!snapshot.empty))
    .catch(next)
})

// User subscribtion to a tag
app.put('/tags/:tag/subscribe', isUserAuthenticated, (req, res, next) => {
  db.collection('users').doc(res.locals.user.id).update({
    tags: admin.firestore.FieldValue.arrayUnion(req.params.tag)
  })
    .then(() => res.sendStatus(200))
    .catch(next)
})

// User unsubscription to a tag
app.put('/tags/:tag/unsubscribe', isUserAuthenticated, (req, res, next) => {
  db.collection('users').doc(res.locals.user.id).update({
    tags: admin.firestore.FieldValue.arrayRemove(req.params.tag)
  })
    .then(() => res.sendStatus(200))
    .catch(next)
})

/**
 * POSTS API
 */

/**
* Push tags that are not in the DB
* @param {*} newTags tags from post
* @param {*} storedTags tags from DB
*/
function pushNewTags(newTags, storedTags = []) {
  newTags.forEach((tag) => {
    if (!storedTags.includes(tag)) {
      esclient.index({
        index: 'tags',
        type: 'tag',
        body: {
          tag
        }
      })
    }
  })
}

// Create a post
app.post('/posts', isUserAuthenticated, (req, res, next) => {
  esclient.index({
    index: 'posts',
    type: 'post',
    body: {
      title: req.body.title,
      description: req.body.description,
      tags: req.body.tags,
      content: req.body.content,
      creator_id: res.locals.user.id,
      author: res.locals.user.nickname,
      claps: 0,
      creation_time: Date.now()
    }
  })
    .then(() => {
      // handle tags
      esclient.indices.exists({
        index: 'tags'
      })
        .then((exists) => {
          if (!exists) {
            // tags index verification (first post)
            pushNewTags(req.body.tags)
          } else {
            // add new tags to DB
            esclient.search({
              index: 'tags',
              type: 'tag'
            })
              .then((result) => {
                // eslint-disable-next-line no-underscore-dangle
                const tags = result.hits.hits.map(item => item._source.tag)
                pushNewTags(req.body.tags, tags)
              })
              .catch(next)
          }
          res.sendStatus(201)
        })
        .catch(next)
    })
    .catch(next)
})

// Find a post by its id
app.get('/posts/:id', isUserAuthenticated, (req, res, next) => {
  esclient.search({
    index: 'posts',
    q: `_id:${req.params.id}`
  })
    .then(post => res.send(post))
    .catch(next)
})

// Find posts by single field
app.get('/posts/search/:field/:query', isUserAuthenticated, (req, res, next) => {
  const query = decodeURIComponent(req.params.query)
  let searchQuery
  switch (req.params.field) {
    case 'title':
      searchQuery = `title:${query}`
      break
    case 'description':
      searchQuery = `description:${query}`
      break
    case 'author':
      searchQuery = `author:${query}`
      break
    case 'user_id':
      searchQuery = `creator_id:${query}`
      break
    case 'content':
      searchQuery = `content:${query}`
      break
    case 'tags':
      searchQuery = `tags:${query}`
      break
    default:
      res.sendStatus(400)
      return
  }
  esclient.search({
    index: 'posts',
    body: {
      query: {
        function_score: {
          query: {
            query_string: {
              query: searchQuery
            }
          },
          field_value_factor: {
            field: 'claps',
            factor: 0.8,
            modifier: 'log1p'
          }
        }
      }
    },
    from: req.query.offset,
    size: req.query.pagesize
  })
    .then(posts => res.send(posts))
    .catch(next)
})

// default search on all fields
app.get('/posts/search/:query', isUserAuthenticated, (req, res, next) => {
  esclient.search({
    index: 'posts',
    body: {
      query: {
        function_score: {
          query: {
            query_string: {
              query: req.params.query
            }
          },
          field_value_factor: {
            field: 'claps',
            factor: 1.2,
            modifier: 'log1p'
          }
        }
      }
    },
    from: req.query.offset,
    size: req.query.pagesize
  })
    .then(posts => res.send(posts))
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
 * WALL API
 */
// Wall posts
app.get('/wall', isUserAuthenticated, (req, res, next) => {
  esclient.search({
    index: 'posts',
    type: 'post',
    q: `tags:${res.locals.user.tags}`,
    from: req.query.offset,
    size: req.query.pagesize,
    sort: 'creation_time:desc'
  })
    .then(posts => res.send(JSON.stringify(posts, null, 2)))
    .catch(next)
})

// Notifications
app.get('/notif/:user_id', isUserAuthenticated, (req, res, next) => {
  const { lastSeen } = req.locals.user.lastSeen
  const tagsSubscribed = req.locals.user.tags
  esclient.search({
    index: 'posts',
    type: 'post',
    body: {
      query: {
        bool: {
          must: [{ range: { creation_time: { gt: lastSeen } } }],
          filter: {
            terms: { 'tags.keyword': tagsSubscribed }
          }
        }
      },
      aggs: {
        tag: {
          terms: { field: 'tags.keyword' }
        }
      }
    }
  })
    .then((result) => {
      const tagCount = []
      result.aggregations.tag.buckets.forEach((bucket) => {
        if (tagsSubscribed.includes(bucket.key)) {
          tagCount.push({ tag: bucket.key, count: bucket.doc_count })
        }
      })
      res.send(tagCount)
    })
    .catch(next)
})

/**
 * CLAPS API
 */
// increment claps to a post
app.put('/posts/:id/update-claps', isUserAuthenticated, (req, res, next) => {
  esclient.update({
    index: 'posts',
    type: 'post',
    id: req.params.id,
    body: {
      script: `ctx._source.claps += ${req.body.claps}`,
      upsert: {
        counter: req.body.claps
      }
    },
    retryOnConflict: 5 // concurrency conflict solving
  })
    .then(() => res.sendStatus(200))
    .catch(next)
})

// Delete
app.delete('/posts/:id', isUserAuthenticated, (req, res, next) => {
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
app.post('/tags/:tag', isUserAuthenticated, (req, res, next) => {
  esclient.index({
    index: 'tags',
    type: 'tag',
    body: {
      tag: req.params.tag
    }
  })
    .then(() => res.sendStatus(201))
    .catch(next)
})

// get all tags
app.get('/tags', isUserAuthenticated, (req, res, next) => {
  esclient.search({
    index: 'tags',
    type: 'tag'
  })
    .then((result) => {
      const tags = []
      // eslint-disable-next-line no-underscore-dangle
      result.hits.hits.forEach(item => tags.push(item._source.tag))
      res.send(tags)
    })
    .catch(next)
})

// get tags like param
app.get('/tags/:tag', isUserAuthenticated, (req, res, next) => {
  esclient.search({
    index: 'tags',
    type: 'tag',
    q: `tag:${req.params.tag}*`
  })
    .then((result) => {
      const tags = []
      // eslint-disable-next-line no-underscore-dangle
      result.hits.hits.forEach(item => tags.push(item._source.tag))
      res.send(tags)
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
