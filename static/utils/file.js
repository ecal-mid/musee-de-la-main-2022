export async function loadJSON(url, ...options) {
  return await fetch(url, ...options).then(resp => resp.json())
}