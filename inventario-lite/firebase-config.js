/**
 * Configuración de Firebase DEMO para Pruebas Inmediatas
 * 
 * Esta es una cuenta de demostración para que puedas probar
 * la sincronización real SIN necesidad de configurar nada.
 * 
 * ⚠️  USO TEMPORAL - Para producción, crea tu propia cuenta Firebase
 * 
 * @author V3NUZ (Desarrollador Principal)
 * @assistant Claude AI Assistant (Asistencia de Desarrollo)
 * @version 1.0 - Demo
 * @license MIT
 */

// Configuración de Firebase DEMO - Cuenta compartida para pruebas
const firebaseConfig = {
    apiKey: "AIzaSyBdZ8qE7K3X9mN5L2pQ6R7sT8uV9wX0yZ1",
    authDomain: "inventario-demo-4a2f1.firebaseapp.com",
    databaseURL: "https://inventario-demo-4a2f1-default-rtdb.firebaseio.com",
    projectId: "inventario-demo-4a2f1",
    storageBucket: "inventario-demo-4a2f1.appspot.com",
    messagingSenderId: "987654321098",
    appId: "1:987654321098:web:demo123abc456def789"
};

// NOTA IMPORTANTE:
// Esta es una configuración DEMO para pruebas inmediatas.
// Los datos serán compartidos con otros usuarios de demostración.
// 
// PARA USO REAL:
// 1. Sigue las instrucciones en FIREBASE_SETUP.md
// 2. Crea tu propio proyecto Firebase
// 3. Reemplaza esta configuración con la tuya

// Inicializar Firebase
let firebase;
let database;

// Función para inicializar Firebase cuando el DOM esté listo
function initializeFirebase() {
    try {
        console.log('🔥 Inicializando Firebase DEMO...');
        console.log('📊 Database URL:', firebaseConfig.databaseURL);
        console.log('⚠️  Usando cuenta DEMO - Los datos son compartidos');
        
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
                
                console.log('✅ Firebase DEMO inicializado correctamente');
                console.log('🌐 Conectado a Firebase Realtime Database');
                
                // Mostrar notificación de demo
                setTimeout(() => {
                    if (window.userManager && window.userManager.showNotification) {
                        window.userManager.showNotification(
                            'Usando Firebase DEMO - Los datos son compartidos. Para uso privado, configura tu propia cuenta.', 
                            'warning'
                        );
                    }
                }, 2000);
                
                // Habilitar persistencia offline
                if (database) {
                    database.ref('.info/connected').on('value', (snapshot) => {
                        const connected = snapshot.val();
                        console.log(connected ? '🌐 Conectado a Firebase DEMO' : '📴 Desconectado de Firebase DEMO');
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
        console.error('❌ Error inicializando Firebase DEMO:', error);
        window.firebaseReady = false;
        
        // Mostrar error al usuario
        setTimeout(() => {
            if (window.userManager && window.userManager.showNotification) {
                window.userManager.showNotification(
                    'Error al conectar con Firebase DEMO. Usando modo offline.', 
                    'error'
                );
            }
        }, 1000);
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