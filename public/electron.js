const { app, BrowserWindow, Menu, shell, ipcMain } = require('electron')
const path = require('path')
const { spawn } = require('child_process')
const isDev = process.env.NODE_ENV === 'development'

// Mantener referencia global de la ventana y del servidor
let mainWindow
let serverProcess

function startServer() {
  return new Promise((resolve, reject) => {
    if (isDev) {
      // En desarrollo, usar el servidor de desarrollo existente
      resolve('http://localhost:3000')
      return
    }

    // En producción, iniciar el servidor local
    const serverPath = path.join(__dirname, 'server.js')
    serverProcess = spawn('node', [serverPath], {
      stdio: 'pipe',
      cwd: path.dirname(__dirname)
    })

    serverProcess.stdout.on('data', (data) => {
      console.log(`Server: ${data}`)
      if (data.toString().includes('Server running on')) {
        resolve('http://localhost:3001')
      }
    })

    serverProcess.stderr.on('data', (data) => {
      console.error(`Server Error: ${data}`)
    })

    serverProcess.on('close', (code) => {
      console.log(`Server process exited with code ${code}`)
    })

    // Timeout por si el servidor tarda demasiado
    setTimeout(() => {
      resolve('http://localhost:3001')
    }, 5000)
  })
}

function createWindow() {
  // Crear la ventana del navegador
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'inventory-logo.png'),
    show: false, // No mostrar hasta que esté lista
    titleBarStyle: 'default',
    webSecurity: false // Permitir loading de recursos locales
  })

  // Iniciar servidor y luego cargar la aplicación
  startServer().then((url) => {
    mainWindow.loadURL(url)

    // Mostrar ventana cuando esté lista
    mainWindow.once('ready-to-show', () => {
      mainWindow.show()
      mainWindow.center()
      
      // En desarrollo, abrir DevTools
      if (isDev) {
        mainWindow.webContents.openDevTools()
      }
    })
  }).catch((error) => {
    console.error('Failed to start server:', error)
    // Fallback: intentar cargar directamente
    const fallbackUrl = isDev 
      ? 'http://localhost:3000' 
      : `file://${path.join(__dirname, '../out/index.html')}`
    mainWindow.loadURL(fallbackUrl)
  })

  // Manejar enlaces externos
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  // Crear menú personalizado
  createMenu()

  // Eventos de la ventana
  mainWindow.on('closed', () => {
    mainWindow = null
    if (serverProcess) {
      serverProcess.kill()
    }
  })

  mainWindow.on('minimize', () => {
    mainWindow.minimize()
  })

  mainWindow.on('maximize', () => {
    mainWindow.maximize()
  })

  mainWindow.on('unmaximize', () => {
    mainWindow.unmaximize()
  })
}

function createMenu() {
  const template = [
    {
      label: 'Archivo',
      submenu: [
        {
          label: 'Nuevo Producto',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('menu-new-product')
          }
        },
        { type: 'separator' },
        {
          label: 'Salir',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit()
          }
        }
      ]
    },
    {
      label: 'Editar',
      submenu: [
        { role: 'undo', label: 'Deshacer' },
        { role: 'redo', label: 'Rehacer' },
        { type: 'separator' },
        { role: 'cut', label: 'Cortar' },
        { role: 'copy', label: 'Copiar' },
        { role: 'paste', label: 'Pegar' },
        { role: 'selectall', label: 'Seleccionar Todo' }
      ]
    },
    {
      label: 'Vista',
      submenu: [
        { role: 'reload', label: 'Recargar' },
        { role: 'forceReload', label: 'Forzar Recarga' },
        { role: 'toggleDevTools', label: 'Herramientas de Desarrollador' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Tamaño Real' },
        { role: 'zoomIn', label: 'Acercar' },
        { role: 'zoomOut', label: 'Alejar' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Pantalla Completa' }
      ]
    },
    {
      label: 'Ventana',
      submenu: [
        { role: 'minimize', label: 'Minimizar' },
        { role: 'close', label: 'Cerrar' }
      ]
    },
    {
      label: 'Ayuda',
      submenu: [
        {
          label: 'Acerca de',
          click: () => {
            mainWindow.webContents.send('menu-about')
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

// Eventos de la aplicación
app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Prevenir múltiples instancias
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    // Alguien intentó ejecutar una segunda instancia
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

// IPC Handlers
ipcMain.handle('app-version', () => {
  return app.getVersion()
})

ipcMain.handle('app-name', () => {
  return app.getName()
})