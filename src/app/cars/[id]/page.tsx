'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../../lib/supabase'
import { useParams } from 'next/navigation'

export default function CarDetails() {
  const { id } = useParams()
  const [car, setCar] = useState<any>(null)

  useEffect(() => {
    if (id) getCar()
  }, [id])

  async function getCar() {
    const { data } = await supabase.from('cars').select('*').eq('id', id).single()
    setCar(data)
  }

  if (!car) return <div>Cargando...</div>

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <img src={car.image_url} className="w-full h-80 object-cover" />
      <div className="p-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2">{car.title}</h1>
            <p className="text-gray-500 text-lg">{car.brand} • {car.year}</p>
          </div>
          <div className="text-3xl font-bold text-green-600">${car.price}</div>
        </div>
        
        <hr className="my-6" />
        <h3 className="text-xl font-semibold mb-2">Descripción</h3>
        <p className="text-gray-700 leading-relaxed mb-6">{car.description}</p>
        
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <h3 className="font-bold text-blue-900 mb-2">Contactar al Vendedor</h3>
          <p className="text-blue-800">Este vehículo es vendido por un particular/concesionario.</p>
          <button className="mt-4 bg-green-600 text-white px-6 py-3 rounded font-bold w-full md:w-auto hover:bg-green-700">
            Contactar: {car.seller_contact}
          </button>
        </div>
      </div>
    </div>
  )
}