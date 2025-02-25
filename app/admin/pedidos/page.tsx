/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Pedido } from '@/app/types';
import { useState, useEffect } from 'react';


// Interface para representar un pedido con sus ítems
interface PedidoDetallado extends Pedido {
  items: Array<{
    id: number;
    producto_nombre: string;
    producto_tipo?: string;
    cantidad: number;
    precio: number;
  }>;
}

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState<PedidoDetallado[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<string>('todos');
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<number | null>(null);
  
  // Cargar pedidos al montar el componente
  useEffect(() => {
    fetchPedidos();
  }, []);

  // Función para cargar pedidos
  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/pedidos');
      if (!response.ok) {
        throw new Error('Error al cargar pedidos');
      }
      const data = await response.json();
      
      // Ordenar por fecha, más recientes primero
      const ordenados = data.sort((a: PedidoDetallado, b: PedidoDetallado) => {
        return new Date(b.creado_en).getTime() - new Date(a.creado_en).getTime();
      });
      
      setPedidos(ordenados);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar pedidos');
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar el estado de un pedido
  const actualizarEstadoPedido = async (pedidoId: number, nuevoEstado: string) => {
    try {
      const response = await fetch(`/api/pedidos/${pedidoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado del pedido');
      }

      // Actualizar la lista de pedidos
      setPedidos(prevPedidos => 
        prevPedidos.map(pedido => 
          pedido.id === pedidoId ? { ...pedido } : pedido
        )
      );
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el estado del pedido');
    }
  };

  // Filtrar pedidos según el estado seleccionado
  const pedidosFiltrados = filtro === 'todos' 
    ? pedidos 
    : pedidos.filter(pedido => pedido.estado === filtro);

  // Funcion para formatear fecha
  const formatearFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(fecha);
  };

  // Obtener color según el estado del pedido
  const getColorEstado = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'procesando':
        return 'bg-blue-100 text-blue-800';
      case 'enviado':
        return 'bg-green-100 text-green-800';
      case 'entregado':
        return 'bg-green-100 text-green-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Estado de carga
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 mb-4">
        <p className="font-bold">Error</p>
        <p>{error}</p>
        <button 
          onClick={fetchPedidos}
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const pedidoActual = pedidoSeleccionado !== null 
    ? pedidos.find(p => p.id === pedidoSeleccionado) 
    : null;

  return (
    <div className="container mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Administración de Pedidos</h1>
      </div>

      {/* Filtros de estado */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFiltro('todos')}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            filtro === 'todos'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFiltro('pendiente')}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            filtro === 'pendiente'
              ? 'bg-yellow-500 text-white'
              : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
          }`}
        >
          Pendientes
        </button>
        <button
          onClick={() => setFiltro('procesando')}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            filtro === 'procesando'
              ? 'bg-blue-500 text-white'
              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
          }`}
        >
          En proceso
        </button>
        <button
          onClick={() => setFiltro('enviado')}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            filtro === 'enviado'
              ? 'bg-green-500 text-white'
              : 'bg-green-100 text-green-800 hover:bg-green-200'
          }`}
        >
          Enviados
        </button>
        <button
          onClick={() => setFiltro('entregado')}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            filtro === 'entregado'
              ? 'bg-green-500 text-white'
              : 'bg-green-100 text-green-800 hover:bg-green-200'
          }`}
        >
          Entregados
        </button>
        <button
          onClick={() => setFiltro('cancelado')}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            filtro === 'cancelado'
              ? 'bg-red-500 text-white'
              : 'bg-red-100 text-red-800 hover:bg-red-200'
          }`}
        >
          Cancelados
        </button>
      </div>

      {/* Lista de pedidos */}
      {pedidosFiltrados.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay pedidos</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filtro !== 'todos' ? `No hay pedidos con estado "${filtro}"` : 'Todavía no hay pedidos en el sistema'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Lista de pedidos (columna izquierda en desktop) */}
          <div className="md:col-span-1 bg-white rounded-lg shadow overflow-hidden">
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-lg font-medium text-gray-900">
                Pedidos {filtro !== 'todos' ? `(${filtro})` : ''}
              </h2>
            </div>
            <ul className="divide-y divide-gray-200 max-h-[70vh] overflow-y-auto">
              {pedidosFiltrados.map((pedido) => (
                <li 
                  key={pedido.id} 
                  className={`cursor-pointer hover:bg-gray-50 ${pedidoSeleccionado === pedido.id ? 'bg-gray-50' : ''}`}
                  onClick={() => setPedidoSeleccionado(pedido.id)}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">Pedido #{pedido.id}</p>
                        <p className="text-sm text-gray-500">{pedido.cliente_nombre}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getColorEstado(pedido.estado)}`}>
                        {pedido.estado}
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between text-sm">
                      <p className="text-gray-500">{formatearFecha(pedido.creado_en)}</p>
                      <p className="font-medium">${pedido.total.toFixed(2)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Detalle del pedido seleccionado (columna derecha en desktop) */}
          <div className="md:col-span-2">
            {pedidoActual ? (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="border-b border-gray-200 p-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-900">
                      Detalle del Pedido #{pedidoActual.id}
                    </h2>
                    <span className={`px-2 py-1 text-xs rounded-full ${getColorEstado(pedidoActual.estado)}`}>
                      {pedidoActual.estado}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Información del Cliente</h3>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p><span className="font-medium">Nombre:</span> {pedidoActual.cliente_nombre}</p>
                      <p><span className="font-medium">Teléfono:</span> {pedidoActual.cliente_telefono}</p>
                      {pedidoActual.cliente_direccion && (
                        <p><span className="font-medium">Dirección:</span> {pedidoActual.cliente_direccion}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Productos</h3>
                    <div className="bg-gray-50 rounded-lg">
                      <ul className="divide-y divide-gray-200">
                        {pedidoActual.items && pedidoActual.items.length > 0 ? (
                          pedidoActual.items.map((item) => (
                            <li key={item.id} className="p-3">
                              <div className="flex justify-between">
                                <div>
                                  <p className="font-medium">{item.producto_nombre}</p>
                                  {item.producto_tipo && (
                                    <p className="text-sm text-gray-500">Variante: {item.producto_tipo}</p>
                                  )}
                                  <p className="text-sm text-gray-500">Cantidad: {item.cantidad}</p>
                                </div>
                                <p className="font-medium">${(item.precio * item.cantidad).toFixed(2)}</p>
                              </div>
                            </li>
                          ))
                        ) : (
                          <li className="p-3">
                            <p className="text-gray-500 italic">No hay detalles de productos disponibles</p>
                          </li>
                        )}
                      </ul>
                      <div className="p-3 border-t border-gray-200">
                        <div className="flex justify-between font-medium">
                          <p>Total</p>
                          <p>${pedidoActual.total.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Fecha del Pedido</h3>
                    <p className="bg-gray-50 p-3 rounded-lg">
                      {formatearFecha(pedidoActual.creado_en)}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Actualizar Estado</h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => actualizarEstadoPedido(pedidoActual.id, 'pendiente')}
                        disabled={pedidoActual.estado === 'pendiente'}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                          pedidoActual.estado === 'pendiente'
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        }`}
                      >
                        Pendiente
                      </button>
                      <button
                        onClick={() => actualizarEstadoPedido(pedidoActual.id, 'procesando')}
                        disabled={pedidoActual.estado === 'procesando'}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                          pedidoActual.estado === 'procesando'
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                        }`}
                      >
                        En proceso
                      </button>
                      <button
                        onClick={() => actualizarEstadoPedido(pedidoActual.id, 'enviado')}
                        disabled={pedidoActual.estado === 'enviado'}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                          pedidoActual.estado === 'enviado'
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        Enviado
                      </button>
                      <button
                        onClick={() => actualizarEstadoPedido(pedidoActual.id, 'entregado')}
                        disabled={pedidoActual.estado === 'entregado'}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                          pedidoActual.estado === 'entregado'
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        Entregado
                      </button>
                      <button
                        onClick={() => actualizarEstadoPedido(pedidoActual.id, 'cancelado')}
                        disabled={pedidoActual.estado === 'cancelado'}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                          pedidoActual.estado === 'cancelado'
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        Cancelado
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <a
                      href={`https://wa.me/${pedidoActual.cliente_telefono.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path>
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 6.628 5.373 12 12 12 6.628 0 12-5.373 12-12 0-6.628-5.373-12-12-12zm.01 18a6 6 0 01-3.22-.93L4 18l1.01-3.73A6 6 0 016.5 9.5a5.942 5.942 0 018.71-5.24A5.97 5.97 0 0118 9.5a5.97 5.97 0 01-5.99 8.5z"></path>
                      </svg>
                      Contactar por WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow flex flex-col items-center justify-center p-12 h-full">
                <svg className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No hay pedido seleccionado</h3>
                <p className="mt-1 text-gray-500">Selecciona un pedido de la lista para ver sus detalles</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}