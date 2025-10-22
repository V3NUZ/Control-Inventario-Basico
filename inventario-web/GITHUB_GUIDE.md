# 🚀 Guía Rápida: GitHub + Vercel en 5 Minutos

## 📋 **Paso 1: Crear Cuenta GitHub**

1. **Ve a** [github.com](https://github.com)
2. **Click en "Sign up"**
3. **Completa el formulario** (usa un email real)
4. **Verifica tu email**
5. **Listo!** Ya tienes cuenta GitHub

## 📁 **Paso 2: Crear Repositorio**

1. **Inicia sesión** en GitHub
2. **Click en el "+"** (arriba a la derecha)
3. **Selecciona "New repository"**
4. **Configura así:**
   ```
   Repository name: inventario-profesional
   Description: Sistema de inventario profesional
   Public: ✅ (marcar)
   Add README: ❌ (no marcar)
   ```
5. **Click en "Create repository"**

## 📤 **Paso 3: Subir Archivos**

### **Opción A: Subir archivos por la web (más fácil)**
1. **En tu repositorio nuevo**, click en "uploading an existing file"
2. **Arrastra todos los archivos** de la carpeta `inventario-web`
3. **Archivos que debes subir:**
   - `index.html`
   - `app.js`
   - `README.md`
   - `GITHUB_GUIDE.md`
   - `vercel.json`
   - `.gitignore`
4. **Scroll abajo**
5. **Escribe en "Commit changes":** "Subir aplicación de inventario"
6. **Click en "Commit changes"**

### **Opción B: Usar Git (si sabes usar Git)**
```bash
git init
git add .
git commit -m "Subir aplicación de inventario"
git branch -M main
git remote add origin https://github.com/tu-usuario/inventario-profesional.git
git push -u origin main
```

## 🌐 **Paso 4: Despliegue en Vercel**

1. **Ve a** [vercel.com](https://vercel.com)
2. **Click en "Sign Up"**
3. **Selecciona "Continue with GitHub"**
4. **Autoriza Vercel** para acceder a tu GitHub
5. **Busca tu repositorio** `inventario-profesional`
6. **Click en "Import"**
7. **Configura así:**
   - Framework: **Other**
   - Build Command: **(dejar vacío)**
   - Output Directory: **(dejar vacío)**
8. **Click en "Deploy"**
9. **Espera 2-3 minutos**

## 🎉 **Paso 5: ¡Listo!**

**Tu aplicación estará online en:**
```
https://inventario-profesional-tu-usuario.vercel.app
```

**También tendrás una URL más corta como:**
```
https://tu-app.vercel.app
```

## 📱 **Paso 6: Compartir tu App**

**Puedes compartir el enlace con:**
- 📱 Tu celular
- 💻 Tu laptop
- 🖥️ Cualquier dispositivo con internet
- 👥 Tu equipo de trabajo

## 🔄 **Actualizaciones Futuras**

**Cuando quieras actualizar la aplicación:**
1. **Modifica los archivos** en tu computadora
2. **Sube los cambios** a GitHub
3. **Vercel actualizará automáticamente** (tarda 1-2 minutos)

## 🎯 **Resumen en 2 Minutos**

1. **Crea cuenta GitHub**
2. **Crea repositorio `inventario-profesional`**
3. **Sube los archivos** por la web
4. **Ve a Vercel.com** y conecta GitHub
5. **Importa tu repositorio**
6. **Deploy → Listo!**

## 🆘 **Problemas Comunes**

### **❌ "No puedo subir archivos"**
- Asegúrate de haber creado el repositorio primero
- Los archivos deben estar en formato correcto (.html, .js)

### **❌ "Vercel no encuentra mi repositorio"**
- Asegúrate de que el repositorio sea **público**
- Refresca la página de Vercel

### **❌ "Error al desplegar"**
- Revisa que el archivo principal sea `index.html`
- Asegúrate de que no haya errores en el código

### **❌ "La página no carga"**
- Espera 5 minutos y recarga
- Revisa el log de despliegue en Vercel

## 🎁 **Bonus: Dominio Personalizado**

**Si quieres un dominio personal:**
1. **Ve a la configuración del proyecto** en Vercel
2. **Click en "Domains"**
3. **Agrega tu dominio** (ej: `inventario.miempresa.com`)
4. **Sigue las instrucciones** de DNS

---

**¡Felicidades! 🎉** Ahora tienes una aplicación profesional en la nube accesible desde cualquier lugar del mundo.