async function getAPI (path) {
  let response = await fetch('/api' + path);
  let body = await response.json();
  if (response.status !== 200) {
    throw Error(body.message);
  }
  return body;
}

async function postAPI (path, data) {
  await fetch('/api' + path, {
    method: 'post',
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(data)
  });
}

export function getExperiments() {
  return getAPI('/data/experiments/');
};

export function getExperiment(id) {
  return getAPI('/data/experiment/' + id);
};

export function postExperiment(data) {
  return postAPI('/data/experiment/', data);
};

export function getMetrics(id) {
  return getAPI('/metrics/' + id);
};

export function getServices() {
  return getAPI('/k8s/services/');
};

export function getDeployments() {
  return getAPI('/k8s/deployments/');
};

export function getBranches(source) {
  return getAPI('/git/branches/' + source);
};

export function runExperiment(id) {
  return getAPI('/run/experiment/' + id);
};

export function endExperiment(id, success) {
  let outcome = (success) ? "success" : "failure";
  return getAPI('/end/experiment/' + outcome + '/' + id);
};

export function mergeExperiment(id, success) {
  let outcome = (success) ? "success" : "failure";
  return getAPI('/merge/experiment/' + outcome + '/' + id);
};
