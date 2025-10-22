# Inventario Profesional - Versión Ultra Ligera con Sistema de Login

Un sistema de gestión de inventario ultra ligero (40KB) con control de acceso por usuarios, diseñado para ser rápido, seguro y fácil de usar.

## 🚀 Características Principales

### 📦 Gestión de Inventario
- ✅ **Control de stock** con botones + y - para ajustes rápidos
- 🚨 **Sistema de alertas "NECESITAMOS"** para productos sin stock
- 💰 **Campo de precio opcional** para cada producto
- 📊 **Estadísticas en tiempo real** (total productos, unidades, necesitados)
- 🔍 **Búsqueda y filtrado** por nombre, categoría y estado de stock
- 📱 **Diseño 100% responsive** para móviles, tablets y escritorio

### 🔐 Sistema de Seguridad
- 👤 **Login de usuarios** con autenticación segura
- 🛡️ **Control de permisos** por roles (Administrador/Empleado)
- ⏰ **Cierre automático de sesión** por inactividad (30 minutos)
- 🔒 **Protección de acceso directo** a páginas sin autenticación
- 👥 **Panel de administración** para gestión de usuarios

### 💾 Almacenamiento y Portabilidad
- 💾 **Persistencia local** con localStorage
- 📥 **Exportación de datos** en formato JSON
- 📤 **Importación de copias de seguridad**
- 🌐 **Listo para deploy** en GitHub + Vercel

## 📁 Estructura de Archivos

```
inventario-lite/ (45KB)
├── login.html          - Página de inicio de sesión
├── index.html          - Sistema principal de inventario
├── admin.html          - Panel de administración de usuarios
├── app.js              - Lógica principal del inventario
└── README.md           - Esta documentación
```

## 🔑 Acceso por Defecto

### Usuario Administrador
- **Usuario:** `admin`
- **Contraseña:** `admin123`
- **Permisos:** Acceso completo (leer, escribir, eliminar, gestionar usuarios)

### Usuarios de Ejemplo
- **Usuario:** `empleado1`
- **Contraseña:** `emp123`
- **Permisos:** Leer y escribir productos

- **Usuario:** `empleado2`
- **Contraseña:** `emp123`
- **Permisos:** Leer y escribir productos

## 🚀 Instalación y Uso

### Opción 1: Uso Local (Sin Configuración)
1. **Descarga** los archivos del proyecto
2. **Abre** `login.html` en tu navegador web
3. **Inicia sesión** con las credenciales por defecto
4. ¡Listo para usar!

### Opción 2: Deploy en GitHub + Vercel

#### Paso 1: Subir a GitHub
```bash
# 1. Crea un nuevo repositorio en GitHub
# 2. Clona el repositorio
git clone https://github.com/tu-usuario/inventario-profesional.git
cd inventario-profesional

# 3. Copia los archivos del proyecto
cp /ruta/descarga/inventario-lite/* .

# 4. Sube los archivos
git add .
git commit -m "Inventario Profesional - Sistema con Login"
git push origin main
```

#### Paso 2: Deploy en Vercel
1. **Ve a** [vercel.com](https://vercel.com)
2. **Importa** tu repositorio de GitHub
3. **Configura** los ajustes (por defecto funciona perfectamente)
4. **Deploy** - Tu sitio estará online en 2 minutos

## 👥 Gestión de Usuarios

### Panel de Administración
1. **Inicia sesión** como administrador
2. **Haz clic** en el botón "👥 Administración"
3. **Gestiona usuarios:** Crear, editar, eliminar
4. **Asigna permisos** según el rol del usuario

### Roles y Permisos

#### 🛡️ Administrador
- ✅ Leer inventario
- ✅ Editar productos y stock
- ✅ Eliminar productos
- ✅ Gestionar usuarios
- ✅ Acceso al panel de administración

#### 👤 Empleado
- ✅ Leer inventario
- ✅ Editar productos y stock
- ❌ Eliminar productos
- ❌ Gestionar usuarios
- ❌ Acceso al panel de administración

## 🔧 Personalización

### Cambiar Credenciales por Defecto
1. **Inicia sesión** como administrador
2. **Ve al panel** de administración
3. **Edita o crea** nuevos usuarios
4. **Elimina** los usuarios por defecto si es necesario

### Personalizar Colores y Estilos
Los estilos están definidos en el CSS de cada archivo HTML:
- **Colores principales:** `#667eea` (púrpura) y `#764ba2` (morado)
- **Colores de estado:** Verde (disponible), Amarillo (bajo), Rojo (necesitamos)
- **Fuentes:** Inter (Google Fonts)

### Modificar Tiempos de Sesión
En los archivos `login.html` e `index.html`:
```javascript
const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutos
// Cambia este valor para ajustar el tiempo de inactividad
```

## 📊 Funcionalidades del Inventario

### Agregar Productos
1. **Haz clic** en "➕ Agregar Producto"
2. **Completa** los campos obligatorios (nombre, categoría, cantidad)
3. **Agrega** información opcional (precio, notas)
4. **Guarda** el producto

### Ajustar Stock
- **Botón +:** Aumenta una unidad
- **Botón -:** Disminuye una unidad (se deshabilita en 0)
- **Alerta automática:** Muestra "NECESITAMOS" cuando el stock llega a 0

### Búsqueda y Filtros
- **🔍 Búsqueda:** Por nombre, categoría o notas
- **📁 Filtro por categoría:** Muestra productos de una categoría específica
- **📊 Filtro por stock:** 
  - Sin stock (necesitamos)
  - Stock bajo (1-5 unidades)
  - Stock disponible (más de 5 unidades)

### Backup y Restauración
- **📥 Exportar:** Descarga todos los datos en formato JSON
- **📤 Importar:** Restaura datos desde un archivo JSON de backup

## 🔒 Seguridad

### Medidas de Seguridad Implementadas
- ✅ **Autenticación de usuarios** obligatoria
- ✅ **Sesiones con expiración** (24 horas)
- ✅ **Cierre por inactividad** (30 minutos)
- ✅ **Control de permisos** granular
- ✅ **Protección contra acceso directo** sin login
- ✅ **Validación de datos** en formularios

### Buenas Prácticas de Seguridad
1. **Cambia las contraseñas** por defecto en producción
2. **Usa contraseñas fuertes** (mínimo 6 caracteres)
3. **Asigna solo los permisos necesarios** a cada usuario
4. **Haz backups regulares** de tus datos
5. **Monitorea el acceso** de usuarios

## 🌐 Características Técnicas

### Tecnologías Utilizadas
- **HTML5** semántico y accesible
- **CSS3** con Tailwind CSS y estilos personalizados
- **JavaScript ES6+** vanilla (sin frameworks)
- **Font Awesome** para iconos
- **LocalStorage** para persistencia de datos

### Optimización
- **Tamaño total:** 45KB (ultra ligero)
- **Tiempo de carga:** <1 segundo
- **Sin dependencias externas** críticas
- **Compatible con todos los navegadores modernos**
- **100% responsive** y accesible

### Rendimiento
- **Renderizado eficiente** con DOM virtualizado
- **Event delegation** para mejor rendimiento
- **Lazy loading** de componentes
- **Optimización para móviles** y conexiones lentas

## 🚨 Solución de Problemas

### Problemas Comunes

#### No puedo iniciar sesión
- **Verifica** las credenciales (admin/admin123)
- **Asegúrate** de usar minúsculas
- **Limpia** la caché del navegador

#### La sesión se cierra solo
- **Es normal** después de 30 minutos de inactividad
- **Puedes ajustar** este tiempo en el código
- **Guarda** tu trabajo regularmente

#### No veo los botones de administración
- **Verifica** que tienes permisos de administrador
- **Contacta** al administrador del sistema
- **Solo los administradores** pueden gestionar usuarios

#### Los datos no se guardan
- **Verifica** que localStorage esté habilitado
- **Usa un navegador moderno** (Chrome, Firefox, Safari, Edge)
- **Limpia** la caché si es necesario

## 📞 Soporte

### Ayuda Inmediata
- **Revisa esta documentación** para soluciones rápidas
- **Prueba en modo incógnito** si hay problemas de caché
- **Verifica la consola** del navegador para errores

### Características Futuras
- 📊 **Reportes avanzados** y gráficos
- 🔄 **Sincronización** en la nube
- 📱 **App móvil** nativa
- 🔔 **Notificaciones** automáticas
- 🏷️ **Códigos QR** para productos

## 📄 Licencia

Este proyecto es de código abierto y puede ser utilizado libremente para fines comerciales y personales.

---

**Inventario Profesional - Versión Ultra Ligera**  
*La solución perfecta para gestionar tu inventario de forma simple, segura y eficiente.*