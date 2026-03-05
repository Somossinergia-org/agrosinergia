# AGRI_NOTES.md — Decisiones Arquitectónicas

## Stack & Patrón
- **SPA monolítica** (`index.html`, ~12.000+ líneas) — vanilla JS, sin framework.
- **Persistencia**: `AgroStore` sobre `localStorage` con prefijo `agro_`.
- **Módulos**: IIFE autocontenidas, cada una gestiona su propio AgroStore key.
- **Navegación**: array `pages[]` → sidebar + mobile bottom bar + "Más" sheet.

## Módulos Implementados

| Módulo | AgroStore Key(s) | Seed Records | Estado |
|--------|-------------------|--------------|--------|
| C — Recolección/Cosecha | `agri_cosechas` | 10 | ✅ Completo |
| D — Riego/Fertirrigación | `agri_riegos`, `agri_fertis` | 8 + 6 | ✅ Completo |
| E — Tratamientos | `agri_tratamientos` | 6 | ✅ Completo |
| E2 — Incidencias | `agri_incidencias` | 5 | ✅ Completo |
| F — Trazabilidad | `agri_lotes`, `agri_movimientos` | 5 + 7 | ✅ Completo |
| G — Rentabilidad | Hardcoded `_parcData` | 6 parcelas | ✅ Completo |
| H — CEO Dashboard | Lee de todos los keys | Agregado | ✅ Completo |
| Auth + RBAC | `agri_employees` + `sessionStorage` | 12 empleados | ✅ Completo |
| Transporte | `agri_vehicles`, `agri_routes` | 4 + 5 | ✅ Completo |
| Fichajes/Jornadas | `agri_fichajes` | 7 | ✅ Completo |
| Mi Panel (Empleado) | Dinámico por rol | — | ✅ Completo |
| Formularios | `agri_form_submissions` | 5 | ✅ Completo |
| Cuadrillas | Lee de `agri_employees` | — | ✅ Completo |
| Roles y Permisos | 12 roles, 50+ permisos | — | ✅ Completo |

## Decisiones Clave

### 1. Datos seed hardcoded vs generados
**Decisión**: Datos seed embebidos en cada IIFE como arrays `_default*`.
**Razón**: Sin backend, necesitamos datos demo realistas. Se cargan solo si localStorage está vacío.

### 2. Rentabilidad con datos estáticos
**Decisión**: `_parcData` hardcoded en vez de calcular desde cosechas/riegos/tratamientos.
**Razón**: Los datos de costes reales (mano de obra, amortización, seguros) no se capturan en los otros módulos. Para un cálculo real necesitaríamos un módulo de contabilidad.
**TODO**: Conectar con datos reales cuando exista módulo de costes.

### 3. CEO Dashboard — timing de inicialización
**Decisión**: CEO lee de AgroStore a 650ms timeout.
**Razón**: Los demás módulos guardan seed data al inicializarse (~500-600ms). Tras la primera visita a cada módulo, los datos persisten y CEO los lee correctamente.
**TODO**: Considerar event bus para notificar cuando los módulos terminen de inicializar.

### 4. Alertas — reglas simples client-side
**Decisión**: 3 reglas evaluadas en cada render del CEO:
- Parcela sin riego > 7 días
- Destrío > 5%
- Incidencias alta severidad abiertas
**Razón**: Sin backend/cron, las alertas se computan al abrir la página.
**TODO**: Añadir notificaciones push si se migra a PWA.

### 5. Trazabilidad — lotes y movimientos separados
**Decisión**: Dos colecciones (`agri_lotes`, `agri_movimientos`) con `loteId` como FK.
**Razón**: Un lote puede tener múltiples movimientos (recepción → almacén → expedición). El inventario se calcula sumando movimientos por ubicación.

### 6. Mobile responsive — `fixMobileGrids()`
**Decisión**: Función JS que fuerza `grid-template-columns:1fr` + `grid-column:auto` en children.
**Razón**: CSS `!important` no basta porque los inline styles de `grid-column:1/3` crean columnas implícitas.

## Gaps Conocidos / TODOs

### Prioridad Alta
- [ ] **Parcelas ficha con tabs**: Integrar tabs de producción, riego, tratamientos, incidencias por parcela
- [ ] **Trabajadores métricas agrícolas**: Añadir kg/hora, cajas/hora al módulo Personal existente
- [ ] **Conectar Rentabilidad con datos reales** de cosechas y tratamientos

### Prioridad Media
- [ ] **Weather API stub**: Preparar integración con OpenWeatherMap para alertas de helada/lluvia
- [ ] **RBAC simulado**: Roles (admin, técnico, peón) con visibilidad de páginas diferenciada
- [ ] **Feature flags**: Toggle para módulos en desarrollo

### Prioridad Baja
- [ ] **Maps stub**: Integración con Leaflet/Google Maps para visualizar parcelas
- [ ] **Export PDF**: Generar informes PDF de rentabilidad y trazabilidad
- [ ] **Sync multi-dispositivo**: Considerar migración a Firebase/Supabase
- [ ] **Tests**: No hay infraestructura de tests; considerar Playwright para E2E

## Convenciones de Código
- IDs de página: kebab-case (`recoleccion`, `riego`, `tratamientos`)
- AgroStore keys: snake_case con prefijo `agri_` (`agri_cosechas`, `agri_riegos`)
- Funciones globales: camelCase (`nuevaCosechaModal`, `guardarRiego`)
- Seed data: prefijo `_default` (`_defaultCosechas`, `_defaultRiegos`)
- Tabs: `showTab('grupo', 'tab')` con atributo `data-tab`
- Modales: reutilizan `#modal-pedido` overlay compartido
