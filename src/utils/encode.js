export function encodeData(data) {
  return btoa(encodeURIComponent(JSON.stringify(data)));
}

export function decodeData(encoded) {
  return JSON.parse(decodeURIComponent(atob(encoded)));
}