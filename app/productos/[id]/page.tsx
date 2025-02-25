
import WhatsAppButtonWrapper from '@/app/components/WhatsAppButtonWrapper';
import { db, initializeDatabase } from '@/app/lib/db';
import { Producto, ProductoTipo } from '@/app/types';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface ProductoDetalleProps {
  params: Promise<{
    id: string;
  }>;
}

async function getProducto(id: string): Promise<Producto | null> {
  await initializeDatabase();
  
  const result = await db.execute({
    sql: 'SELECT * FROM productos WHERE id = ?',
    args: [id]
  });
  
  if (result.rows.length === 0) {
    return null;
  }
  
  const producto = result.rows[0] as unknown as Producto;
  
  // Obtener los tipos del producto
  const tiposResult = await db.execute({
    sql: 'SELECT * FROM producto_tipos WHERE producto_id = ? ORDER BY nombre',
    args: [id]
  });
  
  producto.tipos = tiposResult.rows as unknown as ProductoTipo[];
  
  return producto;
}

export default async function ProductoDetalle({ params }: ProductoDetalleProps) {
  const resolvedParams = await params;
  const producto = await getProducto(resolvedParams.id);
  
  if (!producto) {
    notFound();
  }
  const productoSerializado = JSON.parse(JSON.stringify(producto));
  const tieneVariantes = producto.tipos && producto.tipos.length > 0;
  
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="relative h-[450px] w-full bg-gray-50 rounded-xl overflow-hidden">
          {producto.imagen ? (
            <Image 
              src={producto.imagen} 
              alt={producto.nombre}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-gray-400">Sin imagen</p>
            </div>
          )}
        </div>
        
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold text-gray-900">{producto.nombre}</h1>
          
          <div className="mt-6">
            <p className="text-3xl font-medium text-gray-900">${producto.precio.toFixed(2)}</p>
          </div>
          
          <div className="mt-6 text-gray-600">
            <p>{producto.descripcion}</p>
          </div>
          
          {tieneVariantes && (
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Variantes Disponibles</h2>
              <WhatsAppButtonWrapper 
                productoJson={JSON.stringify(productoSerializado)} 
                showVariants={true} 
              />
            </div>
          )}
          
          {!tieneVariantes && (
            <div className="mt-8">
              <p className="mb-4">
                Stock disponible: <span className="font-medium">{producto.stock}</span>
              </p>
              <WhatsAppButtonWrapper 
                productoJson={JSON.stringify(productoSerializado)} 
                showVariants={false} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}