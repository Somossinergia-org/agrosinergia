const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Find the "</script>\r\n</body>\r\n</html>" that precedes our engine
// and replace it with "</script>\n<script>ENGINE</script>\n</body>\n</html>"

const WRONG_ENDING = '</script>\r\n</body>\r\n</html>\n\n<script>\n// ====== FLOTA Y TRANSPORTE ENGINE ======';
const pos = html.indexOf(WRONG_ENDING);
console.log('Wrong ending at:', pos);

if (pos === -1) {
  // Try without \r
  const alt = '</script>\n</body>\n</html>\n\n<script>\n// ====== FLOTA Y TRANSPORTE ENGINE ======';
  const pos2 = html.indexOf(alt);
  console.log('Alt pos:', pos2);
  if (pos2 === -1) {
    // Just find the </body></html> before the script
    const bodyClose = html.lastIndexOf('</body>');
    const htmlClose = html.lastIndexOf('</html>');
    const engineScript = html.lastIndexOf('<script>');
    console.log('bodyClose:', bodyClose, 'htmlClose:', htmlClose, 'last script open:', engineScript);
    if (engineScript > htmlClose) {
      // Engine is after </html>! Need to move it before </body>
      const scriptContent = html.slice(engineScript); // from <script> to end
      const cleanEnd = html.slice(0, bodyClose); // everything before </body>
      html = cleanEnd + '\n' + scriptContent + '\n</body>\n</html>\n';
      fs.writeFileSync('index.html', html, 'utf8');
      console.log('Fixed: moved engine before </body>');
    }
  } else {
    // Fix the alt version
    html = html.slice(0, pos2) + '</script>\n\n<script>\n// ====== FLOTA Y TRANSPORTE ENGINE ======' + html.slice(pos2 + alt.length);
    // Also fix the trailing body/html
    html = html.replace('</html>\n\n<script>', '</html>'); // prevent duplication
    fs.writeFileSync('index.html', html, 'utf8');
  }
} else {
  const fixed = html.slice(0, pos) + '</script>\n\n<script>\n// ====== FLOTA Y TRANSPORTE ENGINE ======';
  // Now find where the engine ends and add proper closing
  const engineEnd = html.lastIndexOf('})();');
  const rest = html.slice(engineEnd + 5).trim(); // Should be just empty or </script></body></html>
  console.log('Rest after })();:', JSON.stringify(rest.slice(0, 50)));
  const newHtml = fixed + html.slice(pos + WRONG_ENDING.length - 'FLOTA Y TRANSPORTE ENGINE'.length) ;
  fs.writeFileSync('index.html', newHtml, 'utf8');
}

// Final verification
const v = fs.readFileSync('index.html', 'utf8');
const bodyClose = v.lastIndexOf('</body>');
const htmlClose = v.lastIndexOf('</html>');
const lastScriptOpen = v.lastIndexOf('<script>');
const lastScriptClose = v.lastIndexOf('<' + '/script>');
const enginePos = v.lastIndexOf('// ====== FLOTA Y TRANSPORTE ENGINE ======');

console.log('\n=== FINAL POSITIONS ===');
console.log('Engine at:', enginePos);
console.log('Last <script> at:', lastScriptOpen);
console.log('Last </script> at:', lastScriptClose);
console.log('</body> at:', bodyClose);
console.log('</html> at:', htmlClose);
console.log('Order OK (engine < </script> < </body> < </html>):', 
  enginePos < lastScriptClose && lastScriptClose < bodyClose && bodyClose < htmlClose);
console.log('Has initMapaLogistico:', v.includes('window.initMapaLogistico'));
console.log('Last 80:', v.slice(-80).replace(/\n/g,'|'));
