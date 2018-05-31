function log(db, id, message) {
  db.update({ id: id }, {
    $push: { "logs": {
      "date": new Date().toJSON(),
      "message": message
  }}}, {}, ()=>{});
  db.persistence.compactDatafile();
}

function setRunning(db, id) {
  let date = new Date().toJSON();
  db.update({id: id},{
    $set: {
     "status.type": "running",
     "time.started": date
    },
    $push: { "logs": {
     "date": date,
     "message": "started"
    }}}, {}, () => {});
  db.persistence.compactDatafile();
}

function setPast(db, id, outcome, action) {
  let date = new Date().toJSON();
  db.update({id: id}, {
    $set: {
      "status.type": "past",
      "status.outcome": outcome,
      "time.stopped": date
    },
    $push: { "logs": {
     "date": date,
     "message": action
    }}}, {}, () => {});
  db.persistence.compactDatafile();
}

function logCreated(db, id) {
  log(db, id, "created");
}

function logEdited(db, id) {
  log(db, id, "edited");
}

function logStarted(db, id) {
  log(db, id, "started");
}

function logEnded(db, id) {
  log(db, id, "ended");
}

function logMerged(db, id) {
  log(db, id, "merged");
}

module.exports = {
  setRunning,
  setPast,
  logCreated,
  logEdited,
  logStarted,
  logEnded,
  logMerged
};
