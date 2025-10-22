@echo off
title Sistema de Inventario
color 0A
echo.
echo  ╔══════════════════════════════════════════════════════════════╗
echo  ║                                                              ║
echo  ║           🎯 SISTEMA DE INVENTARIO PORTABLE                  ║
echo  ║                                                              ║
echo  ║           Iniciando aplicación...                           ║
echo  ║                                                              ║
echo  ╚══════════════════════════════════════════════════════════════╝
echo.

REM Verificar si el archivo existe
if not exist "index.html" (
    echo ❌ Error: No se encuentra el archivo index.html
    echo    Asegúrate de que este archivo está en la misma carpeta que la aplicación
    pause
    exit /b 1
)

REM Intentar abrir con Chrome primero
echo 🔍 Buscando Google Chrome...
set "CHROME_PATH="
for %%i in (
    "%ProgramFiles%\Google\Chrome\Application\chrome.exe"
    "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
    "%LocalAppData%\Google\Chrome\Application\chrome.exe"
) do (
    if exist "%%i" (
        set "CHROME_PATH=%%i"
        goto :found_chrome
    )
)

:found_chrome
if defined CHROME_PATH (
    echo ✅ Chrome encontrado: %CHROME_PATH%
    echo 🚀 Iniciando aplicación en Chrome...
    start "" "%CHROME_PATH%" --app="file://%~dp0index.html" --disable-web-security --allow-file-access-from-files
) else (
    echo ⚠️  Chrome no encontrado, intentando con navegador predeterminado...
    echo 🚀 Iniciando aplicación...
    start "" "file://%~dp0index.html"
)

echo.
echo ✨ ¡Aplicación iniciada!
echo    La ventana del navegador debería abrirse automáticamente
echo    Si no abre, haz doble clic en index.html manualmente
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause > nul