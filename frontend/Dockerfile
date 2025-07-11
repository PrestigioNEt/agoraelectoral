# Stage 1: Build the React application
FROM node:20-alpine AS builder

ARG VITE_CRM_SERVICE_URL
ARG VITE_AUTH_SERVICE_URL

ENV VITE_CRM_SERVICE_URL=$VITE_CRM_SERVICE_URL
ENV VITE_AUTH_SERVICE_URL=$VITE_AUTH_SERVICE_URL

WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
# VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY should be passed as build arguments
# if they are needed during the build process itself (e.g. for embedding into static files).
# Otherwise, they are runtime configurations for the client.
RUN npm run build

# Stage 2: Serve the static files from the build
FROM node:20-alpine
WORKDIR /usr/src/app

# Copy built assets from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Install 'serve' to act as a static file server
RUN npm install -g serve

# Expose the port 'serve' will listen on.
# The k8s frontend-service targets port 5173, so we'll use that.
EXPOSE 5173

# Command to run 'serve'
# Serve the 'dist' folder, listen on port 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
