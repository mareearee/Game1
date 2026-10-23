// Builds the two playable pages from game.html:
//   index.html                       standalone page for GitHub Pages (loads backgrounds/*.jpg)
//   <out>/bubble-lagoon-artifact.html  page for the claude.ai artifact, with every background
//                                      inlined as a data URI (the artifact viewer won't load them otherwise)
// Usage: node tools/build.js [artifact-output-dir]
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const game = fs.readFileSync(path.join(root, 'game.html'), 'utf8');

const head = game.slice(0, game.indexOf('</style>') + '</style>'.length);
const body = game.slice(head.length);
const standalone = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="theme-color" content="#05141f">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px);box-sizing:border-box}body{margin:0}[hidden]{display:none!important}</style>
${head}
</head>
<body>
${body.replace(/^\n/, '')}
</body>
</html>
`;
fs.writeFileSync(path.join(root, 'index.html'), standalone);

const images = fs.readdirSync(path.join(root, 'backgrounds'))
  .filter(f => /^world\d\d\.jpg$/.test(f)).sort()
  .map(f => 'data:image/jpeg;base64,' + fs.readFileSync(path.join(root, 'backgrounds', f)).toString('base64'));
const inline = `<script>window.WORLD_IMAGES = ${JSON.stringify(images)};</script>\n`;
const at = game.indexOf('<script>');
const artifact = game.slice(0, at) + inline + game.slice(at);
const outDir = process.argv[2] || root;
const out = path.join(outDir, 'bubble-lagoon-artifact.html');
fs.writeFileSync(out, artifact);
console.log(`index.html ${Math.round(standalone.length / 1024)} KB; ${out} ${Math.round(artifact.length / 1024)} KB with ${images.length} inlined backgrounds`);
