# Inventario Profesional v1.0 - Aplicación de Escritorio

## 🎯 Características Principales

- ✅ **Aplicación de escritorio nativa** (no necesita navegador)
- ✅ **Almacenamiento local en archivos JSON** (datos en tu computadora)
- ✅ **Botones + y -** para ajustar cantidad fácilmente
- ✅ **Alerta "NECESITAMOS"** cuando el stock es 0
- ✅ **Precio opcional** (no es obligatorio)
- ✅ **Importar/Exportar** datos
- ✅ **Búsqueda y filtros** avanzados
- ✅ **Estadísticas en tiempo real**

## 📦 Instalación

### Opción 1: Descargar el Ejecutable (Recomendado)
1. Descarga el archivo `Inventario-Profesional-Setup-1.0.0.exe`
2. Haz doble clic para instalar
3. Sigue las instrucciones del instalador
4. Listo! Ya puedes usar la aplicación

### Opción 2: Versión Portable
1. Descarga la carpeta `inventario-desktop.zip`
2. Descomprime en cualquier lugar
3. Ejecuta `Inventario-Profesional.exe`

## 🚀 Cómo Usar

### Agregar Productos
1. Haz clic en el botón **"Agregar Producto"**
2. Completa los campos obligatorios:
   - Nombre del producto
   - Categoría
   - Cantidad inicial
3. El precio es **opcional** (puedes dejarlo vacío)
4. Agrega notas si lo deseas
5. Haz clic en **"Guardar Producto"**

### Ajustar Cantidad (con botones + y -)
1. Busca el producto en la lista
2. Usa los botones:
   - **Botón verde (+)**: Aumenta la cantidad en 1
   - **Botón rojo (-)**: Disminuye la cantidad en 1
3. La cantidad se actualiza automáticamente

### Alerta de Stock en Cero
- Cuando un producto tiene cantidad **0**, aparece una etiqueta roja **"NECESITAMOS"**
- Los productos sin stock se muestran primero en la lista
- Recibirás una notificación cuando un producto se agote

### Buscar y Filtrar
- **Búsqueda**: Escribe para buscar por nombre, categoría o notas
- **Filtro por categoría**: Selecciona una categoría específica
- **Filtro por stock**: 
  - "Sin stock" - muestra solo productos que necesitan reposición
  - "Stock bajo" - productos con 5 unidades o menos
  - "Stock disponible" - productos con más de 5 unidades

## 💾 Respaldo de Datos

### Exportar Datos
1. Haz clic en el botón **"Exportar"**
2. Elige dónde guardar el archivo
3. Se creará un archivo `.json` con todos tus productos

### Importar Datos
1. Haz clic en el botón **"Importar"**
2. Selecciona un archivo `.json` previamente exportado
3. Confirma la importación (reemplazará todos los datos actuales)

## 📁 ¿Dónde se guardan los datos?

Los datos se guardan automáticamente en:
```
Carpeta de la aplicación/data.json
```

Este archivo contiene toda tu información de inventario. Puedes hacer una copia de seguridad simplemente copiando este archivo.

## 🔧 Requisitos del Sistema

- **Windows 10 o superior**
- **2 GB de RAM mínimo**
- **100 MB de espacio en disco**

## 🆘 Solución de Problemas

### La aplicación no abre
- Asegúrate de tener Windows 10 o superior
- Ejecuta como administrador
- Revisa que tu antivirus no esté bloqueando la aplicación

### No se guardan los datos
- Asegúrate de tener permisos de escritura en la carpeta
- Cierra y vuelve a abrir la aplicación
- Verifica que el archivo `data.json` exista en la carpeta

### La aplicación está lenta
- Cierra otras aplicaciones para liberar memoria
- Considera exportar y eliminar productos antiguos
- Reinicia la aplicación

## 📞 Soporte

Si tienes problemas o sugerencias:
1. Revisa esta sección de solución de problemas
2. Haz una copia de seguridad de tus datos antes de hacer cambios
3. La aplicación es autosuficiente, no necesita conexión a internet

---

**Versión 1.0** - Creada para gestión simple y eficiente de inventarios