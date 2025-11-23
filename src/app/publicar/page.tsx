'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function PublishCar() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    price: 0,
    year: new Date().getFullYear(),
    description: '',
    image_url: '',
    seller_contact: '',
  })

  // 1. Verificar si el usuario está logeado
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        alert('Debes iniciar sesión para publicar un vehículo.')
        router.push('/login')
      } else {
        setUser(user)
      }
    })
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    // 2. Insertar el vehículo en la tabla 'cars'
    const { error } = await supabase
      .from('cars')
      .insert({
        ...formData,
        seller_id: user.id, // ID del usuario logeado
        price: Number(formData.price),
        year: Number(formData.year),
      })

    if (error) {
      alert(`Error al publicar: ${error.message}`)
    } else {
      alert('Vehículo publicado con éxito!')
      router.push('/') // Redirigir al Home
    }
  }

  if (!user) return <div className="text-center p-10">Redirigiendo a Login...</div>

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">Publicar Nuevo Vehículo</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <input name="title" placeholder="Título (Ej: Toyota Corolla 2019)" required onChange={handleChange} className="w-full border p-3 rounded"/>
        
        <div className="grid grid-cols-2 gap-4">
          <input type="number" name="price" placeholder="Precio ($)" required onChange={handleChange} className="border p-3 rounded" min="1"/>
          <input type="number" name="year" placeholder="Año" required onChange={handleChange} className="border p-3 rounded" min="1900" max={new Date().getFullYear()}/>
        </div>

        <input name="brand" placeholder="Marca (Ej: Toyota)" required onChange={handleChange} className="w-full border p-3 rounded"/>
        <input name="image_url" placeholder="URL de la imagen" required onChange={handleChange} className="w-full border p-3 rounded"/>
        <input name="seller_contact" placeholder="Email o Teléfono de contacto" required onChange={handleChange} className="w-full border p-3 rounded"/>

        <textarea name="description" placeholder="Descripción detallada del vehículo..." rows={4} required onChange={handleChange} className="w-full border p-3 rounded"/>

        <button type="submit" className="w-full bg-green-600 text-white py-3 rounded text-lg font-bold hover:bg-green-700 transition">
          Publicar Auto
        </button>
      </form>
    </div>
  )
}