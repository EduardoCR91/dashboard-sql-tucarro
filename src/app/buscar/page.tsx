'use client'

import { useState } from 'react'

import { supabase } from '../../../lib/supabase'

import Link from 'next/link'



export default function Search() {

const [query, setQuery] = useState('')

const [brand, setBrand] = useState('')

const [results, setResults] = useState<any[]>([])



async function handleSearch(e: React.FormEvent) {

e.preventDefault()

let search = supabase.from('cars').select('*')



if (query) search = search.ilike('title', `%${query}%`)

if (brand) search = search.ilike('brand', `%${brand}%`)



const { data } = await search

if (data) setResults(data)

}



return (

<div>

<h1 className="text-3xl font-bold mb-6">Buscar Vehículo</h1>

<form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow mb-8 flex gap-4 flex-wrap">

<input

type="text"

placeholder="Ej: Corolla, Mazda 3..."

className="border p-2 rounded flex-1"

onChange={(e) => setQuery(e.target.value)}

/>

<select className="border p-2 rounded" onChange={(e) => setBrand(e.target.value)}>

<option value="">Todas las marcas</option>
<option value="Toyota">Toyota</option>
<option value="Mazda">Mazda</option>
<option value="Chevrolet">Chevrolet</option>
<option value="Ford">Ford</option>
<option value="Honda">Honda</option>
<option value="Nissan">Nissan</option>
<option value="Volkswagen">Volkswagen</option>
<option value="Subaru">Subaru</option>
<option value="Kia">Kia</option>
<option value="Mercedes">Mercedes</option>
<option value="Audi">Audi</option>
<option value="Bmw">Bmw</option>

</select>

<button className="bg-blue-600 text-white px-6 py-2 rounded">Buscar</button>

</form>



<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

{results.map((car) => (

<Link href={`/cars/${car.id}`} key={car.id} className="block border p-4 rounded hover:shadow-md bg-white">

<h2 className="font-bold text-lg">{car.title}</h2>

<p className="text-gray-500">{car.year} - ${car.price}</p>

</Link>

))}

{results.length === 0 && <p className="text-gray-500">Ingresa filtros para buscar.</p>}

</div>

</div>

)

}