"use strict"

const express = require('express');
const bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4');

const app = express();
const port = process.env.PORT || 5100;
app.use(bodyParser.json())


var Datastore = require('nedb')
var db = new Datastore({
  filename: './db/experiments.db',
  autoload: true
});

app.get('/api/experiment/:id', (req, res) => {
  db.find({id: req.params.id}, {
    _id: 0
  }).limit(1).exec(function (err, docs) {
    res.send(docs);
  });
});

app.post('/api/experiment', (req, res) => {
  db.update({ id: req.body.id }, req.body, { upsert:true }, ()=>{});
  console.log(req.body);
  res.end();
  db.persistence.compactDatafile();
});

app.get('/api/experiments/', (req, res) => {
  db.find({}, {
    id: 1,
    "info.title": 1,
    "info.duration": 1,
    "info.durationunit": 1,
    status: 1,
    "time.started": 1,
    _id: 0
  })
  .sort({ "time.added": 1 })
  .exec(function (err, docs) {
    res.send(docs);
  });
});

app.post('/config', (req, res) => {
  db.find({ "versions.url": req.body.url }).exec(function (err, docs) {
    let name = "";
    for (let version of docs[0]["versions"]) {
      if (version["url"] === req.body.url) {
        console.log(version["url"]+" <-");
        name = version["type"];
      }
    }
    res.send({
      "experiment-id" : docs[0]["id"],
      "version-id" : name
    });
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});
