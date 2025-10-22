# Inventario Profesional v1.0 | GitHub + Vercel

## 🎯 **Aplicación Web Profesional de Inventario**

Sistema moderno de gestión de inventario con almacenamiento en la nube, accesible desde cualquier dispositivo.

## ✨ **Características Principales**

- 🌐 **Accesible desde cualquier lugar** (no requiere instalación)
- 💾 **Almacenamiento automático en la nube**
- ➕➖ **Botones + y - para ajustar stock fácilmente**
- 🚨 **Alerta "NECESITAMOS" cuando stock es 0**
- 💰 **Precio opcional** (no obligatorio)
- 📱 **100% responsive** (funciona en celulares, tablets, PC)
- 🔍 **Búsqueda y filtros avanzados**
- 📊 **Estadísticas en tiempo real**
- 💾 **Importar/Exportar datos**
- 🔄 **Auto-guardado cada 30 segundos**

## 🚀 **Despliegue Súper Fácil (GitHub + Vercel)**

### **Paso 1: Subir a GitHub**
1. **Crea una cuenta en GitHub** (si no tienes)
2. **Crea un nuevo repositorio** llamado `inventario-profesional`
3. **Sube todos los archivos** de esta carpeta

### **Paso 2: Despliegue en Vercel**
1. **Ve a** [vercel.com](https://vercel.com)
2. **Inicia sesión con GitHub**
3. **Importa tu repositorio** `inventario-profesional`
4. **Haz clic en "Deploy"**
5. **¡Listo!** Tu aplicación estará online en 2 minutos

## 📱 **Uso de la Aplicación**

### **Agregar Productos**
- Click en **"Agregar Producto"**
- Campos obligatorios: Nombre, Categoría, Cantidad
- Precio: **Opcional** (puedes dejarlo vacío)
- Notas: **Opcional**

### **Ajustar Cantidad (Fácil)**
- **Botón verde (+)**: Aumenta en 1 unidad
- **Botón rojo (-)**: Disminuye en 1 unidad
- No necesitas editar, solo hacer click

### **Alerta de Stock**
- Cuando un producto llega a **0**: aparece **"NECESITAMOS"** en rojo
- Productos sin stock se muestran primero
- Notificación automática cuando algo se agota

### **Búsqueda y Filtros**
- **Búsqueda**: Encuentra por nombre, categoría o notas
- **Filtro por categoría**: Selecciona una categoría específica
- **Filtro por stock**: 
  - "Sin stock" = productos que necesitan reposición
  - "Stock bajo" = 5 unidades o menos
  - "Stock disponible" = más de 5 unidades

## 💾 **Respaldo de Datos**

### **Exportar (Copia de Seguridad)**
1. Click en **"Exportar"**
2. Se descarga un archivo `.json` con todos tus productos
3. Guárdalo en un lugar seguro

### **Importar (Restaurar)**
1. Click en **"Importar"**
2. Selecciona un archivo `.json` previamente exportado
3. Confirma la importación

## 🔧 **Ventajas de esta Solución**

### **✅ Comparado con aplicación de escritorio:**
- **No necesita instalación**
- **Accesible desde cualquier dispositivo**
- **Actualizaciones automáticas**
- **Backup en la nube**
- **Multiplataforma** (Windows, Mac, Linux, iOS, Android)

### **✅ Características técnicas:**
- **Almacenamiento persistente** (localStorage)
- **Auto-guardado automático**
- **Diseño responsive**
- **Rendimiento optimizado**
- **Sin costo de hosting** (Vercel es gratis)

## 🌍 **Acceso desde Dispositivos**

Una vez desplegado en Vercel, podrás acceder:
- **Desde tu PC**: `https://tu-app.vercel.app`
- **Desde tu celular**: misma URL
- **Desde tablet**: misma URL
- **Desde cualquier lugar con internet**

## 📊 **Estadísticas en Tiempo Real**

- **Total Productos**: Número de productos diferentes
- **Unidades Totales**: Suma de todas las cantidades
- **Necesitamos Reponer**: Productos con stock en cero

## 🎨 **Diseño Profesional**

- **Interfaz moderna** con gradientes y glassmorphism
- **Colores intuitivos**:
  - 🔴 Rojo: "NECESITAMOS" (sin stock)
  - 🟡 Amarillo: "BAJO" (poco stock)
  - 🟢 Verde: "DISPONIBLE" (stock suficiente)
- **Animaciones suaves** y transiciones
- **Diseño responsive** para todos los dispositivos

## 🆘 **Soporte y Problemas Comunes**

### **¿Los datos se pierden si cierro el navegador?**
❌ **No**. Los datos se guardan automáticamente en el navegador y persisten.

### **¿Puedo acceder desde mi celular?**
✅ **Sí**. La aplicación es 100% responsive.

### **¿Necesito internet?**
✅ **Sí** para acceder a la aplicación, pero una vez cargada funciona offline.

### **¿Es seguro?**
✅ **Sí**. Los datos se guardan localmente en tu navegador.

## 📞 **Contacto y Soporte**

Esta aplicación es autosuficiente y no requiere mantenimiento técnico. Si tienes problemas:
1. **Recarga la página** (F5)
2. **Limpia el caché** del navegador
3. **Exporta tus datos** como respaldo
4. **Importa los datos** si es necesario

---

**Versión 1.0** - Creada con ❤️ para gestión eficiente de inventarios

**Tecnologías**: HTML5, Tailwind CSS, JavaScript Vanilla, GitHub, Vercel