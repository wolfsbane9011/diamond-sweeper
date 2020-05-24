const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const utils = require('./utils');
const users = require('./users');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors());

const tempDB = {};
tempDB.users = {};
tempDB.session = {};
tempDB.gameProgress = {};

function formattedResponse(error, message, data) {
  const response = {};
  response.error = error;
  response.message = message;

  if (!!data)
    response.data = data;

  return response;
}

app.get('/', function (req, res) {
  res.render("../public/index.html")
});

app.get('/countries', function (req, res) {
  res.send(utils.countries);
});

app.post('/login', function (req, res) {
  res.send(users.login(req, tempDB, formattedResponse));
});

app.post('/sign-up', function (req, res) {
  res.send(users.addUser(req, tempDB, formattedResponse));
});

app.post('/logout', function (req, res) {
  res.send(users.logout(req, tempDB, formattedResponse));
});

app.get('/get-progress', function (req, res) {
  res.send(users.getUserProgress(req, tempDB, formattedResponse));
});

app.post('/update-progress', function (req, res) {
  res.send(users.updateUserProgress(req, tempDB, formattedResponse));
});

app.get('/check-session', function (req, res) {
  res.send(users.checkSession(req, tempDB, formattedResponse));
});

app.get('/new-game', function (req, res) {
  res.send(users.newGame(req, tempDB, formattedResponse));
});

function onHouseKeepingSessions() {
  const allSessions = Object.keys(tempDB.session);
  allSessions.forEach(function (sessionId) {
    if (((new Date() - tempDB.session[sessionId].timestamp) / 60000) > 29)
      delete tempDB.session[sessionId];
  });
}

setInterval(onHouseKeepingSessions, 60000);

app.listen(4200, function () {
  console.log('Listening on port 4200!')
});