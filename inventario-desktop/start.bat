@echo off
title Inventario Profesional - Instalador

echo ====================================
echo   Inventario Profesional v1.0
echo   Constructor de Ejecutable
echo ====================================
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no está instalado
    echo.
    echo Por favor, instala Node.js desde:
    echo https://nodejs.org/
    echo.
    echo Descarga la versión LTS y ejecuta el instalador
    echo Luego vuelve a ejecutar este archivo.
    echo.
    pause
    exit /b 1
)

echo [✓] Node.js encontrado
echo.

REM Instalar dependencias
echo [INFO] Instalando dependencias...
npm install
if %errorlevel% neq 0 (
    echo [ERROR] Error al instalar dependencias
    pause
    exit /b 1
)

echo [✓] Dependencias instaladas
echo.

REM Construir ejecutable
echo [INFO] Construyendo ejecutable...
npm run build-win
if %errorlevel% neq 0 (
    echo [ERROR] Error al construir el ejecutable
    pause
    exit /b 1
)

echo.
echo [✓] ¡Ejecutable construido exitosamente!
echo.
echo El instalador se encuentra en la carpeta 'dist/'
echo Archivo: Inventario-Profesional-Setup-1.0.0.exe
echo.
echo Puedes distribuir este archivo para instalar la aplicación
echo.
pause