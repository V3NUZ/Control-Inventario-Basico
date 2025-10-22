#!/bin/bash

# Sistema de Inventario - Script para macOS
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

# Intentar abrir con Safari primero
if command -v safari &> /dev/null; then
    echo "✅ Abriendo con Safari..."
    open "$HTML_PATH"
# Intentar con Chrome
elif command -v google-chrome &> /dev/null; then
    echo "✅ Abriendo con Chrome..."
    open -a "Google Chrome" "$HTML_PATH"
# Intentar con Firefox
elif command -v firefox &> /dev/null; then
    echo "✅ Abriendo con Firefox..."
    open -a "Firefox" "$HTML_PATH"
# Usar navegador predeterminado
else
    echo "✅ Abriendo con navegador predeterminado..."
    open "$HTML_PATH"
fi

echo ""
echo "✨ ¡Aplicación iniciada!"
echo "   La aplicación debería abrirse en tu navegador"
echo "   Si no abre, haz doble clic en index.html manualmente"
echo ""
read -p "Presiona Enter para cerrar esta ventana..."