// app/layout.tsx
import './globals.css'
import Link from 'next/link'
// Importamos el nuevo componente de la barra de búsqueda
import Searchbar from './buscar/Searchbar' 
// No necesitamos MagnifyingGlassIcon aquí, lo movimos a Searchbar

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-50 text-gray-900">
        <nav className="bg-yellow-300 text-black p-4 py-3 shadow-md sticky top-0 z-10">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* SECCIÓN 1: LOGOS */}
            <div className='flex items-center gap-4 w-full md:w-auto justify-center md:justify-start'>
              <div className='mercado-libre leading-none text-sm'>
                <Link href="/" className="font-bold block">mercado</Link>
                <Link href="/" className="font-bold block">libre</Link>
              </div>
              <Link href="/" className="text-2xl font-bold">tucarro</Link>
            </div>

            {/* SECCIÓN 2: BUSCADOR (Usamos el componente Searchbar) */}
            <Searchbar />

            {/* SECCIÓN 3: ENLACES */}
            <div className="flex items-center gap-4 text-sm w-full md:w-auto justify-center flex-wrap">
              <Link href="/login" className="hover:text-gray-700">Cuenta</Link>
              <Link href="/favoritos" className="hover:text-gray-700">Favoritos</Link>
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