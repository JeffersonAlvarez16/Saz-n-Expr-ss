// app/admin/layout.tsx

import Link from 'next/link';
import { DM_Sans } from "next/font/google";
import AdminAuth from '../components/AdminAuth';

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans"
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuth>
      <div className={`flex h-full min-h-screen bg-gray-50 ${dmSans.className}`}>
        {/* Sidebar para navegación */}
        <div className="w-64 bg-white shadow-md hidden md:block">
          <div className="px-6 pt-8 pb-4">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-teal-600">
              Sazón Expréss
              </span>
            </Link>
            <div className="text-xs text-gray-500 mt-1">Panel de administración</div>
          </div>
          
          <nav className="mt-6">
            <div className="px-3 space-y-1">
              <Link 
                href="/admin"
                className="group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 hover:text-green-600"
              >
                <svg className="mr-3 h-6 w-6 text-gray-400 group-hover:text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </Link>
              
              <Link 
                href="/admin/productos"
                className="group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 hover:text-green-600"
              >
                <svg className="mr-3 h-6 w-6 text-gray-400 group-hover:text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Productos
              </Link>
              
              <Link 
                href="/admin/pedidos"
                className="group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 hover:text-green-600"
              >
                <svg className="mr-3 h-6 w-6 text-gray-400 group-hover:text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Pedidos
              </Link>
              
              <div className="border-t border-gray-200 my-4"></div>
              
              <Link 
                href="/"
                className="group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 hover:text-green-600"
              >
                <svg className="mr-3 h-6 w-6 text-gray-400 group-hover:text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver a la tienda
              </Link>
            </div>
          </nav>
        </div>
        
        {/* Contenido principal */}
        <div className="flex-1 flex flex-col">
          {/* Barra superior móvil */}
          <div className="md:hidden bg-white p-4 border-b flex justify-between items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-teal-600">
              Sazón Expréss
              </span>
            </Link>
            
            {/* Menú móvil */}
            <div className="relative">
              <div className="flex space-x-4">
                <Link href="/admin" className="text-gray-500 hover:text-green-600">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </Link>
                <Link href="/admin/productos" className="text-gray-500 hover:text-green-600">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </Link>
                <Link href="/admin/pedidos" className="text-gray-500 hover:text-green-600">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Contenido */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </AdminAuth>
  );
}