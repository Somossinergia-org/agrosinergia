const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Find the FIRST (and only) occurrence of the Engine block and remove it + everything after
const engineMarker = '// ====== FLOTA Y TRANSPORTE ENGINE ======';
const engineStart = html.indexOf(engineMarker);
console.log('Engine starts at:', engineStart);

// Find the <script> tag that opens just before this engine
// Walk backwards from engineStart to find the preceding <script>
let scriptOpenPos = html.lastIndexOf('<script>', engineStart);
if (html.lastIndexOf('<script\n', engineStart) > scriptOpenPos) scriptOpenPos = html.lastIndexOf('<script\n', engineStart);
console.log('Script open before engine:', scriptOpenPos);

// The clean base is everything BEFORE this script open
const cleanBase = html.slice(0, scriptOpenPos).trimEnd();
console.log('Clean base ends at:', cleanBase.length);
console.log('Last 100 of base:', cleanBase.slice(-100).replace(/\n/g,'|'));

// Build the corrected engine - the fixed version from test.js
const testJs = fs.readFileSync('test.js', 'utf8');
// Extract only the first occurrence of the engine
const testSplit = testJs.indexOf(engineMarker);
if (testSplit === -1) { console.error('No engine in test.js'); process.exit(1); }
let engineCode = testJs.slice(testSplit + engineMarker.length);

// Remove any trailing window.logout lines that are outside the IIFE
const trailingLogout = engineCode.indexOf('\nwindow.logout=_doLogout');
if (trailingLogout > 0) engineCode = engineCode.slice(0, trailingLogout);
engineCode = engineCode.trim();
console.log('Engine code length:', engineCode.length);
console.log('Engine starts:', engineCode.slice(0, 60));
console.log('Engine ends:', engineCode.slice(-60));

// Assemble
const finalHtml = cleanBase + '\n\n<script>\n' + engineMarker + '\n' + engineCode + '\n</script>\n</body>\n</html>\n';
fs.writeFileSync('index.html', finalHtml, 'utf8');

// Verify
const v = fs.readFileSync('index.html', 'utf8');
const ec = (v.match(/FLOTA Y TRANSPORTE ENGINE/g)||[]).length;
const initFn = v.includes('window.initMapaLogistico');
const last80 = v.slice(-80).replace(/\n/g,'|');
console.log('\n=== RESULT ===');
console.log('Size:', v.length, 'Engine count:', ec, 'Has initMapaLogistico:', initFn);
console.log('Last 80:', last80);
