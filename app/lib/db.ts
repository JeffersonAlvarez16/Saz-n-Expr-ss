import { createClient } from '@libsql/client';

// Verificamos si las variables de entorno están definidas
const dbUrl = process.env.TURSO_DATABASE_URL || 'libsql://localhost:8080';
const authToken = process.env.TURSO_AUTH_TOKEN;

export const db = createClient({
  url: dbUrl,
  authToken: authToken
});

// Variable para controlar si la base de datos ya fue inicializada
let dbInitialized = false;

// Función para inicializar la base de datos
export async function initializeDatabase(): Promise<void> {
  // Si ya inicializamos la base de datos, no lo hacemos de nuevo
  if (dbInitialized) {
    return;
  }

  console.log('Inicializando base de datos...');

  try {
    // Tabla de productos
    await db.execute(`
      CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        precio REAL NOT NULL,
        imagen TEXT,
        stock INTEGER NOT NULL DEFAULT 0,
        creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de tipos de productos
    await db.execute(`
      CREATE TABLE IF NOT EXISTS producto_tipos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        producto_id INTEGER NOT NULL,
        nombre TEXT NOT NULL,
        precio_adicional REAL NOT NULL DEFAULT 0,
        stock INTEGER NOT NULL DEFAULT 0,
        creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (producto_id) REFERENCES productos (id) ON DELETE CASCADE
      )
    `);

    // Tabla de pedidos
    await db.execute(`
      CREATE TABLE IF NOT EXISTS pedidos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente_nombre TEXT NOT NULL,
        cliente_telefono TEXT NOT NULL,
        cliente_direccion TEXT,
        estado TEXT DEFAULT 'pendiente',
        total REAL NOT NULL,
        creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de items de pedidos
    await db.execute(`
      CREATE TABLE IF NOT EXISTS pedido_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pedido_id INTEGER NOT NULL,
        producto_id INTEGER NOT NULL,
        producto_tipo_id INTEGER,
        cantidad INTEGER NOT NULL,
        precio REAL NOT NULL,
        FOREIGN KEY (pedido_id) REFERENCES pedidos (id),
        FOREIGN KEY (producto_id) REFERENCES productos (id),
        FOREIGN KEY (producto_tipo_id) REFERENCES producto_tipos (id)
      )
    `);

    // Verificar si ya existen productos
    const productos = await db.execute('SELECT COUNT(*) as count FROM productos');
const count = productos.rows[0].count as number;

// Si no hay productos, insertamos algunos de ejemplo
if (count === 0) {
  console.log('Agregando productos de ejemplo...');
  
  // Ejemplo de tamales con diferentes tipos
  const result = await db.execute({
    sql: `
      INSERT INTO productos (nombre, descripcion, precio, imagen, stock)
      VALUES (?, ?, ?, ?, ?)
    `,
    args: [
      'Tamales Artesanales', 
      'Deliciosos tamales caseros preparados con ingredientes frescos y masa de maíz tradicional.',
      7.99, 
      'https://images.unsplash.com/photo-1617118602627-65c3fc1eb1f5?q=80&w=600&auto=format', 
      50
    ]
  });
  
  const tamalId = result.lastInsertRowid;
  
  // Añadir tipos para los tamales
  await db.execute({
    sql: `
      INSERT INTO producto_tipos (producto_id, nombre, precio_adicional, stock)
      VALUES (?, ?, ?, ?)
    `,
    args: [tamalId!, 'Chancho', 0, 25]
  });
  
  await db.execute({
    sql: `
      INSERT INTO producto_tipos (producto_id, nombre, precio_adicional, stock)
      VALUES (?, ?, ?, ?)
    `,
    args: [tamalId!, 'Pollo', 0, 25]
  });
  
  // Agregar otros productos de comida
  const productosEjemplo = [
    {
      nombre: 'Jugo Natural',
      descripcion: 'Jugo fresco hecho con frutas de temporada, sin azúcar añadida.',
      precio: 4.99,
      imagen: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=600&auto=format',
      stock: 30,
      tipos: ['Naranja', 'Piña', 'Fresa']
    },
    {
      nombre: 'Empanadas Caseras',
      descripcion: 'Empanadas horneadas con masa casera y rellenos tradicionales.',
      precio: 5.99,
      imagen: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=600&auto=format',
      stock: 40,
      tipos: ['Carne', 'Pollo', 'Queso']
    },
    {
      nombre: 'Lasagna Tradicional',
      descripcion: 'Deliciosa lasagna de carne con salsa casera y queso gratinado.',
      precio: 12.99,
      imagen: 'https://images.unsplash.com/photo-1619895092538-128341789043?q=80&w=600&auto=format',
      stock: 15,
      tipos: []
    },
    {
      nombre: 'Enchiladas Verdes',
      descripcion: 'Enchiladas con salsa verde, rellenas de pollo y cubiertas con queso fresco.',
      precio: 9.99,
      imagen: 'https://images.unsplash.com/photo-1588556008426-57e318eeb199?q=80&w=600&auto=format',
      stock: 20,
      tipos: ['Pollo', 'Queso']
    },
    {
      nombre: 'Arroz con Leche',
      descripcion: 'Postre tradicional de arroz cocido con leche, canela y un toque de vainilla.',
      precio: 3.99,
      imagen: 'https://images.unsplash.com/photo-1590016030062-53a803c05d75?q=80&w=600&auto=format',
      stock: 25,
      tipos: ['Con pasas', 'Tradicional']
    }
  ];
  
  for (const producto of productosEjemplo) {
    const res = await db.execute({
      sql: `
        INSERT INTO productos (nombre, descripcion, precio, imagen, stock)
        VALUES (?, ?, ?, ?, ?)
      `,
      args: [
        producto.nombre, 
        producto.descripcion, 
        producto.precio, 
        producto.imagen, 
        producto.stock
      ]
    });
    
    const productoId = res.lastInsertRowid;
    
    // Añadir tipos para este producto
    if (producto.tipos && producto.tipos.length > 0) {
      for (const tipo of producto.tipos) {
        await db.execute({
          sql: `
            INSERT INTO producto_tipos (producto_id, nombre, precio_adicional, stock)
            VALUES (?, ?, ?, ?)
          `,
          args: [productoId!, tipo, 0, Math.floor(producto.stock / producto.tipos.length)]
        });
      }
    }
  }
}


    console.log('Base de datos inicializada correctamente');
    dbInitialized = true;
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    throw error;
  }
}