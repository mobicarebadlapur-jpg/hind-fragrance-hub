import fs from "node:fs";
const sourceSha = "2e14f59fadce576f988e9ea42d6b43e5ac4e3f4f";
const files = [".output/nitro.json", ".output/server/index.mjs"];
const dirs = [".output/server", ".output/public", ".output/public/assets"];
for (const p of files) {
  if (!fs.existsSync(p) || !fs.statSync(p).isFile()) {
    console.error("[Hostinger] Missing artifact file: " + p);
    process.exit(1);
  }
}
for (const p of dirs) {
  if (!fs.existsSync(p) || !fs.statSync(p).isDirectory()) {
    console.error("[Hostinger] Missing artifact directory: " + p);
    process.exit(1);
  }
}
console.log("[Hostinger] Prebuilt Nitro artifact validated; no rebuild required");
console.log("[Hostinger] Artifact built from source commit: " + sourceSha);
