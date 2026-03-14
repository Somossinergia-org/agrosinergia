import { useState, useMemo, useEffect, useRef } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import {
  Sprout, MapPin, ClipboardList, Euro, ShieldCheck, MessageCircle,
  Plus, Search, ChevronRight, TrendingUp, TrendingDown,
  Droplets, Sun, Thermometer, Wind, Calendar, AlertTriangle,
  Check, Clock, Send, Users, Bell, Settings,
  BarChart3, Leaf, ArrowLeft, FileText, Download,
  Truck, Package, Wrench, Map, FlaskConical, Building2,
  UserCog, Layers, BookOpen, Eye, ChevronDown, Activity,
  Zap, Target, Tractor, Warehouse, TestTube, Globe, Lock, Wifi, WifiOff
} from "lucide-react";

// ==================== DATOS FRUITUM 2016 SL / FRUCHESCO ====================
// Fruitum 2016 SL — Albatera, Alicante. Cultivos: Brevas, Higos, Granadas.
// Producción convencional y ecológica. Exporta 90% (Francia, UK, Países Bajos, Rusia, Brasil, Italia, Canadá).
// Central de confección manual. 51-200 empleados.
// Fruchesco — Marca comercial / explotación complementaria orientada a granadas ecológicas premium.

const initialParcelas = [
  { id: 1, nombre: "Finca El Rincón - Higueras", superficie: 14.2, cultivo: "Higuera", variedad: "Colar (Breva/Higo)", estado: "activa", municipio: "Albatera", provincia: "Alicante", sigpac: "03005A01500032", campana: "2025/2026", fechaSiembra: "2017-03-10", sistema: "Riego por goteo", suelo: "Franco-arcilloso", explotacionId: 1, tipo: "agricola" },
  { id: 2, nombre: "Finca Los Bancales - Higueras", superficie: 11.5, cultivo: "Higuera", variedad: "San Antonio (Breva)", estado: "activa", municipio: "Albatera", provincia: "Alicante", sigpac: "03005A01600018", campana: "2025/2026", fechaSiembra: "2018-02-20", sistema: "Riego por goteo", suelo: "Franco-arenoso", explotacionId: 1, tipo: "agricola" },
  { id: 3, nombre: "Finca La Solana - Granados", superficie: 9.8, cultivo: "Granado", variedad: "Mollar de Elche", estado: "activa", municipio: "Albatera", provincia: "Alicante", sigpac: "03005A01700045", campana: "2025/2026", fechaSiembra: "2019-01-15", sistema: "Riego por goteo", suelo: "Franco-limoso", explotacionId: 1, tipo: "agricola" },
  { id: 4, nombre: "Finca Fruchesco Eco - Granados BIO", superficie: 12.3, cultivo: "Granado", variedad: "Wonderful (Ecológico)", estado: "activa", municipio: "Crevillente", provincia: "Alicante", sigpac: "03059A02000091", campana: "2025/2026", fechaSiembra: "2020-02-01", sistema: "Riego por goteo (fertirriego eco)", suelo: "Franco-arenoso", explotacionId: 2, tipo: "agricola" },
  { id: 5, nombre: "Finca El Palmeral - Higueras Eco", superficie: 8.6, cultivo: "Higuera", variedad: "Cuello Dama Negro (Eco)", estado: "activa", municipio: "Catral", provincia: "Alicante", sigpac: "03055A00800027", campana: "2025/2026", fechaSiembra: "2021-03-05", sistema: "Riego por goteo", suelo: "Franco-arcilloso", explotacionId: 2, tipo: "agricola" },
  { id: 6, nombre: "Nave Batistes - Almacén/Base", superficie: 0.35, cultivo: "-", variedad: "-", estado: "activa", municipio: "La Romana", provincia: "Alicante", sigpac: "-", campana: "-", fechaSiembra: "-", sistema: "-", suelo: "-", explotacionId: 1, tipo: "instalacion", refCatastral: "000804300XH84H0001ZU", clase: "Urbano", uso: "Industrial", superficieConstruida: 4066, superficieGrafica: 3499, anoConstruccion: 1989, direccion: "PD Batistes de 114, 03669 La Romana (Alicante)", codigoPostal: "03669", parcelaCatastral: "043", lat: 38.556, lng: -0.873 },
  { id: 7, nombre: "La Dehesa - Pol.18 Parc.71 (Higueras/Granados)", superficie: 7.9, cultivo: "Higuera / Granado", variedad: "Colar + Mollar", estado: "activa", municipio: "Albatera", provincia: "Alicante", sigpac: "03:005:0:0:18:71", campana: "2025/2026", fechaSiembra: "2016-11-10", sistema: "Riego (balsas)", suelo: "Agrario", explotacionId: 1, tipo: "agricola", refCatastral: "03005A018000710000DI", clase: "Rústico", uso: "Agrario", superficieConstruida: 3436, superficieGrafica: 78969, lat: 38.2046, lng: -0.9052, verificadaCatastro: true, poligono: 18, parcela: 71, paraje: "La Dehesa" },
  { id: 8, nombre: "Central Confección Fruitum", superficie: 0.8, cultivo: "-", variedad: "-", estado: "activa", municipio: "Albatera", provincia: "Alicante", sigpac: "-", campana: "-", fechaSiembra: "-", sistema: "-", suelo: "-", explotacionId: 1, tipo: "instalacion", refCatastral: "03005A01400055", clase: "Urbano", uso: "Industrial - Central de confección manual", lat: 38.1780, lng: -0.8710 },
];

const initialIntervenciones = [
  { id: 1, parcelaId: 1, tipo: "Poda", producto: "-", dosis: "-", fecha: "2026-01-12", operario: "Ahmed Benaissa", coste: 1850.00, estado: "completada", notas: "Poda invernal higueras Colar. 45 jornales." },
  { id: 2, parcelaId: 3, tipo: "Fertilización", producto: "NPK 12-8-16 + Micros", dosis: "350 kg/ha", fecha: "2026-02-10", operario: "José Martínez", coste: 890.00, estado: "completada", notas: "Abonado arranque granados Mollar" },
  { id: 3, parcelaId: 2, tipo: "Tratamiento fitosanitario", producto: "Aceite de parafina 83%", dosis: "1.5 L/100L", fecha: "2026-02-18", operario: "Ahmed Benaissa", coste: 420.00, estado: "completada", notas: "Tratamiento invernal contra cochinilla en brevas" },
  { id: 4, parcelaId: 7, tipo: "Riego", producto: "Agua + Ácido fosfórico", dosis: "38 m³/ha", fecha: "2026-02-22", operario: "Pedro Sánchez", coste: 185.00, estado: "completada", notas: "Fertirrigación La Dehesa - limpieza goteros" },
  { id: 5, parcelaId: 4, tipo: "Fertilización", producto: "Abono orgánico ecológico pellet", dosis: "2000 kg/ha", fecha: "2026-02-25", operario: "María Ruiz", coste: 1560.00, estado: "completada", notas: "Abonado eco granados Wonderful - Fruchesco" },
  { id: 6, parcelaId: 5, tipo: "Tratamiento fitosanitario", producto: "Azufre mojable ECO", dosis: "4 kg/ha", fecha: "2026-03-01", operario: "María Ruiz", coste: 340.00, estado: "en_progreso", notas: "Preventivo oidio higueras ecológicas" },
  { id: 7, parcelaId: 1, tipo: "Tratamiento fitosanitario", producto: "Cobre 50% WP", dosis: "3 kg/ha", fecha: "2026-03-02", operario: "Ahmed Benaissa", coste: 275.00, estado: "en_progreso", notas: "Preventivo podredumbre breva temprana" },
  { id: 8, parcelaId: 3, tipo: "Poda", producto: "-", dosis: "-", fecha: "2026-03-05", operario: "José Martínez", coste: 1200.00, estado: "pendiente", notas: "Poda de aclareo granados. Eliminar chupones." },
  { id: 9, parcelaId: 1, tipo: "Cosecha", producto: "-", dosis: "18.500 kg", fecha: "2025-06-20", operario: "Equipo Fruitum (85 pers.)", coste: 12500.00, estado: "completada", notas: "Campaña brevas 2025 - Colar. Calibre A/AA." },
  { id: 10, parcelaId: 3, tipo: "Cosecha", producto: "-", dosis: "42.000 kg", fecha: "2025-10-15", operario: "Equipo Fruitum (120 pers.)", coste: 18200.00, estado: "completada", notas: "Campaña granada 2025 - Mollar de Elche. Export Francia/UK." },
];

const initialPartesTrabajo = [
  { id: 1, titulo: "Tratamiento cobre higueras El Rincón", parcelaId: 1, trabajadorId: 1, fecha: "2026-03-03", prioridad: "alta", estado: "asignado", descripcion: "Cobre 50% WP a 3 kg/ha. Preventivo podredumbre pre-brotación brevas.", horaInicio: "07:00", horaFin: "12:00", confirmado: false },
  { id: 2, titulo: "Poda aclareo granados La Solana", parcelaId: 3, trabajadorId: 2, fecha: "2026-03-05", prioridad: "media", estado: "pendiente", descripcion: "Eliminar chupones y ramas cruzadas. Equipo de 8 podadores.", horaInicio: "07:00", horaFin: "15:00", confirmado: false },
  { id: 3, titulo: "Fertirrigación granados eco Fruchesco", parcelaId: 4, trabajadorId: 3, fecha: "2026-03-03", prioridad: "alta", estado: "completado", descripcion: "Ácidos húmicos eco + microelementos. Revisar pH del agua.", horaInicio: "06:00", horaFin: "10:00", confirmado: true },
  { id: 4, titulo: "Revisión sistema riego La Dehesa", parcelaId: 7, trabajadorId: 4, fecha: "2026-03-04", prioridad: "alta", estado: "pendiente", descripcion: "Comprobar presión balsas, limpiar filtros y verificar goteros sector 3.", horaInicio: "07:00", horaFin: "14:00", confirmado: false },
  { id: 5, titulo: "Preparación central confección - campaña brevas", parcelaId: 8, trabajadorId: 1, fecha: "2026-03-10", prioridad: "alta", estado: "pendiente", descripcion: "Calibrar cintas, revisar líneas confección manual, verificar cámaras frío.", horaInicio: "06:30", horaFin: "18:00", confirmado: false },
];

const trabajadores = [
  { id: 1, nombre: "Ahmed Benaissa", rol: "Capataz campo", telefono: "666 111 222", activo: true },
  { id: 2, nombre: "José Martínez", rol: "Encargado fincas", telefono: "666 333 444", activo: true },
  { id: 3, nombre: "Pedro Sánchez", rol: "Técnico riego", telefono: "666 555 666", activo: true },
  { id: 4, nombre: "María Ruiz", rol: "Resp. producción ecológica", telefono: "666 777 888", activo: true },
  { id: 5, nombre: "Francisco López", rol: "Jefe central confección", telefono: "666 999 111", activo: true },
  { id: 6, nombre: "Carmen Navarro", rol: "Coord. calidad/export", telefono: "666 222 333", activo: true },
];

const vademecumProductos = [
  { id: 1, nombre: "Cobre 50% WP", tipo: "Fungicida", materiaActiva: "Oxicloruro de cobre 50%", cultivos: ["Higuera", "Granado", "Frutales"], dosisMin: 2.0, dosisMax: 4.0, unidad: "kg/ha", plazoSeguridad: 15, registro: "ES-01123", zonaVulnerable: false, estado: "autorizado" },
  { id: 2, nombre: "Aceite de parafina 83%", tipo: "Insecticida", materiaActiva: "Aceite mineral parafínico 83%", cultivos: ["Higuera", "Granado", "Frutales"], dosisMin: 1.0, dosisMax: 2.0, unidad: "L/100L", plazoSeguridad: 0, registro: "ES-00567", zonaVulnerable: false, estado: "autorizado" },
  { id: 3, nombre: "NPK 12-8-16 + Micros", tipo: "Fertilizante", materiaActiva: "N 12%, P2O5 8%, K2O 16% + Fe, Zn, Mn", cultivos: ["Granado", "Higuera"], dosisMin: 250, dosisMax: 400, unidad: "kg/ha", plazoSeguridad: 0, registro: "FE-01234", zonaVulnerable: true, estado: "autorizado" },
  { id: 4, nombre: "Azufre mojable ECO", tipo: "Fungicida (Eco)", materiaActiva: "Azufre 80% WG", cultivos: ["Higuera", "Granado"], dosisMin: 3.0, dosisMax: 6.0, unidad: "kg/ha", plazoSeguridad: 5, registro: "ES-00891-ECO", zonaVulnerable: false, estado: "autorizado" },
  { id: 5, nombre: "Abono orgánico pellet ECO", tipo: "Fertilizante (Eco)", materiaActiva: "N 4%, P2O5 3%, K2O 3% - origen vegetal", cultivos: ["Todos (eco)"], dosisMin: 1500, dosisMax: 3000, unidad: "kg/ha", plazoSeguridad: 0, registro: "FE-03456-ECO", zonaVulnerable: false, estado: "autorizado" },
  { id: 6, nombre: "Bacillus thuringiensis", tipo: "Insecticida biológico", materiaActiva: "B.t. var. kurstaki 32%", cultivos: ["Higuera", "Granado"], dosisMin: 0.5, dosisMax: 1.5, unidad: "kg/ha", plazoSeguridad: 0, registro: "ES-02345-BIO", zonaVulnerable: false, estado: "autorizado" },
  { id: 7, nombre: "Ácido fosfórico 75%", tipo: "Corrector pH / Fertilizante", materiaActiva: "P2O5 54%", cultivos: ["Todos"], dosisMin: 0.3, dosisMax: 0.8, unidad: "L/m³ agua", plazoSeguridad: 0, registro: "FE-04567", zonaVulnerable: true, estado: "autorizado" },
  { id: 8, nombre: "Lambda cihalotrina 10%", tipo: "Insecticida", materiaActiva: "Lambda cihalotrina 10% CS", cultivos: ["Higuera", "Granado"], dosisMin: 0.15, dosisMax: 0.25, unidad: "L/ha", plazoSeguridad: 7, registro: "ES-03678", zonaVulnerable: false, estado: "autorizado" },
  { id: 9, nombre: "Ácidos húmicos ECO", tipo: "Bioestimulante (Eco)", materiaActiva: "Ác. húmicos 15%, Ác. fúlvicos 3%", cultivos: ["Todos (eco)"], dosisMin: 5.0, dosisMax: 15.0, unidad: "L/ha", plazoSeguridad: 0, registro: "BE-01234-ECO", zonaVulnerable: false, estado: "autorizado" },
];

const initialStock = [
  { id: 1, productoId: 1, nombre: "Cobre 50% WP", tipo: "Fungicida", cantidad: 45, unidad: "kg", minimo: 20, ubicacion: "Nave Batistes (La Romana)", lote: "LOT-2026-001", caducidad: "2028-12-01" },
  { id: 2, productoId: 2, nombre: "Aceite de parafina 83%", tipo: "Insecticida", cantidad: 25, unidad: "L", minimo: 15, ubicacion: "Nave Batistes (La Romana)", lote: "LOT-2026-005", caducidad: "2027-08-20" },
  { id: 3, productoId: 3, nombre: "NPK 12-8-16 + Micros", tipo: "Fertilizante", cantidad: 2200, unidad: "kg", minimo: 1000, ubicacion: "Nave Batistes (La Romana)", lote: "LOT-2026-012", caducidad: "2028-06-01" },
  { id: 4, productoId: 4, nombre: "Azufre mojable ECO", tipo: "Fungicida (Eco)", cantidad: 18, unidad: "kg", minimo: 20, ubicacion: "Almacén eco Fruchesco", lote: "LOT-2026-ECO-008", caducidad: "2027-11-15" },
  { id: 5, productoId: 5, nombre: "Abono orgánico pellet ECO", tipo: "Fertilizante (Eco)", cantidad: 4500, unidad: "kg", minimo: 2000, ubicacion: "Nave exterior Albatera", lote: "LOT-2026-ECO-015", caducidad: "2028-03-01" },
  { id: 6, productoId: 6, nombre: "Bacillus thuringiensis", tipo: "Insecticida bio", cantidad: 3, unidad: "kg", minimo: 5, ubicacion: "Almacén eco Fruchesco", lote: "LOT-2026-BIO-003", caducidad: "2027-04-30" },
  { id: 7, productoId: 8, nombre: "Lambda cihalotrina 10%", tipo: "Insecticida", cantidad: 8, unidad: "L", minimo: 5, ubicacion: "Nave Batistes (La Romana)", lote: "LOT-2026-022", caducidad: "2028-01-15" },
  { id: 8, productoId: 9, nombre: "Ácidos húmicos ECO", tipo: "Bioestimulante", cantidad: 60, unidad: "L", minimo: 30, ubicacion: "Almacén eco Fruchesco", lote: "LOT-2026-ECO-020", caducidad: "2027-12-01" },
  { id: 9, productoId: 0, nombre: "Cajas cartón breva (10x1kg)", tipo: "Envase", cantidad: 12000, unidad: "uds", minimo: 5000, ubicacion: "Central confección Albatera", lote: "ENV-2026-B01", caducidad: "-" },
  { id: 10, productoId: 0, nombre: "Alvéolos protección granada", tipo: "Envase", cantidad: 8500, unidad: "uds", minimo: 3000, ubicacion: "Central confección Albatera", lote: "ENV-2026-G01", caducidad: "-" },
];

const initialMaquinaria = [
  { id: 1, nombre: "Tractor New Holland T5.110", tipo: "Tractor", matricula: "ALC-3890-VE", horasTotales: 4120, horasTemporada: 210, costeHora: 38, estado: "operativo", proximoMantenimiento: "2026-04-15", ubicacion: "Nave Batistes (La Romana)" },
  { id: 2, nombre: "Tractor Kubota M5091", tipo: "Tractor", matricula: "ALC-5672-VE", horasTotales: 1850, horasTemporada: 95, costeHora: 32, estado: "operativo", proximoMantenimiento: "2026-05-01", ubicacion: "Finca El Rincón" },
  { id: 3, nombre: "Atomizador Hardi Mercury 2000L", tipo: "Pulverizador", matricula: "-", horasTotales: 1120, horasTemporada: 55, costeHora: 15, estado: "operativo", proximoMantenimiento: "2026-03-20", ubicacion: "Nave Batistes" },
  { id: 4, nombre: "Desbrozadora Belafer 1.8m", tipo: "Desbrozadora", matricula: "-", horasTotales: 1450, horasTemporada: 78, costeHora: 10, estado: "operativo", proximoMantenimiento: "2026-05-10", ubicacion: "Nave Batistes" },
  { id: 5, nombre: "Plataforma elevadora cosecha", tipo: "Cosechadora", matricula: "-", horasTotales: 680, horasTemporada: 120, costeHora: 22, estado: "mantenimiento", proximoMantenimiento: "2026-03-05", ubicacion: "Taller Albatera" },
  { id: 6, nombre: "Furgón refrigerado Iveco Daily", tipo: "Transporte", matricula: "1234 BCD", horasTotales: 0, horasTemporada: 0, costeHora: 28, estado: "operativo", proximoMantenimiento: "2026-06-10", ubicacion: "Central confección" },
  { id: 7, nombre: "Carretilla Toyota (confección)", tipo: "Logística", matricula: "-", horasTotales: 3200, horasTemporada: 180, costeHora: 8, estado: "operativo", proximoMantenimiento: "2026-04-01", ubicacion: "Central confección" },
  { id: 8, nombre: "Furgoneta Renault Kangoo", tipo: "Vehículo", matricula: "5678 FGH", horasTotales: 0, horasTemporada: 0, costeHora: 18, estado: "operativo", proximoMantenimiento: "2026-07-15", ubicacion: "Nave Batistes" },
];

const datosMeteo = [
  { fecha: "27 Feb", tempMax: 20, tempMin: 8, humedad: 55, lluvia: 0, viento: 12 },
  { fecha: "28 Feb", tempMax: 22, tempMin: 9, humedad: 48, lluvia: 0, viento: 8 },
  { fecha: "1 Mar", tempMax: 19, tempMin: 10, humedad: 72, lluvia: 5, viento: 22 },
  { fecha: "2 Mar", tempMax: 18, tempMin: 11, humedad: 80, lluvia: 12, viento: 28 },
  { fecha: "3 Mar", tempMax: 22, tempMin: 9, humedad: 45, lluvia: 0, viento: 10 },
  { fecha: "4 Mar*", tempMax: 24, tempMin: 10, humedad: 40, lluvia: 0, viento: 8 },
  { fecha: "5 Mar*", tempMax: 25, tempMin: 11, humedad: 38, lluvia: 0, viento: 6 },
];

const analisisSuelo = [
  { parcela: "El Rincón (Higueras)", pH: 7.6, materiaOrganica: 2.3, nitrogeno: 0.13, fosforo: 22, potasio: 280, conductividad: 1.1, fecha: "2025-11-15" },
  { parcela: "Los Bancales (Brevas)", pH: 7.4, materiaOrganica: 1.9, nitrogeno: 0.11, fosforo: 19, potasio: 210, conductividad: 0.9, fecha: "2025-11-15" },
  { parcela: "La Solana (Granados)", pH: 7.8, materiaOrganica: 1.6, nitrogeno: 0.09, fosforo: 15, potasio: 195, conductividad: 1.3, fecha: "2025-11-20" },
  { parcela: "Fruchesco Eco (Granados)", pH: 7.5, materiaOrganica: 3.2, nitrogeno: 0.16, fosforo: 28, potasio: 240, conductividad: 0.8, fecha: "2025-10-10" },
  { parcela: "El Palmeral Eco (Higueras)", pH: 7.3, materiaOrganica: 2.8, nitrogeno: 0.14, fosforo: 25, potasio: 220, conductividad: 0.9, fecha: "2025-11-15" },
  { parcela: "La Dehesa (Mixta)", pH: 7.7, materiaOrganica: 2.0, nitrogeno: 0.12, fosforo: 20, potasio: 230, conductividad: 1.0, fecha: "2025-11-20" },
];

const zonasFertilizantes = [
  { parcela: "El Rincón (Higueras)", zonaVulnerable: true, limiteN: 170, aplicadoN: 95, limiteP: 80, aplicadoP: 40 },
  { parcela: "Los Bancales (Brevas)", zonaVulnerable: true, limiteN: 170, aplicadoN: 82, limiteP: 80, aplicadoP: 35 },
  { parcela: "La Solana (Granados)", zonaVulnerable: true, limiteN: 170, aplicadoN: 110, limiteP: 80, aplicadoP: 45 },
  { parcela: "Fruchesco Eco (Granados)", zonaVulnerable: false, limiteN: 170, aplicadoN: 65, limiteP: null, aplicadoP: 30 },
  { parcela: "El Palmeral Eco (Higueras)", zonaVulnerable: false, limiteN: 170, aplicadoN: 55, limiteP: null, aplicadoP: 25 },
  { parcela: "La Dehesa (Mixta)", zonaVulnerable: true, limiteN: 170, aplicadoN: 78, limiteP: 80, aplicadoP: 32 },
];

const explotaciones = [
  { id: 1, nombre: "Fruitum 2016 SL — Producción convencional", pac: "PAC-03005-2025-001", titular: "Fruitum 2016 SL", superficie: 43.5, parcelas: 5, nif: "B-54XXXXXX", municipio: "Albatera (Alicante)", cultivos: "Breva, Higo, Granada" },
  { id: 2, nombre: "Fruchesco — Producción ecológica", pac: "PAC-03059-2025-002", titular: "Fruchesco SL", superficie: 20.9, parcelas: 2, nif: "B-03XXXXXX", municipio: "Crevillente / Catral (Alicante)", cultivos: "Granada eco, Higo eco" },
];

const usuarios = [
  { id: 1, nombre: "David Miquel Jordá", email: "orihuela@somossinergia.es", rol: "Administrador", permisos: ["todo"], activo: true, ultimoAcceso: "2026-03-03 08:30" },
  { id: 2, nombre: "Ahmed Benaissa", email: "ahmed@fruitum.es", rol: "Capataz campo", permisos: ["parcelas", "intervenciones", "partes", "stock"], activo: true, ultimoAcceso: "2026-03-03 07:15" },
  { id: 3, nombre: "Francisco López", email: "flopez@fruitum.es", rol: "Jefe confección", permisos: ["partes", "stock", "maquinaria", "intervenciones_lectura"], activo: true, ultimoAcceso: "2026-03-03 06:30" },
  { id: 4, nombre: "María Ruiz", email: "maria@fruchesco.es", rol: "Resp. ecológico", permisos: ["parcelas", "intervenciones", "partes", "stock", "cumplimiento"], activo: true, ultimoAcceso: "2026-03-02 18:00" },
  { id: 5, nombre: "Carmen Navarro", email: "carmen@fruitum.es", rol: "Calidad/Export", permisos: ["costes_lectura", "informes", "stock"], activo: true, ultimoAcceso: "2026-03-02 16:00" },
  { id: 6, nombre: "Contable externo", email: "contable@asesoria.es", rol: "Consultor", permisos: ["costes_lectura", "informes"], activo: true, ultimoAcceso: "2026-02-28 10:00" },
];

const costesData = [
  { mes: "Sep", fitosanitarios: 3200, fertilizantes: 2100, riego: 1800, maquinaria: 1500, manoObra: 28000, confeccion: 42000 },
  { mes: "Oct", fitosanitarios: 2800, fertilizantes: 3500, riego: 1200, maquinaria: 2200, manoObra: 35000, confeccion: 58000 },
  { mes: "Nov", fitosanitarios: 1500, fertilizantes: 1800, riego: 600, maquinaria: 800, manoObra: 12000, confeccion: 8000 },
  { mes: "Dic", fitosanitarios: 800, fertilizantes: 900, riego: 300, maquinaria: 600, manoObra: 8500, confeccion: 2000 },
  { mes: "Ene", fitosanitarios: 1200, fertilizantes: 1500, riego: 400, maquinaria: 2800, manoObra: 15000, confeccion: 3000 },
  { mes: "Feb", fitosanitarios: 2800, fertilizantes: 2400, riego: 800, maquinaria: 1200, manoObra: 18000, confeccion: 5000 },
  { mes: "Mar", fitosanitarios: 3500, fertilizantes: 3200, riego: 1500, maquinaria: 1800, manoObra: 22000, confeccion: 8000 },
];

const rentabilidadParcela = [
  { parcela: "El Rincón (Higueras)", ingresos: 185000, costes: 98000, margen: 87000 },
  { parcela: "Los Bancales (Brevas)", ingresos: 156000, costes: 82000, margen: 74000 },
  { parcela: "La Solana (Granados)", ingresos: 210000, costes: 95000, margen: 115000 },
  { parcela: "Fruchesco Eco (Granados)", ingresos: 280000, costes: 145000, margen: 135000 },
  { parcela: "El Palmeral Eco (Higueras)", ingresos: 125000, costes: 72000, margen: 53000 },
  { parcela: "La Dehesa (Mixta)", ingresos: 145000, costes: 68000, margen: 77000 },
];

const alertasSIEX = [
  { id: 1, tipo: "warning", mensaje: "Cuaderno digital SIEX: faltan 2 intervenciones eco por registrar (Fruchesco)", fecha: "2026-03-01", parcela: "Fruchesco Eco" },
  { id: 2, tipo: "success", mensaje: "Certificación GlobalGAP renovada - Fruitum 2016 SL", fecha: "2026-02-20", parcela: "Todas Fruitum" },
  { id: 3, tipo: "success", mensaje: "Certificado Ecológico CAECV vigente - Fruchesco parcelas eco", fecha: "2026-02-22", parcela: "Fruchesco Eco + Palmeral" },
  { id: 4, tipo: "info", mensaje: "Plazo envío cuaderno explotación SIEX: 30 días (ambas explotaciones)", fecha: "2026-03-03", parcela: "Todas" },
  { id: 5, tipo: "warning", mensaje: "Zona vulnerable nitratos: La Solana cerca del 65% del límite N aplicado", fecha: "2026-02-28", parcela: "La Solana" },
  { id: 6, tipo: "danger", mensaje: "Alerta export: nuevo requisito MRL para granada UK post-Brexit. Revisar LMR lambda cihalotrina.", fecha: "2026-03-02", parcela: "Granados export" },
];

const initialConversaciones = [
  {
    id: 1, titulo: "Campaña brevas 2026 - Planificación export", participantes: ["Carmen Navarro", "Cliente Rungis (Francia)", "David Miquel"],
    mensajes: [
      { id: 1, autor: "Cliente Rungis", fecha: "20 Feb 10:00", texto: "Buenos días. Necesitamos confirmar volúmenes de breva Colar para junio. ¿Mantienen calibre AA mínimo 60%?", avatar: "CR" },
      { id: 2, autor: "David Miquel", fecha: "20 Feb 11:30", texto: "Estimamos 45 toneladas breva Colar. Calibre AA previsto 65%. Carmen, prepara la oferta.", avatar: "DM" },
      { id: 3, autor: "Carmen Navarro", fecha: "20 Feb 14:00", texto: "Oferta enviada: 45t breva Colar, 2.80€/kg AA, 2.20€/kg A. Entrega semanal junio-julio.", avatar: "CN" },
      { id: 4, autor: "Cliente Rungis", fecha: "21 Feb 09:15", texto: "Aceptamos. Necesitamos certificado GlobalGAP actualizado y ficha logística.", avatar: "CR" },
    ]
  },
  {
    id: 2, titulo: "Granada Mollar - Reunión técnico ATRIA", participantes: ["Ahmed Benaissa", "Técnico ATRIA", "David Miquel"],
    mensajes: [
      { id: 1, autor: "Técnico ATRIA", fecha: "25 Feb 09:00", texto: "He revisado La Solana. Granados en buen estado post-poda. Recomiendo arranque abonado NPK 12-8-16 ya.", avatar: "TA" },
      { id: 2, autor: "David Miquel", fecha: "25 Feb 10:00", texto: "Ahmed, ¿tenemos stock suficiente de NPK?", avatar: "DM" },
      { id: 3, autor: "Ahmed Benaissa", fecha: "25 Feb 10:30", texto: "Sí, 2200 kg en Nave Batistes. Suficiente para La Solana y La Dehesa.", avatar: "AB" },
      { id: 4, autor: "David Miquel", fecha: "25 Feb 11:00", texto: "Perfecto. Programa fertirrigación para esta semana.", avatar: "DM" },
    ]
  },
  {
    id: 3, titulo: "Fruchesco Eco - Auditoría CAECV", participantes: ["María Ruiz", "David Miquel"],
    mensajes: [
      { id: 1, autor: "María Ruiz", fecha: "28 Feb 15:00", texto: "Auditoría CAECV completada sin incidencias. Certificado eco renovado hasta feb 2027.", avatar: "MR" },
      { id: 2, autor: "David Miquel", fecha: "28 Feb 16:00", texto: "Excelente. Subir certificado a SIEX y enviar copia a compradores UK y Países Bajos.", avatar: "DM" },
      { id: 3, autor: "María Ruiz", fecha: "28 Feb 17:30", texto: "Hecho. También he registrado las últimas intervenciones eco en el cuaderno digital.", avatar: "MR" },
    ]
  },
];

// ==================== MAP COMPONENT (Leaflet) ====================

function RealMap({ lat, lng, zoom = 16, height = 380, label, superficie }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Load Leaflet CSS
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(link);
    }

    // Load Leaflet JS
    const loadLeaflet = () => {
      return new Promise((resolve) => {
        if (window.L) { resolve(window.L); return; }
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
        script.onload = () => resolve(window.L);
        document.head.appendChild(script);
      });
    };

    loadLeaflet().then((L) => {
      if (!mapRef.current) return;
      const map = L.map(mapRef.current).setView([lat, lng], zoom);
      mapInstanceRef.current = map;

      // Capa base satélite (Esri)
      const satellite = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { attribution: "Esri Satellite", maxZoom: 19 }
      );

      // Capa base mapa
      const streets = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        { attribution: "&copy; OpenStreetMap", maxZoom: 19 }
      );

      // Capa catastral española (WMS)
      const catastro = L.tileLayer.wms(
        "https://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx",
        { layers: "Catastro", format: "image/png", transparent: true, opacity: 0.6, maxZoom: 20 }
      );

      satellite.addTo(map);
      catastro.addTo(map);

      // Control de capas
      L.control.layers(
        { "Satélite": satellite, "Mapa": streets },
        { "Catastro (parcelas)": catastro },
        { position: "topright" }
      ).addTo(map);

      // Marcador
      const marker = L.marker([lat, lng]).addTo(map);
      if (label) {
        marker.bindPopup(`<div style="text-align:center"><strong>${label}</strong><br/>${superficie || ""}</div>`).openPopup();
      }

      // Escala
      L.control.scale({ metric: true, imperial: false }).addTo(map);

      setTimeout(() => map.invalidateSize(), 200);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, zoom, label, superficie]);

  return <div ref={mapRef} style={{ height, width: "100%", borderRadius: 12, zIndex: 1 }} />;
}

// ==================== SHARED COMPONENTS ====================

const Badge = ({ children, color = "green" }) => {
  const c = { green: "bg-green-100 text-green-800", blue: "bg-blue-100 text-blue-800", yellow: "bg-yellow-100 text-yellow-800", red: "bg-red-100 text-red-800", gray: "bg-gray-100 text-gray-800", purple: "bg-purple-100 text-purple-800", orange: "bg-orange-100 text-orange-800" };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${c[color] || c.gray}`}>{children}</span>;
};

const StatCard = ({ icon: Icon, label, value, change, color = "#16a34a", sub }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className="p-2.5 rounded-xl" style={{ background: `${color}15` }}><Icon size={22} style={{ color }} /></div>
      {change !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-semibold ${change >= 0 ? "text-green-600" : "text-red-500"}`}>
          {change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}{Math.abs(change)}%
        </div>
      )}
    </div>
    <div className="mt-3">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  </div>
);

const NavItem = ({ icon: Icon, label, active, onClick, badge }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative ${active ? "bg-green-50 text-green-700 shadow-sm" : "text-gray-600 hover:bg-gray-50"}`}>
    <Icon size={18} /><span className="truncate">{label}</span>
    {badge && <span className="absolute right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{badge}</span>}
  </button>
);

// ==================== DASHBOARD ====================

function DashboardPage({ parcelas, intervenciones }) {
  const superficieTotal = parcelas.reduce((s, p) => s + p.superficie, 0);
  const intervencionesActivas = intervenciones.filter(i => i.estado !== "completada").length;
  const costeTotalMes = intervenciones.filter(i => i.fecha.startsWith("2026-03")).reduce((s, i) => s + i.coste, 0);
  const ingresosTotal = rentabilidadParcela.reduce((s, p) => s + p.ingresos, 0);
  const cultivoData = parcelas.reduce((acc, p) => { const e = acc.find(a => a.name === p.cultivo); if (e) e.value += p.superficie; else acc.push({ name: p.cultivo, value: p.superficie }); return acc; }, []);
  const pieColors = ["#16a34a", "#0ea5e9", "#f59e0b", "#8b5cf6", "#ef4444"];
  const stockBajo = initialStock.filter(s => s.cantidad <= s.minimo).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Dashboard</h1><p className="text-gray-500 mt-1">Fruitum 2016 SL / Fruchesco — Campaña 2025/2026</p></div>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border"><Sun size={16} className="text-yellow-500" /><span>22°C</span><Wind size={16} className="text-blue-400 ml-2" /><span>10 km/h</span><Droplets size={16} className="text-blue-500 ml-2" /><span>45%</span></div>
          <div className="bg-white px-4 py-2 rounded-xl border"><Calendar size={16} className="inline mr-2" />3 Mar 2026</div>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-4">
        <StatCard icon={MapPin} label="Superficie total" value={`${superficieTotal.toFixed(1)} ha`} change={5.2} color="#16a34a" sub={`${parcelas.length} parcelas`} />
        <StatCard icon={ClipboardList} label="Tareas pendientes" value={intervencionesActivas + initialPartesTrabajo.filter(p => p.estado !== "completado").length} color="#0ea5e9" sub="Intervenciones + partes" />
        <StatCard icon={Euro} label="Coste mes" value={`${costeTotalMes.toFixed(0)} €`} change={-8.3} color="#f59e0b" sub="Marzo 2026" />
        <StatCard icon={TrendingUp} label="Ingresos campaña" value={`${(ingresosTotal / 1000).toFixed(1)}k €`} change={12.4} color="#8b5cf6" />
        <StatCard icon={Package} label="Stock bajo" value={stockBajo} color={stockBajo > 0 ? "#ef4444" : "#16a34a"} sub={stockBajo > 0 ? "Productos bajo mínimo" : "Todo OK"} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white rounded-2xl p-5 shadow-sm border"><h3 className="font-semibold text-gray-900 mb-4">Evolución de costes</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={costesData}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="mes" stroke="#94a3b8" fontSize={12} /><YAxis stroke="#94a3b8" fontSize={12} tickFormatter={v => `${v}€`} /><Tooltip formatter={v => `${v} €`} /><Legend />
              <Area type="monotone" dataKey="confeccion" name="Confección" stackId="1" stroke="#ec4899" fill="#ec489980" />
              <Area type="monotone" dataKey="manoObra" name="Mano obra" stackId="1" stroke="#8b5cf6" fill="#8b5cf680" />
              <Area type="monotone" dataKey="fitosanitarios" name="Fitosanit." stackId="1" stroke="#ef4444" fill="#ef444480" />
              <Area type="monotone" dataKey="fertilizantes" name="Fertiliz." stackId="1" stroke="#16a34a" fill="#16a34a80" />
              <Area type="monotone" dataKey="riego" name="Riego" stackId="1" stroke="#0ea5e9" fill="#0ea5e980" />
              <Area type="monotone" dataKey="maquinaria" name="Maquinaria" stackId="1" stroke="#f59e0b" fill="#f59e0b80" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border"><h3 className="font-semibold text-gray-900 mb-4">Cultivos</h3>
          <ResponsiveContainer width="100%" height={200}><PieChart><Pie data={cultivoData} cx="50%" cy="50%" outerRadius={75} innerRadius={42} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}ha`}>{cultivoData.map((_, i) => <Cell key={i} fill={pieColors[i]} />)}</Pie><Tooltip formatter={v => `${v} ha`} /></PieChart></ResponsiveContainer>
          <div className="space-y-1.5 mt-2">{cultivoData.map((c, i) => (<div key={c.name} className="flex items-center justify-between text-sm"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ background: pieColors[i] }} /><span className="text-gray-600">{c.name}</span></div><span className="font-medium">{c.value} ha</span></div>))}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border"><h3 className="font-semibold text-gray-900 mb-3">Últimas intervenciones</h3>
          <div className="space-y-2">{intervenciones.slice(-5).reverse().map(i => { const p = parcelas.find(x => x.id === i.parcelaId); return (
            <div key={i.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"><div className={`w-2 h-2 rounded-full ${i.estado === "completada" ? "bg-green-500" : i.estado === "pendiente" ? "bg-yellow-500" : "bg-blue-500"}`} /><div className="flex-1"><p className="text-sm font-medium">{i.tipo}</p><p className="text-xs text-gray-500">{p?.nombre?.split(" - ")[1]} · {i.fecha}</p></div><span className="text-sm font-semibold">{i.coste} €</span></div>
          ); })}</div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border"><h3 className="font-semibold text-gray-900 mb-3">Alertas</h3>
          <div className="space-y-2">{alertasSIEX.map(a => (
            <div key={a.id} className={`flex items-start gap-3 p-3 rounded-xl ${a.tipo === "danger" ? "bg-red-50" : a.tipo === "warning" ? "bg-yellow-50" : a.tipo === "success" ? "bg-green-50" : "bg-blue-50"}`}>
              <AlertTriangle size={15} className={`mt-0.5 ${a.tipo === "danger" ? "text-red-500" : a.tipo === "warning" ? "text-yellow-500" : a.tipo === "success" ? "text-green-500" : "text-blue-500"}`} />
              <div><p className="text-sm text-gray-800">{a.mensaje}</p><p className="text-xs text-gray-500 mt-1">{a.fecha}</p></div>
            </div>
          ))}</div>
        </div>
      </div>
    </div>
  );
}

// ==================== PARCELAS ====================

function ParcelasPage({ parcelas, setParcelas }) {
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const filtered = parcelas.filter(p => p.nombre.toLowerCase().includes(search.toLowerCase()) || p.cultivo.toLowerCase().includes(search.toLowerCase()));
  const [form, setForm] = useState({ nombre: "", superficie: "", cultivo: "", variedad: "", municipio: "", sigpac: "", sistema: "Riego por goteo", suelo: "" });
  const handleAdd = () => { if (!form.nombre || !form.superficie) return; setParcelas([...parcelas, { ...form, id: Date.now(), superficie: parseFloat(form.superficie), estado: "activa", campana: "2025/2026", provincia: "Alicante", fechaSiembra: new Date().toISOString().slice(0, 10), explotacionId: 1 }]); setForm({ nombre: "", superficie: "", cultivo: "", variedad: "", municipio: "", sigpac: "", sistema: "Riego por goteo", suelo: "" }); setShowForm(false); };

  if (selected) {
    const isInstalacion = selected.tipo === "instalacion";
    return (
      <div className="space-y-6">
        <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm"><ArrowLeft size={16} /> Volver</button>
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex items-start justify-between">
            <div><h2 className="text-xl font-bold">{selected.nombre}</h2><p className="text-gray-500 mt-1">{isInstalacion ? selected.direccion : `${selected.municipio}, ${selected.provincia}`}</p></div>
            <div className="flex gap-2">
              {isInstalacion && <Badge color="blue">Instalación</Badge>}
              <Badge color={selected.estado === "activa" ? "green" : "yellow"}>{selected.estado === "activa" ? "Activa" : "En reposo"}</Badge>
            </div>
          </div>
          {isInstalacion ? (
            <div className="grid grid-cols-4 gap-6 mt-6">
              {[["Ref. Catastral", selected.refCatastral], ["Clase", selected.clase], ["Uso", selected.uso], ["Parcela catastral", selected.parcelaCatastral],
                ["Sup. construida", `${selected.superficieConstruida.toLocaleString()} m²`], ["Sup. gráfica", `${selected.superficieGrafica.toLocaleString()} m²`], ["Año construcción", selected.anoConstruccion], ["Código postal", selected.codigoPostal]
              ].map(([l, v]) => (<div key={l}><p className="text-xs text-gray-400 uppercase">{l}</p><p className="text-sm font-medium mt-1">{v}</p></div>))}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-6 mt-6">
              {[["Superficie", `${selected.superficie} ha`], ["Cultivo", selected.cultivo], ["Variedad", selected.variedad], ["SIGPAC", selected.sigpac], ["Campaña", selected.campana], ["Riego", selected.sistema], ["Suelo", selected.suelo], ["Plantación", selected.fechaSiembra]].map(([l, v]) => (<div key={l}><p className="text-xs text-gray-400 uppercase">{l}</p><p className="text-sm font-medium mt-1">{v}</p></div>))}
            </div>
          )}
        </div>
        {isInstalacion && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start gap-3">
            <Check size={20} className="text-green-600 mt-0.5" />
            <div><p className="text-sm font-semibold text-green-800">Parcela verificada en Catastro</p><p className="text-sm text-green-700 mt-1">Datos importados directamente de la Sede Electrónica del Catastro. Ref: {selected.refCatastral}</p></div>
          </div>
        )}
        <div className="bg-white rounded-2xl p-6 shadow-sm border"><h3 className="font-semibold mb-4">{isInstalacion ? "Ubicación Catastral" : "Ubicación en Mapa"} {selected.verificadaCatastro && <Badge color="green">Verificada Catastro</Badge>}</h3>
          {selected.lat ? (
            <div>
              <RealMap
                lat={selected.lat}
                lng={selected.lng}
                zoom={selected.tipo === "instalacion" ? 17 : 16}
                height={380}
                label={selected.nombre}
                superficie={selected.tipo === "instalacion" ? `${selected.superficieGrafica?.toLocaleString()} m²` : `${selected.superficie} ha`}
              />
              <div className="bg-gray-50 px-4 py-2.5 rounded-b-xl border border-t-0 flex items-center justify-between text-xs text-gray-500">
                <span>Coordenadas: {selected.lat}, {selected.lng} · Vista satélite + parcelas catastrales</span>
                <a href={`https://www.openstreetmap.org/?mlat=${selected.lat}&mlon=${selected.lng}#map=16/${selected.lat}/${selected.lng}`} target="_blank" rel="noopener" className="text-green-600 hover:underline font-medium">Abrir en OpenStreetMap</a>
              </div>
            </div>
          ) : (
            <div className={`rounded-xl h-56 flex items-center justify-center border-2 border-dashed ${isInstalacion ? "bg-gradient-to-br from-blue-100 via-blue-50 to-gray-50 border-blue-200" : "bg-gradient-to-br from-green-100 via-green-50 to-yellow-50 border-green-200"}`}>
              <div className="text-center">
                {isInstalacion ? <Warehouse size={36} className="text-blue-400 mx-auto mb-2" /> : <MapPin size={36} className="text-green-400 mx-auto mb-2" />}
                <p className="text-gray-500 text-sm">{isInstalacion ? `Catastro · Parcela ${selected.parcelaCatastral}` : `Vista SIGPAC · ${selected.sigpac}`}</p>
                <p className={`font-semibold mt-2 ${isInstalacion ? "text-blue-600" : "text-green-600"}`}>{isInstalacion ? `${selected.superficieGrafica?.toLocaleString()} m²` : `${selected.superficie} ha`}</p>
              </div>
            </div>
          )}
          {selected.refCatastral && (
            <div className="mt-3 flex items-center gap-4 text-sm">
              <span className="text-gray-500">Ref. Catastral: <strong>{selected.refCatastral}</strong></span>
              {selected.poligono && <span className="text-gray-500">Pol: <strong>{selected.poligono}</strong> · Parc: <strong>{selected.parcela}</strong></span>}
              {selected.paraje && <span className="text-gray-500">Paraje: <strong>{selected.paraje}</strong></span>}
              {selected.superficieGrafica && <span className="text-gray-500">Sup. gráfica: <strong>{selected.superficieGrafica.toLocaleString()} m²</strong></span>}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold">Parcelas y Cultivos</h1><p className="text-gray-500 mt-1">{parcelas.length} parcelas · {parcelas.reduce((s, p) => s + p.superficie, 0).toFixed(1)} ha</p></div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700"><Plus size={18} /> Nueva parcela</button></div>
      {showForm && (<div className="bg-white rounded-2xl p-6 shadow-sm border border-green-200"><h3 className="font-semibold mb-4">Nueva parcela</h3>
        <div className="grid grid-cols-4 gap-4">{[["Nombre", "nombre", "text"], ["Superficie (ha)", "superficie", "number"], ["Cultivo", "cultivo", "text"], ["Variedad", "variedad", "text"], ["Municipio", "municipio", "text"], ["SIGPAC", "sigpac", "text"], ["Riego", "sistema", "text"], ["Suelo", "suelo", "text"]].map(([l, k, t]) => (<div key={k}><label className="text-xs text-gray-500 uppercase">{l}</label><input type={t} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300" /></div>))}</div>
        <div className="flex gap-3 mt-4"><button onClick={handleAdd} className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-700">Guardar</button><button onClick={() => setShowForm(false)} className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg text-sm">Cancelar</button></div>
      </div>)}
      <div className="relative"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Buscar parcela o cultivo..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300" /></div>
      <div className="space-y-3">{filtered.map(p => {
        const isInst = p.tipo === "instalacion";
        return (
        <div key={p.id} onClick={() => setSelected(p)} className={`bg-white rounded-2xl p-5 shadow-sm border hover:shadow-md transition-all cursor-pointer ${isInst ? "hover:border-blue-200" : "hover:border-green-200"}`}>
          <div className="flex items-center justify-between"><div className="flex items-center gap-4"><div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isInst ? "bg-blue-50" : "bg-green-50"}`}>{isInst ? <Warehouse size={24} className="text-blue-600" /> : <Sprout size={24} className="text-green-600" />}</div><div><h3 className="font-semibold">{p.nombre}</h3><p className="text-sm text-gray-500">{p.municipio} · {isInst ? `${p.uso} · ${p.refCatastral}` : `${p.cultivo} (${p.variedad})`}</p></div></div>
            <div className="flex items-center gap-4"><div className="text-right"><p className="text-lg font-bold">{isInst ? `${p.superficieGrafica?.toLocaleString()} m²` : `${p.superficie} ha`}</p><p className="text-xs text-gray-400">{isInst ? `Catastro: ${p.refCatastral?.slice(0,14)}` : `SIGPAC: ${p.sigpac}`}</p></div>{isInst ? <Badge color="blue">Instalación</Badge> : <Badge color={p.estado === "activa" ? "green" : "yellow"}>{p.estado === "activa" ? "Activa" : "Reposo"}</Badge>}<ChevronRight size={20} className="text-gray-300" /></div></div>
        </div>
      ); })}</div>
    </div>
  );
}

// ==================== INTERVENCIONES ====================

function IntervencionesPage({ intervenciones, setIntervenciones, parcelas }) {
  const [filter, setFilter] = useState("todas");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ parcelaId: "", tipo: "", producto: "", dosis: "", operario: "", coste: "", notas: "" });
  const tipos = ["Tratamiento fitosanitario", "Fertilización", "Riego", "Poda", "Cosecha", "Siembra", "Laboreo"];
  const filtered = filter === "todas" ? intervenciones : intervenciones.filter(i => i.estado === filter);
  const handleAdd = () => { if (!form.parcelaId || !form.tipo) return; setIntervenciones([...intervenciones, { ...form, id: Date.now(), parcelaId: parseInt(form.parcelaId), coste: parseFloat(form.coste) || 0, fecha: new Date().toISOString().slice(0, 10), estado: "pendiente" }]); setForm({ parcelaId: "", tipo: "", producto: "", dosis: "", operario: "", coste: "", notas: "" }); setShowForm(false); };
  const ec = { completada: "green", en_progreso: "blue", pendiente: "yellow" };
  const el = { completada: "Completada", en_progreso: "En progreso", pendiente: "Pendiente" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold">Intervenciones</h1><p className="text-gray-500 mt-1">Registro de labores y tratamientos</p></div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700"><Plus size={18} /> Nueva</button></div>
      {showForm && (<div className="bg-white rounded-2xl p-6 shadow-sm border border-green-200"><h3 className="font-semibold mb-4">Registrar intervención</h3>
        <div className="grid grid-cols-3 gap-4">
          <div><label className="text-xs text-gray-500 uppercase">Parcela</label><select value={form.parcelaId} onChange={e => setForm({ ...form, parcelaId: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300"><option value="">Seleccionar...</option>{parcelas.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}</select></div>
          <div><label className="text-xs text-gray-500 uppercase">Tipo</label><select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300"><option value="">Seleccionar...</option>{tipos.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
          {[["Producto", "producto"], ["Dosis", "dosis"], ["Operario", "operario"], ["Coste (€)", "coste"]].map(([l, k]) => (<div key={k}><label className="text-xs text-gray-500 uppercase">{l}</label><input type={k === "coste" ? "number" : "text"} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300" /></div>))}
          <div className="col-span-3"><label className="text-xs text-gray-500 uppercase">Notas</label><textarea value={form.notas} onChange={e => setForm({ ...form, notas: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300" rows={2} /></div>
        </div>
        <div className="flex gap-3 mt-4"><button onClick={handleAdd} className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-700">Guardar</button><button onClick={() => setShowForm(false)} className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg text-sm">Cancelar</button></div>
      </div>)}
      <div className="flex gap-2">{[["todas", "Todas"], ["pendiente", "Pendientes"], ["en_progreso", "En progreso"], ["completada", "Completadas"]].map(([k, l]) => (<button key={k} onClick={() => setFilter(k)} className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === k ? "bg-green-600 text-white" : "bg-white text-gray-600 border hover:bg-gray-50"}`}>{l}</button>))}</div>
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden"><table className="w-full"><thead><tr className="bg-gray-50 text-left">{["Fecha", "Tipo", "Parcela", "Producto", "Dosis", "Operario", "Coste", "Estado"].map(h => (<th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>))}</tr></thead>
        <tbody>{filtered.map(i => { const p = parcelas.find(x => x.id === i.parcelaId); return (
          <tr key={i.id} className="border-t border-gray-50 hover:bg-gray-50"><td className="px-4 py-3 text-sm">{i.fecha}</td><td className="px-4 py-3 text-sm font-medium">{i.tipo}</td><td className="px-4 py-3 text-sm text-gray-600">{p?.nombre?.split(" - ")[1] || p?.nombre}</td><td className="px-4 py-3 text-sm">{i.producto}</td><td className="px-4 py-3 text-sm">{i.dosis}</td><td className="px-4 py-3 text-sm">{i.operario}</td><td className="px-4 py-3 text-sm font-semibold">{i.coste} €</td><td className="px-4 py-3"><Badge color={ec[i.estado]}>{el[i.estado]}</Badge></td></tr>
        ); })}</tbody></table></div>
    </div>
  );
}

// ==================== PARTES DE TRABAJO ====================

function PartesTrabajoPage({ parcelas }) {
  const [partes, setPartes] = useState(initialPartesTrabajo);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ titulo: "", parcelaId: "", trabajadorId: "", descripcion: "", prioridad: "media", horaInicio: "07:00", horaFin: "14:00" });

  const handleAdd = () => { if (!form.titulo || !form.parcelaId) return; setPartes([...partes, { ...form, id: Date.now(), parcelaId: parseInt(form.parcelaId), trabajadorId: parseInt(form.trabajadorId), fecha: new Date().toISOString().slice(0, 10), estado: "pendiente", confirmado: false }]); setForm({ titulo: "", parcelaId: "", trabajadorId: "", descripcion: "", prioridad: "media", horaInicio: "07:00", horaFin: "14:00" }); setShowForm(false); };
  const toggleConfirm = (id) => setPartes(partes.map(p => p.id === id ? { ...p, confirmado: !p.confirmado, estado: !p.confirmado ? "completado" : "asignado" } : p));
  const prioColor = { alta: "red", media: "yellow", baja: "green" };
  const estColor = { pendiente: "gray", asignado: "blue", completado: "green" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold">Partes de Trabajo</h1><p className="text-gray-500 mt-1">Asigna tareas y comprueba su ejecución</p></div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700"><Plus size={18} /> Nuevo parte</button></div>

      {showForm && (<div className="bg-white rounded-2xl p-6 shadow-sm border border-green-200"><h3 className="font-semibold mb-4">Crear parte de trabajo</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2"><label className="text-xs text-gray-500 uppercase">Título</label><input type="text" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300" /></div>
          <div><label className="text-xs text-gray-500 uppercase">Prioridad</label><select value={form.prioridad} onChange={e => setForm({ ...form, prioridad: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300"><option value="alta">Alta</option><option value="media">Media</option><option value="baja">Baja</option></select></div>
          <div><label className="text-xs text-gray-500 uppercase">Parcela</label><select value={form.parcelaId} onChange={e => setForm({ ...form, parcelaId: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300"><option value="">Seleccionar...</option>{parcelas.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}</select></div>
          <div><label className="text-xs text-gray-500 uppercase">Trabajador</label><select value={form.trabajadorId} onChange={e => setForm({ ...form, trabajadorId: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300"><option value="">Seleccionar...</option>{trabajadores.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}</select></div>
          <div className="flex gap-3"><div className="flex-1"><label className="text-xs text-gray-500 uppercase">Inicio</label><input type="time" value={form.horaInicio} onChange={e => setForm({ ...form, horaInicio: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300" /></div><div className="flex-1"><label className="text-xs text-gray-500 uppercase">Fin</label><input type="time" value={form.horaFin} onChange={e => setForm({ ...form, horaFin: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300" /></div></div>
          <div className="col-span-3"><label className="text-xs text-gray-500 uppercase">Descripción</label><textarea value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300" rows={2} /></div>
        </div>
        <div className="flex gap-3 mt-4"><button onClick={handleAdd} className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-700">Crear</button><button onClick={() => setShowForm(false)} className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg text-sm">Cancelar</button></div>
      </div>)}

      <div className="grid grid-cols-3 gap-4">
        {["pendiente", "asignado", "completado"].map(estado => (
          <div key={estado}><h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${estado === "completado" ? "bg-green-500" : estado === "asignado" ? "bg-blue-500" : "bg-gray-400"}`} />{estado === "pendiente" ? "Pendientes" : estado === "asignado" ? "Asignados" : "Completados"} ({partes.filter(p => p.estado === estado).length})</h3>
            <div className="space-y-3">{partes.filter(p => p.estado === estado).map(parte => {
              const parcela = parcelas.find(x => x.id === parte.parcelaId);
              const trab = trabajadores.find(t => t.id === parte.trabajadorId);
              return (
                <div key={parte.id} className="bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2"><h4 className="text-sm font-semibold text-gray-900">{parte.titulo}</h4><Badge color={prioColor[parte.prioridad]}>{parte.prioridad}</Badge></div>
                  <p className="text-xs text-gray-500 mb-3">{parte.descripcion}</p>
                  <div className="space-y-1.5 text-xs text-gray-600">
                    <div className="flex items-center gap-2"><MapPin size={12} />{parcela?.nombre?.split(" - ")[1]}</div>
                    <div className="flex items-center gap-2"><Users size={12} />{trab?.nombre || "Sin asignar"}</div>
                    <div className="flex items-center gap-2"><Clock size={12} />{parte.horaInicio} - {parte.horaFin}</div>
                    <div className="flex items-center gap-2"><Calendar size={12} />{parte.fecha}</div>
                  </div>
                  {estado !== "completado" && (<button onClick={() => toggleConfirm(parte.id)} className="mt-3 w-full flex items-center justify-center gap-2 bg-green-50 text-green-700 py-2 rounded-lg text-xs font-medium hover:bg-green-100"><Check size={14} /> Confirmar realizado</button>)}
                  {estado === "completado" && (<div className="mt-3 flex items-center justify-center gap-2 text-green-600 text-xs font-medium"><Check size={14} /> Confirmado</div>)}
                </div>
              );
            })}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== VADEMECUM ====================

function VademecumPage() {
  const [search, setSearch] = useState("");
  const [filterTipo, setFilterTipo] = useState("todos");
  const [selected, setSelected] = useState(null);
  const tipos = ["todos", "Insecticida", "Fungicida", "Herbicida", "Fertilizante", "Acaricida"];
  const filtered = vademecumProductos.filter(p => (filterTipo === "todos" || p.tipo === filterTipo) && (p.nombre.toLowerCase().includes(search.toLowerCase()) || p.materiaActiva.toLowerCase().includes(search.toLowerCase())));

  if (selected) {
    return (
      <div className="space-y-6">
        <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm"><ArrowLeft size={16} /> Volver al vademecum</button>
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex items-start justify-between"><div><h2 className="text-xl font-bold">{selected.nombre}</h2><p className="text-gray-500 mt-1">{selected.materiaActiva}</p></div><Badge color={selected.estado === "autorizado" ? "green" : "red"}>{selected.estado}</Badge></div>
          <div className="grid grid-cols-3 gap-6 mt-6">
            <div><p className="text-xs text-gray-400 uppercase">Tipo</p><p className="text-sm font-medium mt-1">{selected.tipo}</p></div>
            <div><p className="text-xs text-gray-400 uppercase">Dosis</p><p className="text-sm font-medium mt-1">{selected.dosisMin} - {selected.dosisMax} {selected.unidad}</p></div>
            <div><p className="text-xs text-gray-400 uppercase">Plazo seguridad</p><p className="text-sm font-medium mt-1">{selected.plazoSeguridad} días</p></div>
            <div><p className="text-xs text-gray-400 uppercase">Nº Registro</p><p className="text-sm font-medium mt-1">{selected.registro}</p></div>
            <div><p className="text-xs text-gray-400 uppercase">Zona vulnerable</p><p className="text-sm font-medium mt-1">{selected.zonaVulnerable ? "Restricción aplicable" : "Sin restricción"}</p></div>
            <div><p className="text-xs text-gray-400 uppercase">Cultivos autorizados</p><p className="text-sm font-medium mt-1">{selected.cultivos.join(", ")}</p></div>
          </div>
        </div>
        {selected.estado === "retirado" && (<div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3"><AlertTriangle size={20} className="text-red-500 mt-0.5" /><div><p className="text-sm font-semibold text-red-800">Producto retirado del mercado</p><p className="text-sm text-red-700 mt-1">Este producto ya no está autorizado. Consulte alternativas en el vademecum.</p></div></div>)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Vademecum</h1><p className="text-gray-500 mt-1">Base de datos de productos fitosanitarios y fertilizantes con dosis homologadas</p></div>
      <div className="flex gap-3">
        <div className="relative flex-1"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Buscar producto o materia activa..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300" /></div>
        <div className="flex gap-2">{tipos.map(t => (<button key={t} onClick={() => setFilterTipo(t)} className={`px-3 py-2 rounded-lg text-sm font-medium capitalize ${filterTipo === t ? "bg-green-600 text-white" : "bg-white text-gray-600 border hover:bg-gray-50"}`}>{t}</button>))}</div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden"><table className="w-full"><thead><tr className="bg-gray-50 text-left">{["Producto", "Tipo", "Materia activa", "Dosis", "P. Seguridad", "Cultivos", "Estado"].map(h => (<th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>))}</tr></thead>
        <tbody>{filtered.map(p => (
          <tr key={p.id} onClick={() => setSelected(p)} className="border-t border-gray-50 hover:bg-gray-50 cursor-pointer"><td className="px-4 py-3 text-sm font-medium">{p.nombre}</td><td className="px-4 py-3"><Badge color={p.tipo === "Insecticida" ? "red" : p.tipo === "Fungicida" ? "blue" : p.tipo === "Herbicida" ? "orange" : p.tipo === "Fertilizante" ? "green" : "purple"}>{p.tipo}</Badge></td><td className="px-4 py-3 text-sm text-gray-600">{p.materiaActiva}</td><td className="px-4 py-3 text-sm">{p.dosisMin}-{p.dosisMax} {p.unidad}</td><td className="px-4 py-3 text-sm">{p.plazoSeguridad} días</td><td className="px-4 py-3 text-sm text-gray-600">{p.cultivos.join(", ")}</td><td className="px-4 py-3"><Badge color={p.estado === "autorizado" ? "green" : "red"}>{p.estado}</Badge></td></tr>
        ))}</tbody></table></div>
    </div>
  );
}

// ==================== STOCK ====================

function StockPage() {
  const [stock, setStock] = useState(initialStock);
  const bajosStock = stock.filter(s => s.cantidad <= s.minimo);
  const totalProductos = stock.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold">Control de Stock</h1><p className="text-gray-500 mt-1">Inventario de productos en tiempo real</p></div>
        <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700"><Plus size={18} /> Entrada de producto</button></div>
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={Package} label="Total productos" value={totalProductos} color="#0ea5e9" />
        <StatCard icon={AlertTriangle} label="Bajo mínimo" value={bajosStock.length} color="#ef4444" sub={bajosStock.length > 0 ? "Reponer urgente" : "Todo OK"} />
        <StatCard icon={Warehouse} label="Ubicaciones" value="3" color="#8b5cf6" sub="Almacenes activos" />
        <StatCard icon={Euro} label="Valor stock estimado" value="4.850 €" color="#f59e0b" />
      </div>
      {bajosStock.length > 0 && (<div className="bg-red-50 border border-red-200 rounded-2xl p-4"><h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2"><AlertTriangle size={18} /> Productos bajo mínimo — reponer</h3>
        <div className="space-y-2">{bajosStock.map(s => (<div key={s.id} className="flex items-center justify-between bg-white p-3 rounded-xl"><div><p className="text-sm font-medium">{s.nombre}</p><p className="text-xs text-gray-500">{s.ubicacion} · Lote: {s.lote}</p></div><div className="text-right"><p className="text-sm font-bold text-red-600">{s.cantidad} {s.unidad}</p><p className="text-xs text-gray-500">Mínimo: {s.minimo} {s.unidad}</p></div></div>))}</div>
      </div>)}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden"><table className="w-full"><thead><tr className="bg-gray-50 text-left">{["Producto", "Tipo", "Cantidad", "Mín.", "Ubicación", "Lote", "Caducidad", "Estado"].map(h => (<th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>))}</tr></thead>
        <tbody>{stock.map(s => { const bajo = s.cantidad <= s.minimo; return (
          <tr key={s.id} className={`border-t border-gray-50 hover:bg-gray-50 ${bajo ? "bg-red-50" : ""}`}><td className="px-4 py-3 text-sm font-medium">{s.nombre}</td><td className="px-4 py-3"><Badge color={s.tipo === "Insecticida" ? "red" : s.tipo === "Fertilizante" ? "green" : s.tipo === "Fungicida" ? "blue" : s.tipo === "Herbicida" ? "orange" : "purple"}>{s.tipo}</Badge></td><td className={`px-4 py-3 text-sm font-bold ${bajo ? "text-red-600" : "text-gray-900"}`}>{s.cantidad} {s.unidad}</td><td className="px-4 py-3 text-sm text-gray-500">{s.minimo} {s.unidad}</td><td className="px-4 py-3 text-sm">{s.ubicacion}</td><td className="px-4 py-3 text-sm text-gray-500">{s.lote}</td><td className="px-4 py-3 text-sm">{s.caducidad}</td><td className="px-4 py-3"><Badge color={bajo ? "red" : "green"}>{bajo ? "Reponer" : "OK"}</Badge></td></tr>
        ); })}</tbody></table></div>
    </div>
  );
}

// ==================== MAQUINARIA ====================

function MaquinariaPage() {
  const estadoColor = { operativo: "green", mantenimiento: "yellow", averiado: "red" };
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Gestión de Maquinaria</h1><p className="text-gray-500 mt-1">Control de equipos, horas de trabajo y costes</p></div>
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={Tractor} label="Total equipos" value={initialMaquinaria.length} color="#16a34a" />
        <StatCard icon={Clock} label="Horas temporada" value={initialMaquinaria.reduce((s, m) => s + m.horasTemporada, 0)} color="#0ea5e9" sub="Todas las máquinas" />
        <StatCard icon={Euro} label="Coste maquinaria" value={`${initialMaquinaria.reduce((s, m) => s + m.horasTemporada * m.costeHora, 0).toLocaleString()} €`} color="#f59e0b" sub="Esta campaña" />
        <StatCard icon={Wrench} label="En mantenimiento" value={initialMaquinaria.filter(m => m.estado === "mantenimiento").length} color="#ef4444" />
      </div>
      <div className="grid grid-cols-1 gap-4">{initialMaquinaria.map(m => (
        <div key={m.id} className="bg-white rounded-2xl p-5 shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4"><div className={`w-12 h-12 rounded-xl flex items-center justify-center ${m.estado === "operativo" ? "bg-green-50" : "bg-yellow-50"}`}><Tractor size={24} className={m.estado === "operativo" ? "text-green-600" : "text-yellow-600"} /></div>
              <div><h3 className="font-semibold">{m.nombre}</h3><p className="text-sm text-gray-500">{m.tipo} {m.matricula !== "-" ? `· ${m.matricula}` : ""} · {m.ubicacion}</p></div></div>
            <div className="flex items-center gap-6">
              <div className="text-center"><p className="text-lg font-bold text-gray-900">{m.horasTemporada}h</p><p className="text-xs text-gray-400">Temporada</p></div>
              <div className="text-center"><p className="text-lg font-bold text-gray-900">{m.costeHora} €/h</p><p className="text-xs text-gray-400">Coste</p></div>
              <div className="text-center"><p className="text-lg font-bold text-blue-600">{(m.horasTemporada * m.costeHora).toLocaleString()} €</p><p className="text-xs text-gray-400">Total</p></div>
              <div className="text-center"><p className="text-sm font-medium">{m.proximoMantenimiento}</p><p className="text-xs text-gray-400">Próx. mantenim.</p></div>
              <Badge color={estadoColor[m.estado]}>{m.estado}</Badge>
            </div>
          </div>
        </div>
      ))}</div>
    </div>
  );
}

// ==================== CARTOGRAFIA ====================

function CartografiaAllMap({ parcelas }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link"); link.id = "leaflet-css"; link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"; document.head.appendChild(link);
    }
    const loadL = () => new Promise((res) => { if (window.L) { res(window.L); return; } const s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"; s.onload = () => res(window.L); document.head.appendChild(s); });

    loadL().then((L) => {
      if (!mapRef.current) return;
      const parcelasConCoords = parcelas.filter(p => p.lat && p.lng);
      const centerLat = parcelasConCoords.length > 0 ? parcelasConCoords.reduce((s, p) => s + p.lat, 0) / parcelasConCoords.length : 38.3;
      const centerLng = parcelasConCoords.length > 0 ? parcelasConCoords.reduce((s, p) => s + p.lng, 0) / parcelasConCoords.length : -0.89;
      const map = L.map(mapRef.current).setView([centerLat, centerLng], 12);
      mapInstanceRef.current = map;

      const satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", { attribution: "Esri", maxZoom: 19 });
      const streets = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OSM", maxZoom: 19 });
      const catastro = L.tileLayer.wms("https://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx", { layers: "Catastro", format: "image/png", transparent: true, opacity: 0.5, maxZoom: 20 });
      satellite.addTo(map); catastro.addTo(map);
      L.control.layers({ "Satélite": satellite, "Mapa": streets }, { "Catastro": catastro }, { position: "topright" }).addTo(map);
      L.control.scale({ metric: true, imperial: false }).addTo(map);

      parcelasConCoords.forEach(p => {
        const isInst = p.tipo === "instalacion";
        const icon = L.divIcon({
          className: "custom-marker",
          html: `<div style="background:${isInst ? "#3b82f6" : p.estado === "activa" ? "#16a34a" : "#eab308"};width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4)"></div>`,
          iconSize: [14, 14], iconAnchor: [7, 7]
        });
        const marker = L.marker([p.lat, p.lng], { icon }).addTo(map);
        marker.bindPopup(`<div style="min-width:160px"><strong>${p.nombre}</strong><br/>${p.municipio}<br/>${isInst ? p.uso + " · " + (p.superficieGrafica?.toLocaleString() || "") + " m²" : p.cultivo + " · " + p.superficie + " ha"}<br/><small>${p.refCatastral || p.sigpac}</small></div>`);
      });

      if (parcelasConCoords.length > 1) {
        const bounds = L.latLngBounds(parcelasConCoords.map(p => [p.lat, p.lng]));
        map.fitBounds(bounds, { padding: [50, 50] });
      }
      setTimeout(() => map.invalidateSize(), 200);
    });
    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; } };
  }, [parcelas]);

  return <div ref={mapRef} style={{ height: 520, width: "100%", borderRadius: 12, zIndex: 1 }} />;
}

function CartografiaPage({ parcelas }) {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Cartografía</h1><p className="text-gray-500 mt-1">Mapa integrado con satélite + parcelas catastrales reales</p></div>
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <CartografiaAllMap parcelas={parcelas} />
        <div className="p-4 bg-gray-50 border-t flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">{[["Activa", "bg-green-500"], ["Reposo", "bg-yellow-500"], ["Instalación", "bg-blue-500"]].map(([l, c]) => (<div key={l} className="flex items-center gap-2"><div className={`w-3 h-3 rounded-full ${c}`} /><span className="text-gray-600">{l}</span></div>))}</div>
          <div className="text-sm text-gray-500">{parcelas.length} parcelas · {parcelas.reduce((s, p) => s + p.superficie, 0).toFixed(1)} ha totales</div>
        </div>
      </div>
    </div>
  );
}

// ==================== SEGUIMIENTO TECNICO ====================

function SeguimientoPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Seguimiento Técnico</h1><p className="text-gray-500 mt-1">Análisis de suelo y datos meteorológicos</p></div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border"><h3 className="font-semibold mb-4">Previsión meteorológica (Orihuela)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={datosMeteo}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="fecha" stroke="#94a3b8" fontSize={12} /><YAxis stroke="#94a3b8" fontSize={12} /><Tooltip /><Legend />
            <Area type="monotone" dataKey="tempMax" name="T. Máx (°C)" stroke="#ef4444" fill="#ef444430" />
            <Area type="monotone" dataKey="tempMin" name="T. Mín (°C)" stroke="#3b82f6" fill="#3b82f630" />
            <Line type="monotone" dataKey="humedad" name="Humedad (%)" stroke="#16a34a" strokeDasharray="5 5" dot={false} />
            <Bar dataKey="lluvia" name="Lluvia (mm)" fill="#0ea5e980" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border"><h3 className="font-semibold mb-4">Análisis de suelo por parcela</h3>
        <div className="overflow-x-auto"><table className="w-full"><thead><tr className="bg-gray-50 text-left">{["Parcela", "pH", "Mat. Orgánica (%)", "N (%)", "P (ppm)", "K (ppm)", "CE (dS/m)", "Fecha"].map(h => (<th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>))}</tr></thead>
          <tbody>{analisisSuelo.map(a => (
            <tr key={a.parcela} className="border-t border-gray-50 hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-medium">{a.parcela}</td>
              <td className={`px-4 py-3 text-sm font-medium ${a.pH > 8.0 ? "text-red-600" : a.pH < 6.5 ? "text-yellow-600" : "text-green-600"}`}>{a.pH}</td>
              <td className={`px-4 py-3 text-sm ${a.materiaOrganica < 1.5 ? "text-red-600 font-semibold" : ""}`}>{a.materiaOrganica}</td>
              <td className="px-4 py-3 text-sm">{a.nitrogeno}</td><td className="px-4 py-3 text-sm">{a.fosforo}</td><td className="px-4 py-3 text-sm">{a.potasio}</td><td className="px-4 py-3 text-sm">{a.conductividad}</td><td className="px-4 py-3 text-sm text-gray-500">{a.fecha}</td>
            </tr>
          ))}</tbody></table></div>
        <div className="mt-4 flex gap-4 text-xs text-gray-500"><div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500" /> pH óptimo (6.5-8.0)</div><div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /> Valor fuera de rango</div></div>
      </div>
    </div>
  );
}

// ==================== FERTILIZANTES ====================

function FertilizantesPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Control de Fertilizantes</h1><p className="text-gray-500 mt-1">Seguimiento de aportes nitrogenados y zonas vulnerables</p></div>
      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={FlaskConical} label="Parcelas en zona vulnerable" value={zonasFertilizantes.filter(z => z.zonaVulnerable).length} color="#ef4444" sub={`de ${zonasFertilizantes.length} parcelas`} />
        <StatCard icon={Target} label="Límite N (zona vulnerable)" value="170 kg N/ha" color="#f59e0b" sub="Directiva Nitratos" />
        <StatCard icon={Activity} label="N medio aplicado" value={`${(zonasFertilizantes.reduce((s, z) => s + z.aplicadoN, 0) / zonasFertilizantes.length).toFixed(0)} kg/ha`} color="#16a34a" />
      </div>
      <div className="bg-white rounded-2xl p-5 shadow-sm border"><h3 className="font-semibold mb-4">Balance nitrogenado por parcela</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={zonasFertilizantes}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="parcela" stroke="#94a3b8" fontSize={12} /><YAxis stroke="#94a3b8" fontSize={12} domain={[0, 200]} /><Tooltip /><Legend />
            <Bar dataKey="aplicadoN" name="N aplicado (kg/ha)" fill="#16a34a" radius={[4, 4, 0, 0]} />
            <Bar dataKey="limiteN" name="Límite N (kg/ha)" fill="#ef444450" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white rounded-2xl p-5 shadow-sm border"><h3 className="font-semibold mb-4">Detalle por parcela</h3>
        <div className="space-y-3">{zonasFertilizantes.map(z => { const pct = (z.aplicadoN / z.limiteN) * 100; const danger = pct > 80; return (
          <div key={z.parcela} className={`p-4 rounded-xl border ${z.zonaVulnerable ? "bg-orange-50 border-orange-200" : "bg-gray-50 border-gray-200"}`}>
            <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-3"><h4 className="text-sm font-semibold">{z.parcela}</h4>{z.zonaVulnerable && <Badge color="orange">Zona vulnerable</Badge>}</div><span className={`text-sm font-bold ${danger ? "text-red-600" : "text-green-600"}`}>{z.aplicadoN}/{z.limiteN} kg N/ha</span></div>
            <div className="w-full h-3 bg-gray-200 rounded-full"><div className={`h-3 rounded-full transition-all ${pct > 85 ? "bg-red-500" : pct > 60 ? "bg-yellow-500" : "bg-green-500"}`} style={{ width: `${Math.min(pct, 100)}%` }} /></div>
            <p className="text-xs text-gray-500 mt-1">{pct.toFixed(0)}% del límite · Restante: {z.limiteN - z.aplicadoN} kg N/ha</p>
          </div>
        ); })}</div>
      </div>
    </div>
  );
}

// ==================== COSTES ====================

function CostesPage({ parcelas, intervenciones }) {
  const totalC = rentabilidadParcela.reduce((s, p) => s + p.costes, 0);
  const totalI = rentabilidadParcela.reduce((s, p) => s + p.ingresos, 0);
  const totalM = totalI - totalC;
  const costesPorTipo = intervenciones.reduce((acc, i) => { const e = acc.find(a => a.name === i.tipo); if (e) e.value += i.coste; else acc.push({ name: i.tipo, value: i.coste }); return acc; }, []);
  const pc = ["#ef4444", "#16a34a", "#0ea5e9", "#f59e0b", "#8b5cf6", "#ec4899"];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Costes y Rentabilidad</h1><p className="text-gray-500 mt-1">Análisis económico campaña 2025/2026</p></div>
      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={TrendingUp} label="Ingresos" value={`${(totalI / 1000).toFixed(1)}k €`} change={12.4} color="#16a34a" />
        <StatCard icon={Euro} label="Costes" value={`${(totalC / 1000).toFixed(1)}k €`} change={-3.1} color="#ef4444" />
        <StatCard icon={BarChart3} label="Margen bruto" value={`${(totalM / 1000).toFixed(1)}k €`} change={18.7} color="#8b5cf6" sub={`${((totalM / totalI) * 100).toFixed(1)}% margen`} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border"><h3 className="font-semibold mb-4">Rentabilidad por parcela</h3>
          <ResponsiveContainer width="100%" height={280}><BarChart data={rentabilidadParcela}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="parcela" stroke="#94a3b8" fontSize={11} /><YAxis stroke="#94a3b8" fontSize={11} tickFormatter={v => `${v / 1000}k`} /><Tooltip formatter={v => `${v.toLocaleString()} €`} /><Legend /><Bar dataKey="ingresos" name="Ingresos" fill="#16a34a" radius={[4, 4, 0, 0]} /><Bar dataKey="costes" name="Costes" fill="#ef4444" radius={[4, 4, 0, 0]} /><Bar dataKey="margen" name="Margen" fill="#8b5cf6" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border"><h3 className="font-semibold mb-4">Costes por tipo</h3>
          <ResponsiveContainer width="100%" height={220}><PieChart><Pie data={costesPorTipo} cx="50%" cy="50%" outerRadius={80} innerRadius={48} paddingAngle={3} dataKey="value">{costesPorTipo.map((_, i) => <Cell key={i} fill={pc[i % pc.length]} />)}</Pie><Tooltip formatter={v => `${v.toFixed(0)} €`} /></PieChart></ResponsiveContainer>
          <div className="space-y-1.5 mt-2">{costesPorTipo.map((c, i) => (<div key={c.name} className="flex items-center justify-between text-sm"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ background: pc[i % pc.length] }} /><span className="text-gray-600">{c.name}</span></div><span className="font-medium">{c.value.toFixed(0)} €</span></div>))}</div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-5 shadow-sm border"><h3 className="font-semibold mb-4">Coste por hectárea</h3>
        <div className="grid grid-cols-5 gap-4">{rentabilidadParcela.map(p => { const pa = parcelas.find(x => x.nombre.includes(p.parcela)); const ha = pa?.superficie || 1; return (
          <div key={p.parcela} className="bg-gray-50 rounded-xl p-4 text-center"><p className="text-sm font-medium">{p.parcela}</p><p className="text-2xl font-bold text-green-600 mt-2">{(p.costes / ha).toFixed(0)} €</p><p className="text-xs text-gray-400">por hectárea</p><p className={`mt-2 text-xs font-semibold ${p.margen > 0 ? "text-green-600" : "text-red-500"}`}>Margen: {(p.margen / ha).toFixed(0)} €/ha</p></div>
        ); })}</div>
      </div>
    </div>
  );
}

// ==================== CUMPLIMIENTO ====================

function CumplimientoPage({ parcelas, intervenciones }) {
  const reg = intervenciones.filter(i => i.estado === "completada").length;
  const tot = intervenciones.length;
  const fichas = parcelas.map(p => { const ints = intervenciones.filter(i => i.parcelaId === p.id); const comp = ints.filter(i => i.estado === "completada").length; return { ...p, ints: ints.length, comp, cumple: comp === ints.length }; });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold">Cumplimiento Normativo</h1><p className="text-gray-500 mt-1">Cuaderno Digital SIEX</p></div>
        <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700"><Download size={18} /> Exportar SIEX</button></div>
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={FileText} label="Registradas" value={`${reg}/${tot}`} color="#16a34a" sub={`${((reg / tot) * 100).toFixed(0)}%`} />
        <StatCard icon={ShieldCheck} label="Certificaciones" value="2" color="#0ea5e9" sub="GlobalGAP, Prod. Integrada" />
        <StatCard icon={AlertTriangle} label="Alertas" value={alertasSIEX.filter(a => a.tipo === "danger" || a.tipo === "warning").length} color="#f59e0b" />
        <StatCard icon={Calendar} label="Próx. inspección" value="15 Abr" color="#8b5cf6" />
      </div>
      <div className="bg-white rounded-2xl p-5 shadow-sm border"><h3 className="font-semibold mb-4">Estado por parcela</h3>
        <div className="space-y-3">{fichas.map(f => (
          <div key={f.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"><div className={`w-10 h-10 rounded-full flex items-center justify-center ${f.cumple ? "bg-green-100" : "bg-yellow-100"}`}>{f.cumple ? <Check size={20} className="text-green-600" /> : <Clock size={20} className="text-yellow-600" />}</div>
            <div className="flex-1"><p className="text-sm font-semibold">{f.nombre}</p><p className="text-xs text-gray-500">{f.cultivo} · {f.superficie} ha</p></div>
            <div className="text-right"><p className="text-sm font-medium">{f.comp}/{f.ints}</p><div className="w-32 h-2 bg-gray-200 rounded-full mt-1"><div className="h-2 bg-green-500 rounded-full" style={{ width: `${(f.comp / Math.max(f.ints, 1)) * 100}%` }} /></div></div>
            <Badge color={f.cumple ? "green" : "yellow"}>{f.cumple ? "Completo" : "Pendiente"}</Badge></div>
        ))}</div>
      </div>
      <div className="bg-white rounded-2xl p-5 shadow-sm border"><h3 className="font-semibold mb-4">Alertas regulatorias</h3>
        <div className="space-y-3">{alertasSIEX.map(a => (
          <div key={a.id} className={`flex items-start gap-3 p-4 rounded-xl border ${a.tipo === "danger" ? "bg-red-50 border-red-200" : a.tipo === "warning" ? "bg-yellow-50 border-yellow-200" : a.tipo === "success" ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"}`}>
            <AlertTriangle size={16} className={`mt-0.5 ${a.tipo === "danger" ? "text-red-500" : a.tipo === "warning" ? "text-yellow-500" : a.tipo === "success" ? "text-green-500" : "text-blue-500"}`} />
            <div className="flex-1"><p className="text-sm font-medium">{a.mensaje}</p><p className="text-xs text-gray-500 mt-1">{a.fecha} · {a.parcela}</p></div>
            <Badge color={a.tipo === "danger" ? "red" : a.tipo === "warning" ? "yellow" : a.tipo === "success" ? "green" : "blue"}>{a.tipo === "danger" ? "Urgente" : a.tipo === "warning" ? "Aviso" : a.tipo === "success" ? "OK" : "Info"}</Badge>
          </div>
        ))}</div>
      </div>
    </div>
  );
}

// ==================== CONVERSACIONES ====================

function ConversacionesPage() {
  const [convs, setConvs] = useState(initialConversaciones);
  const [sel, setSel] = useState(null);
  const [msg, setMsg] = useState("");
  const send = () => { if (!msg.trim() || !sel) return; const u = convs.map(c => c.id === sel.id ? { ...c, mensajes: [...c.mensajes, { id: Date.now(), autor: "David Miquel", fecha: "Ahora", texto: msg, avatar: "DM" }] } : c); setConvs(u); setSel(u.find(c => c.id === sel.id)); setMsg(""); };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Conversaciones</h1><p className="text-gray-500 mt-1">Comunicación centralizada con equipo y colaboradores</p></div>
      <div className="grid grid-cols-3 gap-4" style={{ height: "calc(100vh - 220px)" }}>
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden flex flex-col">
          <div className="p-4 border-b"><div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Buscar..." className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300" /></div></div>
          <div className="flex-1 overflow-y-auto">{convs.map(c => { const last = c.mensajes[c.mensajes.length - 1]; return (
            <div key={c.id} onClick={() => setSel(c)} className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${sel?.id === c.id ? "bg-green-50 border-l-4 border-l-green-500" : ""}`}>
              <div className="flex items-start justify-between"><h4 className="text-sm font-semibold line-clamp-1">{c.titulo}</h4><span className="text-xs text-gray-400 ml-2 whitespace-nowrap">{last.fecha.split(" ")[0]}</span></div>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{last.autor}: {last.texto}</p>
              <div className="flex items-center gap-1 mt-2"><Users size={12} className="text-gray-400" /><span className="text-xs text-gray-400">{c.participantes.length}</span></div>
            </div>
          ); })}</div>
        </div>
        <div className="col-span-2 bg-white rounded-2xl shadow-sm border overflow-hidden flex flex-col">
          {sel ? (<>
            <div className="p-4 border-b bg-gray-50"><h3 className="font-semibold">{sel.titulo}</h3><p className="text-xs text-gray-500 mt-1">{sel.participantes.join(", ")}</p></div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">{sel.mensajes.map(m => { const me = m.autor === "David Miquel"; return (
              <div key={m.id} className={`flex gap-3 ${me ? "flex-row-reverse" : ""}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${me ? "bg-green-600" : "bg-blue-500"}`}>{m.avatar}</div>
                <div className={`max-w-md ${me ? "text-right" : ""}`}><div className="flex items-center gap-2 mb-1"><span className="text-xs font-semibold text-gray-700">{m.autor}</span><span className="text-xs text-gray-400">{m.fecha}</span></div>
                  <div className={`p-3 rounded-2xl text-sm ${me ? "bg-green-600 text-white rounded-tr-sm" : "bg-gray-100 text-gray-800 rounded-tl-sm"}`}>{m.texto}</div></div>
              </div>
            ); })}</div>
            <div className="p-4 border-t"><div className="flex gap-3"><input type="text" value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Escribe un mensaje..." className="flex-1 px-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300" /><button onClick={send} className="bg-green-600 text-white p-2.5 rounded-xl hover:bg-green-700"><Send size={18} /></button></div></div>
          </>) : (<div className="flex-1 flex items-center justify-center text-gray-400"><div className="text-center"><MessageCircle size={48} className="mx-auto mb-3 opacity-30" /><p className="text-sm">Selecciona una conversación</p></div></div>)}
        </div>
      </div>
    </div>
  );
}

// ==================== MULTI-EXPLOTACION ====================

function MultiExplotacionPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Multi-Explotación</h1><p className="text-gray-500 mt-1">Gestión centralizada de varias PACs y explotaciones</p></div>
      <div className="grid grid-cols-2 gap-4">
        <StatCard icon={Building2} label="Explotaciones" value={explotaciones.length} color="#16a34a" />
        <StatCard icon={MapPin} label="Superficie total" value={`${explotaciones.reduce((s, e) => s + e.superficie, 0).toFixed(1)} ha`} color="#0ea5e9" />
      </div>
      <div className="space-y-4">{explotaciones.map(e => (
        <div key={e.id} className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4"><div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center"><Building2 size={28} className="text-green-600" /></div>
              <div><h3 className="text-lg font-bold">{e.nombre}</h3><p className="text-sm text-gray-500">Titular: {e.titular}</p></div></div>
            <Badge color="green">Activa</Badge>
          </div>
          <div className="grid grid-cols-4 gap-6 mt-5">
            <div><p className="text-xs text-gray-400 uppercase">PAC</p><p className="text-sm font-medium mt-1">{e.pac}</p></div>
            <div><p className="text-xs text-gray-400 uppercase">Superficie</p><p className="text-sm font-medium mt-1">{e.superficie} ha</p></div>
            <div><p className="text-xs text-gray-400 uppercase">Parcelas</p><p className="text-sm font-medium mt-1">{e.parcelas} parcelas</p></div>
            <div><p className="text-xs text-gray-400 uppercase">Cultivos</p><p className="text-sm font-medium mt-1">{e.cultivos || "-"}</p></div>
          </div>
        </div>
      ))}</div>
    </div>
  );
}

// ==================== MULTI-USUARIO ====================

function MultiUsuarioPage() {
  const permisoLabels = { todo: "Acceso total", parcelas: "Parcelas", intervenciones: "Intervenciones", partes: "Partes trabajo", stock: "Stock", costes_lectura: "Costes (lectura)", informes: "Informes", intervenciones_lectura: "Intervenciones (lectura)" };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold">Usuarios y Permisos</h1><p className="text-gray-500 mt-1">Gestiona quién accede y qué puede hacer</p></div>
        <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700"><Plus size={18} /> Invitar usuario</button></div>
      <div className="space-y-3">{usuarios.map(u => (
        <div key={u.id} className="bg-white rounded-2xl p-5 shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4"><div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${u.rol === "Administrador" ? "bg-green-600" : u.rol === "Capataz" ? "bg-blue-500" : u.rol === "Operario" ? "bg-purple-500" : "bg-gray-500"}`}>{u.nombre.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
              <div><h3 className="font-semibold">{u.nombre}</h3><p className="text-sm text-gray-500">{u.email}</p></div></div>
            <div className="flex items-center gap-4">
              <div className="text-right"><Badge color={u.rol === "Administrador" ? "green" : u.rol === "Capataz" ? "blue" : u.rol === "Operario" ? "purple" : "gray"}>{u.rol}</Badge><p className="text-xs text-gray-400 mt-1">Último: {u.ultimoAcceso}</p></div>
              <div className={`w-3 h-3 rounded-full ${u.activo ? "bg-green-500" : "bg-gray-300"}`} />
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">{u.permisos.map(p => (<span key={p} className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-600">{permisoLabels[p] || p}</span>))}</div>
        </div>
      ))}</div>
    </div>
  );
}

// ==================== MAIN APP ====================

export default function AgroSinergia() {
  const [page, setPage] = useState("dashboard");
  const [parcelas, setParcelas] = useState(initialParcelas);
  const [intervenciones, setIntervenciones] = useState(initialIntervenciones);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const sections = [
    { label: "PRINCIPAL", items: [
      { id: "dashboard", icon: BarChart3, label: "Dashboard" },
      { id: "parcelas", icon: MapPin, label: "Parcelas y Cultivos" },
      { id: "cartografia", icon: Globe, label: "Cartografía" },
    ]},
    { label: "OPERACIONES", items: [
      { id: "intervenciones", icon: ClipboardList, label: "Intervenciones", badge: intervenciones.filter(i => i.estado === "pendiente").length || null },
      { id: "partes", icon: Zap, label: "Partes de Trabajo", badge: initialPartesTrabajo.filter(p => p.estado === "pendiente").length || null },
      { id: "vademecum", icon: BookOpen, label: "Vademecum" },
    ]},
    { label: "INVENTARIO", items: [
      { id: "stock", icon: Package, label: "Control de Stock", badge: initialStock.filter(s => s.cantidad <= s.minimo).length || null },
      { id: "maquinaria", icon: Tractor, label: "Maquinaria" },
    ]},
    { label: "ANÁLISIS", items: [
      { id: "costes", icon: Euro, label: "Costes y Rentabilidad" },
      { id: "seguimiento", icon: Thermometer, label: "Seguimiento Técnico" },
      { id: "fertilizantes", icon: FlaskConical, label: "Control Fertilizantes" },
    ]},
    { label: "NORMATIVA", items: [
      { id: "cumplimiento", icon: ShieldCheck, label: "Cumplimiento SIEX" },
    ]},
    { label: "COMUNICACIÓN", items: [
      { id: "conversaciones", icon: MessageCircle, label: "Conversaciones", badge: 3 },
    ]},
    { label: "ADMINISTRACIÓN", items: [
      { id: "explotaciones", icon: Building2, label: "Explotaciones" },
      { id: "usuarios", icon: UserCog, label: "Usuarios y Permisos" },
    ]},
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-3"><div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center"><Leaf size={22} className="text-white" /></div>
            <div><h1 className="text-lg font-bold text-gray-900">AgroSinergia</h1><p className="text-xs text-gray-500">Fruitum · Fruchesco</p></div></div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-4">
          {sections.map(s => (
            <div key={s.label}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-1.5">{s.label}</p>
              <div className="space-y-0.5">{s.items.map(item => (<NavItem key={item.id} icon={item.icon} label={item.label} badge={item.badge} active={page === item.id} onClick={() => setPage(item.id)} />))}</div>
            </div>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2.5 bg-green-50 rounded-xl"><div className="w-9 h-9 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">DM</div>
            <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">David Miquel</p><p className="text-xs text-gray-500 truncate">Somos Sinergia</p></div>
          </div>
          <div className="flex items-center gap-2 mt-2 px-3 text-xs text-green-600"><Wifi size={12} /><span>Online · Sincronizado</span></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {page === "dashboard" && <DashboardPage parcelas={parcelas} intervenciones={intervenciones} />}
          {page === "parcelas" && <ParcelasPage parcelas={parcelas} setParcelas={setParcelas} />}
          {page === "cartografia" && <CartografiaPage parcelas={parcelas} />}
          {page === "intervenciones" && <IntervencionesPage intervenciones={intervenciones} setIntervenciones={setIntervenciones} parcelas={parcelas} />}
          {page === "partes" && <PartesTrabajoPage parcelas={parcelas} />}
          {page === "vademecum" && <VademecumPage />}
          {page === "stock" && <StockPage />}
          {page === "maquinaria" && <MaquinariaPage />}
          {page === "costes" && <CostesPage parcelas={parcelas} intervenciones={intervenciones} />}
          {page === "seguimiento" && <SeguimientoPage />}
          {page === "fertilizantes" && <FertilizantesPage />}
          {page === "cumplimiento" && <CumplimientoPage parcelas={parcelas} intervenciones={intervenciones} />}
          {page === "conversaciones" && <ConversacionesPage />}
          {page === "explotaciones" && <MultiExplotacionPage />}
          {page === "usuarios" && <MultiUsuarioPage />}
        </div>
      </div>
    </div>
  );
}
