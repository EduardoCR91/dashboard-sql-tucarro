import './globals.css'
import Link from 'next/link'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-50 text-gray-900">
        {/* Añadimos py-3 para dar aire arriba y abajo */}
        <nav className="bg-yellow-300 text-black p-4 py-3 shadow-md sticky top-0 z-10">
          
          {/* CAMBIO CLAVE: flex-col para móviles, md:flex-row para escritorio */}
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* SECCIÓN 1: LOGOS */}
            <div className='flex items-center gap-4 w-full md:w-auto justify-center md:justify-start'>
              <div className='mercado-libre leading-none text-sm'>
                <Link href="/" className="font-bold block">mercado</Link>
                <Link href="/" className="font-bold block">libre</Link>
              </div>
              <Link href="/" className="text-2xl font-bold">tucarro</Link>
            </div>

            {/* SECCIÓN 2: BUSCADOR */}
            {/* Ajustado para que ocupe el ancho total en móvil (w-full) y se expanda en escritorio (md:flex-1) */}
            <form className="bg-white rounded shadow flex w-full md:max-w-xl md:flex-1">
              <input 
                type="text" 
                className="p-2 px-4 rounded-l w-full focus:outline-none text-gray-700"
                placeholder="Buscar vehículos..."
              />
              <button type="submit" className="px-4 py-2 border-l border-gray-200 text-gray-500 hover:text-blue-600">
                {/* Usamos el icono importado en lugar del emoji */}
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </form>

            {/* SECCIÓN 3: ENLACES */}
            {/* En móviles permitimos scroll horizontal (overflow-x-auto) si hay muchos links, o wrap */}
            <div className="flex items-center gap-4 text-sm w-full md:w-auto justify-center flex-wrap">
              <Link href="/login" className="hover:text-gray-700">Cuenta</Link>
              <Link href="/favoritos" className="hover:text-gray-700">Favoritos</Link>
              
              {/* BOTÓN CORREGIDO: border-black para el borde negro */}
              <Link 
                href="/publicar" 
                className="hover:bg-black hover:text-white transition-colors border border-black px-3 py-1 rounded-md text-center"
              >
                Publica tu vehículo
              </Link> 
            </div>

          </div>
        </nav>

        <main className="container mx-auto p-4 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}