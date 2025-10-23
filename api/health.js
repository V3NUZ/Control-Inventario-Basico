/**
 * API Health Check para Vercel
 * 
 * @author V3NUZ (Desarrollador Principal)
 * @assistant Claude AI Assistant (Asistencia de Desarrollo)
 * @version 1.0
 * @license MIT
 */

export default function handler(req, res) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        res.status(200).json({
            status: 'OK',
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            environment: 'vercel-serverless',
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            message: 'API de sincronización funcionando correctamente'
        });
    } else {
        res.status(405).json({
            success: false,
            error: 'Método no permitido'
        });
    }
}