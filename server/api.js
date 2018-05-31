async function GET(path) {
  let response = await fetch(path);
  let body = await response.json();
  if (response.status !== 200) {
    throw Error(body.message);
  }
  return body;
}

async function POST(path, data) {
  await fetch(path, {
    method: 'post',
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(data)
  });
}

async function PATCH(path, data) {
  await fetch(path, {
    method: 'patch',
    headers: {
      "Content-type": "application/merge-patch+json"
    },
    body: JSON.stringify(data)
  });
}

async function DELETE(path) {
  await fetch(path, {
    method: 'delete',
    headers: {
      "Content-type": "application/json"
    },
  });
}

module.exports = {
  GET,
  POST,
  PATCH,
  DELETE
};
