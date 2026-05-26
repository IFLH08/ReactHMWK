import React from 'react'
import { useParams, useSearchParams } from 'react-router-dom'


const Details = () => {
  const { id } = useParams()
  const [searchParams] = useSearchParams()


    return (
    <div>
        Details
        <p>Valor de la variable id: {id}</p>
        <p>Valor del parámetro de búsqueda react: {searchParams.get('react')}</p>
    </div>
    )
}

export default Details
