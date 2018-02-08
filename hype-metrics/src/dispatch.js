import "isomorphic-fetch"

export default async function dispatch(data) {
  console.log(window.location);
  await fetch('/metrics', {
    method: 'POST',
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(data)
  });
}
