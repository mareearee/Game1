// Picks a checked board variant for each level and writes the table into game.html.
// A variant passes when random play clears it at least targetRate(level) of the time
// (so it is provably solvable and findable), preferring rates within 2x of the target.
// Usage: node tools/vet-levels.js [levels=100] [plays=1000]
const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'game.html');
const html = fs.readFileSync(file, 'utf8');
const start = html.indexOf('// ===== shared board logic');
const end = html.indexOf('// ===== end shared board logic');
const shared = html.slice(start, end).replace(/const VARIANTS = \[[^\]]*\];/, 'const VARIANTS = [];');
const RB = 9, BOMB = 8, DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const api = new Function('RB', 'BOMB', 'DIRS', 'performance',
  shared + '\nreturn { pickVariant, boardFor, clearRate, targetRate, rng };')(RB, BOMB, DIRS, performance);

const levels = +(process.argv[2] || 100), plays = +(process.argv[3] || 1000);
const table = [];
for (let l = 1; l <= levels; l++) {
  const v = api.pickVariant(l, plays);
  const { rate } = api.clearRate(api.boardFor(l, v), plays, api.rng(l * 31 + v * 7));
  if (rate === 0) throw new Error(`level ${l}: no clearable variant found`);
  table.push(v);
  console.log(`level ${l}: variant ${v}, random play clears ${(rate * 100).toFixed(1)}% (target ${(api.targetRate(l) * 100).toFixed(1)}%)`);
}
fs.writeFileSync(file, html.replace(/const VARIANTS = \[[^\]]*\];/, `const VARIANTS = [${table.join(',')}];`));
console.log('Wrote', table.length, 'variants to game.html');
