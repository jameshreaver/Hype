import "isomorphic-fetch"
import "babel-polyfill"


let experimentID = "";
let versionID = "";

fetch('/hype/config', {
  method: 'POST',
  headers: {
    "Content-type": "application/json"
  },
  body: JSON.stringify({
    "url":document.URL
  })
}).then((response) => {
  return response.json();
}).then((data) => {
  experimentID = data["experiment-id"];
  versionID = data["version-id"];
});

export default async function dispatch(data) {
  await fetch('/hype/metrics', {
    method: 'POST',
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify({
      "experiment-id":experimentID,
      "version-id":versionID,
      "data":data
    })
  }).then((response) => {
    return response.json();
  }).then((data) => {
    console.log(data);
  });
}
