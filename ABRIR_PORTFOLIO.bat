@echo off
setlocal
title Portfolio R4 - PARRONDO Nehuen

REM Trabaja siempre desde la carpeta donde fue extraído el proyecto.
cd /d "%~dp0"

REM Comprueba que Node.js y npm estén disponibles en la computadora.
where node >nul 2>nul
if errorlevel 1 goto node_missing
where npm >nul 2>nul
if errorlevel 1 goto node_missing

REM Instala dependencias solamente cuando todavía no existe node_modules.
if not exist "node_modules\" (
  echo Instalando dependencias. La primera vez puede tardar algunos minutos...
  call npm install
  if errorlevel 1 goto install_error
)

REM Si la compilación no está incluida, la genera después de validar TypeScript.
if not exist "dist\index.html" (
  echo Generando la version de produccion...
  call npm run build
  if errorlevel 1 goto build_error
)

echo Abriendo el portfolio en http://127.0.0.1:4173
echo Para cerrar el servidor, presiona Ctrl+C en esta ventana.
start "" "http://127.0.0.1:4173"
call npm run preview -- --host 127.0.0.1
goto end

:node_missing
echo.
echo No se encontro Node.js o npm.
echo Instala Node.js 20 LTS o superior desde https://nodejs.org/
echo Tambien podes abrir la version publicada: https://r4-theta.vercel.app/
pause
goto end

:install_error
echo.
echo No se pudieron instalar las dependencias. Revisa Internet y los permisos.
pause
goto end

:build_error
echo.
echo No se pudo generar la version de produccion.
echo Ejecuta npm run typecheck para ver el detalle.
pause

:end
endlocal

