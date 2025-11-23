'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

// Define la estructura de los datos del vehículo
interface Car {
  id: number
  title: string
  brand: string
  price: number
  year: number
  description: string
  image_url: string
  seller_contact: string
}

export default function Home() {
  const [cars, setCars] = useState<Car[]>([])
  const [favorites, setFavorites] = useState<number[]>([]) // Almacena IDs de favoritos
  const [page, setPage] = useState(0)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const CARS_PER_PAGE = 10

  useEffect(() => {
    // 1. Obtener usuario y favoritos
    async function loadUserData() {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        // Cargar IDs de favoritos del usuario
        const { data: favData } = await supabase
          .from('favorites')
          .select('car_id')
          .eq('user_id', user.id)
        
        if (favData) {
          setFavorites(favData.map(f => f.car_id))
        }
      } else {
        setUserId(null)
        setFavorites([])
      }
      setLoading(false)
    }

    loadUserData()
  }, [])


  useEffect(() => {
    fetchCars()
  }, [page]) // Refetch cuando cambia la página

  async function fetchCars() {
    setLoading(true)
    const from = page * CARS_PER_PAGE
    const to = from + CARS_PER_PAGE - 1
    
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to)
      
    if (error) {
        console.error('Error fetching cars:', error)
    }
    if (data) setCars(data)
    setLoading(false)
  }

  async function addToFavorites(carId: number) {
    if (!userId) {
        alert('Debes iniciar sesión para añadir a favoritos.')
        return
    }
    
    // Si ya está en favoritos, se asume que queremos quitarlo
    if (favorites.includes(carId)) {
        const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', userId)
            .eq('car_id', carId)

        if (!error) {
            setFavorites(favorites.filter(id => id !== carId))
        }
    } else {
        // Añadir a favoritos
        const { error } = await supabase
            .from('favorites')
            .insert({ user_id: userId, car_id: carId })
        
        if (!error) {
            setFavorites([...favorites, carId])
        } else {
            // Este error puede ocurrir si ya existe la combinación car_id/user_id
            console.error('Error al añadir favorito:', error.message)
            alert('Error al guardar favorito. Puede que ya esté añadido.')
        }
    }
  }

  if (loading) return <div className="text-center p-10">Cargando vehículos...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-blue-800">Vehículos Recientes</h1>
      
      {cars.length === 0 && page > 0 && (
          <p className="text-center text-gray-500 p-10">No hay más vehículos en esta página.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => {
            const isFavorite = favorites.includes(car.id)
            return (
                <div key={car.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition duration-300 hover:shadow-2xl hover:scale-[1.01]">
                    <img 
                        src={car.image_url || 'https://placehold.co/500x300/CCCCCC/333333?text=CarMarket'} 
                        alt={car.title} 
                        className="w-full h-48 object-cover transition duration-500 hover:opacity-90"
                    />
                    <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="text-xl font-bold text-gray-800 truncate">{car.title}</h2>
                            <button 
                                onClick={(e) => {
                                    e.preventDefault(); 
                                    addToFavorites(car.id);
                                }} 
                                className="transition transform duration-150 active:scale-90"
                                title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                            >
                                {isFavorite ? (
                                    <HeartSolidIcon className="h-7 w-7 text-red-500 drop-shadow-md" />
                                ) : (
                                    <HeartIcon className="h-7 w-7 text-gray-400 hover:text-red-500" />
                                )}
                            </button>
                        </div>
                        
                        <p className="text-gray-500 text-sm mb-3">
                            {car.year} • {car.brand}
                        </p>
                        <p className="text-3xl font-extrabold text-green-600">
                            ${car.price.toLocaleString()}
                        </p>

                        <Link 
                            href={`/cars/${car.id}`} 
                            className="mt-4 block text-center bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Ver Detalles
                        </Link>
                    </div>
                </div>
            )
        })}
      </div>
      
      <div className="flex justify-center mt-10 gap-6">
        <button 
            disabled={page === 0} 
            onClick={() => setPage(page - 1)} 
            className="px-6 py-3 bg-gray-300 text-gray-800 font-bold rounded-lg disabled:opacity-50 transition hover:bg-gray-400"
        >
            ← Anterior
        </button>
        <button 
            onClick={() => setPage(page + 1)} 
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg transition hover:bg-blue-700"
        >
            Siguiente →
        </button>
      </div>
    </div>
  )
}