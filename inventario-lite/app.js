class InventoryManager {
    constructor() {
        this.products = [];
        this.editingProduct = null;
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.updateStats();
        this.renderProducts();
        this.updateCategoryFilter();
        console.log('Inventario cargado -', this.products.length, 'productos');
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
    }

    loadFromStorage() {
        try {
            const stored = localStorage.getItem('inventory_products');
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
            localStorage.setItem('inventory_products', JSON.stringify(this.products));
        } catch (error) {
            console.error('Error guardando datos:', error);
        }
    }

    getDefaultProducts() {
        return [
            {
                id: 1,
                name: 'Laptop Dell XPS',
                category: 'Electrónicos',
                quantity: 5,
                price: 1200,
                notes: 'Laptops de alto rendimiento',
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                name: 'Mouse Inalámbrico',
                category: 'Accesorios',
                quantity: 0,
                price: 25,
                notes: 'Mouse USB recargable',
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                name: 'Silla Ergonómica',
                category: 'Mobiliario',
                quantity: 2,
                price: 350,
                notes: 'Silla de oficina con soporte lumbar',
                createdAt: new Date().toISOString()
            }
        ];
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