"use strict"

const express = require('express');
const bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4');

const app = express();
const port = process.env.PORT || 5500;
app.use(bodyParser.json())



var Datastore = require('nedb')
var db = new Datastore({
  filename: './db/metrics.db',
  autoload: true
});

app.get('/metrics', (req, res) => {
  db.find({}).exec(function (err, docs) {
    res.send(docs);
  });
});

app.post('/metrics', (req, res) => {
  db.insert(req.body);
  db.persistence.compactDatafile();
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});
