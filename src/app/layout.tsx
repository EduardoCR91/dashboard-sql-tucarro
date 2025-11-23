import './globals.css'
import Link from 'next/link'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-50 text-gray-900">
        <nav className="bg-blue-900 text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">CarMarket 🚗</Link>
            <div className="space-x-6">
              <Link href="/publicar" className="hover:text-blue-200 bg-red-600 px-3 py-1 rounded">Vender!</Link> 
              <Link href="/buscar" className="hover:text-blue-200">Buscar</Link>
              <Link href="/favoritos" className="hover:text-blue-200">Favoritos</Link>
              <Link href="/login" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500">Cuenta</Link>
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