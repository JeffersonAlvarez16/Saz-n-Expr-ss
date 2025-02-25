/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/pedidos/route.ts
import { db } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Primero obtenemos todos los pedidos
    const pedidosResult = await db.execute(`
      SELECT * FROM pedidos ORDER BY creado_en DESC
    `);
    
    const pedidos = pedidosResult.rows;
    
    // Para cada pedido, obtenemos sus ítems
    for (const pedido of pedidos) {
      const itemsResult = await db.execute({
        sql: `
          SELECT pi.*, p.nombre as producto_nombre, pt.nombre as producto_tipo
          FROM pedido_items pi
          LEFT JOIN productos p ON pi.producto_id = p.id
          LEFT JOIN producto_tipos pt ON pi.producto_tipo_id = pt.id
          WHERE pi.pedido_id = ?
        `,
        args: [pedido.id]
      });
      
    }
    
    return NextResponse.json(pedidos);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { cliente_nombre, cliente_telefono, cliente_direccion, total, items } = await request.json();
    
    if (!cliente_nombre || !cliente_telefono || !total || !items || !items.length) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos para el pedido' },
        { status: 400 }
      );
    }
    
    // Iniciar una transacción para asegurar que se guarden o fallen todos los datos
    const pedidoResult = await db.execute({
      sql: `
        INSERT INTO pedidos (cliente_nombre, cliente_telefono, cliente_direccion, estado, total)
        VALUES (?, ?, ?, ?, ?)
      `,
      args: [cliente_nombre, cliente_telefono, cliente_direccion || null, 'pendiente', total]
    });
    
    const pedidoId = pedidoResult.lastInsertRowid;
    
    // Insertar cada ítem del pedido
    for (const item of items) {
      await db.execute({
        sql: `
          INSERT INTO pedido_items (pedido_id, producto_id, producto_tipo_id, cantidad, precio)
          VALUES (?, ?, ?, ?, ?)
        `,
        args: [
          pedidoId,
          item.producto_id,
          item.producto_tipo_id || null,
          item.cantidad,
          item.precio
        ]
      });
    }
    
    return NextResponse.json({ id: pedidoId }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}