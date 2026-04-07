const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const opens = [...html.matchAll(/<script[^>]*>/gi)].map(m => ({pos: m.index, before: html[m.index-1]}));
const closes = [...html.matchAll(/<\/script>/gi)].map(m => ({pos: m.index, before: html[m.index-1]}));

// Filter out those inside JS strings (preceded by quote char)
const realOpens = opens.filter(o => o.before !== "'" && o.before !== '"');
const realCloses = closes.filter(o => o.before !== "'" && o.before !== '"');
console.log('Real opens:', realOpens.length, realOpens.map(o => o.pos));
console.log('Real closes:', realCloses.length, realCloses.map(o => o.pos));
