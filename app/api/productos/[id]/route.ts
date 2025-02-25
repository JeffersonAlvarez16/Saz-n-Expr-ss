/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/productos/[id]/route.ts
import { db } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Obtener el producto por ID

    const id = (await params).id
    const productoResult = await db.execute({
      sql: `SELECT * FROM productos WHERE id = ?`,
      args: [id]
    });
    
    if (productoResult.rows.length === 0) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }
    
    const producto = productoResult.rows[0];
    
    // Obtener los tipos del producto
    const tiposResult = await db.execute({
      sql: `SELECT * FROM producto_tipos WHERE producto_id = ? ORDER BY nombre`,
      args: [id]
    });
    
    //producto.tipos = tiposResult.rows;
    
    return NextResponse.json(producto);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { nombre, descripcion, precio, imagen, stock, tipos } = await request.json();
    
    // Validar datos requeridos
    if (!nombre || precio === undefined || precio < 0) {
      return NextResponse.json(
        { error: 'Nombre y precio son obligatorios y el precio debe ser positivo' },
        { status: 400 }
      );
    }
    const id = (await params).id
    // Verificar que el producto existe
    const checkResult = await db.execute({
      sql: 'SELECT id FROM productos WHERE id = ?',
      args: [id]
    });
    
    if (checkResult.rows.length === 0) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }
    
    // Actualizar el producto
    await db.execute({
      sql: `
        UPDATE productos 
        SET nombre = ?, descripcion = ?, precio = ?, imagen = ?, stock = ?
        WHERE id = ?
      `,
      args: [
        nombre,
        descripcion || null,
        precio,
        imagen || null,
        stock || 0,
        id
      ]
    });
    
    // Gestionar los tipos del producto
    if (tipos && Array.isArray(tipos)) {
      // Obtener tipos actuales
      const tiposActualesResult = await db.execute({
        sql: 'SELECT id FROM producto_tipos WHERE producto_id = ?',
        args: [id]
      });
      
      const tiposActualesIds = tiposActualesResult.rows.map(t => t.id);
      const tiposNuevosIds = tipos.filter(t => t.id).map(t => t.id);
      
      // Eliminar tipos que ya no existen
      const tiposEliminar = tiposActualesIds.filter(id => !tiposNuevosIds.includes(id));
      
      for (const tipoId of tiposEliminar) {
        await db.execute({
          sql: 'DELETE FROM producto_tipos WHERE id = ?',
          args: [tipoId]
        });
      }
      
      // Actualizar o insertar tipos
      for (const tipo of tipos) {
        if (tipo.id) {
          // Actualizar tipo existente
          await db.execute({
            sql: `
              UPDATE producto_tipos
              SET nombre = ?, precio_adicional = ?, stock = ?
              WHERE id = ?
            `,
            args: [
              tipo.nombre,
              tipo.precio_adicional || 0,
              tipo.stock || 0,
              tipo.id
            ]
          });
        } else {
          // Insertar nuevo tipo
          await db.execute({
            sql: `
              INSERT INTO producto_tipos (producto_id, nombre, precio_adicional, stock)
              VALUES (?, ?, ?, ?)
            `,
            args: [
              id,
              tipo.nombre,
              tipo.precio_adicional || 0,
              tipo.stock || 0
            ]
          });
        }
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id
    // Eliminar primero los tipos del producto para mantener la integridad
    await db.execute({
      sql: 'DELETE FROM producto_tipos WHERE producto_id = ?',
      args: [id]
    });
    
    // Ahora eliminar el producto
    const result = await db.execute({
      sql: 'DELETE FROM productos WHERE id = ?',
      args: [id]
    });
    
    if (result.rowsAffected === 0) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}