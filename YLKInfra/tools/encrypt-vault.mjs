import { webcrypto } from "node:crypto";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { catalog } from "./catalog.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const enc = new TextEncoder();

function b64(buf) {
  return Buffer.from(buf).toString("base64");
}

async function sha256hex(text) {
  const buf = await webcrypto.subtle.digest("SHA-256", enc.encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function encryptJson(obj, passphrase) {
  const salt = webcrypto.getRandomValues(new Uint8Array(16));
  const iv = webcrypto.getRandomValues(new Uint8Array(12));
  const keyMaterial = await webcrypto.subtle.importKey("raw", enc.encode(passphrase), "PBKDF2", false, ["deriveKey"]);
  const key = await webcrypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 48000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  );
  const cipher = await webcrypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(JSON.stringify(obj)));
  return { v: 1, a: "AES-GCM", i: 48000, s: b64(salt), n: b64(iv), d: b64(cipher) };
}

/* Public vault key is split so a casual view-source is not plaintext JSON. */
const PUBLIC_PASS = ["YLK", "Infra", "2026", "Bareilly", "Vault", "v1"].join("·");

catalog.auth.passHash = await sha256hex("YlkInfra@2030");
const payload = await encryptJson(catalog, PUBLIC_PASS);

const out = `/* Encoded inventory vault — AES-GCM. Not human-readable JSON. */
window.YLK_VAULT=${JSON.stringify(payload)};
`;
writeFileSync(join(__dirname, "../assets/js/vault.enc.js"), out);
console.log("Wrote assets/js/vault.enc.js", out.length, "bytes");
