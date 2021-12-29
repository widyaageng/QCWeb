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

const session = require('express-session');
const passportSocketIo = require('passport.socketio');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')
const URI = process.env.MONGO_URI;
const store = new MongoStore({ mongoUrl: URI });


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


function onAuthorizeSuccess(data, accept) {
  console.log('successful connection to socket.io');
  accept(null, true);
}

function onAuthorizeFail(data, message, error, accept) {
  if (error) throw new Error(message);
  console.log('failed connection to socket.io:', message);
  accept(null, false);
}


io.use(
  passportSocketIo.authorize({
    cookieParser: cookieParser,
    key: 'express.sid',
    secret: process.env.SESSION_SECRET,
    store: store,
    success: onAuthorizeSuccess,
    fail: onAuthorizeFail
  })
);


myDB(async client => {
  const myDataBase = await client.db('database').collection('users');

  auth(app, store, myDataBase);
  routes(app, myDataBase);

  let currentUsers = 0;
  io.on('connection', socket => {
    ++currentUsers;
    console.log(`${socket.request.user.username.split(' ')[0]} has connected`);
    io.emit('user', {
      name: socket.request.user.username.split(' ')[0],
      currentUsers,
      connected: true
    });

    socket.on('chat message', message => {
      io.emit('chat message', {
        name: socket.request.user.username.split(' ')[0],
        message
      });
    });

    socket.on('disconnect', () => {
      --currentUsers;
      console.log(`${socket.request.user.username.split(' ')[0]} has disconnected`);
      io.emit('user', {
        name: socket.request.user.username.split(' ')[0],
        currentUsers,
        connected: false
      });
    });
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
// http.listen(PORT, '0.0.0.0', () => {
//   console.log('Listening on port ' + PORT);
// });
http.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});