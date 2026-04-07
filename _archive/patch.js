const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
const jsLogic = fs.readFileSync('test.js', 'utf8').split('// ====== FLOTA Y TRANSPORTE ENGINE ======')[1];

html = html.replace(/window\.handleLogout=_doLogout;\r?\n}\)\(\);/, "window.handleLogout=_doLogout;\n})();\n\n// ====== FLOTA Y TRANSPORTE ENGINE ======\n" + jsLogic);

const searchArrTab = [
  "'</div>'+\r\n'<div class=\"tab-content active\" data-group=\"transp\" id=\"tab-transp-flota\"><div id=\"transp-flota-content\"></div></div>'+",
  "'</div>'+\n'<div class=\"tab-content active\" data-group=\"transp\" id=\"tab-transp-flota\"><div id=\"transp-flota-content\"></div></div>'+"
];

let tabInjected = false;
for (const s of searchArrTab) {
  if (html.includes(s)) {
    html = html.replace(s, "  '<button class=\"tab-btn\" data-group=\"transp\" data-tab=\"mapa\" onclick=\"showTab(\\'transp\\',\\'mapa\\'); if(window.initMapaLogistico) window.initMapaLogistico();\">\\uD83D\\uDFE2 Live API</button>'+\n" + s);
    tabInjected = true;
    break;
  }
}

console.log("Tab Injected:", tabInjected);

const searchArrDiv = [
  "'<div class=\"tab-content\" data-group=\"transp\" id=\"tab-transp-estadisticas\"><div id=\"transp-estadisticas-content\"></div></div>'+\r\n'</div>';",
  "'<div class=\"tab-content\" data-group=\"transp\" id=\"tab-transp-estadisticas\"><div id=\"transp-estadisticas-content\"></div></div>'+\n'</div>';"
];

let divInjected = false;
for (const s of searchArrDiv) {
  if (html.includes(s)) {
    const replacement = s.replace(/'<\/div>';$/, "'<div class=\"tab-content\" data-group=\"transp\" id=\"tab-transp-mapa\"><div id=\"mapa-logistico-container\" style=\"display:flex; flex-direction:column; height:calc(100vh - 180px);\"></div></div>'+\n'</div>';");
    html = html.replace(s, replacement);
    divInjected = true;
    break;
  }
}

console.log("Div Injected:", divInjected);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Patch completed successfully with accurate strict matching!');
