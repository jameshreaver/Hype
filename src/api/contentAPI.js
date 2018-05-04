async function getContent (path) {
  let response = await fetch('/api' + path);
  let body = await response.json();
  if (response.status !== 200) {
    throw Error(body.message);
  }
  return body;
}

async function postContent (path, data) {
  await fetch('/api' + path, {
    method: 'post',
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(data)
  });
}

export function getExperiments() {
  return getContent('/experiments');
};

export function getExperiment(id) {
  return getContent('/experiment/' + id);
};

export function postExperiment(data) {
  return postContent('/experiment', data);
};
