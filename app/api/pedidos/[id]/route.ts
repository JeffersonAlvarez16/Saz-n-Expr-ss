/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/pedidos/[id]/route.ts
import { db } from '@/app/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// Definir el tipo correcto para el contexto en Next.js 15
type RouteContext = {
  params: {
    id: string;
  };
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id
    
    // Obtener el pedido por ID
    const pedidoResult = await db.execute({
      sql: `SELECT * FROM pedidos WHERE id = ?`,
      args: [id]
    });
    
    if (pedidoResult.rows.length === 0) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }
    
    const pedido = pedidoResult.rows[0];
    
    // Obtener los ítems del pedido
    const itemsResult = await db.execute({
      sql: `
        SELECT pi.*, p.nombre as producto_nombre, pt.nombre as producto_tipo
        FROM pedido_items pi
        LEFT JOIN productos p ON pi.producto_id = p.id
        LEFT JOIN producto_tipos pt ON pi.producto_tipo_id = pt.id
        WHERE pi.pedido_id = ?
      `,
      args: [id]
    });
    
    return NextResponse.json(pedido);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id
    const { estado } = await request.json();
    
    // Validar que el estado sea válido
    const estadosValidos = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'];
    if (!estadosValidos.includes(estado)) {
      return NextResponse.json(
        { error: 'Estado no válido' },
        { status: 400 }
      );
    }
    
    // Actualizar el estado del pedido
    const result = await db.execute({
      sql: `UPDATE pedidos SET estado = ? WHERE id = ?`,
      args: [estado, id]
    });
    
    if (result.rowsAffected === 0) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id
    
    // Eliminar los ítems del pedido primero
    await db.execute({
      sql: `DELETE FROM pedido_items WHERE pedido_id = ?`,
      args: [id]
    });
    
    // Luego eliminar el pedido
    const result = await db.execute({
      sql: `DELETE FROM pedidos WHERE id = ?`,
      args: [id]
    });
    
    if (result.rowsAffected === 0) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}