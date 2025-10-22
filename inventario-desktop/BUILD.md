# Cómo Construir el Ejecutable

## 📋 Prerrequisitos

1. **Node.js** (versión 16 o superior)
2. **npm** (viene con Node.js)

## 🛠️ Pasos para Construir

### 1. Instalar dependencias
```bash
cd inventario-desktop
npm install
```

### 2. Probar la aplicación en modo desarrollo
```bash
npm run dev
```

### 3. Construir el ejecutable para Windows
```bash
npm run build-win
```

### 4. El ejecutable se creará en la carpeta `dist/`

## 📦 Archivos Generados

- `Inventario-Profesional-Setup-1.0.0.exe` - Instalador completo
- `Inventario-Profesional 1.0.0.exe` - Ejecutable portable

## 🎯 Personalización

Para modificar la aplicación:
1. Edita los archivos en la carpeta `src/`
2. Reconstruye con `npm run build-win`

## 📝 Notas

- El tamaño final del instalador será de aproximadamente 150-200 MB
- Incluye todo lo necesario para funcionar sin instalación adicional
- Es compatible con Windows 10 y 11