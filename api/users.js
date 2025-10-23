/**
 * API Serverless para Vercel - Sincronización de Usuarios
 * 
 * Esta función serverless proporciona:
 * - Sincronización de usuarios en la nube
 * - Persistencia de datos跨 dispositivos
 * - API RESTful para gestión de usuarios
 * 
 * @author V3NUZ (Desarrollador Principal)
 * @assistant Claude AI Assistant (Asistencia de Desarrollo)
 * @version 1.0
 * @license MIT
 */

const fs = require('fs').promises;
const path = require('path');

// Para Vercel, usamos el directorio /tmp que es writeable
const USERS_FILE = path.join('/tmp', 'users.json');

// Inicializar archivo de usuarios si no existe
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
        console.log('✅ Archivo de usuarios inicializado en Vercel');
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

// Manejar diferentes métodos HTTP
export default async function handler(req, res) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        await initializeUsersFile();
        const { method, query } = req;

        if (method === 'GET') {
            const users = await readUsers();
            const usersWithoutPasswords = users.map(user => ({
                ...user,
                password: undefined
            }));
            
            res.status(200).json({
                success: true,
                data: usersWithoutPasswords,
                count: usersWithoutPasswords.length,
                timestamp: new Date().toISOString(),
                source: 'vercel-serverless'
            });
        }
        else if (method === 'POST' && req.url.endsWith('/sync')) {
            const { users: clientUsers } = req.body;
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
                    } else if (clientTime < serverTime) {
                        conflicts.push({
                            type: 'server_newer',
                            userId: clientUser.id,
                            username: clientUser.username,
                            serverVersion: { ...serverUser, password: undefined },
                            clientVersion: { ...clientUser, password: undefined }
                        });
                    }
                }
            }
            
            const saved = await saveUsers(syncedUsers);
            if (saved) {
                const usersWithoutPasswords = syncedUsers.map(user => ({
                    ...user,
                    password: undefined
                }));
                
                res.status(200).json({
                    success: true,
                    data: usersWithoutPasswords,
                    conflicts: conflicts,
                    message: 'Sincronización completada',
                    timestamp: new Date().toISOString(),
                    source: 'vercel-serverless'
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Error al sincronizar usuarios'
                });
            }
        }
        else if (method === 'POST') {
            const newUser = {
                id: Date.now(), // Simple ID basado en timestamp
                ...req.body,
                active: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            const users = await readUsers();
            
            // Verificar si el username ya existe
            if (users.find(u => u.username === newUser.username)) {
                return res.status(400).json({
                    success: false,
                    error: 'El nombre de usuario ya existe'
                });
            }
            
            users.push(newUser);
            const saved = await saveUsers(users);
            
            if (saved) {
                const userWithoutPassword = { ...newUser, password: undefined };
                res.status(201).json({
                    success: true,
                    data: userWithoutPassword,
                    message: 'Usuario creado exitosamente',
                    timestamp: new Date().toISOString()
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Error al guardar usuario'
                });
            }
        }
        else if (method === 'PUT') {
            const { id } = query;
            const users = await readUsers();
            const userIndex = users.findIndex(u => u.id === parseInt(id));
            
            if (userIndex === -1) {
                return res.status(404).json({
                    success: false,
                    error: 'Usuario no encontrado'
                });
            }
            
            const updatedUser = {
                ...users[userIndex],
                ...req.body,
                id: parseInt(id),
                updatedAt: new Date().toISOString()
            };
            
            users[userIndex] = updatedUser;
            const saved = await saveUsers(users);
            
            if (saved) {
                const userWithoutPassword = { ...updatedUser, password: undefined };
                res.status(200).json({
                    success: true,
                    data: userWithoutPassword,
                    message: 'Usuario actualizado exitosamente',
                    timestamp: new Date().toISOString()
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Error al actualizar usuario'
                });
            }
        }
        else if (method === 'DELETE') {
            const { id } = query;
            const users = await readUsers();
            const userIndex = users.findIndex(u => u.id === parseInt(id));
            
            if (userIndex === -1) {
                return res.status(404).json({
                    success: false,
                    error: 'Usuario no encontrado'
                });
            }
            
            const deletedUser = users[userIndex];
            users.splice(userIndex, 1);
            const saved = await saveUsers(users);
            
            if (saved) {
                res.status(200).json({
                    success: true,
                    data: { id: deletedUser.id, username: deletedUser.username },
                    message: 'Usuario eliminado exitosamente',
                    timestamp: new Date().toISOString()
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Error al eliminar usuario'
                });
            }
        }
        else {
            res.status(405).json({
                success: false,
                error: 'Método no permitido'
            });
        }
    } catch (error) {
        console.error('Error en API de usuarios:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor',
            message: error.message
        });
    }
}