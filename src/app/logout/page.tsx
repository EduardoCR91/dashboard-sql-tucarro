'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function AuthStatus() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // 1. Verificar la sesión actual al cargar
    supabase.auth.getUser().then(({ data }) => {
        setUser(data.user)
        setLoading(false)
    })

    // 2. Escuchar cambios de autenticación (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    // Limpieza del listener
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  async function handleLogout() {
    // Cerrar sesión
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error al cerrar sesión:', error)
      alert('Error al cerrar sesión.')
    } else {
      // Redirigir al home
      router.push('/')
    }
  }

  // Si está cargando, no mostrar nada
  if (loading) return null

  // Si el usuario está logeado, mostrar el botón de Logout
  if (user) {
    return (
      <div className="flex items-center space-x-4">
        {/* Enlace a Favoritos y Buscar, ahora visible en todos los tamaños */}
        <Link href="/buscar" className="hover:text-yellow-400 text-sm flex items-center p-1 rounded-lg transition hover:bg-gray-800">
            <MagnifyingGlassIcon className="h-6 w-6 mr-1" />
            <span className="hidden sm:inline">Buscar</span>
        </Link>
        <Link href="/favoritos" className="hover:text-yellow-400 text-sm p-1 rounded-lg transition hover:bg-gray-800">
            Favoritos
        </Link>
        
        {/* Botón de Cerrar Sesión (Logout) */}
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 text-sm transition"
        >
          Salir ({user.email ? user.email.split('@')[0] : 'Usuario'})
        </button>
      </div>
    )
  }

  // Si no hay usuario, mostrar el botón de Login
  return (
    <Link href="/login" className="bg-gray-800 text-white px-3 py-1 rounded-lg hover:bg-gray-700 text-sm">
      Mi Cuenta
    </Link>
  )
}