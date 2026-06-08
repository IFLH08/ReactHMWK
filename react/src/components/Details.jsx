import { useEffect, useEffectEvent, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiRequest } from '../utils/api'

const Details = ({ token, currentUser, onUnauthorized }) => {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const triggerUnauthorized = useEffectEvent(() => {
    if (onUnauthorized) {
      onUnauthorized()
    }
  })

  useEffect(() => {
    let ignore = false

    const loadUser = async () => {
      setLoading(true)
      setError('')

      try {
        const data = await apiRequest(`/users/${id}`, { token })

        if (!ignore) {
          setUser(data)
        }
      } catch (requestError) {
        console.error('Error al obtener detalle del usuario', requestError)

        if (requestError.status === 401) {
          triggerUnauthorized()
          return
        }

        if (!ignore) {
          setError(requestError.message || 'No se pudo cargar el usuario')
          setUser(null)
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadUser()

    return () => {
      ignore = true
    }
  }, [id, token])

  if (loading) {
    return <p>Cargando usuario...</p>
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>
  }

  if (!user) {
    return <p>Usuario no encontrado.</p>
  }

  const isOwnProfile = currentUser?._id === user._id

  return (
    <div>
      <h1>Detalle de usuario</h1>
      <p>Id: {user._id}</p>
      <p>Name: {user.name}</p>
      <p>Username: {user.username}</p>
      <p>Role: {user.role || 'user'}</p>
      <p>{isOwnProfile ? 'Este es tu usuario actual.' : 'Vista de otro usuario.'}</p>
    </div>
  )
}

export default Details
