const api = require('../api');

var metricsHost = "";

function setMetricsHost(cdb) {
  cdb.findOne({
    type: "info"
  }).exec((err, doc) => {
    metricsHost = doc.data["metrics-host"];
  });
}

function getMetrics(req, res) {
  api.GET(metricsHost + req.params.id)
    .then(metrics => {
      res.send(metrics);
    }).catch(err => {
      res.send([]);
      console.log(err);
  });
}

module.exports = {
  setMetricsHost,
  getMetrics
};
