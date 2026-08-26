import { deflate, inflate } from "pako";


/*
--------------------------------
Encode
--------------------------------
*/

export function encodeData(data) {

  const json = JSON.stringify(data);

  // Compress JSON
  const compressed = deflate(json);

  // Convert compressed bytes to binary string
  let binary = "";

  compressed.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  // Convert to Base64URL
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}


/*
--------------------------------
Decode
--------------------------------
*/

export function decodeData(encoded) {

  // Convert Base64URL back to standard Base64
  const base64 = encoded
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  // Restore Base64 padding
  const padded = base64 + "=".repeat(
    (4 - (base64.length % 4)) % 4
  );

  // Decode Base64
  const binary = atob(padded);

  // Convert binary string to bytes
  const compressed = Uint8Array.from(
    binary,
    (char) => char.charCodeAt(0)
  );

  // Decompress
  const decompressed = inflate(compressed);

  // Convert UTF-8 bytes to string
  const json = new TextDecoder().decode(
    decompressed
  );

  // Convert JSON string to object
  return JSON.parse(json);
}