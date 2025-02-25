/* eslint-disable @typescript-eslint/no-explicit-any */
// components/DbInitializer.tsx
'use client';

import { useEffect, useState } from 'react';

interface DbInitializerProps {
  initFunction: () => Promise<void>;
}

export default function DbInitializer({ initFunction }: DbInitializerProps) {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initFunction();
        setInitialized(true);
      } catch (err: any) {
        console.error('Error al inicializar la base de datos:', err);
        setError(err.message);
      }
    };

    initialize();
  }, [initFunction]);

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p className="font-bold">Error al inicializar la base de datos</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!initialized) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return null;
}