// components/Searchbar.tsx
'use client'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'

// Usaremos un modal simple para los filtros avanzados (marca)
function FilterModal({ isOpen, onClose, currentBrand, onApplyFilters }: { 
    isOpen: boolean, 
    onClose: () => void, 
    currentBrand: string,
    onApplyFilters: (brand: string) => void 
}) {
  const [selectedBrand, setSelectedBrand] = useState(currentBrand) // Usamos el valor actual

  const handleApply = () => {
    // Llama a la función del padre para actualizar y ejecutar la búsqueda
    onApplyFilters(selectedBrand)
    // El onClose ahora se llama dentro del padre para dar tiempo a la redirección
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 max-w-sm">
        <h3 className="text-xl font-bold mb-4">Filtros de Búsqueda</h3>
        <div className="mb-4">
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
          <select 
            id="brand" 
            className="border p-2 rounded w-full" 
            value={selectedBrand} 
            onChange={(e) => setSelectedBrand(e.target.value)}
          >
            <option value="">Todas las marcas</option>
            <option value="Toyota">Toyota</option>
            <option value="Mazda">Mazda</option>
            <option value="Chevrolet">Chevrolet</option>
          </select>
        </div>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 rounded hover:bg-gray-100">Cancelar</button>
          <button type="button" onClick={handleApply} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Aplicar Filtros</button>
        </div>
      </div>
    </div>
  )
}

export default function Searchbar() {
  const [query, setQuery] = useState('')
  const [brand, setBrand] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()
  // Usamos usePathname para saber en qué página estamos
  const pathname = usePathname() 

  // Función auxiliar para construir y ejecutar la redirección
  const performSearch = (currentQuery: string, currentBrand: string) => {
      const params = new URLSearchParams()
      if (currentQuery) params.set('query', currentQuery)
      if (currentBrand) params.set('brand', currentBrand)

      const url = `/buscar?${params.toString()}`
      router.push(url)
  }

  // Se llama al enviar el formulario con la tecla Enter o el botón "Buscar"
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(query, brand)
  }
  
  // Se llama desde el modal al aplicar filtros
  const handleApplyFilters = (newBrand: string) => {
      setBrand(newBrand);
      setIsModalOpen(false) // Cierra el modal
      
      // *** CORRECCIÓN CLAVE: Activa la búsqueda automáticamente ***
      // Si el usuario no está ya en la página de resultados, lo redirigimos.
      // Siempre redirige para que el filtro se aplique.
      performSearch(query, newBrand)
  };
  
  const filterButtonText = brand ? brand : 'Marca'
  const isBrandApplied = !!brand;

  return (
    <>
      <form onSubmit={handleSearch} className="bg-white rounded shadow flex w-full md:max-w-xl md:flex-1">
        <input 
          type="text" 
          placeholder="Buscar modelo o palabra clave..."
          className="p-2 px-4 rounded-l w-full focus:outline-none text-gray-700"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* Botón para aplicar el filtro de marca */}
        <button 
            type="button"
            onClick={() => setIsModalOpen(true)} 
            className={`px-4 py-2 text-sm whitespace-nowrap border-l border-gray-200 ${isBrandApplied ? 'text-blue-600 font-semibold' : 'text-gray-600'} hover:text-blue-700 transition-colors`}
        >
            <FunnelIcon className="h-5 w-5 inline-block mr-1 align-sub" /> 
            {filterButtonText}
        </button>
        
        {/* Botón principal de búsqueda */}
        <button type="submit" className="px-4 py-2 border-l border-gray-200 text-white bg-blue-600 hover:bg-blue-700 rounded-r">
          <MagnifyingGlassIcon className="h-5 w-5" />
        </button>
      </form>
      
      <FilterModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          currentBrand={brand}
          onApplyFilters={handleApplyFilters}
      />
    </>
  )
}