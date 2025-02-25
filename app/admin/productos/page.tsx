// app/productos/page.tsx

import Link from 'next/link';
import Image from 'next/image';
import { Producto, ProductoTipo } from '@/app/types';
import { db, initializeDatabase } from '@/app/lib/db';
import ProductCard from '@/app/components/ProductCard';

async function getAllProductos(): Promise<Producto[]> {
  await initializeDatabase();
  
  try {
    const result = await db.execute('SELECT * FROM productos WHERE stock > 0 ORDER BY nombre ASC');
    
    // Para cada producto, obtenemos sus tipos
    const productos = result.rows as unknown as Producto[];
    
    for (const producto of productos) {
      const tiposResult = await db.execute({
        sql: 'SELECT * FROM producto_tipos WHERE producto_id = ?',
        args: [producto.id]
      });
      
      producto.tipos = tiposResult.rows as unknown as ProductoTipo[];
    }
    
    return productos;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }
}

export default async function ProductosPage() {
  const productos = await getAllProductos();
  
  // Podemos agrupar por categorías si quisiéramos en el futuro
  const tienenVariantes = productos.filter(p => p.tipos && p.tipos.length > 0);
  const productosSimples = productos.filter(p => !p.tipos || p.tipos.length === 0);
  
  return (
    <div className="bg-white">
      {/* Hero de la página */}
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Nuestro Menú Completo</h1>
            <p className="max-w-3xl mx-auto text-lg text-gray-600">
              Explora nuestra variedad de platillos preparados con ingredientes frescos y el mejor sabor casero.
            </p>
          </div>
        </div>
      </div>
      
      {/* Productos con variantes */}
      {tienenVariantes.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Platillos con Opciones</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {tienenVariantes.map((producto) => (
                <ProductCard key={producto.id} producto={producto} admin={true}/>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Productos simples */}
      {productosSimples.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Platillos Individuales</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {productosSimples.map((producto) => (
                <ProductCard key={producto.id} producto={producto} admin={true}/>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* En caso de no tener productos */}
      {productos.length === 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="mt-4 text-gray-500">No hay productos disponibles en este momento.</p>
            <div className="mt-6">
              <Link href="/" className="btn-secondary">
                Volver al inicio
              </Link>
              <Link href="/admin/productos/nuevo" className="btn-primary ml-4">
                Agregar producto
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Sección de contacto */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-green-50 rounded-2xl overflow-hidden shadow-sm">
            <div className="md:flex">
              <div className="md:w-1/2 p-8 md:p-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">¿Necesitas algo especial?</h2>
                <p className="text-gray-600 mb-6">
                  Si tienes alguna solicitud especial o quieres consultar por pedidos para eventos, 
                  contáctanos directamente por WhatsApp.
                </p>
                <a 
                  href="https://wa.me/5491112345678?text=Hola,%20me%20gustaría%20consultar%20sobre%20un%20pedido%20especial" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 6.628 5.373 12 12 12 6.628 0 12-5.373 12-12 0-6.628-5.373-12-12-12zm.01 18a6 6 0 01-3.22-.93L4 18l1.01-3.73A6 6 0 016.5 9.5a5.942 5.942 0 018.71-5.24A5.97 5.97 0 0118 9.5a5.97 5.97 0 01-5.99 8.5z"></path>
                  </svg>
                  Contáctanos por WhatsApp
                </a>
              </div>
              <div className="md:w-1/2 relative h-64 md:h-auto">
                <Image
                  src="https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=600&auto=format"
                  alt="Servicio de atención al cliente"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}