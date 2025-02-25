'use client';

import { useState } from 'react';
import { Producto } from '../types';

interface WhatsAppButtonProps {
  producto: Producto;
  cantidad?: number;
  showVariants?: boolean;
}

export default function WhatsAppButton({ producto, cantidad = 1, showVariants = false }: WhatsAppButtonProps) {
  const [qty, setQty] = useState<number>(cantidad);
  const [selectedTipoId, setSelectedTipoId] = useState<number | null>(
    producto.tipos && producto.tipos.length > 0 ? producto.tipos[0].id : null
  );
  
  const selectedTipo = producto.tipos?.find(tipo => tipo.id === selectedTipoId);
  
  const calcularPrecio = (): number => {
    const precioBase = producto.precio;
    const precioAdicional = selectedTipo?.precio_adicional || 0;
    return precioBase + precioAdicional;
  };
  
  const handleOrder = (): void => {
    // Formatear mensaje para WhatsApp
    let mensaje = `Hola, me interesa comprar *${producto.nombre}*\n`;
    
    if (selectedTipo) {
      mensaje += `Variante: *${selectedTipo.nombre}*\n`;
    }
    
    mensaje += `Cantidad: ${qty}\n` +
      `Precio unitario: ${calcularPrecio().toFixed(2)}\n` +
      `Total: ${(calcularPrecio() * qty).toFixed(2)}\n\n` +
      `Por favor, confirma disponibilidad.`;
    
    // Número de teléfono del vendedor (este debe ser configurado)
    const telefono = '5491112345678'; // Reemplazar con tu número real
    
    // Abrir chat de WhatsApp
    window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };
  
  if (!showVariants && !producto.tipos?.length) {
    // Versión simplificada sin variantes
    return (
      <div className="space-y-4">
        <div className="flex items-center">
          <button 
            onClick={() => qty > 1 && setQty(qty - 1)}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            type="button"
          >
            <span className="text-xl font-medium">-</span>
          </button>
          <span className="mx-4 text-lg w-8 text-center">{qty}</span>
          <button 
            onClick={() => setQty(qty + 1)}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            type="button"
          >
            <span className="text-xl font-medium">+</span>
          </button>
        </div>
        
        <button
          onClick={handleOrder}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg flex items-center justify-center font-medium transition-colors"
          type="button"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 6.628 5.373 12 12 12 6.628 0 12-5.373 12-12 0-6.628-5.373-12-12-12zm.01 18a6 6 0 01-3.22-.93L4 18l1.01-3.73A6 6 0 016.5 9.5a5.942 5.942 0 018.71-5.24A5.97 5.97 0 0118 9.5a5.97 5.97 0 01-5.99 8.5z"></path>
          </svg>
          Pedir por WhatsApp
        </button>
      </div>
    );
  }
  
  // Versión con variantes/tipos
  return (
    <div className="space-y-6 w-full">
      {producto.tipos && producto.tipos.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-gray-700">Selecciona una variante:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {producto.tipos.map((tipo) => (
              <button
                key={tipo.id}
                type="button"
                onClick={() => setSelectedTipoId(tipo.id)}
                className={`py-3 px-4 rounded-lg border text-left transition-all
                  ${selectedTipoId === tipo.id 
                    ? 'border-green-500 bg-green-50 text-green-600' 
                    : 'border-gray-200 hover:border-gray-300'
                  }`
                }
              >
                <div className="font-medium">{tipo.nombre}</div>
                {tipo.precio_adicional > 0 && (
                  <div className="text-sm mt-1 text-gray-500">
                    +${tipo.precio_adicional.toFixed(2)}
                  </div>
                )}
                <div className="mt-1 text-sm text-gray-500">
                  Stock: {tipo.stock}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex items-center">
        <button 
          onClick={() => qty > 1 && setQty(qty - 1)}
          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          type="button"
        >
          <span className="text-xl font-medium">-</span>
        </button>
        <span className="mx-4 text-lg w-8 text-center">{qty}</span>
        <button 
          onClick={() => setQty(qty + 1)}
          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          type="button"
        >
          <span className="text-xl font-medium">+</span>
        </button>
        
        <div className="ml-6 text-lg font-medium">
          ${calcularPrecio().toFixed(2)}
        </div>
      </div>
      
      <button
        onClick={handleOrder}
        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg flex items-center justify-center font-medium transition-colors"
        type="button"
        disabled={!selectedTipoId && producto.tipos && producto.tipos.length > 0}
      >
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 6.628 5.373 12 12 12 6.628 0 12-5.373 12-12 0-6.628-5.373-12-12-12zm.01 18a6 6 0 01-3.22-.93L4 18l1.01-3.73A6 6 0 016.5 9.5a5.942 5.942 0 018.71-5.24A5.97 5.97 0 0118 9.5a5.97 5.97 0 01-5.99 8.5z"></path>
        </svg>
        Pedir por WhatsApp
      </button>
    </div>
  );
}