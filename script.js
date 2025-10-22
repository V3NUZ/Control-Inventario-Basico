// Clase para manejar el inventario
class InventoryManager {
    constructor() {
        this.products = this.loadProducts();
        this.initializeEventListeners();
        this.renderInventory();
        this.updateStats();
    }

    // Cargar productos del localStorage
    loadProducts() {
        const stored = localStorage.getItem('inventory');
        return stored ? JSON.parse(stored) : [];
    }

    // Guardar productos en localStorage
    saveProducts() {
        localStorage.setItem('inventory', JSON.stringify(this.products));
    }

    // Generar ID único
    generateId() {
        return Date.now().toString();
    }

    // Agregar producto
    addProduct(name, quantity, price, category) {
        const product = {
            id: this.generateId(),
            name: name,
            quantity: parseInt(quantity),
            price: parseFloat(price),
            category: category || 'Sin categoría'
        };
        this.products.push(product);
        this.saveProducts();
        this.renderInventory();
        this.updateStats();
    }

    // Editar producto
    editProduct(id, name, quantity, price, category) {
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
            this.products[index] = {
                id: id,
                name: name,
                quantity: parseInt(quantity),
                price: parseFloat(price),
                category: category || 'Sin categoría'
            };
            this.saveProducts();
            this.renderInventory();
            this.updateStats();
        }
    }

    // Eliminar producto
    deleteProduct(id) {
        this.products = this.products.filter(p => p.id !== id);
        this.saveProducts();
        this.renderInventory();
        this.updateStats();
    }

    // Buscar productos
    searchProducts(searchTerm) {
        return this.products.filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Renderizar inventario
    renderInventory(productsToRender = null) {
        const tbody = document.getElementById('inventory-body');
        const emptyMessage = document.getElementById('empty-message');
        const products = productsToRender || this.products;

        tbody.innerHTML = '';

        if (products.length === 0) {
            emptyMessage.style.display = 'block';
            document.getElementById('inventory-table').style.display = 'none';
        } else {
            emptyMessage.style.display = 'none';
            document.getElementById('inventory-table').style.display = 'table';

            products.forEach(product => {
                const row = document.createElement('tr');
                const total = product.quantity * product.price;
                
                row.innerHTML = `
                    <td>${product.name}</td>
                    <td>${product.quantity}</td>
                    <td>$${product.price.toFixed(2)}</td>
                    <td>${product.category}</td>
                    <td>$${total.toFixed(2)}</td>
                    <td>
                        <button class="btn btn-edit" onclick="inventory.openEditModal('${product.id}')">Editar</button>
                        <button class="btn btn-delete" onclick="inventory.confirmDelete('${product.id}')">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
    }

    // Actualizar estadísticas
    updateStats() {
        const totalProducts = this.products.reduce((sum, p) => sum + p.quantity, 0);
        const totalValue = this.products.reduce((sum, p) => sum + (p.quantity * p.price), 0);

        document.getElementById('total-products').textContent = totalProducts;
        document.getElementById('total-value').textContent = `$${totalValue.toFixed(2)}`;
    }

    // Abrir modal de edición
    openEditModal(id) {
        const product = this.products.find(p => p.id === id);
        if (product) {
            document.getElementById('edit-id').value = product.id;
            document.getElementById('edit-name').value = product.name;
            document.getElementById('edit-quantity').value = product.quantity;
            document.getElementById('edit-price').value = product.price;
            document.getElementById('edit-category').value = product.category;
            document.getElementById('edit-modal').style.display = 'block';
        }
    }

    // Cerrar modal
    closeModal() {
        document.getElementById('edit-modal').style.display = 'none';
    }

    // Confirmar eliminación
    confirmDelete(id) {
        const product = this.products.find(p => p.id === id);
        if (product && confirm(`¿Está seguro de eliminar "${product.name}"?`)) {
            this.deleteProduct(id);
        }
    }

    // Inicializar event listeners
    initializeEventListeners() {
        // Formulario de agregar producto
        document.getElementById('product-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('product-name').value;
            const quantity = document.getElementById('product-quantity').value;
            const price = document.getElementById('product-price').value;
            const category = document.getElementById('product-category').value;

            this.addProduct(name, quantity, price, category);

            // Limpiar formulario
            e.target.reset();
            document.getElementById('product-name').focus();
        });

        // Formulario de editar producto
        document.getElementById('edit-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('edit-id').value;
            const name = document.getElementById('edit-name').value;
            const quantity = document.getElementById('edit-quantity').value;
            const price = document.getElementById('edit-price').value;
            const category = document.getElementById('edit-category').value;

            this.editProduct(id, name, quantity, price, category);
            this.closeModal();
        });

        // Cerrar modal
        document.querySelector('.close').addEventListener('click', () => {
            this.closeModal();
        });

        // Cerrar modal al hacer click fuera
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('edit-modal');
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // Búsqueda de productos
        document.getElementById('search-input').addEventListener('input', (e) => {
            const searchTerm = e.target.value;
            if (searchTerm.trim() === '') {
                this.renderInventory();
            } else {
                const filtered = this.searchProducts(searchTerm);
                this.renderInventory(filtered);
            }
        });
    }
}

// Inicializar el gestor de inventario
const inventory = new InventoryManager();
