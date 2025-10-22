const express = require('express');
const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');

const app = express();
const prisma = new PrismaClient();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../.next')));

// CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// API Routes
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { updatedAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { name, description, stock, price } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        stock: stock || 0,
        price: price || 0
      }
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { name, description, stock, price } = req.body;
    
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(stock !== undefined && { stock }),
        ...(price !== undefined && { price })
      }
    });

    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.put('/api/products/:id/stock', async (req, res) => {
  try {
    const { adjustment } = req.body;

    if (adjustment === undefined || adjustment === null) {
      return res.status(400).json({ error: 'Adjustment is required' });
    }

    const product = await prisma.product.findUnique({
      where: { id: req.params.id }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const newStock = product.stock + adjustment;
    if (newStock < 0) {
      return res.status(400).json({ error: 'Stock cannot be negative' });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: req.params.id },
      data: { stock: newStock }
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ error: 'Failed to update stock' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Serve the app - handle Next.js routing
app.get('*', (req, res) => {
  // Try to serve static files first
  const staticPath = path.join(__dirname, '../.next', req.path);
  if (fs.existsSync(staticPath) && fs.statSync(staticPath).isFile()) {
    res.sendFile(staticPath);
  } else {
    // Serve the main app page for all other routes
    res.sendFile(path.join(__dirname, '../.next/server/app/page.html'));
  }
});

// Initialize database and start server
async function startServer() {
  try {
    // Ensure database directory exists
    const dbDir = path.join(__dirname, '../db');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Push database schema
    await prisma.$connect();
    console.log('Database connected successfully');
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});