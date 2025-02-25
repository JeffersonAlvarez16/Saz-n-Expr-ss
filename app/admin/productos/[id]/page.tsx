/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

import Link from 'next/link';
import { Producto, ProductoTipo } from '@/app/types';

interface ProductoFormData extends Omit<Producto, 'id' | 'creado_en' | 'tipos'> {
  tipos: Array<{
    id?: number;
    nombre: string;
    precio_adicional: number;
    stock: number;
  }>;
}

export default function EditProductoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const isEditing = id !== 'nuevo';
  
  const [producto, setProducto] = useState<ProductoFormData>({
    nombre: '',
    descripcion: '',
    precio: 0,
    imagen: '',
    stock: 0,
    tipos: []
  });
  
  const [isFetching, setIsFetching] = useState<boolean>(isEditing);
  const [error, setError] = useState<string>('');
  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  
  // Fetch product data if in edit mode
  useEffect(() => {
    if (isEditing) {
      fetchProducto();
    } else {
      setIsFetching(false);
    }
  }, [isEditing]);
  
  // Reset success message after 3 seconds
  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  // Fetch product data
  const fetchProducto = async () => {
    setIsFetching(true);
    setError('');
    
    try {
      const res = await fetch(`/api/productos/${id}`);
      if (!res.ok) {
        throw new Error('Error al cargar el producto');
      }
      
      const data = await res.json();
      
      setProducto({
        nombre: data.nombre,
        descripcion: data.descripcion || '',
        precio: data.precio,
        imagen: data.imagen || '',
        stock: data.stock,
        tipos: data.tipos?.map((tipo: ProductoTipo) => ({
          id: tipo.id,
          nombre: tipo.nombre,
          precio_adicional: tipo.precio_adicional,
          stock: tipo.stock
        })) || []
      });
    } catch (err: any) {
      setError(`Error al cargar el producto: ${err.message}`);
    } finally {
      setIsFetching(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);
    
    try {
      const url = isEditing ? `/api/productos/${id}` : '/api/productos';
      const method = isEditing ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(producto)
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al guardar el producto');
      }
      
      setSaveSuccess(true);
      
      if (!isEditing) {
        // For new products, redirect to the products list
        setTimeout(() => {
          router.push('/admin/productos');
        }, 1000);
      }
    } catch (err: any) {
      setError(`Error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle product deletion
  const handleDelete = async () => {
    if (!isEditing) return;
    
    setIsDeleting(true);
    setError('');
    
    try {
      const res = await fetch(`/api/productos/${id}`, {
        method: 'DELETE'
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al eliminar el producto');
      }
      
      // Redirect to products list
      router.push('/admin/productos');
    } catch (err: any) {
      setError(`Error al eliminar: ${err.message}`);
      setIsDeleting(false);
      setDeleteConfirm(false);
    }
  };

  // Add a new product type
  const addTipo = () => {
    setProducto({
      ...producto,
      tipos: [
        ...producto.tipos,
        { nombre: '', precio_adicional: 0, stock: 0 }
      ]
    });
  };
  
  // Update a product type
  const updateTipo = (index: number, field: string, value: string | number) => {
    const newTipos = [...producto.tipos];
    newTipos[index] = {
      ...newTipos[index],
      [field]: value
    };
    
    setProducto({
      ...producto,
      tipos: newTipos
    });
  };
  
  // Remove a product type
  const removeTipo = (index: number) => {
    const newTipos = [...producto.tipos];
    newTipos.splice(index, 1);
    
    setProducto({
      ...producto,
      tipos: newTipos
    });
  };

  // Loading state
  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
        </h1>
        
        <div className="flex space-x-2">
          <Link 
            href="/admin/productos"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancelar
          </Link>
          
          {isEditing && !deleteConfirm && (
            <button
              onClick={() => setDeleteConfirm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
              type="button"
            >
              Eliminar
            </button>
          )}
        </div>
      </div>

      {/* Success message */}
      {saveSuccess && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 text-green-700">
          <p className="font-medium">¡Éxito!</p>
          <p>El producto ha sido guardado correctamente.</p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">¿Estás seguro de que quieres eliminar este producto?</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Esta acción no se puede deshacer. Se eliminarán todos los datos asociados a este producto.</p>
              </div>
              <div className="mt-4">
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    {isDeleting ? 'Eliminando...' : 'Sí, eliminar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm(false)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Información del Producto</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Detalles básicos del producto.</p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
              {/* Nombre */}
              <div className="sm:col-span-4">
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
                  value={producto.nombre}
                  onChange={(e) => setProducto({...producto, nombre: e.target.value})}
                  className="border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 block w-full"
                  required
                />
              </div>

              {/* Descripción */}
              <div className="sm:col-span-6">
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  rows={4}
                  value={producto.descripcion}
                  onChange={(e) => setProducto({...producto, descripcion: e.target.value})}
                  className="border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 block w-full"
                />
                <p className="mt-2 text-sm text-gray-500">Breve descripción del producto.</p>
              </div>

              {/* Precio */}
              <div className="sm:col-span-2">
                <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-1">
                  Precio Base *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="precio"
                    id="precio"
                    min="0"
                    step="0.01"
                    value={producto.precio}
                    onChange={(e) => setProducto({...producto, precio: parseFloat(e.target.value)})}
                    className="border border-gray-300 pl-7 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 block w-full"
                    required
                  />
                </div>
              </div>

              {/* Stock */}
              <div className="sm:col-span-2">
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  id="stock"
                  min="0"
                  value={producto.stock}
                  onChange={(e) => setProducto({...producto, stock: parseInt(e.target.value, 10)})}
                  className="border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 block w-full"
                />
              </div>

              {/* Imagen URL */}
              <div className="sm:col-span-4">
                <label htmlFor="imagen" className="block text-sm font-medium text-gray-700 mb-1">
                  URL de la Imagen
                </label>
                <input
                  type="text"
                  name="imagen"
                  id="imagen"
                  value={producto.imagen || ''}
                  onChange={(e) => setProducto({...producto, imagen: e.target.value})}
                  className="border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 block w-full"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                <p className="mt-2 text-sm text-gray-500">
                  URL de la imagen del producto. Dejarlo en blanco si no hay imagen.
                </p>
              </div>

              {/* Image preview */}
              {producto.imagen && (
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vista previa</label>
                  <div className="mt-1 relative h-32 w-32 rounded-md overflow-hidden border border-gray-300">
                    <img
                      src={producto.imagen}
                      alt="Vista previa"
                      className="h-full w-full object-center object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/150?text=Error';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product types/variants */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Variantes del Producto</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Agrega diferentes variantes como sabores, tamaños, etc.
              </p>
            </div>
            <button
              type="button"
              onClick={addTipo}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Añadir Variante
            </button>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            {producto.tipos.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm">No hay variantes para este producto.</p>
                <p className="text-sm">
                  Añade variantes si este producto tiene diferentes opciones (ej: sabores, tamaños).
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {producto.tipos.map((tipo, index) => (
                  <div key={tipo.id || `new-${index}`} className="border border-gray-200 rounded-md p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-base font-medium text-gray-900">Variante #{index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeTipo(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      {/* Nombre de la variante */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre *
                        </label>
                        <input
                          type="text"
                          value={tipo.nombre}
                          onChange={(e) => updateTipo(index, 'nombre', e.target.value)}
                          className="border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 block w-full"
                          placeholder="Ej: Pollo, Familiar, etc."
                          required
                        />
                      </div>
                      
                      {/* Precio adicional */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Precio Adicional
                        </label>
                        <div className="mt-1 relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={tipo.precio_adicional}
                            onChange={(e) => updateTipo(index, 'precio_adicional', parseFloat(e.target.value))}
                            className="border border-gray-300 pl-7 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 block w-full"
                          />
                        </div>
                      </div>
                      
                      {/* Stock de la variante */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Stock
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={tipo.stock}
                          onChange={(e) => updateTipo(index, 'stock', parseInt(e.target.value, 10))}
                          className="border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 block w-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Form actions */}
        <div className="flex justify-end space-x-3 mb-10">
          <Link
            href="/admin/productos"
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {isSaving ? 'Guardando...' : (isEditing ? 'Actualizar Producto' : 'Crear Producto')}
          </button>
        </div>
      </form>
    </div>
  );
}