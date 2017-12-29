const config = require('./config')
const web3 = require('./ethconn')

const express = require('express')
const bodyParser = require('body-parser')

// ---- Web Server
const app = express()
const port = config.api.port

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

// headers setup
app.all('/*', function (req, res, next) { // CORS headers
  res.header('Access-Control-Allow-Origin', '*') // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key')
  if (req.method === 'OPTIONS') {
    res.status(200).end()
  } else {
    next()
  }
})

// routes
require('./api/routes/index')(app, web3)

// Start the server
var server = app.listen(port, () => {
  console.log('Ethereum Node HTTP RESTful API server started on: ' + port + ' ... \n')
})
