# AGRI_EMPLOYEE_AUTH_NOTES.md — Auth, RBAC y Portal de Empleado

## Resumen de Implementación

### Sistema de Autenticación
- **Tipo**: Simulación client-side con `sessionStorage` (no hay backend)
- **Login**: Pantalla completa con branding AgroSinergia, email + password
- **Sesión**: Almacenada en `sessionStorage` (se pierde al cerrar pestaña)
- **Empleados**: Almacenados en `AgroStore` key `agri_employees`
- **Contraseñas**: Texto plano (SOLO demo — requiere hash real en producción)
- **Logout**: Botón en sidebar footer, limpia sesión y muestra login

### Feature Flags
- `EMPLOYEE_AUTH_ENABLED`: Siempre activo (el login se muestra por defecto)
- Para desactivar temporalmente: comentar `setTimeout(initAuth,2300)` en el engine

## Roles Implementados (12)

| Rol | Label | Color | Permisos |
|-----|-------|-------|----------|
| SUPER_ADMIN | Super Admin | #7C3AED | Todos (*) |
| CEO | CEO / Director | #D4A843 | 31 permisos |
| ADMIN_OPERACIONES | Admin Operaciones | #2C6E49 | 48 permisos |
| ENCARGADO_GENERAL | Encargado General | #2563EB | 33 permisos |
| ENCARGADO_PARCELA | Encargado Parcela | #0891B2 | 24 permisos |
| TECNICO_CAMPO | Técnico Campo | #059669 | 15 permisos |
| RECOLECTOR | Recolector | #D97706 | 8 permisos |
| CONDUCTOR | Conductor | #7C3AED | 8 permisos |
| ALMACEN | Almacén | #EA580C | 11 permisos |
| CALIDAD | Control Calidad | #DC2626 | 8 permisos |
| RRHH_ADMIN | RRHH Admin | #9333EA | 18 permisos |
| COMERCIAL | Comercial | #0284C7 | 7 permisos |

## Usuarios Demo

| Email | Contraseña | Rol | Nombre |
|-------|-----------|-----|--------|
| ceo@demo.com | demo123 | CEO | David Miquel |
| admin@demo.com | demo123 | ADMIN_OPERACIONES | Carlos Ruiz |
| encargado@demo.com | demo123 | ENCARGADO_GENERAL | Antonio García |
| parcela@demo.com | demo123 | ENCARGADO_PARCELA | María López |
| tecnico@demo.com | demo123 | TECNICO_CAMPO | Javier Martín |
| recolector@demo.com | demo123 | RECOLECTOR | Ahmed Benali |
| conductor@demo.com | demo123 | CONDUCTOR | Pedro Navarro |
| almacen@demo.com | demo123 | ALMACEN | Laura Sánchez |
| calidad@demo.com | demo123 | CALIDAD | Elena Ferrer |
| rrhh@demo.com | demo123 | RRHH_ADMIN | Carmen Díaz |
| recolector2@demo.com | demo123 | RECOLECTOR | Miguel Torres |
| recolector3@demo.com | demo123 | RECOLECTOR | Rosa Méndez |

## Sistema de Permisos (RBAC Granular)

### Categorías de Permisos
- `users.*` — gestión de usuarios
- `roles.*` — gestión de roles
- `parcels.*` — parcelas
- `workers.*` — trabajadores
- `worklogs.*` — partes de trabajo
- `harvest.*` — cosecha/recolección
- `irrigation.*` / `fertigation.*` — riego y fertirrigación
- `treatments.*` — tratamientos fitosanitarios
- `incidents.*` — incidencias
- `inventory.*` — inventario/almacén
- `traceability.*` — trazabilidad
- `transport.*` — transporte
- `ceo_dashboard.*` — dashboard CEO
- `costs.*` / `profitability.*` — costes y rentabilidad
- `attendance.*` — fichajes
- `forms.*` — formularios
- `fichajes.*` — fichajes (own/team/all)
- `cuadrillas.*` — cuadrillas
- `vehicles.*` — vehículos

### Cómo se aplican
- **Sidebar**: `applyRBAC()` oculta nav-items sin permiso
- **Mobile sheet**: Los items sin permiso se ocultan
- **Páginas**: `PAGE_PERMS` mapea cada página a permisos requeridos
- **Botones/acciones**: `hasPermission('perm')` disponible globalmente
- **Mi Panel**: Acciones rápidas filtradas por permisos del rol

## Módulos Nuevos Añadidos

### Transporte (AgroStore: `agri_vehicles`, `agri_routes`)
- CRUD de rutas con estados: pendiente, en-ruta, completada
- Vehículos con matrícula, tipo, ITV, seguro
- Vista de rutas pendientes y historial completadas
- 4 vehículos + 5 rutas seed

### Fichajes/Jornadas (AgroStore: `agri_fichajes`)
- Clock-in/clock-out con hora real
- Cálculo automático de horas
- Validación por encargado/admin
- Filtros por fecha y estado
- 7 fichajes seed (2 en curso hoy)

### Mi Panel (Dashboard Empleado)
- Bienvenida personalizada con nombre, rol y hora
- Estado de fichaje (fichado/sin fichar)
- Acciones rápidas filtradas por rol
- Actividad reciente
- Pendientes (incidencias, validaciones)
- Sección equipo (para encargados)
- Mis Rutas (para conductores)

### Formularios Dinámicos (AgroStore: `agri_form_submissions`)
- 12 tipos de formularios (recolección, transporte, riego, etc.)
- Asignación automática por rol
- Flujo: disponible → enviado → validado/rechazado
- Trazabilidad completa (quién, cuándo, datos)
- 5 submissions seed

### Cuadrillas
- Vista de equipos agrupados por subrole
- Miembros con avatar, nombre y rol

### Roles y Permisos (Admin)
- Vista de todos los roles con recuento de permisos
- Tabla de empleados con rol, estado y último login

## Decisiones Técnicas

### 1. Auth client-side vs backend
**Decisión**: Simulación con sessionStorage
**Razón**: No hay backend. Funcional para demo y desarrollo.
**TODO**: Migrar a auth real (Firebase Auth, Supabase, o backend propio)

### 2. Contraseñas en texto plano
**Decisión**: Almacenadas sin hash
**Razón**: No hay crypto API adecuada sin backend. Solo demo.
**TODO**: Implementar bcrypt server-side

### 3. showPage chain pattern
**Decisión**: Cada engine wrappea `showPage` con `var _spN=showPage; showPage=function(id){_spN(id);...}`
**Razón**: Sin framework, es la forma más limpia de hooks sin modificar el core
**Riesgo**: Cadena larga de wrappers. Funciona pero puede ser frágil.

### 4. Sidebar filtering en applyRBAC()
**Decisión**: Ocultar nav-items con `style.display='none'`
**Razón**: Más simple que regenerar el sidebar. Funciona con el sistema existente.

### 5. Formularios genéricos vs específicos
**Decisión**: Forms engine con tipos mapeados a campos dinámicos
**Razón**: Evita crear 12 páginas separadas. Un modal con campos según tipo.
**TODO**: Añadir más campos específicos por tipo, validaciones, adjuntos

## TODOs Pendientes

### Prioridad Alta
- [ ] **Migrar auth a backend real** (Firebase, Supabase, Express+JWT)
- [ ] **Hash de contraseñas** server-side
- [ ] **Protección de rutas server-side** (actualmente solo frontend)
- [ ] **Adjuntos/fotos en formularios** (requiere storage)

### Prioridad Media
- [ ] **Geolocalización en fichajes** (usar Geolocation API)
- [ ] **Firma digital** en formularios (canvas signature)
- [ ] **Notificaciones push** (Service Worker / PWA)
- [ ] **Más campos específicos** por tipo de formulario
- [ ] **Parcelas ficha con tabs cross-module** (riego, tratamientos, incidencias)
- [ ] **Weather API stub** (OpenWeatherMap)
- [ ] **Trabajadores métricas agrícolas** (kg/hora desde fichajes + cosechas)

### Prioridad Baja
- [ ] **Tests E2E** con Playwright
- [ ] **Export PDF** de fichas y formularios
- [ ] **RBAC persistente** (permisos editables desde UI)
- [ ] **Audit log** (registro de todas las acciones por empleado)
- [ ] **Multi-idioma** (i18n)

## Cómo Levantar el Proyecto
```
1. Abrir index.html en navegador (funciona sin servidor)
2. O usar servidor local: python -m http.server 3000
3. Login: ceo@demo.com / demo123
4. Para cambiar rol: Cerrar sesión → login con otro usuario
5. Para resetear datos: Borrar localStorage del navegador
```

## Cómo Probar Permisos
1. Login como `ceo@demo.com` → ve TODO (sidebar completo)
2. Login como `recolector@demo.com` → solo ve Mi Panel, Formularios, Fichajes, Cosecha, Incidencias
3. Login como `conductor@demo.com` → solo ve Mi Panel, Formularios, Fichajes, Transporte, Vehículos, Incidencias
4. Login como `almacen@demo.com` → solo ve Mi Panel, Formularios, Fichajes, Trazabilidad, Cosecha, Incidencias
5. Verificar que las acciones rápidas en Mi Panel cambian según el rol
