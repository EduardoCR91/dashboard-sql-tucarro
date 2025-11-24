// app/buscar/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase' // Asegúrate de que esta ruta sea correcta
import Link from 'next/link'

interface Car {
    id: number;
    title: string;
    year: number;
    price: number;
    // Añade más campos según tu esquema de Supabase
}

export default function SearchResultsPage() {
  const searchParams = useSearchParams()
  const [results, setResults] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Obtenemos los parámetros de la URL
  const query = searchParams.get('query') || ''
  const brand = searchParams.get('brand') || ''

  useEffect(() => {
    async function fetchResults() {
      setLoading(true)
      setError(null)

      try {
        let search = supabase.from('cars').select('*')

        // Aplicamos los filtros de la URL
        if (query) search = search.ilike('title', `%${query}%`)
        if (brand) search = search.ilike('brand', `%${brand}%`)

        const { data, error: dbError } = await search
        
        if (dbError) {
          throw new Error(dbError.message)
        }

        if (data) setResults(data as Car[])

      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    
    // Solo busca si hay al menos un filtro o consulta
    if (query || brand) {
        fetchResults()
    } else {
        setLoading(false)
        setResults([])
    }

  }, [query, brand]) // Se ejecuta cada vez que cambian la consulta o la marca

  // --- Renderizado ---
  
  if (loading) {
    return (
      <div className="text-center p-8">
        <p>Cargando resultados...</p>
      </div>
    )
  }
  
  if (error) {
      return <p className="text-red-500 p-8">Error al cargar resultados: {error}</p>
  }
  
  const searchTitle = `Resultados para: "${query}" ${brand ? `(Marca: ${brand})` : ''}`

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{searchTitle}</h1>
      
      {results.length === 0 && (
          <p className="text-gray-500">No se encontraron vehículos que coincidan con tu búsqueda. Intenta con otros filtros.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((car) => (
          <Link href={`/cars/${car.id}`} key={car.id} className="block border p-4 rounded-lg hover:shadow-lg transition-shadow bg-white">
             <h2 className="font-bold text-xl mb-1">{car.title}</h2>
             <p className="text-gray-600">{car.year}</p>
             <p className="text-2xl font-semibold mt-2">${car.price.toLocaleString('es-CO')}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}