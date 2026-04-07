const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const engine = fs.readFileSync('test.js', 'utf8').split('// ====== FLOTA Y TRANSPORTE ENGINE ======')[1].split('\nwindow.logout=_doLogout')[0].trim();

// Find the end of the PWA logout script
// We know the valid portion ends with: window.handleLogout=_doLogout; followed by })();
// Find all occurrences of window.handleLogout=_doLogout;
const marker = 'window.handleLogout=_doLogout;\n})();';
let lastIdx = html.lastIndexOf(marker);
console.log('Last marker at:', lastIdx);

if (lastIdx > 0) {
  // Cut everything after this marker
  const cleanHtml = html.slice(0, lastIdx + marker.length);
  const fixed = cleanHtml + '\n</script>\n\n<script>\n// ====== FLOTA Y TRANSPORTE ENGINE ======\n' + engine + '\n\n</script>\n</body>\n</html>\n';
  fs.writeFileSync('index.html', fixed, 'utf8');
  
  // Verify
  const check = fs.readFileSync('index.html', 'utf8');
  const opens = [...check.matchAll(/<script[^>]*>/gi)].length;
  const closes = [...check.matchAll(/<\/script>/gi)].length;
  console.log('Script opens:', opens, 'closes:', closes, 'match:', opens === closes);
  console.log('Has engine:', check.includes('window.initMapaLogistico'));
  console.log('Last 100 chars:', check.slice(-100).replace(/\n/g, '|'));
} else {
  console.log('MARKER NOT FOUND!');
}
