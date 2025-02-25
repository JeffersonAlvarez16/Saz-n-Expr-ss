'use client';

import React from 'react';
import { Producto } from '../types';
import WhatsAppButton from './WhatsAppButton';

interface WhatsAppButtonWrapperProps {
  productoJson: string; // Pasamos el producto como string JSON
  showVariants?: boolean;
  cantidad?: number;
}

const WhatsAppButtonWrapper = ({ 
  productoJson, 
  showVariants = false, 
  cantidad = 1 
}: WhatsAppButtonWrapperProps) => {
  // Convertimos el JSON string de nuevo a objeto
  const producto = JSON.parse(productoJson) as Producto;
  
  return (
    <WhatsAppButton 
      producto={producto} 
      showVariants={showVariants} 
      cantidad={cantidad} 
    />
  );
};

export default WhatsAppButtonWrapper;