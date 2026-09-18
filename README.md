# Alcaldía de Girón (demo)

Demo funcional del frontend de la plataforma unificada de gestión
municipal de la **Alcaldía de Girón**. SPA construida con React 18 + TypeScript
+ Vite + Tailwind CSS + React Router, con una "base de datos" simulada en
`localStorage` (CRUD funcional, sin backend).

## Rutas

- `/` — portada de acceso.
- `/ciudadano` — panel público: radicación de PQRS y consulta de estado.
- `/admin` — panel de funcionarios: resumen, cobro coactivo y ventanilla única.

Ambos paneles leen y escriben sobre los mismos datos (`src/data/mockData.json`
sembrado en `localStorage` la primera vez).

## Estructura

```
src/
  components/       componentes compartidos (escudo, sello de radicado, badges de semáforo)
  data/             mockData.json, capa de storage (localStorage) y formateo
  pages/
    ciudadano/      radicación de PQRS y consulta de estado
    admin/          resumen, cobro coactivo (semáforo de cuantía) y ventanilla única (auditoría de tiempos)
  types/            modelos de dominio (Deudor, PQRS) y reglas de semáforo
```

## Desarrollo

```bash
npm install
npm run dev
```

Para reiniciar los datos de la demo, borre las claves `gidi.deudores` y
`gidi.pqrs` del localStorage del navegador.
