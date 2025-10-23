# 🏪 Inventario MultiTienda v4.0

Sistema completo de gestión de inventario multi-tienda con control de usuarios y sincronización en tiempo real.

## 🚀 Características Principales

### 🔧 **Botón de Debug Funcional**
- Diagnóstico completo del sistema
- Limpieza segura de datos
- Exportación/Importación de datos
- Consola visual con logs en tiempo real
- Estadísticas del sistema

### 🏪 **Sistema Multi-Tienda**
- Gestión de múltiples tiendas
- Asignación de empleados a tiendas específicas
- Control de acceso por permisos
- Estadísticas por tienda

### 👥 **Gestión de Usuarios**
- Roles: Administrador / Empleado
- Permisos granulares (leer, escribir, eliminar, gestionar)
- Validación de seguridad y manejo de sesión

### 📦 **Inventario Completo**
- CRUD completo de productos
- Control de stock con alertas
- Importación/Exportación (CSV, JSON)
- Búsqueda y filtrado avanzado

### 🎨 **Diseño Moderno**
- Glassmorphism effects
- Animaciones suaves
- Totalmente responsivo
- Indicadores visuales de estado

### 🔄 **Sincronización Real**
- Firebase Realtime Database
- Modo offline con sincronización automática
- Respaldo en localStorage

## 🔑 Credenciales de Acceso

### 👤 **Administrador**
- **Usuario**: `admin`
- **Contraseña**: `admin123`
- **Acceso**: Panel completo + todas las tiendas

### 👨‍💼 **Empleado**
- **Usuario**: `vendedor1`
- **Contraseña**: `empleado`
- **Acceso**: Solo tiendas asignadas

## 📁 Archivos

- `login.html` - Sistema de login moderno
- `admin.html` - Panel de administración completo
- `index.html` - Sistema de inventario multi-tienda
- `firebase-config.js` - Configuración de Firebase
- `vercel.json` - Configuración de despliegue
- `CHANGELOG.md` - Historial de cambios

## 🚀 Instalación y Uso

### 1. **Configurar Firebase**
1. Crea un proyecto en Firebase Console
2. Habilita Realtime Database
3. Copia la configuración en `firebase-config.js`

### 2. **Desplegar**
- **Vercel**: Conecta el repositorio y despliega automáticamente
- **GitHub Pages**: Sube los archivos a la rama `gh-pages`
- **Servidor local**: Usa cualquier servidor web estático

### 3. **Uso**
1. Abre `login.html`
2. Inicia sesión con las credenciales proporcionadas
3. Configura tiendas y usuarios (como admin)
4. Gestiona el inventario

## 🛠️ Botón Debug

El botón **Debug** (naranja) en el panel de administración incluye:

- **🔍 Diagnóstico**: Verificación completa del sistema
- **🗑️ Limpiar Datos**: Reseteo seguro con confirmación
- **📥 Exportar**: Backup completo en JSON
- **📤 Importar**: Restauración desde backup
- **📊 Consola**: Logs en tiempo real
- **📈 Estadísticas**: Métricas del sistema

## 📱 Compatibilidad

- **Navegadores**: Chrome, Firefox, Safari, Edge
- **Dispositivos**: Desktop, Tablet, Mobile
- **Modo**: Online y Offline

## 🔐 Seguridad

- Validación de sesión en todas las páginas
- Control de acceso por rol y tienda
- Confirmaciones para acciones destructivas
- Manejo seguro de credenciales

## 📞 Soporte

Para problemas o preguntas:
1. Usa el panel de Debug para diagnóstico
2. Revisa la consola del navegador
3. Contacta al soporte técnico

---

**Desarrollado por: V3NUZ**  
**Asistencia: Claude AI Assistant**  
**Versión: 4.0 - Producción**  
**Licencia: MIT**