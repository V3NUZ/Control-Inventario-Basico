/**
 * Inventario Profesional - Motor Principal MultiTienda
 * 
 * Este sistema gestiona:
 * - Operaciones CRUD de productos por tienda
 * - Control de stock con ajustes rápidos (+/-)
 * - Sistema de alertas automáticas (NECESITAMOS)
 * - Búsqueda y filtrado avanzado
 * - Importación/Exportación de datos por tienda
 * - Persistencia local con localStorage por tienda
 * 
 * Características principales:
 * - Ultra optimizado para rendimiento
 * - Diseño responsive y accesible
 * - Control de permisos integrado
 * - Validación de datos robusta
 * - Soporte multi-tienda
 * 
 * @author V3NUZ (Desarrollador Principal)
 * @assistant Claude AI Assistant (Asistencia de Desarrollo)
 * @version 3.1.0 MultiTienda con Asignación de Empleados
 * @license MIT
 */

class InventoryManager {
    constructor() {
        this.products = [];
        this.currentStore = null;
        this.editingProduct = null;
        this.init();
    }

    init() {
        this.checkStoreSelection();
        this.loadFromStorage();
        this.setupEventListeners();
        this.updateStats();
        this.renderProducts();
        this.updateCategoryFilter();
        this.updateStoreInfo();
        console.log('Inventario cargado -', this.products.length, 'productos para tienda:', this.currentStore?.name);
    }

    checkStoreSelection() {
        // Verificar autenticación primero
        const session = localStorage.getItem('inventario_session');
        if (!session) {
            window.location.href = 'login.html';
            return;
        }
        
        const sessionData = JSON.parse(session);
        const expiresAt = new Date(sessionData.expiresAt);
        
        if (expiresAt <= new Date()) {
            localStorage.removeItem('inventario_session');
            window.location.href = 'login.html';
            return;
        }

        // Verificar si hay una tienda seleccionada
        const urlParams = new URLSearchParams(window.location.search);
        const storeParam = urlParams.get('store');
        const selectedStore = localStorage.getItem('selected_store');
        
        // Si viene por parámetro URL, usarlo y guardarlo
        if (storeParam) {
            const storeData = JSON.parse(storeParam);
            // Verificar permisos para esta tienda
            if (!this.canAccessStore(storeData.id, sessionData.user)) {
                this.showNotification('No tienes permiso para acceder a esta tienda', 'error');
                window.location.href = 'tienda-selector.html';
                return;
            }
            localStorage.setItem('selected_store', storeParam);
            this.currentStore = storeData;
            return;
        }
        
        // Si no hay tienda seleccionada, redirigir al selector
        if (!selectedStore) {
            window.location.href = 'tienda-selector.html';
            return;
        }
        
        const storeData = JSON.parse(selectedStore);
        // Verificar permisos para esta tienda
        if (!this.canAccessStore(storeData.id, sessionData.user)) {
            this.showNotification('No tienes permiso para acceder a esta tienda', 'error');
            window.location.href = 'tienda-selector.html';
            return;
        }
        
        this.currentStore = storeData;
    }

    canAccessStore(storeId, user) {
        // Los administradores pueden acceder a todas las tiendas
        if (user && user.role === 'admin') {
            return true;
        }

        // Verificar asignaciones de empleados
        const assignments = localStorage.getItem('employee_store_assignments');
        if (assignments) {
            const parsedAssignments = JSON.parse(assignments);
            const userAssignments = parsedAssignments[user.username] || [];
            return userAssignments.includes(parseInt(storeId)) || userAssignments.includes(storeId);
        }
        
        return false;
    }
    
    getStoreInfo(storeId) {
        const stores = {
            'la-estancia': {
                id: 'la-estancia',
                name: 'La Estancia',
                location: 'Tienda principal de productos para el hogar',
                icon: 'fas fa-home',
                color: '#10b981'
            },
            'animal-world': {
                id: 'animal-world',
                name: 'Animal World',
                location: 'Tienda especializada en productos para mascotas',
                icon: 'fas fa-paw',
                color: '#f97316'
            }
        };
        
        return stores[storeId] || stores['la-estancia'];
    }

    initConsolidatedView() {
        // Lógica especial para vista consolidada
        this.isConsolidated = true;
        localStorage.removeItem('consolidated_view');
    }

    loadFromStorage() {
        try {
            let storageKey = `inventory_products_${this.currentStore.id}`;
            
            const stored = localStorage.getItem(storageKey);
            if (stored) {
                this.products = JSON.parse(stored);
            } else {
                this.products = this.getDefaultProducts();
                this.saveToStorage();
            }
        } catch (error) {
            console.error('Error cargando datos:', error);
            this.products = this.getDefaultProducts();
            this.saveToStorage();
        }
    }

    saveToStorage() {
        try {
            let storageKey = `inventory_products_${this.currentStore.id}`;
            localStorage.setItem(storageKey, JSON.stringify(this.products));
        } catch (error) {
            console.error('Error guardando datos:', error);
        }
    }

    setupEventListeners() {
        // Formulario
        const form = document.getElementById('productForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProduct();
            });
        }

        // Búsqueda y filtros
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.renderProducts());
        }

        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.renderProducts());
        }

        const stockFilter = document.getElementById('stockFilter');
        if (stockFilter) {
            stockFilter.addEventListener('change', () => this.renderProducts());
        }

        // Cerrar modal con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });

        // File input
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                this.handleFileImport(e);
            });
        }

        // Botón de cambiar de tienda
        const changeStoreBtn = document.getElementById('changeStoreBtn');
        if (changeStoreBtn) {
            changeStoreBtn.addEventListener('click', () => {
                localStorage.removeItem('selected_store');
                window.location.href = 'tienda-selector.html';
            });
        }
    }

    updateStoreInfo() {
        if (!this.currentStore) return;

        // Actualizar información de la tienda en la interfaz
        const storeNameElement = document.getElementById('storeName');
        const storeColorElement = document.getElementById('storeColor');

        if (storeNameElement) {
            storeNameElement.textContent = this.currentStore.name;
        }
        if (storeColorElement && this.currentStore.color) {
            storeColorElement.style.backgroundColor = this.currentStore.color;
        }

        // Actualizar título de la página
        document.title = `${this.currentStore.name} - Inventario Profesional`;
    }

    getDefaultProducts() {
        // Productos para Pet Shop Agropecuaria
        if (this.currentStore.id === 'la-estancia') {
            return [
                {
                    id: 1,
                    name: 'Alimento Balanceado Vacuno',
                    category: 'Ganado',
                    quantity: 25,
                    price: 45.99,
                    notes: 'Bolsa 40kg para engorde',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    name: 'Antiparasitario Canino',
                    category: 'Medicamentos',
                    quantity: 0,
                    price: 28.50,
                    notes: 'Tratamiento mensual 6 tabletas',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 3,
                    name: 'Shampoo Antipulgas Gatos',
                    category: 'Higiene',
                    quantity: 12,
                    price: 15.99,
                    notes: 'Frasco 250ml',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 4,
                    name: 'Vitaminas Pollo Engorde',
                    category: 'Aves',
                    quantity: 8,
                    price: 22.75,
                    notes: 'Presentación 1kg',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 5,
                    name: 'Collar Antipulgas Mediano',
                    category: 'Accesorios',
                    quantity: 15,
                    price: 12.99,
                    notes: 'Para perros 10-25kg',
                    createdAt: new Date().toISOString()
                }
            ];
        } else if (this.currentStore.id === 'animal-world') {
            return [
                {
                    id: 1,
                    name: 'Alimento Premium Perros Adultos',
                    category: 'Alimentos',
                    quantity: 30,
                    price: 52.99,
                    notes: 'Bolsa 20kg sabor carne',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    name: 'Juguete Mordedor Gatos',
                    category: 'Juguetes',
                    quantity: 0,
                    price: 8.99,
                    notes: 'Con catnip incluido',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 3,
                    name: 'Cama Ortopédica Grande',
                    category: 'Accesorios',
                    quantity: 6,
                    price: 89.99,
                    notes: 'Para perros grandes',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 4,
                    name: 'Vacuna Triple Felina',
                    category: 'Medicamentos',
                    quantity: 4,
                    price: 35.50,
                    notes: 'Dosis única con jeringa',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 5,
                    name: 'Arena Sanitaria Gatos',
                    category: 'Higiene',
                    quantity: 20,
                    price: 18.75,
                    notes: 'Bolsa 10kg aglomerante',
                    createdAt: new Date().toISOString()
                }
            ];
        }
        
        return [];
    }

    saveProduct() {
        const name = document.getElementById('productName').value.trim();
        const category = document.getElementById('productCategory').value.trim();
        const quantity = parseInt(document.getElementById('productQuantity').value) || 0;
        const price = parseFloat(document.getElementById('productPrice').value) || 0;
        const notes = document.getElementById('productNotes').value.trim();

        if (!name || !category) {
            this.showNotification('Por favor completa los campos obligatorios', 'error');
            return;
        }

        if (this.editingProduct) {
            const index = this.products.findIndex(p => p.id === this.editingProduct.id);
            if (index !== -1) {
                this.products[index] = {
                    ...this.products[index],
                    name,
                    category,
                    quantity,
                    price,
                    notes,
                    updatedAt: new Date().toISOString()
                };
            }
        } else {
            const newProduct = {
                id: Date.now(),
                name,
                category,
                quantity,
                price,
                notes,
                createdAt: new Date().toISOString()
            };
            this.products.push(newProduct);
        }

        this.saveToStorage();
        this.updateStats();
        this.renderProducts();
        this.updateCategoryFilter();
        this.closeModal();
        this.showNotification(this.editingProduct ? 'Producto actualizado' : 'Producto agregado', 'success');
    }

    deleteProduct(id) {
        if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            this.products = this.products.filter(p => p.id !== id);
            this.saveToStorage();
            this.updateStats();
            this.renderProducts();
            this.updateCategoryFilter();
            this.showNotification('Producto eliminado', 'info');
        }
    }

    adjustQuantity(id, change) {
        const product = this.products.find(p => p.id === id);
        if (product) {
            const newQuantity = Math.max(0, product.quantity + change);
            product.quantity = newQuantity;
            product.updatedAt = new Date().toISOString();
            this.saveToStorage();
            this.updateStats();
            this.renderProducts();
            
            if (newQuantity === 0) {
                this.showNotification(`${product.name} está agotado`, 'warning');
            }
        }
    }

    getFilteredProducts() {
        let filtered = [...this.products];
        
        // Búsqueda
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            const searchTerm = searchInput.value.toLowerCase();
            if (searchTerm) {
                filtered = filtered.filter(p => 
                    p.name.toLowerCase().includes(searchTerm) ||
                    p.category.toLowerCase().includes(searchTerm) ||
                    (p.notes && p.notes.toLowerCase().includes(searchTerm))
                );
            }
        }

        // Filtro por categoría
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            const categoryValue = categoryFilter.value;
            if (categoryValue) {
                filtered = filtered.filter(p => p.category === categoryValue);
            }
        }

        // Filtro por stock
        const stockFilter = document.getElementById('stockFilter');
        if (stockFilter) {
            const stockValue = stockFilter.value;
            if (stockValue) {
                filtered = filtered.filter(p => {
                    if (stockValue === 'zero') return p.quantity === 0;
                    if (stockValue === 'low') return p.quantity > 0 && p.quantity <= 5;
                    if (stockValue === 'good') return p.quantity > 5;
                    return true;
                });
            }
        }

        // Ordenar: primero los sin stock, luego por nombre
        return filtered.sort((a, b) => {
            if (a.quantity === 0 && b.quantity !== 0) return -1;
            if (a.quantity !== 0 && b.quantity === 0) return 1;
            return a.name.localeCompare(b.name);
        });
    }

    renderProducts() {
        const container = document.getElementById('productsList');
        const emptyState = document.getElementById('emptyState');
        
        if (!container) return;

        const filtered = this.getFilteredProducts();
        const session = JSON.parse(localStorage.getItem('inventario_session') || '{}');
        const permissions = session.user?.permissions || [];

        if (filtered.length === 0) {
            container.innerHTML = '';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';
        
        container.innerHTML = filtered.map(product => {
            const stockClass = product.quantity === 0 ? 'stock-zero' : 
                              product.quantity <= 5 ? 'stock-low' : 'stock-good';
            
            const stockBadge = product.quantity === 0 ? 
                '<span class="badge badge-danger">NECESITAMOS</span>' :
                product.quantity <= 5 ? 
                '<span class="badge badge-warning">BAJO</span>' :
                '<span class="badge badge-success">DISPONIBLE</span>';

            // Determinar qué botones mostrar según permisos
            const canEdit = permissions.includes('write');
            const canDelete = permissions.includes('delete');
            
            const actionButtons = [];
            if (canEdit) {
                actionButtons.push(`<button class="btn-icon btn-edit" onclick="inventory.editProduct(${product.id})" title="Editar">✏️</button>`);
            }
            if (canDelete) {
                actionButtons.push(`<button class="btn-icon btn-delete" onclick="inventory.deleteProduct(${product.id})" title="Eliminar">🗑️</button>`);
            }

            return `
                <div class="product-card ${stockClass}">
                    <div class="product-info">
                        <div class="product-name">
                            ${this.escapeHtml(product.name)}
                            ${stockBadge}
                        </div>
                        <div class="product-details">
                            📁 ${this.escapeHtml(product.category)}
                            ${product.price ? ` • 💰 $${product.price.toFixed(2)}` : ''}
                            ${product.notes ? ` • 📝 ${this.escapeHtml(product.notes)}` : ''}
                        </div>
                    </div>
                    
                    <div class="product-actions">
                        ${canEdit ? `
                        <div class="quantity-controls">
                            <button class="quantity-btn btn-minus" onclick="inventory.adjustQuantity(${product.id}, -1)" 
                                    ${product.quantity === 0 ? 'disabled' : ''}>−</button>
                            <span class="quantity-display">${product.quantity}</span>
                            <button class="quantity-btn btn-plus" onclick="inventory.adjustQuantity(${product.id}, 1)">+</button>
                        </div>
                        ` : `
                        <div class="quantity-display" style="padding: 5px 10px; background: #f5f5f5; border-radius: 8px; font-weight: 600;">
                            ${product.quantity} unidades
                        </div>
                        `}
                        
                        ${actionButtons.length > 0 ? `
                        <div class="action-buttons">
                            ${actionButtons.join('')}
                        </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    editProduct(id) {
        const product = this.products.find(p => p.id === id);
        if (product) {
            this.editingProduct = product;
            const modalTitle = document.getElementById('modalTitle');
            if (modalTitle) modalTitle.textContent = 'Editar Producto';
            
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productQuantity').value = product.quantity;
            document.getElementById('productPrice').value = product.price || '';
            document.getElementById('productNotes').value = product.notes || '';
            this.openModal();
        }
    }

    updateStats() {
        const totalProducts = this.products.length;
        const totalStock = this.products.reduce((sum, p) => sum + p.quantity, 0);
        const neededProducts = this.products.filter(p => p.quantity === 0).length;

        this.updateElement('totalProducts', totalProducts);
        this.updateElement('totalStock', totalStock);
        this.updateElement('neededProducts', neededProducts);
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    }

    updateCategoryFilter() {
        const categories = [...new Set(this.products.map(p => p.category))].sort();
        const select = document.getElementById('categoryFilter');
        
        if (!select) return;
        
        const currentValue = select.value;
        
        select.innerHTML = '<option value="">Todas las categorías</option>' +
            categories.map(cat => `<option value="${this.escapeHtml(cat)}">${this.escapeHtml(cat)}</option>`).join('');
        
        select.value = currentValue;
    }

    openModal() {
        const modal = document.getElementById('productModal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        const modal = document.getElementById('productModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            this.resetForm();
        }
    }

    resetForm() {
        const form = document.getElementById('productForm');
        if (form) form.reset();
        
        const productId = document.getElementById('productId');
        const modalTitle = document.getElementById('modalTitle');
        
        if (productId) productId.value = '';
        if (modalTitle) modalTitle.textContent = 'Agregar Producto';
        this.editingProduct = null;
    }

    exportData() {
        try {
            const dataStr = JSON.stringify({ products: this.products }, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `inventario-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            this.showNotification('Datos exportados correctamente', 'success');
        } catch (error) {
            console.error('Error exportando:', error);
            this.showNotification('Error al exportar datos', 'error');
        }
    }

    importData() {
        const fileInput = document.getElementById('fileInput');
        if (fileInput) fileInput.click();
    }

    handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.products && Array.isArray(data.products)) {
                    if (confirm('¿Importar estos datos? Reemplazará todos los productos actuales.')) {
                        this.products = data.products;
                        this.saveToStorage();
                        this.updateStats();
                        this.renderProducts();
                        this.updateCategoryFilter();
                        this.showNotification('Datos importados correctamente', 'success');
                    }
                } else {
                    this.showNotification('Formato de archivo inválido', 'error');
                }
            } catch (error) {
                console.error('Error importando:', error);
                this.showNotification('Error al leer el archivo', 'error');
            }
        };
        reader.readAsText(file);
        
        event.target.value = '';
    }

    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        if (!notification) return;

        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';

        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Funciones globales
function openModal() {
    if (window.inventory) inventory.openModal();
}

function closeModal() {
    if (window.inventory) inventory.closeModal();
}

function exportData() {
    if (window.inventory) inventory.exportData();
}

function importData() {
    if (window.inventory) inventory.importData();
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('Iniciando Inventario Profesional...');
    window.inventory = new InventoryManager();
});