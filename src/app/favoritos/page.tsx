'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import Link from 'next/link'
import { HeartIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/navigation'

// Definimos la interfaz del auto
interface FavoriteCar {
  id: number
  title: string
  brand: string
  price: number
  year: number
  image_url: string
}

export default function Favorites() {
  const [favs, setFavs] = useState<FavoriteCar[]>([])
  const [loading, setLoading] = useState(true)
  const [isLogged, setIsLogged] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadFavorites()
  }, [])

  async function loadFavorites() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
        setIsLogged(false)
        setLoading(false)
        return
    }

    setIsLogged(true)
    
    // Solicitamos la tabla favorites y unimos con cars
    const { data, error } = await supabase
      .from('favorites')
      .select('car_id, cars(*)') 
      .eq('user_id', user.id)

    if (error) {
        console.error('Error al cargar favoritos:', error.message)
    }

    if (data) {
        // CORRECCIÓN DEL ERROR DE TYPESCRIPT:
        // Usamos (f: any) para evitar conflictos de inferencia inicial.
        // Hacemos 'as unknown as FavoriteCar' para forzar el tipo y eliminar el error ts(2352).
        const favoriteCars = data
            .map((f: any) => f.cars as unknown as FavoriteCar)
            .filter(car => car !== null) // Filtramos por seguridad
            
        setFavs(favoriteCars)
    }
    setLoading(false)
  }
  
  async function removeFavorite(carId: number) {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('car_id', carId)
        
      if (!error) {
          setFavs(favs.filter(car => car.id !== carId))
      }
  }

  if (loading) return <div className="text-center p-10 text-xl">Cargando tus vehículos favoritos...</div>

  if (!isLogged) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-lg max-w-lg mx-auto mt-10">
        <HeartIcon className="h-16 w-16 text-red-500 mb-4"/>
        <h1 className="text-2xl font-bold mb-3">Inicia Sesión para ver Favoritos</h1>
        <p className="text-gray-600 mb-6 text-center">
            Guarda los vehículos que te interesan para contactar al vendedor más tarde.
        </p>
        <button 
            onClick={() => router.push('/login')}
            className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition"
        >
            Ir a Iniciar Sesión
        </button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-red-600 flex items-center">
        <HeartIcon className="h-8 w-8 mr-3"/> Mis Vehículos Favoritos
      </h1>
      
      <div className="space-y-4">
        {favs.length === 0 ? (
          <div className="text-center p-12 bg-gray-100 rounded-xl">
            <p className="text-xl text-gray-600">Aún no has guardado ningún vehículo en favoritos. ¡Empieza a buscar!</p>
            <button 
                onClick={() => router.push('/buscar')}
                className="mt-6 bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
            >
                Buscar Vehículos
            </button>
          </div>
        ) : (
          favs.map((car) => (
            <div key={car.id} className="flex bg-white p-5 rounded-xl shadow-md items-center gap-6 border border-gray-200"> 
                <img 
                    src={car.image_url || 'https://placehold.co/128x96/CCCCCC/333333?text=Car'} 
                    className="w-32 h-24 object-cover rounded-lg flex-shrink-0" 
                    alt={car.title}
                />
                <div className="flex-grow">
                    <Link href={`/cars/${car.id}`} className="font-bold text-xl text-blue-800 hover:text-blue-600 transition">
                        {car.title} ({car.year})
                    </Link>
                    <p className="text-gray-500 text-sm mb-1">{car.brand}</p>
                    <p className="text-2xl font-extrabold text-green-600">${car.price.toLocaleString()}</p>
                </div>
                <button 
                    onClick={() => removeFavorite(car.id)}
                    className="text-red-400 hover:text-red-600 transition p-2 bg-red-50 rounded-full flex-shrink-0"
                    title="Quitar de favoritos"
                >
                    <HeartIcon className="h-6 w-6" />
                </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}