
// ── Service Worker Registration ────────────────────────────────
if('serviceWorker' in navigator){
  window.addEventListener('load',function(){
    navigator.serviceWorker.register('sw.js')
      .then(function(reg){console.log('✅ SW registered:',reg.scope)})
      .catch(function(err){console.log('SW error:',err)});
  });
}

// ── PWA Install Banner ─────────────────────────────────────────
var _deferredPrompt=null;
window.addEventListener('beforeinstallprompt',function(e){
  e.preventDefault();
  _deferredPrompt=e;
  // Mostrar banner solo en móvil
  if(window.innerWidth<=900){
    var banner=document.getElementById('pwa-install-banner');
    if(banner){banner.style.display='flex';}
  }
});
document.getElementById('pwa-install-btn').addEventListener('click',function(){
  var banner=document.getElementById('pwa-install-banner');
  if(banner)banner.style.display='none';
  if(_deferredPrompt){
    _deferredPrompt.prompt();
    _deferredPrompt.userChoice.then(function(){_deferredPrompt=null;});
  }
});
document.getElementById('pwa-banner-close').addEventListener('click',function(){
  document.getElementById('pwa-install-banner').style.display='none';
  sessionStorage.setItem('pwa-dismissed','1');
});


// ── PATCH: Badge OFFLINE → LIVE cuando hay conexión ───────────────
(function(){
  var _badgePatched=false;
  function _patchBadge(){
    // Buscar el elemento badge por texto o id conocido
    var badge=document.getElementById('live-badge-text');
    if(!badge){
      // Buscar por texto OFFLINE en spans pequeños
      document.querySelectorAll('span,div').forEach(function(el){
        if(el.children.length===0&&el.textContent.trim()==='OFFLINE')badge=el;
      });
    }
    if(!badge)return;
    _badgePatched=true;
    function _setLive(){
      badge.textContent='● EN VIVO';
      badge.style.color='#16A34A';
      if(badge.parentElement){
        badge.parentElement.style.color='#16A34A';
        badge.parentElement.style.background='rgba(22,163,74,.1)';
      }
    }
    function _setOffline(){
      badge.textContent='○ OFFLINE';
      badge.style.color='#94A3B8';
      if(badge.parentElement){
        badge.parentElement.style.color='#94A3B8';
        badge.parentElement.style.background='rgba(148,163,184,.1)';
      }
    }
    // Comprobar conexión inmediatamente
    if(navigator.onLine)_setLive();else _setOffline();
    window.addEventListener('online',_setLive);
    window.addEventListener('offline',_setOffline);
    // Ping periódico para confirmar conectividad real
    setInterval(function(){
      if(!navigator.onLine){_setOffline();return;}
      fetch('https://www.google.com/favicon.ico?_='+Date.now(),{mode:'no-cors',cache:'no-store'})
        .then(function(){_setLive()}).catch(function(){_setOffline()});
    },10000);
  }
  // Intentar parchear badge con retraso (esperar a que se renderice el DOM de sesión)
  setTimeout(_patchBadge,2000);
  setInterval(function(){if(!_badgePatched)_patchBadge()},3000);
})();

// ── PATCH: window.logout — cerrar sesión desde cualquier punto ────
(function(){
  function _doLogout(){
    // Intentar la función de logout original del sistema de auth
    if(typeof handleLogout==='function'){handleLogout();return;}
    if(typeof window.authLogout==='function'){window.authLogout();return;}
    // Buscar el botón de cerrar sesión en la sidebar y hacer clic
    var btns=document.querySelectorAll('button,a');
    for(var i=0;i<btns.length;i++){
      var t=btns[i].textContent.trim().toLowerCase();
      if(t==='cerrar sesión'||t==='cerrar sesion'||t==='logout'||t==='salir'){
        btns[i].click();return;
      }
    }
    // Fallback final: limpiar sesión de AgroStore y recargar
    try{
      localStorage.removeItem('agro_session');
      localStorage.removeItem('agro_current_user');
      Object.keys(localStorage).filter(function(k){return k.startsWith('agro_session')}).forEach(function(k){localStorage.removeItem(k)});
    }catch(e){}
    location.reload();
  }
  window.logout=_doLogout;
  window.handleLogout=_doLogout;
})();

// ====== FLOTA Y TRANSPORTE ENGINE ======

(function() {
  var mapTransporte = null;
  var markersInfo = {}; // id -> marker
  var trackingInterval = null;
  
  // Datos MOCK iniciales simulando la API
  var mockFlota = [
    { id: 'V-001', matricula: '4589-LKM', conductor: 'Pedro Navarro', tipo: 'Camión Frigorífico', lat: 38.3452, lng: -0.4810, vel: 85, rumbo: 45, estado: 'En Ruta', destino: 'Mercamadrid', temp: 4.2, fuel: 80, progreso: 65, color: '#3B82F6' },
    { id: 'V-002', matricula: '9234-JKT', conductor: 'Antonio Gómez', tipo: 'Furgón Reparto', lat: 38.2622, lng: -0.6865, vel: 0, rumbo: 0, estado: 'Detenido', destino: 'Elche Central', temp: 5.5, fuel: 45, progreso: 100, color: '#10B981' },
    { id: 'V-003', matricula: '1122-HGF', conductor: 'Luis Martínez', tipo: 'Camión Lona', lat: 39.4699, lng: -0.3763, vel: 90, rumbo: 10, estado: 'En Ruta', destino: 'Puerto Valencia', temp: null, fuel: 60, progreso: 85, color: '#3B82F6' },
    { id: 'V-004', matricula: '5544-FGH', conductor: 'Carlos Ruiz', tipo: 'Furgoneta', lat: 38.0833, lng: -0.9333, vel: 110, rumbo: 270, estado: 'Incidencia', destino: 'Murcia Sur', temp: null, fuel: 15, progreso: 40, color: '#EF4444' },
    { id: 'V-005', matricula: '7788-DWS', conductor: 'Sonia Verdú', tipo: 'Camión Frigorífico', lat: 38.8794, lng: -0.0453, vel: 80, rumbo: 30, estado: 'En Ruta', destino: 'Barcelona - Rungis (Francia)', temp: 3.8, fuel: 95, progreso: 15, color: '#3B82F6' }
  ];

  window.cerrarTelemetria = function() {
    var panel = document.getElementById('telemetria-panel');
    if(panel) {
      panel.style.transform = 'translateY(20px)';
      panel.style.opacity = '0';
      setTimeout(()=>panel.style.display='none', 300);
    }
  };

  window.abrirTelemetria = function(vid) {
    var v = mockFlota.find(x => x.id === vid);
    if(!v) return;
    
    document.getElementById('tel-vehiculo').textContent = v.tipo + ' (' + v.matricula + ')';
    document.getElementById('tel-conductor').textContent = '👤 ' + v.conductor;
    document.getElementById('tel-vel').textContent = v.vel + ' km/h';
    document.getElementById('tel-fuel').textContent = v.fuel + ' %';
    document.getElementById('tel-temp').textContent = v.temp !== null ? v.temp.toFixed(1) + ' °C' : 'N/A';
    document.getElementById('tel-estado').textContent = v.vel > 0 ? 'Encendido' : 'Apagado';
    document.getElementById('tel-estado').style.color = v.vel > 0 ? 'var(--primary)' : 'var(--gray)';
    document.getElementById('tel-prog-pct').textContent = v.progreso + '%';
    document.getElementById('tel-prog-fill').style.width = v.progreso + '%';
    document.getElementById('tel-destino').innerHTML = 'Destino: <strong>' + v.destino + '</strong>';
    
    var panel = document.getElementById('telemetria-panel');
    panel.style.display = 'block';
    setTimeout(() => {
      panel.style.transform = 'translateY(0)';
      panel.style.opacity = '1';
    }, 10);
    
    if(mapTransporte) {
      mapTransporte.setView([v.lat, v.lng], 12);
    }
  };

  window.renderFlotaList = function() {
    var list = document.getElementById('fleet-list');
    var q = (document.getElementById('fleet-search') || {}).value;
    if(!list) return;
    if(q) q = q.toLowerCase();
    
    var html = '';
    mockFlota.forEach(function(v) {
      if(q && !(v.conductor + v.matricula + v.estado).toLowerCase().includes(q)) return;
      
      var badgeColor = v.estado === 'En Ruta' ? 'rgba(59,130,246,0.1)' : (v.estado === 'Detenido' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)');
      var textColor = v.estado === 'En Ruta' ? '#2563EB' : (v.estado === 'Detenido' ? '#059669' : '#DC2626');
      var iconPulse = v.vel > 0 ? '<div style="width:8px; height:8px; border-radius:50%; background:#2563EB; box-shadow:0 0 8px #2563EB; animation:pulse 1.5s infinite;"></div>' : '<div style="width:8px; height:8px; border-radius:50%; background:#059669;"></div>';
      
      html += '<div onclick="window.abrirTelemetria(\''+v.id+'\')" style="background:var(--light); border-radius:10px; padding:12px; margin-bottom:10px; cursor:pointer; border:1px solid transparent; transition:all 0.2s;" onmouseover="this.style.borderColor=\'var(--accent)\'" onmouseout="this.style.borderColor=\'transparent\'">'+
        '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">'+
          '<div style="font-weight:700; font-size:13px; color:var(--dark); display:flex; align-items:center; gap:6px;">'+
            iconPulse+' '+v.matricula+
          '</div>'+
          '<span style="font-size:10px; font-weight:700; background:'+badgeColor+'; color:'+textColor+'; padding:2px 6px; border-radius:6px;">'+v.estado+'</span>'+
        '</div>'+
        '<div style="font-size:11px; color:var(--gray); display:flex; gap:8px; margin-bottom:4px;">'+
          '<span>👤 '+v.conductor+'</span>'+
          '<span>⚡ '+v.vel+' km/h</span>'+
        '</div>'+
        '<div style="font-size:10px; color:var(--gray);">'+
          '🛣️ <strong>'+v.destino+'</strong>'+
        '</div>'+
      '</div>';
    });
    list.innerHTML = html;
  };

  function createMarkerIcon(v) {
    var svg = '<div style="position:relative; width:40px; height:40px; transform: rotate('+v.rumbo+'deg); transition: transform 0.5s;">'+
      '<div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:28px; height:28px; background:'+v.color+'; border:2px solid #fff; border-radius:50%; box-shadow:0 2px 8px rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center;">'+
        '<span style="font-size:14px; transform: rotate(-'+v.rumbo+'deg);">🚚</span>'+
      '</div>'+
      '<div style="position:absolute; top:0; left:50%; width:0; height:0; border-left:6px solid transparent; border-right:6px solid transparent; border-bottom:10px solid '+v.color+'; transform:translate(-50%, -10px);"></div>'+
    '</div>';
    return L.divIcon({
      html: svg,
      className: '',
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });
  }

  function renderMapMarkers() {
    if(!mapTransporte) return;
    
    mockFlota.forEach(function(v) {
      if(!markersInfo[v.id]) {
        markersInfo[v.id] = L.marker([v.lat, v.lng], {icon: createMarkerIcon(v)}).addTo(mapTransporte);
        markersInfo[v.id].on('click', function() { window.abrirTelemetria(v.id); });
      } else {
        markersInfo[v.id].setLatLng([v.lat, v.lng]);
        markersInfo[v.id].setIcon(createMarkerIcon(v));
      }
    });
  }

  function simulateAPITracking() {
    mockFlota.forEach(function(v) {
      if(v.estado === 'En Ruta') {
        v.lat += (Math.random() - 0.4) * 0.003;
        v.lng += (Math.random() - 0.4) * 0.003;
        v.vel = Math.max(0, Math.min(120, v.vel + (Math.random() - 0.5) * 5));
        v.vel = Math.round(v.vel);
        if(v.temp !== null) v.temp += (Math.random() - 0.5) * 0.2;
      }
    });
    renderMapMarkers();
    
    var openPanel = document.getElementById('telemetria-panel');
    if(openPanel && openPanel.style.display !== 'none') {
      var actId = document.getElementById('tel-vehiculo').textContent.match(/\\(([^)]+)\\)/);
      if(actId && actId[1]) {
        var vv = mockFlota.find(x => x.matricula === actId[1]);
        if(vv) {
          document.getElementById('tel-vel').textContent = vv.vel + ' km/h';
          if(vv.temp !== null) document.getElementById('tel-temp').textContent = vv.temp.toFixed(1) + ' °C';
        }
      }
    }
  }

  window.initMapaLogistico = function() {
    var c = document.getElementById("mapa-logistico-container");
    if(c && c.innerHTML === '') {
      var transpHtml = '<div style="display:flex;gap:8px;align-items:center;margin-bottom:12px;">'+
        '<span class="badge" style="background:var(--accent)"><span style="display:inline-block;width:6px;height:6px;background:#fff;border-radius:50%;margin-right:6px;animation:pulse 1.5s infinite;"></span>Enlace API Activo</span>'+
      '</div>'+
      '<div style="display:flex; gap:20px; flex:1; min-height:0;">'+
        '<div style="width: 320px; background:var(--white); border-radius:var(--radius); box-shadow:var(--shadow-sm); display:flex; flex-direction:column; border:1px solid rgba(0,0,0,.04); overflow:hidden;">'+
          '<div style="padding:16px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; background:var(--light);">'+
            '<h3 style="font-size:14px; color:var(--dark); font-weight:700;">Estado de la Flota</h3>'+
            '<button class="btn btn-sm btn-outline" style="padding:4px 8px; font-size:10px;" onclick="window.renderFlotaList()">🔄 Refrescar</button>'+
          '</div>'+
          '<div style="padding:10px; border-bottom:1px solid var(--border);">'+
            '<input type="text" class="form-control" style="font-size:12px;" placeholder="Buscar vehículo o conductor..." id="fleet-search" oninput="window.renderFlotaList()">'+
          '</div>'+
          '<div id="fleet-list" style="flex:1; overflow-y:auto; padding:10px;"></div>'+
        '</div>'+
        '<div style="flex:1; background:var(--white); border-radius:var(--radius); box-shadow:var(--shadow-sm); position:relative; overflow:hidden; border:1px solid rgba(0,0,0,.04);">'+
          '<div id="map-transporte" style="width:100%; height:100%;"></div>'+
          '<div id="telemetria-panel" style="position:absolute; bottom:20px; right:20px; width:300px; background:rgba(255,255,255,0.95); backdrop-filter:blur(10px); border-radius:12px; box-shadow:var(--shadow-lg); padding:16px; border:1px solid rgba(0,0,0,.08); display:none; z-index:1000; transition:all 0.3s ease; transform:translateY(20px); opacity:0;">'+
            '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">'+
              '<div>'+
                '<h4 id="tel-vehiculo" style="font-size:15px; font-weight:700; color:var(--dark);"></h4>'+
                '<div id="tel-conductor" style="font-size:12px; color:var(--gray);"></div>'+
              '</div>'+
              '<button style="background:none; border:none; color:var(--gray); cursor:pointer; font-size:16px; font-weight:700; padding:4px;" onclick="window.cerrarTelemetria()">✕</button>'+
            '</div>'+
            '<div class="kpi-grid" style="grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:12px;">'+
              '<div style="background:var(--light); padding:10px; border-radius:8px;">'+
                '<div style="font-size:10px; color:var(--gray); text-transform:uppercase;">Velocidad</div>'+
                '<div style="font-size:18px; font-weight:800; color:var(--dark);" id="tel-vel">-- km/h</div>'+
              '</div>'+
              '<div style="background:var(--light); padding:10px; border-radius:8px;">'+
                '<div style="font-size:10px; color:var(--gray); text-transform:uppercase;">Nivel Combustible</div>'+
                '<div style="font-size:18px; font-weight:800; color:var(--primary);" id="tel-fuel">-- %</div>'+
              '</div>'+
              '<div style="background:var(--light); padding:10px; border-radius:8px;">'+
                '<div style="font-size:10px; color:var(--gray); text-transform:uppercase;">Temp. Remolque</div>'+
                '<div style="font-size:18px; font-weight:800; color:var(--accent);" id="tel-temp">-- °C</div>'+
              '</div>'+
              '<div style="background:var(--light); padding:10px; border-radius:8px;">'+
                '<div style="font-size:10px; color:var(--gray); text-transform:uppercase;">Estado Motor</div>'+
                '<div style="font-size:14px; font-weight:800; color:var(--dark);" id="tel-estado">--</div>'+
              '</div>'+
            '</div>'+
            '<div style="font-size:11px; color:var(--gray); margin-bottom:6px; display:flex; justify-content:space-between;"><span>Progreso Ruta</span><span id="tel-prog-pct" style="font-weight:700;">--</span></div>'+
            '<div class="progress-track" style="height:6px; margin-bottom:12px; background:var(--border);"><div class="progress-fill" id="tel-prog-fill" style="width:0%; background:linear-gradient(90deg, var(--accent), var(--gold));"></div></div>'+
            '<div style="font-size:11px; color:var(--text);" id="tel-destino">Destino: <strong>--</strong></div>'+
          '</div>'+
        '</div>'+
      '</div>';
      c.innerHTML = transpHtml;
    }
    
    setTimeout(function() {
      if(!window.mapTransporte) {
        window.mapTransporte = L.map('map-transporte').setView([38.5, -0.5], 8);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; OSM & CARTO',
          subdomains: 'abcd',
          maxZoom: 20
        }).addTo(window.mapTransporte);
        renderMapMarkers();
        trackingInterval = setInterval(simulateAPITracking, 3000);
      } else {
        window.mapTransporte.invalidateSize();
      }
      window.renderFlotaList();
    }, 100);
  };
})();

window.logout=_doLogout;

  window.handleLogout=_doLogout;
})();



window.logout=_doLogout;
window.handleLogout=_doLogout;
})();



