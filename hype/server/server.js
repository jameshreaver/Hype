"use strict"

const express = require('express');
const bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4');

const app = express();
const port = process.env.PORT || 5100;
app.use(bodyParser.json())


let experiment = {
    "id":"exp00001",
    "title":"Browse Books Button",
    "versions":[
      {"name":"A001-master", "url":"http://localhost:3000/"},
      {"name":"B001-branch", "url":"http://localhost:3200/"}
    ]
  };


var Datastore = require('nedb')
var db = new Datastore({
  filename: './db/experiments.db',
  autoload: true
});

app.post('/config', (req, res) => {
  db.find({ "versions.url": req.body.url }).exec(function (err, docs) {
    let name = "";
    for (let version of docs[0]["versions"]) {
      if (version["url"] === req.body.url) {
        console.log(version["url"]+" <-");
        name = version["name"];
      }
    }
    res.send({
      "experiment-id" : docs[0]["id"],
      "version-id" : name
    });
  });
});
/*
app.post('/api/reviews', (req, res) => {
  let review = {
    id : uuidv4(),
    timestamp : new Date().toString(),
    book : req.body.book,
    review : req.body.review
  }
  db.insert(review);
  db.persistence.compactDatafile();
});
*/
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});
