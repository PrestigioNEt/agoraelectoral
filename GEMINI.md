# Project Overview

This is a monorepo containing a frontend application and multiple backend microservices.

## Technologies Used

- **Frontend**: React, TypeScript, Vite
- **Backend Services**: Node.js, Python
- **Containerization**: Docker
- **Orchestration**: Kubernetes

## Common Commands

### Overall Project

*   **Start all services (development)**: `npm run dev` or `npm start` (uses Docker Compose)
*   **Build all Docker images**: `npm run build`
*   **Stop and remove all Docker containers**: `npm run down`
*   **Lint all JavaScript/TypeScript and Python files**: `npm run lint`
*   **Run all tests (frontend and Python services)**: `npm run test`

### Frontend (`frontend/`)

*   **Environment Variables**: The frontend uses `import.meta.env` for environment variables. For local development, these are sourced from `frontend/.env`. For Kubernetes deployments, these should be configured in the Deployment manifest.
    *   `VITE_CRM_SERVICE_URL`: URL for the CRM service (e.g., `http://crm-service` in Kubernetes).
    *   `VITE_AUTH_SERVICE_URL`: URL for the Auth service (e.g., `http://auth-service` in Kubernetes).

*   **Start development server**: `npm run dev --workspace=frontend`
*   **Build for production**: `npm run build --workspace=frontend`
*   **Preview production build**: `npm run preview --workspace=frontend`
*   **Run tests**: `npm run test --workspace=frontend`
*   **Run tests with UI**: `npm run test:ui --workspace=frontend`

### Microservices

*   **MCP Service Kubernetes Deployment**: Kubernetes deployment files (`mcp-deployment.yaml` and `mcp-service.yaml`) have been created in the `k8s/` directory. Remember to build and push the Docker image for `mcp-service` and apply these manifests to your Kubernetes cluster.

*   **Node.js Services (e.g., `services/mcp-service/`)**
    *   **Start development server**: `npm run start:dev --workspace=services/mcp-service`
    *   **Build**: `npm run build --workspace=services/mcp-service`
    *   **Start production**: `npm run start --workspace=services/mcp-service`
    *   *(Note: `analytics-service`, `maps-service`, and `notifications-service` currently only have a `start` script: `npm run start --workspace=services/<service-name>`)*

*   **Python Services (e.g., `services/auth-service/`, `services/crm-service/`)**
    *   **Install dependencies**: `poetry install` (run inside the service directory, e.g., `cd services/auth-service && poetry install`)
    *   **Run tests**: `pytest` (run inside the service directory, e.g., `cd services/auth-service && pytest`)
    *   **Run development server**: `uvicorn app.main:app --reload` (assuming `app/main.py` and `app` is the FastAPI app instance, run inside the service directory)
    *   *(Note: Specific run commands might vary based on the service's entry point. Refer to the service's `app/` directory for details.)*
