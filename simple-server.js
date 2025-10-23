/**
 * Servidor HTTP Simple para Sincronización
 * Servidor sin dependencias externas para Vercel/Netlify
 * 
 * @author V3NUZ (Desarrollador Principal)
 * @assistant Claude AI Assistant (Asistencia de Desarrollo)
 * @version 1.0
 * @license MIT
 */

const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const url = require('url');

// Archivo de almacenamiento
const USERS_FILE = path.join(__dirname, 'data', 'users.json');

// Configuración CORS
const setCORSHeaders = (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

// Inicializar archivo de usuarios
async function initializeUsersFile() {
    try {
        await fs.access(USERS_FILE);
    } catch (error) {
        const defaultUsers = [
            {
                id: 1,
                username: 'admin',
                password: 'admin123',
                name: 'Administrador',
                role: 'admin',
                permissions: ['read', 'write', 'delete', 'manage_users'],
                storeAccess: ['La Estancia', 'Animal World'],
                active: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 2,
                username: 'empleado1',
                password: 'emp123',
                name: 'Empleado 1',
                role: 'employee',
                permissions: ['read', 'write'],
                storeAccess: ['La Estancia'],
                active: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 3,
                username: 'empleado2',
                password: 'emp123',
                name: 'Empleado 2',
                role: 'employee',
                permissions: ['read', 'write'],
                storeAccess: ['Animal World'],
                active: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
        
        await fs.writeFile(USERS_FILE, JSON.stringify(defaultUsers, null, 2));
        console.log('✅ Archivo de usuarios inicializado');
    }
}

// Leer usuarios
async function readUsers() {
    try {
        const data = await fs.readFile(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error leyendo usuarios:', error);
        return [];
    }
}

// Guardar usuarios
async function saveUsers(users) {
    try {
        await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
        return true;
    } catch (error) {
        console.error('Error guardando usuarios:', error);
        return false;
    }
}

// Enviar respuesta JSON
function sendJSON(res, data, statusCode = 200) {
    setCORSHeaders(res);
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data, null, 2));
}

// Enviar respuesta de error
function sendError(res, message, statusCode = 500) {
    sendJSON(res, {
        success: false,
        error: message
    }, statusCode);
}

// Manejar solicitudes de usuarios
async function handleUsers(req, res, method, pathname, query) {
    await initializeUsersFile();

    if (method === 'GET' && pathname === '/api/users') {
        const users = await readUsers();
        const usersWithoutPasswords = users.map(user => ({
            ...user,
            password: undefined
        }));
        
        sendJSON(res, {
            success: true,
            data: usersWithoutPasswords,
            count: usersWithoutPasswords.length,
            timestamp: new Date().toISOString()
        });
    }
    else if (method === 'POST' && pathname === '/api/users/sync') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { users: clientUsers } = JSON.parse(body);
                const serverUsers = await readUsers();
                
                let syncedUsers = [...serverUsers];
                let conflicts = [];
                
                for (const clientUser of clientUsers || []) {
                    const serverUserIndex = syncedUsers.findIndex(u => u.id === clientUser.id);
                    
                    if (serverUserIndex === -1) {
                        syncedUsers.push({
                            ...clientUser,
                            id: syncedUsers.length > 0 ? Math.max(...syncedUsers.map(u => u.id)) + 1 : 1,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        });
                    } else {
                        const serverUser = syncedUsers[serverUserIndex];
                        const clientTime = new Date(clientUser.updatedAt || clientUser.createdAt);
                        const serverTime = new Date(serverUser.updatedAt || serverUser.createdAt);
                        
                        if (clientTime > serverTime) {
                            syncedUsers[serverUserIndex] = {
                                ...clientUser,
                                updatedAt: new Date().toISOString()
                            };
                        }
                    }
                }
                
                const saved = await saveUsers(syncedUsers);
                if (saved) {
                    const usersWithoutPasswords = syncedUsers.map(user => ({
                        ...user,
                        password: undefined
                    }));
                    
                    sendJSON(res, {
                        success: true,
                        data: usersWithoutPasswords,
                        conflicts: conflicts,
                        message: 'Sincronización completada',
                        timestamp: new Date().toISOString()
                    });
                } else {
                    sendError(res, 'Error al sincronizar usuarios');
                }
            } catch (error) {
                sendError(res, 'Error procesando solicitud: ' + error.message);
            }
        });
    }
    else if (method === 'GET' && pathname === '/api/health') {
        sendJSON(res, {
            status: 'OK',
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        });
    }
    else {
        sendError(res, 'Ruta no encontrada', 404);
    }
}

// Crear servidor
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;
    const pathname = parsedUrl.pathname;
    
    console.log(`${new Date().toISOString()} - ${method} ${pathname}`);
    
    // Manejar CORS preflight
    if (method === 'OPTIONS') {
        setCORSHeaders(res);
        res.writeHead(200);
        res.end();
        return;
    }
    
    // Rutas API
    if (pathname.startsWith('/api/')) {
        await handleUsers(req, res, method, pathname, parsedUrl.query);
    } else {
        // Servir archivos estáticos o redirigir
        setCORSHeaders(res);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>API de Sincronización</title>
                <style>
                    body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
                    .endpoint { background: #f5f5f5; padding: 10px; margin: 10px 0; border-radius: 5px; }
                    .method { color: #007bff; font-weight: bold; }
                </style>
            </head>
            <body>
                <h1>🌐 API de Sincronización de Usuarios</h1>
                <p>Servidor funcionando correctamente</p>
                
                <h2>Endpoints disponibles:</h2>
                <div class="endpoint">
                    <span class="method">GET</span> /api/health - Verificar estado del servidor
                </div>
                <div class="endpoint">
                    <span class="method">GET</span> /api/users - Obtener todos los usuarios
                </div>
                <div class="endpoint">
                    <span class="method">POST</span> /api/users/sync - Sincronizar usuarios
                </div>
                
                <h2>Uso:</h2>
                <p>Esta API soporta sincronización de usuarios entre múltiples dispositivos y navegadores.</p>
                <p>Los datos se persisten en el servidor y se sincronizan automáticamente.</p>
                
                <p><a href="/api/health">Probar API Health</a></p>
            </body>
            </html>
        `);
    }
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`🚀 Servidor de sincronización iniciado en puerto ${PORT}`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`🔗 API Health: http://localhost:${PORT}/api/health`);
    console.log(`👥 Users API: http://localhost:${PORT}/api/users`);
    console.log(`⏰ Iniciado: ${new Date().toISOString()}`);
});

module.exports = server;