'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'
import { UserIcon, ChevronDoubleDownIcon } from '@heroicons/react/24/outline'

// Componente Unificado para Login, Registro y Perfil
export default function AccountPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // 1. Cargar el usuario actual al inicio
  useEffect(() => {
    // Escuchar cambios de autenticación para saber el estado
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )
    // Cargar el usuario al montar
    supabase.auth.getUser().then(({ data }) => {
        setUser(data.user)
        setLoading(false)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault()
    let result

    if (isLogin) {
      result = await supabase.auth.signInWithPassword({ email, password })
    } else {
      // Proceso de Registro
      result = await supabase.auth.signUp({ email, password })
    }

    if (result.error) {
      alert(result.error.message)
    } else {
      alert(isLogin ? 'Inicio de sesión exitoso!' : 'Registro exitoso! Revisa tu email para confirmar.')
      // No redirigimos aquí; el listener de useEffect manejará el cambio de estado
    }
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error al cerrar sesión:', error)
      alert('Error al cerrar sesión.')
    } else {
      router.push('/') // Redirigir al home después de salir
    }
  }

  if (loading) return <div className="text-center p-10">Cargando estado de la sesión...</div>

  // ----------------------------------------------------
  // VISTA 1: USUARIO AUTENTICADO (PERFIL Y LOGOUT)
  // ----------------------------------------------------
  if (user) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-2xl border-t-4 border-yellow-500">
        <div className="flex items-center mb-6 border-b pb-4">
          <UserIcon className="h-10 w-10 text-yellow-500 mr-4"/>
          <h2 className="text-3xl font-bold text-gray-800">Mi Perfil</h2>
        </div>
        
        <div className="space-y-4">
            <p className="text-lg">
                <span className="font-semibold text-gray-600">Email:</span> {user.email}
            </p>
            <p className="text-lg">
                <span className="font-semibold text-gray-600">ID de Usuario:</span> {user.id}
            </p>
            <p className="text-sm text-gray-500 pt-2">
                Estado: {user.confirmed_at ? 'Verificado' : 'Pendiente de confirmación por email'}
            </p>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition"
        >
          Cerrar Sesión
        </button>
      </div>
    )
  }

  // ----------------------------------------------------
  // VISTA 2: USUARIO NO AUTENTICADO (LOGIN / REGISTRO)
  // ----------------------------------------------------
  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-xl border-t-4 border-blue-500">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
      </h2>
      <form onSubmit={handleAuth} className="space-y-4">
        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full border p-3 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full border p-3 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition text-lg">
          {isLogin ? 'Entrar' : 'Crear Cuenta'}
        </button>
      </form>
      
      <p className="text-center mt-6 text-sm">
        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {isLogin ? '¿No tienes cuenta? Regístrate aquí.' : '¿Ya tienes cuenta? Inicia Sesión.'}
        </button>
      </p>
    </div>
  )
}