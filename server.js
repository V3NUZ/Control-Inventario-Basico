/**
 * Servidor Express para API de Sincronización
 * 
 * Este servidor proporciona:
 * - API REST para sincronización de usuarios
 * - Persistencia en la nube
 * - CORS para acceso desde el frontend
 * - Logging de solicitudes
 * 
 * @author V3NUZ (Desarrollador Principal)
 * @assistant Claude AI Assistant (Asistencia de Desarrollo)
 * @version 1.0
 * @license MIT
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

// Importar rutas
const usersRouter = require('./api/users');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'https://inventario-profesional.vercel.app', 'https://inventario-profesional.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Rutas API
app.use('/api/users', usersRouter);

// Ruta de salud
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development'
    });
});

// Servir archivos estáticos (para producción)
app.use(express.static(path.join(__dirname, 'public')));

// Manejo de errores
app.use((err, req, res, next) => {
    console.error('Error del servidor:', err);
    res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: err.message
    });
});

// Ruta no encontrada
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Ruta no encontrada',
        path: req.originalUrl
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor API iniciado en puerto ${PORT}`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`🔗 API Health: http://localhost:${PORT}/api/health`);
    console.log(`👥 Users API: http://localhost:${PORT}/api/users`);
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
});

module.exports = app;