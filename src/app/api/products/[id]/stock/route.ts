import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { adjustment } = body

    if (adjustment === undefined || adjustment === null) {
      return NextResponse.json({ error: 'Adjustment is required' }, { status: 400 })
    }

    const product = await db.product.findUnique({
      where: { id: params.id }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const newStock = product.stock + adjustment
    if (newStock < 0) {
      return NextResponse.json({ error: 'Stock cannot be negative' }, { status: 400 })
    }

    const updatedProduct = await db.product.update({
      where: { id: params.id },
      data: { stock: newStock }
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('Error updating stock:', error)
    return NextResponse.json({ error: 'Failed to update stock' }, { status: 500 })
  }
}