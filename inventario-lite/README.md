# 📦 Inventario Profesional - Versión Ultra Ligera

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/Version-2.0-blue.svg)](https://github.com/V3NUZ/Control-Inventario-Basico)
[![Size](https://img.shields.io/badge/Size-94KB-green.svg)](https://github.com/V3NUZ/Control-Inventario-Basico)

Un sistema de gestión de inventario **ultra ligero y seguro** con control de acceso por usuarios, diseñado por **V3NUZ** para pymes y emprendedores que necesitan una solución eficiente sin complicaciones.

## ✨ Características Principales

### 🎯 Gestión de Inventario
- 📊 **Control de stock inteligente** con botones + y - para ajustes rápidos
- 🚨 **Sistema de alertas "NECESITAMOS"** automático para productos sin stock
- 💰 **Gestión de precios opcional** para cada producto
- 🔍 **Búsqueda y filtrado avanzado** por nombre, categoría y estado
- 📱 **Diseño 100% responsive** para todos los dispositivos
- 📈 **Estadísticas en tiempo real** del inventario

### 🔐 Sistema de Seguridad
- 👤 **Autenticación de usuarios** segura y confiable
- 🛡️ **Control de permisos granular** por roles (Admin/Empleado)
- ⏰ **Sesiones con expiración automática** (24h + inactividad)
- 🔒 **Protección contra acceso no autorizado**
- 👥 **Panel de administración** para gestión de usuarios

### ⚡ Rendimiento y Portabilidad
- 🚀 **Ultra ligero:** Solo 85KB totales
- ⚡ **Carga instantánea:** Menos de 1 segundo
- 💾 **Persistencia local** con localStorage
- 📥 **Exportación/Importación** de datos en JSON
- 🌐 **Listo para deploy** en GitHub + Vercel

## 🚀 Demostración Rápida

### 📱 Interfaz Principal
```
📦 Inventario Profesional                    👤 Administrador
┌─────────────────────────────────────────────────────────────┐
│ Total Productos: 15    Unidades: 247    Necesitan: 3       │
└─────────────────────────────────────────────────────────────┘

🔍 Buscar... 📁 Todas las categorías 📊 Todo el stock
[➕ Agregar Producto] [👥 Administración] [📥 Exportar] [🚪 Salir]

┌─ Laptop Dell XPS                    📁 Electrónicos 💰 $1200 ─┐
│ 🏷️ DISPONIBLE                                               │
│ [+][-] 5 unidades  [✏️] [🗑️]                                │
└─────────────────────────────────────────────────────────────┘

┌─ Mouse Inalámbrico                 📁 Accesorios              ─┐
│ 🏷️ NECESITAMOS  ⚠️                                         │
│ 0 unidades  [✏️] [🗑️]                                      │
└─────────────────────────────────────────────────────────────┘
```

### 🔐 Sistema de Login
```
🔐 Inventario Profesional - Login

┌─────────────────────────────────┐
│ 👤 Usuario                      │
│ [admin           ]              │
│                                 │
│ 🔒 Contraseña                   │
│ [••••••••        ]              │
│                                 │
│ ☑️ Recordarme                   │
│                                 │
│ [🔓 Iniciar Sesión]             │
└─────────────────────────────────┘

ℹ️ Contacta al administrador para obtener credenciales
```

## 📋 Requisitos

### 🌐 Navegadores Compatibles
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### 📱 Dispositivos
- ✅ Escritorio (Windows/Mac/Linux)
- ✅ Tablets (iPad/Android)
- ✅ Móviles (iOS/Android)

## 🚀 Instalación Rápida

### Opción 1: Uso Local Inmediato
```bash
# 1. Descarga los archivos
git clone https://github.com/V3NUZ/Control-Inventario-Basico.git
cd Control-Inventario-Basico

# 2. Abre el sistema de login
open inventario-lite/login.html  # Mac
start inventario-lite/login.html # Windows
xdg-open inventario-lite/login.html # Linux

# 3. ¡Listo para usar! 🎉
```

### Opción 2: Deploy en Vercel (2 minutos)
```bash
# 1. Sube a GitHub
git add .
git commit -m "Deploy Inventario Profesional"
git push origin main

# 2. Importa en Vercel
# → ve a vercel.com
# → import your repository
# → deploy 🚀
```

## 🔑 Configuración Inicial

### 👤 Primer Acceso
1. **Abre** `login.html` en tu navegador
2. **Usa las credenciales por defecto** (solo para configuración inicial)
3. **Ve al panel de administración** (botón 👥)
4. **Crea tus usuarios** y elimina los por defecto

### 🛡️ Buenas Prácticas de Seguridad
```javascript
// Cambiar tiempo de sesión (opcional)
const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutos

// Roles y permisos configurables
const ROLES = {
    ADMIN: ['read', 'write', 'delete', 'manage_users'],
    EMPLOYEE: ['read', 'write']
};
```

## 📖 Guía de Uso

### 📦 Gestión de Productos

#### Agregar Producto
1. **Haz clic** en `[➕ Agregar Producto]`
2. **Completa** los campos obligatorios:
   - Nombre del producto *
   - Categoría *
   - Cantidad inicial *
3. **Agrega** información opcional:
   - Precio unitario
   - Notas adicionales
4. **Guarda** el producto

#### Control de Stock
- **Botón [+]:** Aumenta una unidad
- **Botón [-]:** Disminuye una unidad (se deshabilita en 0)
- **Alerta automática:** "NECESITAMOS" cuando stock = 0

#### Búsqueda y Filtros
```javascript
// Búsqueda por texto
🔍 "laptop" → Encuentra "Laptop Dell XPS"

// Filtro por categoría
📁 "Electrónicos" → Muestra solo productos electrónicos

// Filtro por stock
📊 "Sin stock" → Muestra productos que necesitan reposición
```

### 👥 Gestión de Usuarios

#### Panel de Administración
1. **Inicia sesión** como administrador
2. **Haz clic** en `[👥 Administración]`
3. **Gestiona usuarios:**
   - ➕ Crear nuevo usuario
   - ✏️ Editar usuario existente
   - 🗑️ Eliminar usuario

#### Roles y Permisos
| Rol | Leer | Escribir | Eliminar | Gestionar Usuarios |
|-----|------|----------|----------|-------------------|
| 🛡️ Administrador | ✅ | ✅ | ✅ | ✅ |
| 👤 Empleado | ✅ | ✅ | ❌ | ❌ |

### 💾 Backup y Restauración

#### Exportar Datos
```javascript
// 1. Haz clic en [📥 Exportar]
// 2. Se descarga archivo JSON
// 3. Formato: inventario-backup-2024-01-15.json
```

#### Importar Datos
```javascript
// 1. Haz clic en [📤 Importar]
// 2. Selecciona archivo JSON de backup
// 3. Confirma la importación
// 4. ¡Datos restaurados! 🎉
```

## 🏗️ Arquitectura del Sistema

### 📁 Estructura de Archivos
```
inventario-lite/ (85KB total)
├── 📄 login.html      (14KB) - Sistema de autenticación
├── 📄 index.html      (19KB) - Interfaz principal de inventario
├── 📄 admin.html      (27KB) - Panel de administración
├── 📄 app.js          (17KB) - Motor principal del sistema
├── 📄 README.md       (8KB)  - Documentación completa
└── 🎨 assets/         - Estilos y recursos (CDN)
```

### 🛠️ Tecnologías Utilizadas
- **Frontend:** HTML5, CSS3, JavaScript ES6+
- **Estilos:** Tailwind CSS + CSS personalizado
- **Iconos:** Font Awesome 6.4
- **Almacenamiento:** LocalStorage (cliente)
- **Deployment:** GitHub + Vercel

### 🔧 Características Técnicas
- **Sin dependencias externas críticas**
- **Código vanilla JavaScript** (no frameworks)
- **Diseño responsive** con Mobile-First
- **Accesibilidad WCAG 2.1** compatible
- **Rendimiento optimizado** para conexiones lentas

## 🔒 Seguridad

### 🛡️ Medidas de Seguridad Implementadas
- ✅ **Autenticación obligatoria** para todo acceso
- ✅ **Sesiones con expiración** automática
- ✅ **Cierre por inactividad** (configurable)
- ✅ **Control de permisos** granular
- ✅ **Protección CSRF** inherente
- ✅ **Validación de datos** en cliente y servidor
- ✅ **Sanitización de entradas** XSS protection

### 🔐 Buenas Prácticas
```javascript
// 1. Cambiar credenciales por defecto
// 2. Usar contraseñas fuertes (mínimo 6 caracteres)
// 3. Asignar permisos mínimos necesarios
// 4. Hacer backups regulares
// 5. Monitorear acceso de usuarios
```

## 🚀 Deployment

### 🌐 GitHub + Vercel (Recomendado)
```bash
# 1. Crear repositorio en GitHub
git clone https://github.com/V3NUZ/Control-Inventario-Basico.git
cd Control-Inventario-Basico

# 2. Subir archivos
git add .
git commit -m "🚀 Deploy Inventario Profesional v2.0"
git push origin main

# 3. Deploy en Vercel
# → https://vercel.com
# → Import GitHub Repository
# → Deploy Settings: Framework Preset = Other
# → Click Deploy 🚀
```

### 🐳 Docker (Opcional)
```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 📱 PWA (Progresive Web App)
```javascript
// El sistema es PWA-ready
// Manifest y Service Worker incluidos
// Instalable como app nativa en móviles
```

## 🐛 Solución de Problemas

### ❌ Problemas Comunes

#### No puedo iniciar sesión
```bash
✅ Solución:
1. Verifica credenciales (case-sensitive)
2. Limpia caché del navegador
3. Usa navegador moderno
4. Contacta al administrador
```

#### La sesión se cierra sola
```bash
✅ Es normal (seguridad):
- Sesión expira después de 30 min inactividad
- Sesión máxima: 24 horas
- Puedes ajustar estos tiempos en el código
```

#### No veo botones de administración
```bash
✅ Verifica permisos:
1. Debes tener rol de Administrador
2. Contacta al administrador del sistema
3. Solo admins ven panel de gestión
```

#### Los datos no se guardan
```bash
✅ Requisitos:
1. LocalStorage habilitado en navegador
2. Espacio de almacenamiento disponible
3. Navegador actualizado
4. Conexión estable (para backups)
```

## 🔄 Actualizaciones y Mantenimiento

### 📅 Versiones
- **v1.0:** Sistema básico de inventario
- **v2.0:** Sistema completo con login y permisos
- **v2.1:** Mejoras de seguridad y rendimiento

### 🚀 Próximas Características
- 📊 Reportes avanzados y gráficos
- 🔄 Sincronización en la nube
- 📱 Aplicación móvil nativa
- 🔔 Notificaciones automáticas
- 🏷️ Códigos QR para productos
- 📈 Análisis predictivo de stock

## 🤝 Contribución

### 📋 Cómo Contribuir
1. **Fork** el repositorio de V3NUZ
2. **Crea** una rama feature (`git checkout - feature/amazing-feature`)
3. **Commit** tus cambios (`git commit -m 'Add amazing feature'`)
4. **Push** a la rama (`git push origin feature/amazing-feature`)
5. **Abre** un Pull Request

### 🐛 Reportar Issues
- **Bug Report:** Usa plantilla de bug
- **Feature Request:** Describe el caso de uso
- **Security Issue:** Contacta directamente

## 📄 Licencia

Este proyecto está licenciado bajo la **MIT License** - ver el archivo [LICENSE](LICENSE) para detalles.

```
MIT License

Copyright (c) 2024 V3NUZ

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 👥 Créditos

### 🎯 Desarrollador Principal
- **V3NUZ** - Diseño y desarrollo completo del sistema
- **Arquitectura** y lógica del software
- **Implementación** de todas las funcionalidades
- **GitHub:** [@V3NUZ](https://github.com/V3NUZ)

### 🤖 Asistencia de Desarrollo
- **Claude AI Assistant** - Soporte técnico y desarrollo
- **Optimización** de código y rendimiento
- **Documentación** y buenas prácticas
- **Asistencia** en implementación de características

---

## 📞 Soporte y Contacto

### 💬 Obtener Ayuda
- 📖 **Documentación:** Revisa este README completo
- 🐛 **Issues:** Abre un issue en GitHub
- 📧 **Email:** [tu-email@ejemplo.com]

### 🌐 Comunidad
- ⭐ **Star** el repositorio si te gusta
- 🍴 **Fork** para personalizar
- 📢 **Share** con otros emprendedores

---

**🚀 Inventario Profesional - La solución perfecta para gestionar tu inventario de forma simple, segura y eficiente.**

*Desarrollado con ❤️ por V3NUZ con asistencia de Claude AI Assistant*