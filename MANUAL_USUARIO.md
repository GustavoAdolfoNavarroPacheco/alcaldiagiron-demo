# Manual de Uso — Portal Unificado de Trámites, Alcaldía de Girón

## Antes de comenzar: esto es una demostración

Lo que va a usar es una **demostración funcional** de la futura plataforma de trámites de la Alcaldía de San Juan de Girón. Antes de navegarla, tenga en cuenta:

- **Es una vista previa, no el sistema definitivo.** Se construyó para mostrar cómo se sentirá y funcionará la plataforma, con datos de ejemplo.
- **Los datos no son reales.** La información que usted vea (deudores, trámites, radicados) es de prueba y se guarda únicamente en su propio navegador — no se envía a ninguna entidad ni queda registrada oficialmente.
- **El "Portal Ciudadano" y el "Panel Administrativo" conviven en una misma demo.** En la versión final serán dos accesos completamente separados e independientes, cada uno con su propia seguridad.
- **El ingreso como administrador está simulado.** El botón *"Iniciar sesión"* no pide usuario ni contraseña — es solo para que usted pueda explorar cómo se vería la vista de un funcionario. En el sistema real, ese acceso requerirá autenticación institucional.
- **Algunas funciones muestran comportamientos automáticos de ejemplo** (como la llegada de nuevos expedientes de cartera cada pocos segundos en el módulo de Cobro Coactivo). Esto representa, de forma simulada, futuras integraciones con otras entidades — en la práctica esos datos serán reales y no aparecerán "solos".
- **Si algo se ve incompleto o simplificado**, es intencional: esta fase muestra el flujo y la experiencia, no el alcance final del proyecto.

Si borra los datos de su navegador (o usa el botón de reinicio de la demo), la información volverá a su estado inicial de ejemplo.

---

## 1. ¿Cómo se organiza la plataforma?

Al entrar, usted llega directamente al **Portal Ciudadano**, el espacio público pensado para cualquier persona que necesite radicar o consultar un trámite ante la Alcaldía.

Desde ese portal, en la esquina superior derecha, hay un botón **"Iniciar sesión"** que lleva al **Panel Administrativo**, pensado para los funcionarios que gestionan esos trámites. En esta demo cualquier persona puede entrar allí sin restricciones, solo para fines de exhibición.

- **Portal Ciudadano** — público, sin usuario ni contraseña.
- Desde allí, el botón **"Iniciar sesión"** (simulado, sin validación real) lleva al...
- **Panel Administrativo** — uso interno de funcionarios.

Para volver del panel administrativo al portal ciudadano, hay un botón **"Vista Ciudadano"** en la parte superior del panel.

---

## 2. Portal Ciudadano

### 2.1 Inicio

Página de bienvenida con accesos directos a las tres acciones principales: radicar una solicitud, consultar el estado de una ya radicada, y ver el listado de secretarías del municipio.

### 2.2 Radicar una PQRS

*Menú lateral: "Radicar PQRS"*

Aquí puede presentar una **Petición, Queja, Reclamo, Sugerencia o Denuncia** ante la Alcaldía. Pasos a seguir:

1. **Elija el tipo de solicitud** (Petición, Queja, Reclamo, Sugerencia o Denuncia). Cada una tiene una breve explicación en pantalla para ayudarle a escoger la correcta.
2. **Seleccione la dependencia** a la que va dirigida (por ejemplo, Secretaría de Salud, Hacienda, Tránsito, etc.).
3. **Escriba el asunto** de su solicitud.
4. **Indique si radica de forma registrada o anónima.** Si elige radicar de forma registrada, deberá diligenciar sus datos (nombre, documento, correo, teléfono, dirección).
5. **Adjunte un archivo** si lo necesita (opcional).
6. **Autorice el tratamiento de datos personales**, marcando la casilla correspondiente.
7. **Resuelva el código de seguridad (captcha)** que aparece en pantalla, escribiéndolo en el campo indicado. Puede generar un código nuevo si no logra leerlo.
8. **Envíe el formulario.**

Al radicar exitosamente, el sistema le entrega un **número de radicado** (por ejemplo `PQRS-2026-000123`) y le indica la **fecha límite legal de respuesta** (15 días hábiles para la mayoría de solicitudes, 30 días para denuncias, según la Ley 1755 de 2015). Guarde ese número: lo necesitará para consultar el estado de su trámite más adelante.

### 2.3 Consultar el estado de un trámite

*Menú lateral: "Consultar Estado"*

Permita verificar en qué va su solicitud. Solo debe ingresar **el número de radicado o su número de documento de identidad** con el que radicó, y el sistema mostrará:

- El estado actual (en proceso, resuelta o vencida).
- La fecha límite de respuesta y si el trámite va a tiempo o está retrasado (indicado con un color: verde a tiempo, amarillo dentro del plazo, rojo vencido, azul respondido fuera de plazo).
- La respuesta oficial, si ya fue emitida.

### 2.4 Consultar las secretarías del municipio

*Menú lateral: "Secretarías"*

Muestra el listado de las **11 secretarías** de la Alcaldía de Girón (Salud, Hacienda, Tránsito y Transporte, Ordenamiento Territorial, Seguridad, Desarrollo Social, Gobierno, Educación, Infraestructura, Planeación, y Cultura/Turismo/Deporte). Al seleccionar una, encontrará una ficha con su descripción, canales de contacto (correo, teléfono, ubicación) y los servicios que presta.

---

## 3. Panel Administrativo (uso interno)

Pensado para el personal de la Alcaldía que gestiona los trámites ciudadanos. Se accede desde el botón *"Iniciar sesión"* del Portal Ciudadano (recuerde: en esta demo el acceso no pide credenciales).

### 3.1 Resumen General

Página de entrada del panel. Presenta un tablero con los indicadores más importantes de la gestión municipal:

- Presupuesto asignado y ejecutado, con el porcentaje de ejecución.
- Total de trámites recibidos y cuántos están actualmente en curso.
- Una gráfica que distribuye la gestión por secretaría.
- Una tabla con el resumen de cada secretaría, que se puede filtrar por rango de fechas.

### 3.2 Cobro Coactivo

Módulo donde el funcionario gestiona la cartera morosa del municipio (deudas de impuestos, comparendos, etc.). Permite:

- Ver el listado completo de deudores, con un **semáforo de color** según el monto adeudado (rojo = mayor cuantía, hasta verde = menor cuantía).
- **Buscar** un deudor por nombre o documento.
- **Filtrar** por nivel de urgencia o por estado del proceso de cobro.
- **Ordenar** el listado (mayor deuda, menor deuda, orden alfabético).
- Abrir el detalle de un expediente para ver los predios asociados y el historial de oficios enviados.

*Nota:* en esta demo, el listado recibe nuevos expedientes de ejemplo automáticamente cada pocos segundos, simulando la futura llegada de información desde otras entidades (Predial, tránsito, etc.).

### 3.3 Ventanilla Única (PQRS)

Es la bandeja donde el funcionario ve **todas** las solicitudes ciudadanas radicadas, tanto las que llegaron por el Portal Ciudadano como las que un funcionario radica manualmente por correspondencia física recibida en la entidad. Cada solicitud muestra su semáforo de cumplimiento de plazo, y desde aquí se puede dar respuesta o cambiar su estado.

### 3.4 Secretarías (vista administrativa)

Directorio y tablero de indicadores por cada una de las 11 secretarías, con datos de presupuesto y trámites propios de cada dependencia — la versión "interna" de lo que el ciudadano ve de forma simplificada en su propio portal.

---

## 4. Preguntas frecuentes

**¿Necesito una cuenta para radicar una PQRS?**
No. Puede radicar de forma anónima o registrada, sin necesidad de crear una cuenta.

**¿Mis datos quedan guardados de forma oficial?**
No en esta demo. Todo lo que usted registre se guarda solo en su navegador, como ejemplo de funcionamiento — no llega a ningún sistema de la Alcaldía.

**¿Por qué puedo entrar al Panel Administrativo sin contraseña?**
Porque en esta fase de demostración esa validación está simulada, para que cualquier evaluador pueda recorrer ambas experiencias (ciudadano y funcionario) sin restricciones. En el sistema definitivo, ese acceso será exclusivo y protegido.

**¿Puedo dañar algo si hago pruebas?**
No. Como no hay una base de datos real detrás, puede explorar, radicar solicitudes de prueba y navegar libremente sin ningún riesgo.
