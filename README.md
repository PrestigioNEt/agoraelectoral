# Agora Electoral PWA SaaS

¡Bienvenido al repositorio de Agora Electoral! Este proyecto es una Aplicación Web Progresiva (PWA) diseñada como Software como Servicio (SaaS) para la gestión y análisis de procesos electorales. Su objetivo principal es proporcionar herramientas robustas para la administración de candidatos, votantes, votos y la visualización avanzada de resultados.

## Características Principales

-   **Gestión de Usuarios y Roles:** Sistema de autenticación completo con roles (`admin`, `candidato`, `votante`) para controlar el acceso a diferentes funcionalidades.
-   **Administración de Candidatos y Votantes:** Interfaces dedicadas para el registro, edición y listado de candidatos y votantes.
-   **Registro de Votos:** Funcionalidad para el ingreso y seguimiento de votos.
-   **Visualización de Datos Avanzada:** Múltiples dashboards para analizar resultados electorales por región, municipio, cargo, y votantes.
-   **Notificaciones y Logs:** Gestión y visualización de notificaciones y registros del sistema.
-   **Integración de Mapas:** Visualización de datos geoespaciales con marcadores interactivos.
-   **Despliegue Continuo:** Configuración para despliegues automatizados en Netlify.

## Arquitectura

El proyecto sigue una arquitectura de microservicios, dividiendo la aplicación en componentes frontend y backend desacoplados:

-   **Frontend:** Desarrollado con **React** y **TypeScript**, proporcionando una interfaz de usuario dinámica y reactiva. Utiliza **Vite** para un entorno de desarrollo rápido y un proceso de construcción optimizado.
-   **Backend:** Se basa en **Supabase** para la gestión de la base de datos (PostgreSQL), autenticación y APIs en tiempo real. Los servicios específicos del backend (como `auth-service`, `maps-service`, `crm-service`, etc.) están orquestados con **Docker Compose**.

## Tecnologías Utilizadas

-   **Frontend:**
    -   React
    -   TypeScript
    -   Vite
    -   React Router DOM
    -   React Leaflet (para mapas)
    -   Recharts (para gráficos en dashboards)
    -   Papaparse (para manejo de CSV)
    -   html2canvas, jspdf (para exportación de contenido)
-   **Backend/Base de Datos:**
    -   Supabase (PostgreSQL, Auth, Realtime)
    -   Node.js (para microservicios)
    -   Express.js (para APIs REST)
    -   Redis (para caché y otras funcionalidades)
-   **Testing:**
    -   Vitest
    -   React Testing Library
-   **CI/CD:**
    -   GitHub Actions
    -   Netlify

## Configuración y Ejecución Local

Sigue estos pasos para tener el proyecto funcionando en tu máquina local.

### 1. Clonar el Repositorio

```bash
git clone https://github.com/PrestigioNEt/agoraelectoral.git
cd agoraelectoral
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con tus credenciales de Supabase. Puedes usar el archivo `.env.example` como plantilla (si existe, o simplemente crea uno nuevo).

```
# .env
REACT_APP_SUPABASE_URL=https://[tu-proyecto-id].supabase.co
REACT_APP_SUPABASE_ANON_KEY=tu-anon-key-publica
```

**Importante:** Asegúrate de que estas variables coincidan con las de tu proyecto Supabase. Para el desarrollo local, no es necesario que sean secretos de GitHub, pero para el despliegue en Netlify, sí lo son (ya configurado en GitHub Secrets).

### 4. Configuración de Supabase (Manual)

Si aún no lo has hecho, configura tu base de datos Supabase con la tabla `profiles` y el trigger para roles, como se describe en la sección de análisis del proyecto.

### 5. Ejecutar el Servidor de Desarrollo

```bash
npm run dev
```

Esto iniciará el servidor de desarrollo de Vite, y tu aplicación estará disponible en `http://localhost:5173` (o el puerto que Vite asigne).

## Ejecutar Pruebas

Para ejecutar las pruebas unitarias y de componente:

```bash
npm test
# O para ver la interfaz de usuario de Vitest:
npm run test:ui
```

## Despliegue en Netlify

Este proyecto está configurado para despliegue continuo en Netlify. El archivo `netlify.toml` en la raíz del proyecto define los comandos de construcción y el directorio de publicación.

Para desplegar:

1.  Conecta tu repositorio de GitHub (`https://github.com/PrestigioNEt/agoraelectoral`) a Netlify.
2.  Netlify detectará automáticamente el `netlify.toml`.
3.  Asegúrate de haber configurado las variables de entorno `REACT_APP_SUPABASE_URL` y `REACT_APP_SUPABASE_ANON_KEY` como **Repository Secrets** en GitHub (Settings -> Secrets and variables -> Actions).
4.  Inicia el despliegue desde el panel de Netlify.

## Roadmap y Mejoras Futuras

Aquí hay algunas áreas clave para futuras mejoras y expansiones:

-   **Mejoras de UX:** Implementar feedback visual (toasts, spinners de carga), y refinar el diseño general de la interfaz de usuario.
-   **Módulo CRM:** Desarrollar la interfaz de usuario y la lógica completa para el `crm-service` planificado.
-   **Actualizaciones en Tiempo Real:** Utilizar las capacidades de Realtime de Supabase para que los dashboards y listas se actualicen instantáneamente.
-   **Cobertura de Pruebas:** Ampliar la suite de pruebas para cubrir más funcionalidades y componentes críticos.
-   **Manejo de Errores:** Implementar `Error Boundaries` en React para una gestión de errores más robusta en la UI.
-   **Optimización de Rendimiento:** Analizar y optimizar el rendimiento de la aplicación, especialmente en los dashboards con grandes volúmenes de datos.

## Contribuciones

¡Las contribuciones son bienvenidas! Si deseas contribuir, por favor, abre un issue para discutir los cambios propuestos o envía un Pull Request.

## Licencia

Este proyecto está bajo la licencia ISC. Consulta el archivo `LICENSE` para más detalles.
