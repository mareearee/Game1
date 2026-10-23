// Packages the web build for itch.io: a zip with index.html at its root, the backdrops and icons.
// itch.io plays the game inside its own frame, so the offline service worker is left out
// (it would only cache a copy that itch.io can't update).
// Run `node tools/build.js` first. Usage: node tools/itch.js <output-dir>
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const root = path.join(__dirname, '..');
const out = path.resolve(process.argv[2] || root);
const stage = path.join(out, 'itch-stage');

fs.rmSync(stage, { recursive: true, force: true });
fs.mkdirSync(stage, { recursive: true });
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8')
  .replace(/<script>\nif \('serviceWorker' in navigator[\s\S]*?<\/script>\n/, '')
  .replace(/<link rel="manifest"[^>]*>\n/, '');
if (html.includes('serviceWorker')) throw new Error('service worker registration not removed');
fs.writeFileSync(path.join(stage, 'index.html'), html);
for (const dir of ['backgrounds', 'icons']) fs.cpSync(path.join(root, dir), path.join(stage, dir), { recursive: true });

const zip = path.join(out, 'bubble-lagoon-itch.zip');
fs.rmSync(zip, { force: true });
execFileSync('python3', ['-I', '-c', `
import os, sys, zipfile
stage, zip_path = sys.argv[1], sys.argv[2]
with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as z:
    for base, _, files in os.walk(stage):
        for f in sorted(files):
            full = os.path.join(base, f)
            z.write(full, os.path.relpath(full, stage))
`, stage, zip]);
fs.rmSync(stage, { recursive: true, force: true });
console.log(`${zip} ${Math.round(fs.statSync(zip).size / 1024)} KB`);
