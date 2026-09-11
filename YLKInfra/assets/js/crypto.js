/* YLK Infra — AES-GCM vault. Public listings decrypt in memory only. */
const YLKCrypto = (() => {
  const enc = new TextEncoder();
  const dec = new TextDecoder();

  const publicPass = () => ["YLK", "Infra", "2026", "Bareilly", "Vault", "v1"].join("·");

  function b64ToBytes(b64) {
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  function bytesToB64(bytes) {
    let s = "";
    bytes = new Uint8Array(bytes);
    for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
    return btoa(s);
  }

  async function derive(passphrase, saltB64, iterations) {
    const salt = b64ToBytes(saltB64);
    const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(passphrase), "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations: iterations || 48000, hash: "SHA-256" },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  async function decryptVault(vault, passphrase) {
    const key = await derive(passphrase, vault.s, vault.i);
    const iv = b64ToBytes(vault.n);
    const data = b64ToBytes(vault.d);
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
    return JSON.parse(dec.decode(plain));
  }

  async function encryptObj(obj, passphrase) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(passphrase), "PBKDF2", false, ["deriveKey"]);
    const key = await crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations: 48000, hash: "SHA-256" },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt"]
    );
    const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(JSON.stringify(obj)));
    return { v: 1, a: "AES-GCM", i: 48000, s: bytesToB64(salt), n: bytesToB64(iv), d: bytesToB64(cipher) };
  }

  async function sha256hex(text) {
    const buf = await crypto.subtle.digest("SHA-256", enc.encode(text));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  async function openPublic() {
    if (!window.YLK_VAULT) throw new Error("Vault missing");
    return decryptVault(window.YLK_VAULT, publicPass());
  }

  return { decryptVault, encryptObj, sha256hex, openPublic, publicPass };
})();
