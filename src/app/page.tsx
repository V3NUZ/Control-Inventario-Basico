'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Package, Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Product {
  id: string
  name: string
  description: string
  stock: number
  price: number
  createdAt: string
  updatedAt: string
}

export default function InventoryApp() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    stock: 0,
    price: 0
  })
  const [stockAdjustment, setStockAdjustment] = useState(0)

  // Cargar productos desde localStorage o API
  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      // Intentar cargar desde API primero
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      } else {
        // Fallback a localStorage
        const stored = localStorage.getItem('inventory-products')
        if (stored) {
          setProducts(JSON.parse(stored))
        } else {
          // Datos de ejemplo iniciales
          const mockProducts: Product[] = [
            {
              id: '1',
              name: 'Laptop Dell XPS 15',
              description: 'Laptop de alto rendimiento con pantalla 4K',
              stock: 5,
              price: 1299.99,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: '2',
              name: 'Mouse Logitech MX Master 3',
              description: 'Mouse ergonómico inalámbrico',
              stock: 12,
              price: 99.99,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: '3',
              name: 'Teclado mecánico RGB',
              description: 'Teclado gaming con retroiluminación RGB',
              stock: 8,
              price: 149.99,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ]
          setProducts(mockProducts)
          localStorage.setItem('inventory-products', JSON.stringify(mockProducts))
        }
      }
    } catch (error) {
      console.error('Error loading products:', error)
      // Fallback a localStorage
      const stored = localStorage.getItem('inventory-products')
      if (stored) {
        setProducts(JSON.parse(stored))
      }
    } finally {
      setLoading(false)
    }
  }

  const saveToLocalStorage = (products: Product[]) => {
    localStorage.setItem('inventory-products', JSON.stringify(products))
  }

  const handleCreateProduct = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "El nombre del producto es requerido",
        variant: "destructive"
      })
      return
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      stock: formData.stock,
      price: formData.price,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    try {
      // Intentar guardar en API
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const createdProduct = await response.json()
        setProducts([...products, createdProduct])
      } else {
        // Fallback a localStorage
        const updatedProducts = [...products, newProduct]
        setProducts(updatedProducts)
        saveToLocalStorage(updatedProducts)
      }
    } catch (error) {
      // Fallback a localStorage
      const updatedProducts = [...products, newProduct]
      setProducts(updatedProducts)
      saveToLocalStorage(updatedProducts)
    }

    setFormData({ name: '', description: '', stock: 0, price: 0 })
    setIsCreateDialogOpen(false)
    toast({
      title: "Éxito",
      description: "Producto creado exitosamente"
    })
  }

  const handleUpdateStock = async (productId: string, adjustment: number) => {
    const product = products.find(p => p.id === productId)
    if (!product) return

    const newStock = product.stock + adjustment
    if (newStock < 0) {
      toast({
        title: "Error",
        description: "No se puede tener stock negativo",
        variant: "destructive"
      })
      return
    }

    try {
      // Intentar actualizar en API
      const response = await fetch(`/api/products/${productId}/stock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adjustment }),
      })

      if (response.ok) {
        const updatedProduct = await response.json()
        setProducts(products.map(p => p.id === productId ? updatedProduct : p))
      } else {
        // Fallback a localStorage
        const updatedProducts = products.map(p => 
          p.id === productId 
            ? { ...p, stock: newStock, updatedAt: new Date().toISOString() }
            : p
        )
        setProducts(updatedProducts)
        saveToLocalStorage(updatedProducts)
      }
    } catch (error) {
      // Fallback a localStorage
      const updatedProducts = products.map(p => 
        p.id === productId 
          ? { ...p, stock: newStock, updatedAt: new Date().toISOString() }
          : p
      )
      setProducts(updatedProducts)
      saveToLocalStorage(updatedProducts)
    }

    toast({
      title: "Éxito",
      description: "Stock actualizado"
    })
  }

  const handleDeleteProduct = async (productId: string) => {
    try {
      // Intentar eliminar en API
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setProducts(products.filter(p => p.id !== productId))
      } else {
        // Fallback a localStorage
        const updatedProducts = products.filter(p => p.id !== productId)
        setProducts(updatedProducts)
        saveToLocalStorage(updatedProducts)
      }
    } catch (error) {
      // Fallback a localStorage
      const updatedProducts = products.filter(p => p.id !== productId)
      setProducts(updatedProducts)
      saveToLocalStorage(updatedProducts)
    }

    toast({
      title: "Éxito",
      description: "Producto eliminado"
    })
  }

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product)
    setStockAdjustment(0)
    setIsEditDialogOpen(true)
  }

  const totalProducts = products.length
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0)
  const lowStockProducts = products.filter(product => product.stock < 5).length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Cargando inventario...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema de Inventario</h1>
          <p className="text-gray-600">Gestiona tu inventario de productos de manera sencilla</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total en Stock</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStock}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{lowStockProducts}</div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Lista de Productos</h2>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Producto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nuevo Producto</DialogTitle>
                <DialogDescription>
                  Agrega un nuevo producto a tu inventario
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre del Producto</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: Laptop Dell XPS 15"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descripción del producto"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="stock">Stock Inicial</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Precio</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <Button onClick={handleCreateProduct} className="w-full">
                  Crear Producto
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Products List */}
        <div className="grid gap-4">
          {products.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos</h3>
                  <p className="text-gray-500">Comienza agregando tu primer producto al inventario</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            products.map((product) => (
              <Card key={product.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">{product.description}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-sm text-gray-500">Stock:</span>
                        <span className={`font-semibold ${product.stock < 5 ? 'text-red-600' : 'text-green-600'}`}>
                          {product.stock} unidades
                        </span>
                        <span className="text-sm text-gray-500">Precio:</span>
                        <span className="font-semibold">${product.price.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog open={isEditDialogOpen && selectedProduct?.id === product.id} onOpenChange={(open) => {
                        if (!open) {
                          setIsEditDialogOpen(false)
                          setSelectedProduct(null)
                        }
                      }}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Stock - {selectedProduct?.name}</DialogTitle>
                            <DialogDescription>
                              Ajusta la cantidad de stock para este producto
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Stock Actual: {selectedProduct?.stock}</Label>
                            </div>
                            <div>
                              <Label htmlFor="adjustment">Ajuste de Stock</Label>
                              <Input
                                id="adjustment"
                                type="number"
                                value={stockAdjustment}
                                onChange={(e) => setStockAdjustment(parseInt(e.target.value) || 0)}
                                placeholder="Usa números positivos para agregar, negativos para restar"
                              />
                            </div>
                            <div className="text-sm text-gray-600">
                              Nuevo stock: {selectedProduct ? Math.max(0, selectedProduct.stock + stockAdjustment) : 0}
                            </div>
                            <Button 
                              onClick={() => {
                                if (selectedProduct) {
                                  handleUpdateStock(selectedProduct.id, stockAdjustment)
                                  setIsEditDialogOpen(false)
                                  setSelectedProduct(null)
                                  setStockAdjustment(0)
                                }
                              }} 
                              className="w-full"
                            >
                              Actualizar Stock
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}