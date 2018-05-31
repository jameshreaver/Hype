const logger = require('../logger');

function getExperiments(req, res, db) {
  db.find({}, {id: 1, _id: 0, status :1,
    "info.title": 1,
    "info.duration": 1,
    "info.durationunit": 1,
    "time.started": 1,
  }).sort({
    "time.added": 1
  }).exec((err, docs) => {
    res.send(docs);
  });
}

function getExperiment(req, res, db) {
  db.findOne({id: req.params.id}, {
    _id: 0
  }).exec((err, doc) => {
    res.send(doc);
  });
}

function postExperiment(req, res, db) {
  db.update({ id: req.body.id }, req.body, {
    upsert:true
  }, (e, n, a, upsert) => {
    db.persistence.compactDatafile();
    if (upsert) {
      logger.logCreated(db, req.body.id);
    } else {
      logger.logEdited(db, req.body.id);
    }
  });
  res.end();
}

module.exports = {
  getExperiments,
  getExperiment,
  postExperiment
};
