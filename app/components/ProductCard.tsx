// components/ProductCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Producto } from '../types';


interface ProductCardProps {
  producto: Producto;
  admin:boolean;
}

export default function ProductCard({ producto,admin=false }: ProductCardProps) {
  const tieneVariantes = producto.tipos && producto.tipos.length > 0;
  
  return (
    <div className="product-card group shadow-lg">
      <Link href={!admin ? `/productos/${producto.id}` :`/admin/productos/${producto.id}`} className="block">
        <div className="aspect-square relative overflow-hidden">
          {producto.imagen ? (
            <Image 
              src={producto.imagen} 
              alt={producto.nombre}
              fill
              className="object-cover"
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {tieneVariantes && (
            <div className="absolute top-2 right-2 bg-white px-2 py-1 text-xs font-medium rounded-full shadow-sm text-green-600">
              {producto.tipos?.length} variantes
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
            <span className="text-white font-medium">Ver detalles</span>
          </div>
        </div>
        
        <div className="p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-1">{producto.nombre}</h2>
          <p className="text-sm text-gray-500 line-clamp-2 mb-2">{producto.descripcion}</p>
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-green-600">${producto.precio.toFixed(2)}</p>
            {tieneVariantes ? (
              <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">
                Múltiples opciones
              </span>
            ) : (
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                Producto único
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}