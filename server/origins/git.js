const api = require('../api');

const githubAPI = "https://api.github.com/";

function getBranches(req, res) {
  let owner = req.params.owner;
  let repo = req.params.repo;
  api.GET(githubAPI +"repos/"+ owner +"/"+ repo +"/branches")
    .then(branches => {
      res.send(branches);
    }).catch(err => {
      res.send([]);
      console.log(err);
    });
}

module.exports = {
  getBranches
};
