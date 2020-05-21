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

app.get('/', function (req, res) {
  res.render("../public/index.html")
});

app.get('/countries', function (req, res) {
  res.send(utils.countries);
});

app.post('/login', function (req, res) {
  res.send(users.login(req, tempDB));
});

app.post('/sign-up', function (req, res) {
  res.send(users.addUser(req, tempDB));
});

app.post('/logout', function (req, res) {
  res.send(users.logout(req, tempDB));
});

app.get('/get-progress', function (req, res) {
  res.send(users.getUserProgress(req, tempDB));
});

app.post('/update-progress', function (req, res) {
  res.send(users.updateUserProgress(req, tempDB));
});

app.get('/check-session', function (req, res) {
  res.send(users.checkSession(req, tempDB));
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