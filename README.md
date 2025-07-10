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

-   Node.js (v20.19.0 o superior, especificado en `.nvmrc`)
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

Los servicios de backend también pueden requerir variables de entorno. Revisa los archivos `.env.example` dentro de cada carpeta de `services` para la configuración necesaria.

**Importante:** Para el despliegue, estas variables deben configurarse como secretos en el repositorio de GitHub.

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
-   `npm run lint`: Ejecuta los linters para todo el código (JavaScript/TypeScript y Python).
-   `npm test`: Ejecuta todas las pruebas del proyecto (frontend y backend).

### Scripts Personalizados

-   `generateServices.js`: Este script genera automáticamente los archivos de servicio de Supabase para el frontend (`frontend/src/services/`). Se basa en una lista predefinida de tablas y crea funciones CRUD básicas para cada una. Útil para acelerar el desarrollo de la capa de acceso a datos del frontend.
-   `limpiar_config_frontend.sh`: Un script de shell que ayuda a mantener la limpieza del proyecto eliminando archivos de configuración duplicados (`postcss.config.js`, `tailwind.config.js`, `.env`) fuera del directorio `frontend/client`. Asegura que solo exista una fuente de verdad para la configuración del frontend.

## Despliegue

El despliegue está automatizado mediante GitHub Actions.

-   **Frontend:** Se despliega automáticamente en GitHub Pages en cada push a la rama `main`.
    *Nota:* Para despliegues en entornos de Kubernetes, se utiliza el manifiesto `k8s/frontend-deployment.yaml`.
-   **Backend:** Los servicios `auth-service` y `crm-service` se despliegan en Google Kubernetes Engine (GKE) en cada push a la rama `main`.

La configuración completa se encuentra en `.github/workflows/ci.yml`.

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue para discutir los cambios propuestos o envía un Pull Request.