/* eslint-disable @typescript-eslint/no-explicit-any */
// app/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Producto } from './types';
import { db, initializeDatabase } from './lib/db';
import ProductCard from './components/ProductCard';

async function getProductos(): Promise<Producto[]> {
  // Nos aseguramos que la base de datos está inicializada antes de consultar
  await initializeDatabase();
  
  try {
    const result = await db.execute('SELECT * FROM productos WHERE stock > 0 ORDER BY creado_en DESC LIMIT 6');
    
    // Para cada producto, obtenemos sus tipos
    const productos = result.rows as unknown as Producto[];
    
    for (const producto of productos) {
      const tiposResult = await db.execute({
        sql: 'SELECT * FROM producto_tipos WHERE producto_id = ?',
        args: [producto.id]
      });
      
      producto.tipos = tiposResult.rows  as any[];
    }
    
    return productos;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }
}

export default async function Home() {
  await initializeDatabase(); // Inicializamos la base de datos antes de cualquier consulta
  const productos = await getProductos();
  
  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="md:flex items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Sabores auténticos a un click de distancia
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Pide deliciosa comida casera directamente por WhatsApp. 
                Sin complicaciones, solo comida con amor.
              </p>
              <Link 
                href="/productos" 
                className="btn-primary inline-block"
              >
                Ver nuestro menú
              </Link>
            </div>
            <div className="md:w-1/2 relative">
              <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden shadow-xl">
                <Image 
                  src="https://images.unsplash.com/photo-1730415136652-3044ec3db585?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Deliciosos tamales" 
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  priority
                />
              </div>
              <div className="absolute -bottom-5 -right-5 bg-white p-4 rounded-lg shadow-lg hidden md:block">
                <div className="flex items-center">
                  <div className="bg-green-500 rounded-full p-2 mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Entrega rápida</p>
                    <p className="text-sm text-gray-500">Recibe tu pedido en minutos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Productos Destacados */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Nuestros platillos</h2>
          <Link href="/productos" className="text-green-600 font-medium hover:text-green-800 transition-colors flex items-center">
            Ver todo 
            <svg className="ml-1 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
        
        {productos.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="mt-4 text-gray-500">No hay productos disponibles en este momento.</p>
            <Link href="/admin/productos/nuevo" className="mt-4 inline-block btn-primary">
              Agregar producto
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {productos.map((producto) => (
              <ProductCard key={producto.id} producto={producto}  admin={false}/>
            ))}
          </div>
        )}
      </section>
      
      {/* Características */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Por qué elegirnos?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nuestra plataforma combina la comodidad de pedir online con la calidez 
              de la comunicación personal a través de WhatsApp.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Pedido Fácil</h3>
              <p className="text-gray-600">
                Elige tu platillo y envía tu pedido directamente por WhatsApp con un solo clic.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Atención Rápida</h3>
              <p className="text-gray-600">
                Respuesta inmediata a tus pedidos y consultas a través de WhatsApp.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Sabor Casero</h3>
              <p className="text-gray-600">
                Todos nuestros platillos se preparan con ingredientes frescos y recetas tradicionales.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl text-white overflow-hidden shadow-xl">
            <div className="md:flex items-center">
              <div className="p-8 md:p-12 md:w-3/5">
                <h2 className="text-3xl font-bold mb-4">¿Listo para probar nuestros platillos?</h2>
                <p className="text-white/90 mb-6 text-lg">
                  Haz tu pedido ahora y disfruta de la mejor comida casera en la comodidad de tu hogar.
                </p>
                <Link 
                  href="/productos" 
                  className="bg-white text-green-600 px-6 py-3 rounded-lg font-medium inline-block hover:bg-gray-100 transition-colors shadow-md"
                >
                  Ver el menú completo
                </Link>
              </div>
              <div className="md:w-2/5 h-64 md:h-auto relative">
                <Image 
                  src="https://images.unsplash.com/photo-1626700051175-6818013e1d4f" 
                  alt="Empanadas caseras" 
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 40vw, 100vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}