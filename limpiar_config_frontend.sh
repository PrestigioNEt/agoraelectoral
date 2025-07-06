#!/bin/bash

# Ruta base del frontend
FRONTEND_DIR="$HOME/agoraelectoralaico/apk/frontend/client"

# Archivos de configuración que deben existir solo en el frontend/client
CONFIGS=("postcss.config.js" "postcss.config.cjs" "tailwind.config.js" ".env")

echo "Verificando y limpiando archivos de configuración duplicados..."

for config in "${CONFIGS[@]}"; do
  # Buscar y eliminar duplicados fuera de la carpeta client
  find "$HOME/agoraelectoralaico/apk/frontend" -maxdepth 2 -type f -name "$config" ! -path "$FRONTEND_DIR/$config" -exec rm -v {} \;
done

echo "Archivos de configuración duplicados eliminados fuera de $FRONTEND_DIR"
echo "Verificando archivos principales en $FRONTEND_DIR:"

for config in "${CONFIGS[@]}"; do
  if [ -f "$FRONTEND_DIR/$config" ]; then
    echo "✔ $config existe en $FRONTEND_DIR"
  else
    echo "✖ $config NO existe en $FRONTEND_DIR"
  fi
done

echo "¡Listo! Solo tienes una configuración válida en tu frontend."
