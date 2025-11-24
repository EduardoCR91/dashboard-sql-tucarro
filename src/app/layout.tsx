import './globals.css'
import Link from 'next/link'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-50 text-gray-900">
        <nav className="bg-yellow-300 text-black p-4 shadow-xl sticky top-0 z-10">
          <div className="container mx-auto flex justify-between items-center">
            <div className='mercado-libre'>
              <Link href="/" className=" font-bold">mercado</Link>
              <br />
            <Link href="/" className=" font-bold">libre</Link>
            </div>
            <Link href="/" className="text-2xl font-bold">tucarro</Link>
        <form  className="bg-white p-6 rounded-lg shadow mb-8 flex gap-4 flex-wrap">
          <input 
            type="text" 
            className="border p-2 rounded flex-1"
          />
          <Link href="/buscar" className="px-4 py-2 ">🔍</Link>
        </form>
            <div className="space-x-6">
              <Link href="/login" className="px-4 py-2 ">Cuenta</Link>
      
              <Link href="/buscar" className="hover:text-black-200">Buscar</Link>
              <Link href="/favoritos" className="hover:text-black-200">Favoritos</Link>
              <Link href="/publicar" className="hover:text-black text-stroke-black px-3 py-1 rounded">Publica tu vehiculo</Link> 
              
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