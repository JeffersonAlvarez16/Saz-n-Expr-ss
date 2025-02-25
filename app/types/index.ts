export interface ProductoTipo {
    id: number;
    producto_id: number;
    nombre: string;
    precio_adicional: number;
    stock: number;
    creado_en: string;
  }
  
  export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen: string | null;
    stock: number;
    creado_en: string;
    tipos?: ProductoTipo[];
  }
  
  export interface Pedido {
    id: number;
    cliente_nombre: string;
    cliente_telefono: string;
    cliente_direccion: string | null;
    estado: 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado';
    total: number;
    creado_en: string;
  }
  
  export interface PedidoItem {
    id: number;
    pedido_id: number;
    producto_id: number;
    cantidad: number;
    precio: number;
  }
  
  export interface Estadisticas {
    totalProductos: number;
    totalPedidos: number;
    pedidosPendientes: number;
  }