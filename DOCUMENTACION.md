# Documentación Técnica — Plataforma Unificada de Gestión Municipal (Alcaldía de Girón)

> **AVISO — Naturaleza del proyecto: DEMO.**
> Este repositorio es una **demostración funcional de frontend**, construida para mostrar el flujo y la experiencia de usuario de la futura plataforma municipal. **No** es el sistema final. En esta fase:
> - El **Portal Ciudadano** y el **Panel Administrativo** están **unidos en una sola aplicación** y comparten la misma base de datos simulada — en el producto final serán dos productos separados, con autenticación, roles y bases de datos independientes.
> - El **acceso de Administrador está simulado**: cualquier persona puede entrar sin usuario ni contraseña, únicamente para fines de demostración.
> - No existe backend ni base de datos real: toda la información se guarda en el `localStorage` del navegador.
> - Varios flujos (radicación, cobro coactivo, ventanilla única) están completos como *demo* de interacción, pero **serán ampliados y conectados a sistemas reales** (bases de datos, autenticación institucional, firma electrónica, notificaciones, interoperabilidad con entidades externas) en el desarrollo final.

---

## 1. Resumen

Aplicación **SPA (Single Page Application)** que simula la plataforma unificada de gestión municipal de la Alcaldía de San Juan de Girón (Santander, Colombia). Permite a un ciudadano radicar y consultar PQRS (Peticiones, Quejas, Reclamos, Sugerencias, Denuncias), y a un funcionario administrar esos trámites, gestionar cobro coactivo y visualizar indicadores por secretaría.

## 2. Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Framework UI | React 18 + TypeScript |
| Enrutamiento | React Router DOM v6 |
| Build / Dev server | Vite 5 |
| Estilos | Tailwind CSS |
| Persistencia | `localStorage` del navegador (sin backend) |
| Linting | ESLint + `@typescript-eslint` |

No hay servidor, API REST ni base de datos real. Toda la "base de datos" es el archivo semilla [`src/data/mockData.json`](src/data/mockData.json), que se copia a `localStorage` la primera vez que se abre la aplicación.

## 3. Cómo ejecutar el proyecto

```bash
npm install
npm run dev
```

Otros comandos:
- `npm run build` — compila TypeScript y genera el build de producción con Vite.
- `npm run preview` — sirve el build de producción localmente.
- `npm run lint` — corre ESLint sobre el proyecto.

Para reiniciar los datos de la demo a su estado inicial, se debe borrar del `localStorage` del navegador las claves `gidi.deudores`, `gidi.pqrs` y `gidi.secretarias_tramites` (o llamar a `resetDemoData()` desde consola, expuesta en [`src/data/storage.ts`](src/data/storage.ts)).

## 4. Arquitectura y estructura de carpetas

```
src/
  App.tsx                  Definición de rutas raíz (React Router)
  main.tsx                 Punto de entrada de la aplicación
  components/              Componentes compartidos (escudo, sello de radicado, captcha, badges de semáforo, login admin)
  components/admin/        Componentes exclusivos del panel administrativo (gráficas, tablas, filtros)
  data/                    mockData.json (semilla), capa de storage (localStorage), datos de secretarías y formateo
  pages/ciudadano/         Vistas del Portal Ciudadano
  pages/admin/              Vistas del Panel Administrativo
  types/                   Modelos de dominio (Deudor, PQRS, Trámite) y reglas de negocio (semáforos, auditoría de plazos)
```

### 4.1 Enrutamiento (`src/App.tsx`)

La ruta raíz `/` redirige automáticamente a `/ciudadano`. Esto refleja que, en esta demo, **ambos paneles conviven en una sola aplicación**: no hay una landing separada — se entra directo al portal ciudadano y desde allí se accede al panel administrativo mediante el botón *"Iniciar sesión"*.

| Ruta | Vista | Descripción |
|---|---|---|
| `/` | — | Redirige a `/ciudadano` |
| `/ciudadano` | `CiudadanoInicio` | Página de inicio del portal público |
| `/ciudadano/radicar` | `RadicarPQRS` | Formulario de radicación de PQRS |
| `/ciudadano/consultar` | `ConsultarEstado` | Consulta del estado de un radicado |
| `/ciudadano/secretaria/:slug` | `SecretariaDetalle` | Ficha pública de cada una de las 11 secretarías |
| `/admin` | `AdminResumen` | Resumen ejecutivo municipal (KPIs, gráficas) |
| `/admin/cobro-coactivo` | `CobroCoactivo` | Gestión de deudores y cartera morosa |
| `/admin/ventanilla-unica` | `VentanillaUnica` | Bandeja de PQRS y radicación interna de correspondencia |
| `/admin/secretarias` | `SecretariasIndex` | Directorio de las 11 secretarías |
| `/admin/secretarias/:slug` | `SecretariaDashboard` | Tablero de indicadores por secretaría |

### 4.2 Capa de datos y persistencia (`src/data/storage.ts`)

No hay backend: esta capa reemplaza a una API real.

- **`load()` / `save()`**: leen y escriben en `localStorage`, con *fallback* en memoria si `localStorage` no está disponible (SSR/testing). Cada `save()` emite un evento global `gidi-storage-change` para que todas las vistas abiertas se actualicen en vivo sin recargar la página.
- **Entidades gestionadas**:
  - `deudores` (`gidi.deudores`) — cartera de Cobro Coactivo.
  - `pqrs` (`gidi.pqrs`) — Peticiones, Quejas, Reclamos, Sugerencias y Denuncias.
  - `secretariasTramites` (`gidi.secretarias_tramites`) — trámites propios de cada una de las 11 secretarías.
- **Simulación de interoperabilidad**: `ingestarProximoDeudor()` simula la llegada periódica de nuevos expedientes de cartera desde fuentes externas (Predial, SIMIT, ICA, Inspección de Policía, Gestión del Riesgo) — en la demo, el panel `CobroCoactivo` invoca esta función automáticamente cada 10 segundos para representar una futura integración por interoperabilidad con esas entidades.
- **`resetDemoData()`**: limpia el `localStorage` para reiniciar la demo desde cero.

### 4.3 Modelos de dominio (`src/types/index.ts`)

- **`Deudor`**: expediente de cartera (capital, intereses, predios asociados, historial de oficios). La función `nivelUrgenciaDeudor()` calcula un **semáforo de cuantía** (`rojo` desde $20M, `naranja` desde $10M, `amarillo` desde $3M, `verde` por debajo de $3M) que se usa en toda la UI de Cobro Coactivo.
- **`PQRS`**: solicitud ciudadana (tipo, dependencia, solicitante, plazos, estado). La función `auditoriaPQRS()` calcula un **semáforo de cumplimiento de plazo** (`verde`/`azul` si se respondió a tiempo/tarde, `amarillo` si está dentro del plazo, `rojo` si está vencida), conforme a los términos de la Ley 1755 de 2015. También admite metadatos de radicación interna (correspondencia física recibida por un funcionario: mensajero, folios, anexos, etc.).

## 5. Portal Ciudadano (`/ciudadano`)

Panel público, sin autenticación real, orientado al ciudadano.

- **Inicio** (`CiudadanoInicio`): accesos directos a radicación, consulta y directorio de secretarías.
- **Radicar PQRS** (`RadicarPQRS`): formulario completo con selección de tipo de solicitud (Petición/Queja/Reclamo/Sugerencia/Denuncia), dependencia destino, datos del solicitante (o radicación anónima), adjuntos, autorización de tratamiento de datos y **captcha de seguridad simulado** (componente [`CaptchaSeguridad.tsx`](src/components/CaptchaSeguridad.tsx)). Al radicar, genera un número consecutivo (`PQRS-AAAA-000001`) y un plazo legal de respuesta (15 días para Petición/Queja/Reclamo/Sugerencia, 30 días para Denuncia), materializado como un "sello de radicado" (`SelloRadicado.tsx`).
- **Consultar Estado** (`ConsultarEstado`): búsqueda por número de radicado o documento de identidad, sobre PQRS y trámites de secretaría (`findExpedienteCiudadano()`).
- **Secretarías** (`SecretariaDetalle` y vistas específicas en `pages/ciudadano/secretarias/`): ficha informativa de cada una de las 11 secretarías del municipio (Salud, Hacienda, Tránsito y Transporte, Ordenamiento Territorial, Seguridad, Desarrollo Social, Gobierno, Educación, Infraestructura, Planeación, Cultura/Turismo/Deporte).

## 6. Panel Administrativo (`/admin`)

Panel interno para funcionarios. **En esta demo el ingreso no requiere autenticación real** (ver [`AdminLoginModal.tsx`](src/components/AdminLoginModal.tsx), que simula una validación de sesión y redirige directo). Ambos paneles comparten los mismos datos y navegador.

- **Resumen General** (`AdminResumen`): KPIs consolidados (presupuesto asignado/ejecutado, % de ejecución, total de trámites, trámites en curso), gráfica de dona por secretaría y tabla ejecutiva, con filtro de rango de fechas.
- **Cobro Coactivo** (`CobroCoactivo`): listado de deudores con semáforo de cuantía, filtros por búsqueda/urgencia/estado de proceso, ordenamiento, y detalle de cada expediente (predios, historial de oficios). Incluye la simulación de ingesta automática de nuevos expedientes cada 10 segundos, representando la futura interoperabilidad con fuentes externas de cartera municipal.
- **Ventanilla Única** (`VentanillaUnica`): bandeja de todas las PQRS radicadas (portal digital o radicación interna por un funcionario), con semáforo de auditoría de plazos y capacidad de radicar correspondencia física recibida manualmente.
- **Secretarías** (`SecretariasIndex` / `SecretariaDashboard`): directorio administrativo y tablero de indicadores (presupuesto, trámites) por cada una de las 11 secretarías, con datos definidos en [`src/data/secretariasData.ts`](src/data/secretariasData.ts).

## 7. Componentes compartidos clave

| Componente | Función |
|---|---|
| `Escudo.tsx` | Escudo/identidad institucional del municipio |
| `SelloRadicado.tsx` | Comprobante visual de radicación (número, fecha, plazo) |
| `SemaforoBadge.tsx` | Insignias de color para niveles de urgencia/auditoría |
| `CaptchaSeguridad.tsx` | Captcha simulado para el formulario de radicación |
| `AdminLoginModal.tsx` | Modal de acceso simulado al panel administrativo |
| `CustomSelect.tsx` | Select estilizado reutilizable |
| `components/admin/*` | Gráficas de dona, filtros de fecha y tablas resumen del panel administrativo |

## 8. Alcance y limitaciones de la demo

Lo que **sí** cubre esta demo:
- Flujo completo de radicación, consulta y auditoría de PQRS.
- Simulación de gestión de cartera (Cobro Coactivo) con semáforo de cuantía.
- Indicadores agregados por secretaría y a nivel municipal.
- Navegación unificada entre el portal público y el panel administrativo.

Lo que **no** está implementado (pendiente para el desarrollo final):
- Backend, base de datos real y API.
- Autenticación y autorización reales (roles de funcionario, contraseñas, MFA).
- Separación real entre el Portal Ciudadano y el Panel Administrativo como productos/dominios independientes.
- Firma electrónica, notificaciones (correo/SMS) y trazabilidad legal certificada.
- Interoperabilidad real con fuentes externas (Predial, SIMIT, ICA, EPS/IPS, SIVIGILA, etc.) — actualmente simulada.
- Persistencia centralizada (hoy los datos viven únicamente en el `localStorage` de cada navegador).
