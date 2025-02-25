// scripts/init-db.ts


import { createClient } from '@libsql/client';

const db = createClient({
  url: "libsql://app-jeffrin.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJleHAiOjE3NDgyNzU4NzgsImlhdCI6MTc0MDQ5OTg3OCwiaWQiOiJmYmU1ODZlMC0wZjcwLTRiOTQtYWM5Mi1hYTU3Y2Q5MzJiZmQifQ.y9vMACDC9d7tyuzl16Es12fYgUWNywGLYgQMvNVNTffgQl4raJVEqAn8Bv3jTRWc9eH28HS5b_-SaENiPAy9DA"
});


async function initializeDatabase(): Promise<void> {
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

  await db.execute(`
    CREATE TABLE IF NOT EXISTS pedido_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pedido_id INTEGER NOT NULL,
      producto_id INTEGER NOT NULL,
      cantidad INTEGER NOT NULL,
      precio REAL NOT NULL,
      FOREIGN KEY (pedido_id) REFERENCES pedidos (id),
      FOREIGN KEY (producto_id) REFERENCES productos (id)
    )
  `);
}

async function main() {
  console.log('Inicializando base de datos...');
  
  try {
    await initializeDatabase();
    console.log('Tablas creadas correctamente');
    
    // Podemos añadir algunos productos de ejemplo
    const productos = [
      {
        nombre: 'Camiseta Básica',
        descripcion: 'Camiseta de algodón 100%, disponible en varios colores',
        precio: 19.99,
        imagen: 'https://picsum.photos/id/237/400/300',
        stock: 25
      },
      {
        nombre: 'Zapatillas Deportivas',
        descripcion: 'Zapatillas cómodas para running o uso casual',
        precio: 59.99,
        imagen: 'https://picsum.photos/id/238/400/300',
        stock: 10
      },
      {
        nombre: 'Mochila Moderna',
        descripcion: 'Mochila con compartimentos para laptop y accesorios',
        precio: 39.99,
        imagen: 'https://picsum.photos/id/239/400/300',
        stock: 15
      }
    ];
    
    for (const producto of productos) {
      await db.execute({
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
    }
    
    console.log('Productos de ejemplo agregados');
    
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  } finally {
    process.exit(0);
  }
}

main();