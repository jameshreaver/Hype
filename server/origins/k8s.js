const api = require('../api');

const kubeHost = "http://localhost:" + process.env.KUBE;
const serviceAPI = "/api/v1/namespaces/default/services/";
const deployAPI = "/apis/apps/v1beta1/namespaces/default/deployments/";

function getServices(req, res) {
  api.GET(kubeHost + serviceAPI)
    .then(services => {
      res.send(services);
    }).catch(err => {
      res.send({});
      console.log(err);
    });
}

function getDeployments(req, res) {
  api.GET(kubeHost + deployAPI)
    .then(deployments => {
      res.send(deployments);
    }).catch(err => {
      res.send({});
      console.log(err);
    });
}

function createDeployment(config) {
  api.POST(kubeHost + deployAPI, config)
    .then(res => {
      console.log("- Created Deployment "
      + config.metadata.name);
    }).catch(err =>
      console.log(err));
}

function deleteDeployment(name) {
  api.DELETE(kubeHost + deployAPI + name)
    .then(res => {
      console.log("- Deleted Deployment "
      + name);
    }).catch(err =>
      console.log(err));
}

function patchService(service, patch) {
  api.PATCH(kubeHost + serviceAPI + service, patch)
    .then(res => {
      console.log("- Patched Service " + service);
    }).catch(err =>
      console.log(err));
}

function getDeployment(name) {
  return api.GET(kubeHost + deployAPI + name);
}

module.exports = {
  getServices,
  getDeployments,
  getDeployment,
  createDeployment,
  deleteDeployment,
  patchService
};
