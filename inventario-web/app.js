class InventoryManager {
    constructor() {
        this.products = [];
        this.editingProduct = null;
        this.init();
    }

    init() {
        try {
            this.loadFromStorage();
            this.setupEventListeners();
            this.updateStats();
            this.renderProducts();
            this.updateCategoryFilter();
            console.log('Aplicación inicializada correctamente');
        } catch (error) {
            console.error('Error al inicializar:', error);
            this.showNotification('Error al cargar la aplicación', 'error');
        }
    }

    setupEventListeners() {
        // Formulario de producto
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

        // File input for import
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
            console.error('Error loading from storage:', error);
            this.products = this.getDefaultProducts();
            this.saveToStorage();
        }
    }

    saveToStorage() {
        try {
            localStorage.setItem('inventory_products', JSON.stringify(this.products));
        } catch (error) {
            console.error('Error saving to storage:', error);
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
        const productCount = document.getElementById('productCount');
        
        if (!container) return;

        const filtered = this.getFilteredProducts();

        if (filtered.length === 0) {
            container.innerHTML = '';
            if (emptyState) emptyState.classList.remove('hidden');
            if (productCount) productCount.textContent = '0 productos';
            return;
        }

        if (emptyState) emptyState.classList.add('hidden');
        if (productCount) productCount.textContent = `${filtered.length} producto${filtered.length !== 1 ? 's' : ''}`;
        
        container.innerHTML = filtered.map(product => {
            const stockClass = product.quantity === 0 ? 'stock-zero' : 
                              product.quantity <= 5 ? 'stock-low' : 'stock-good';
            
            const stockBadge = product.quantity === 0 ? 
                '<span class="alert-badge bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">NECESITAMOS</span>' :
                product.quantity <= 5 ? 
                '<span class="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">BAJO</span>' :
                '<span class="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">DISPONIBLE</span>';

            return `
                <div class="product-card ${stockClass} bg-white rounded-lg p-4 md:p-6 shadow-md fade-in">
                    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div class="flex-1">
                            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                                <h3 class="text-lg font-semibold text-gray-800">${this.escapeHtml(product.name)}</h3>
                                ${stockBadge}
                            </div>
                            <div class="flex flex-wrap gap-2 sm:gap-4 text-sm text-gray-600 mb-3">
                                <span class="flex items-center">
                                    <i class="fas fa-tag mr-1"></i>${this.escapeHtml(product.category)}
                                </span>
                                ${product.price ? `
                                <span class="flex items-center">
                                    <i class="fas fa-dollar-sign mr-1"></i>${product.price.toFixed(2)}
                                </span>` : ''}
                                ${product.notes ? `
                                <span class="flex items-center">
                                    <i class="fas fa-sticky-note mr-1"></i>${this.escapeHtml(product.notes)}
                                </span>` : ''}
                            </div>
                        </div>
                        
                        <div class="flex items-center justify-between lg:justify-end gap-4">
                            <div class="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
                                <button onclick="inventory.adjustQuantity(${product.id}, -1)" 
                                        class="btn-quantity w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                        ${product.quantity === 0 ? 'disabled' : ''}>
                                    <i class="fas fa-minus text-xs"></i>
                                </button>
                                <span class="font-bold text-lg min-w-[3rem] text-center">${product.quantity}</span>
                                <button onclick="inventory.adjustQuantity(${product.id}, 1)" 
                                        class="btn-quantity w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center">
                                    <i class="fas fa-plus text-xs"></i>
                                </button>
                            </div>
                            
                            <div class="flex gap-2">
                                <button onclick="inventory.editProduct(${product.id})" 
                                        class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Editar">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="inventory.deleteProduct(${product.id})" 
                                        class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Eliminar">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
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

        const totalProductsEl = document.getElementById('totalProducts');
        const totalStockEl = document.getElementById('totalStock');
        const neededProductsEl = document.getElementById('neededProducts');

        if (totalProductsEl) totalProductsEl.textContent = totalProducts;
        if (totalStockEl) totalStockEl.textContent = totalStock;
        if (neededProductsEl) neededProductsEl.textContent = neededProducts;
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
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        const modal = document.getElementById('productModal');
        if (modal) {
            modal.classList.add('hidden');
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
            console.error('Export error:', error);
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
                console.error('Import error:', error);
                this.showNotification('Error al leer el archivo', 'error');
            }
        };
        reader.readAsText(file);
        
        // Reset file input
        event.target.value = '';
    }

    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        const icon = document.getElementById('notificationIcon');
        const text = document.getElementById('notificationText');
        const notificationDiv = notification ? notification.querySelector('div') : null;

        if (!notification || !icon || !text || !notificationDiv) return;

        const icons = {
            success: '<i class="fas fa-check-circle text-green-500 text-xl"></i>',
            error: '<i class="fas fa-exclamation-circle text-red-500 text-xl"></i>',
            warning: '<i class="fas fa-exclamation-triangle text-yellow-500 text-xl"></i>',
            info: '<i class="fas fa-info-circle text-blue-500 text-xl"></i>'
        };

        const colors = {
            success: 'border-green-500',
            error: 'border-red-500',
            warning: 'border-yellow-500',
            info: 'border-blue-500'
        };

        icon.innerHTML = icons[type] || icons.info;
        text.textContent = message;
        notificationDiv.className = `bg-white rounded-lg shadow-lg p-4 flex items-center space-x-3 min-w-[300px] border-l-4 ${colors[type] || colors.info}`;

        notification.classList.remove('hidden');
        notification.classList.add('fade-in');

        setTimeout(() => {
            if (notification) notification.classList.add('hidden');
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Global functions for HTML onclick handlers
function openAddModal() {
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

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, inicializando aplicación...');
    window.inventory = new InventoryManager();
});