#!/bin/bash

# Sistema de Inventario - Script para Linux
echo "🎯 SISTEMA DE INVENTARIO PORTABLE"
echo "=================================="
echo ""

# Verificar si el archivo existe
if [ ! -f "index.html" ]; then
    echo "❌ Error: No se encuentra el archivo index.html"
    echo "   Asegúrate de que este script está en la misma carpeta que la aplicación"
    read -p "Presiona Enter para salir..."
    exit 1
fi

# Obtener la ruta completa del script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
HTML_PATH="file://$SCRIPT_DIR/index.html"

echo "🚀 Iniciando aplicación..."
echo ""

# Intentar abrir con Firefox primero
if command -v firefox &> /dev/null; then
    echo "✅ Ab    firefox "$riendo con Firefox..."
HTML_PATH" &
# Intentar con Chrome
elif command -v google-chrome &> /dev/null; then
    echo "✅ Abriendo con Chrome..."
    google-chrome "$HTML_PATH" &
# Intentar con Chromium
elif command -v chromium-browser &> /dev/null; then
    echo "✅ Abriendo con Chromium..."
    chromium-browser "$HTML_PATH" &
# Usar xdg-open (navegador predeterminado)
elif command -v xdg-open &> /dev/null; then
    echo "✅ Abriendo con navegador predeterminado..."
    xdg-open "$HTML_PATH" &
else
    echo "⚠️  No se encontró ningún navegador compatible"
    echo "   Por favor, abre index.html manualmente en tu navegador"
fi

echo ""
echo "✨ ¡Aplicación iniciada!"
echo "   La aplicación debería abrirse en tu navegador"
echo "   Si no abre, haz doble clic en index.html manualmente"
echo ""
read -p "Presiona Enter para cerrar esta ventana..."