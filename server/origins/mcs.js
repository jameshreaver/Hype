const api = require('../api');

const metricsHost = "http://localhost:4888/";

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
  getMetrics
};
