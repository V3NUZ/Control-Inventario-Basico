/**
 * Configuración de Firebase para Sincronización Real
 * 
 * Este archivo contiene la configuración para conectar
 * con Firebase Realtime Database y garantizar sincronización
 * real跨 todos los dispositivos.
 * 
 * @author V3NUZ (Desarrollador Principal)
 * @assistant Claude AI Assistant (Asistencia de Desarrollo)
 * @version 1.0
 * @license MIT
 */

// Configuración de Firebase - PROYECTO: inventario-profesional-sync
const firebaseConfig = {
    apiKey: "AIzaSyDmFz9HsYqK7Q8rL3tW5vX2nZ6aB8cD4eF",
    authDomain: "inventario-profesional-sync.firebaseapp.com",
    databaseURL: "https://inventario-profesional-sync-default-rtdb.firebaseio.com",
    projectId: "inventario-profesional-sync",
    storageBucket: "inventario-profesional-sync.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abc123def456ghi789"
};

// NOTA: Esta es una configuración de ejemplo.
// Para usarla real:
// 1. Ve a https://console.firebase.google.com/
// 2. Crea un nuevo proyecto llamado "inventario-profesional-sync"
// 3. Habilita "Realtime Database"
// 4. Copia tu configuración real aquí
// 5. Reemplaza los valores de ejemplo

// Inicializar Firebase
let firebase;
let database;

// Función para inicializar Firebase cuando el DOM esté listo
function initializeFirebase() {
    try {
        // Cargar Firebase SDK dinámicamente
        const script1 = document.createElement('script');
        script1.src = 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js';
        script1.onload = () => {
            const script2 = document.createElement('script');
            script2.src = 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database-compat.js';
            script2.onload = () => {
                // Inicializar Firebase
                firebase.initializeApp(firebaseConfig);
                database = firebase.database();
                
                console.log('✅ Firebase inicializado correctamente');
                console.log('📊 Database URL:', firebaseConfig.databaseURL);
                
                // Habilitar persistencia offline
                if (database) {
                    database.ref('.info/connected').on('value', (snapshot) => {
                        const connected = snapshot.val();
                        console.log(connected ? '🌐 Conectado a Firebase' : '📴 Desconectado de Firebase');
                    });
                }
                
                // Notificar que Firebase está listo
                window.firebaseReady = true;
                if (window.userManager && window.userManager.onFirebaseReady) {
                    window.userManager.onFirebaseReady();
                }
            };
            document.head.appendChild(script2);
        };
        document.head.appendChild(script1);
    } catch (error) {
        console.error('❌ Error inicializando Firebase:', error);
        window.firebaseReady = false;
    }
}

// Exportar para uso global
window.firebaseConfig = firebaseConfig;
window.initializeFirebase = initializeFirebase;

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFirebase);
} else {
    initializeFirebase();
}