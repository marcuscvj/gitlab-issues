/**
 * Starting point of application.
 *
 * @author Marcus Cvjeticanin
 * @version 1.0.0
 */

const express = require('express')
const app = express()
const path = require('path')
const fetch = require('node-fetch')
const createError = require('http-errors')

require('dotenv').config()

const HOST = process.env.HOST || 'localhost'
const PORT = process.env.PORT || 3000

const indexRouter = require('./routes/indexRouter')
const issuesRouter = require('./routes/issuesRouter')

app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

app.use('/', indexRouter)
app.use('/issues', issuesRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // 404 Not Found.
  if (err.status === 404) {
    return res
      .status(404)
      .render('errors/404.hbs', { layout: 'default' })
  }

  // 500 Internal Server Error (in production, all other errors send this response).
  if (req.app.get('env') !== 'development') {
    return res
      .status(500)
      .render('errors/500.hbs', { layout: 'default' })
  }

  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

const server = app.listen(PORT, () => {
  console.log(`Server started on http://${HOST}:${PORT}`)
  console.log('Press Ctrl-C to terminate...')
})

const io = require('socket.io')(server)

const API_URL = 'https://gitlab.lnu.se/api/v4/projects/962/issues?private_token=' + process.env.GITLAB_PRIVATE_TOKEN

io.on('connection', function (socket) {
  fetch(API_URL)
    .then(res => res.json())
    .then(json => socket.emit('addInitialIssueData', json))
})

module.exports = io
