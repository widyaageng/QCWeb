'use strict';
require('dotenv').config();
const express = require('express');
const myDB = require('./connection');
const routes = require('./routes.js');
const auth = require('./auth.js');
const fccTesting = require('./freeCodeCamp/fcctesting.js');

const app = express();
app.set('view engine', 'pug');
const http = require('http').createServer(app);
const io = require('socket.io')(http);


// ----------- middleware -----------
//app logger
function appLogger(req, res, next) {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
}
// ----------- middleware end -----------


fccTesting(app); //For FCC testing purposes
app.use('/public', express.static(process.cwd() + '/public'));
app.use(appLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

myDB(async client => {
  const myDataBase = await client.db('database').collection('users');


  auth(app, myDataBase);
  routes(app, myDataBase);

  io.on('connection', socket => {
    console.log('A user has connected');
  });

  app.use((req, res, next) => {
    res.status(404)
      .type('text')
      .send('Not Found');
  });
}).catch(e => {
  app.route('/').get((req, res) => {
    res.render('pug/index', {
      title: e,
      message: 'Unable to login',
      showLogin: true,
      showRegistration: true
    });
  });
});


const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});
