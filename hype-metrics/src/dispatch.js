import "isomorphic-fetch"
import "babel-polyfill"

export default async function dispatch(data) {
  await fetch('/metrics', {
    method: 'POST',
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(data)
  });
}
