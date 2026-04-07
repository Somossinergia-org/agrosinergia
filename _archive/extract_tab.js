const {execSync} = require('child_process');
const fs = require('fs');

// Get c922ab3 version
const html = execSync('git show c922ab3:index.html').toString('utf8');

// Find the Live API tab button
const tabIdx = html.indexOf('Live API');
console.log('Tab at:', tabIdx);

// Get full button element
const btnStart = html.lastIndexOf('<button', tabIdx);
const btnEnd = html.indexOf('</button>', tabIdx) + 9;
const tabButton = html.slice(btnStart, btnEnd);
console.log('=== TAB BUTTON ===');
console.log(tabButton);

// Also find the map container div
const mapContIdx = html.indexOf('mapa-logistico-container');
console.log('\nMap container at:', mapContIdx);
const mapContStart = html.lastIndexOf('<div', mapContIdx);
const mapContEnd = html.indexOf('</div>', mapContIdx) + 6;
console.log('=== MAP CONTAINER ===');
console.log(html.slice(mapContStart, mapContEnd));

// Find the tab content div for the mapa tab
const tabMapa = html.indexOf('tab-transp-mapa');
if (tabMapa > 0) {
  console.log('\n=== TAB CONTENT MAPA ===');
  const start = html.lastIndexOf('<div', tabMapa);
  console.log(html.slice(start, start + 400));
}
