# Agora Electoral PWA SaaS 🧠

¡Bienvenido al repositorio de Agora Electoral! Este proyecto es una Aplicación Web Progresiva (PWA) diseñada como Software como Servicio (SaaS) para la gestión y análisis de procesos electorales.

## Arquitectura

El proyecto está estructurado como un **monorepo** utilizando **npm workspaces**, lo que permite gestionar de forma centralizada el `frontend` y los `services` de backend.

-   **Frontend:** Una aplicación React con TypeScript y Vite.
-   **Backend:** Un conjunto de microservicios en Node.js (`auth-service`, `crm-service`, etc.), orquestados con Docker Compose.
-   **Base de Datos:** Supabase (PostgreSQL, Auth, Realtime).
-   **CI/CD:** GitHub Actions para la integración continua.

## Configuración y Ejecución Local

### Prerrequisitos

-   Node.js (v18 o superior)
-   npm (v8 o superior)
-   Docker y Docker Compose

### 1. Clonar el Repositorio

```bash
git clone https://github.com/PrestigioNEt/agoraelectoral.git
cd agoraelectoral
```

### 2. Instalar Dependencias

El proyecto utiliza npm workspaces. Instala todas las dependencias desde la raíz:

```bash
npm install
```

### 3. Configurar Variables de Entorno

El frontend necesita credenciales de Supabase para funcionar. Crea un archivo `.env` en la carpeta `frontend`.

```
# frontend/.env
VITE_SUPABASE_URL=https://[tu-proyecto-id].supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-publica
```

**Importante:** Para el despliegue, estas variables deben configurarse como secretos en el repositorio de GitHub (`VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`).

### 4. Ejecutar el Entorno de Desarrollo

El proyecto utiliza Docker Compose para orquestar los servicios de backend y el frontend.

```bash
npm start
```

Esto levantará todos los servicios. El frontend estará disponible en `http://localhost:5173`.

## Comandos Útiles

-   `npm start`: Levanta todos los servicios con Docker Compose.
-   `npm run dev`: Alias para `npm start`.
-   `npm run build`: Construye las imágenes de Docker para producción.
-   `npm run down`: Detiene y elimina los contenedores.
-   `npm run lint`: Ejecuta ESLint para analizar el código en busca de errores y problemas de estilo.
-   `npm test`: Ejecuta las pruebas para todos los workspaces.

## Despliegue

El frontend se despliega automáticamente en GitHub Pages en cada push a la rama `main`. La configuración se encuentra en `.github/workflows/ci.yml`.

Actualmente, no hay un flujo de despliegue automatizado para los servicios de backend.

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue para discutir los cambios propuestos o envía un Pull Request.