import './App.css'
import { useEffect, useEffectEvent, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ResponsiveAppBar from './components/AppBar'
import Details from './components/Details'
import useAuth from './hooks/useAuth'
import Admin from './views/Admin'
import Contenido from './views/Contenido'
import Login from './views/Login'
import Profile from './views/Profile'
import { apiRequest } from './utils/api'

function App() {
  const { isLogin, user, token, setSession, logout } = useAuth()
  const [users, setUsers] = useState([])
  const [adminError, setAdminError] = useState('')
  const [adminMessage, setAdminMessage] = useState('')
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const isAdmin = user?.role === 'admin'

  const resetAdminState = () => {
    setUsers([])
    setAdminError('')
    setAdminMessage('')
    setIsLoadingUsers(false)
  }

  const handleLogout = () => {
    logout()
    resetAdminState()
  }

  const handleUnauthorized = useEffectEvent(() => {
    handleLogout()
  })

  useEffect(() => {
    if (!isLogin || !token || !isAdmin) {
      setUsers([])
      return
    }

    let ignore = false

    const getUsers = async () => {
      setIsLoadingUsers(true)
      setAdminError('')

      try {
        const data = await apiRequest('/users', { token })

        if (!ignore) {
          setUsers(data)
        }
      } catch (error) {
        console.error('Error al obtener usuarios', error)

        if (error.status === 401) {
          handleUnauthorized()
          return
        }

        if (!ignore) {
          setAdminError(error.message || 'Error al obtener usuarios')
        }
      } finally {
        if (!ignore) {
          setIsLoadingUsers(false)
        }
      }
    }

    getUsers()

    return () => {
      ignore = true
    }
  }, [isAdmin, isLogin, token])

  const login = async (credentials) => {
    try {
      const data = await apiRequest('/login/', {
        method: 'POST',
        body: credentials,
      })

      setSession({
        user: data.user || {},
        token: data.token || '',
      })
      setAdminError('')
      setAdminMessage('')

      return data
    } catch (error) {
      console.error('Error al iniciar sesion', error)
      return {
        login: false,
        msg: error.message || 'No se pudo conectar con la API',
        user: {},
        token: '',
      }
    }
  }

  const addUser = async (newUser) => {
    try {
      const data = await apiRequest('/users', {
        method: 'POST',
        token,
        body: newUser,
      })

      setUsers((prev) => [data, ...prev])
      setAdminError('')
      setAdminMessage('Usuario creado correctamente')
      return data
    } catch (error) {
      console.error('Error al crear usuario', error)

      if (error.status === 401) {
        handleLogout()
        return null
      }

      setAdminError(error.message || 'Error al crear usuario')
      return null
    }
  }

  const updateUser = async (id, updates) => {
    try {
      const data = await apiRequest(`/users/${id}`, {
        method: 'PUT',
        token,
        body: updates,
      })

      setUsers((prev) => prev.map((item) => (item._id === id ? data : item)))
      setAdminError('')
      setAdminMessage('Usuario actualizado correctamente')
      return data
    } catch (error) {
      console.error('Error al actualizar usuario', error)

      if (error.status === 401) {
        handleLogout()
        return null
      }

      setAdminError(error.message || 'Error al actualizar usuario')
      return null
    }
  }

  const deleteUser = async (id) => {
    try {
      await apiRequest(`/users/${id}`, {
        method: 'DELETE',
        token,
      })

      setUsers((prev) => prev.filter((item) => item._id !== id))
      setAdminError('')
      setAdminMessage('Usuario eliminado correctamente')
      return true
    } catch (error) {
      console.error('Error al eliminar usuario', error)

      if (error.status === 401) {
        handleLogout()
        return false
      }

      setAdminError(error.message || 'Error al eliminar usuario')
      return false
    }
  }

  return (
    <BrowserRouter>
      {isLogin && <ResponsiveAppBar onLogout={handleLogout} user={user} />}
      <Routes>
        <Route path="/" element={<Navigate to={isLogin ? '/profile' : '/login'} replace />} />
        <Route
          path="/login"
          element={isLogin ? <Navigate to="/profile" replace /> : <Login login={login} />}
        />
        <Route
          path="/profile"
          element={isLogin ? <Profile user={user} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/contenido"
          element={isLogin ? <Contenido /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/admin"
          element={
            isLogin ? (
              isAdmin ? (
                <Admin
                  users={users}
                  addUser={addUser}
                  updateUser={updateUser}
                  deleteUser={deleteUser}
                  currentUserId={user?._id}
                  loading={isLoadingUsers}
                  error={adminError}
                  message={adminMessage}
                />
              ) : (
                <Navigate to="/profile" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/users/:id"
          element={
            isLogin ? (
              <Details token={token} currentUser={user} onUnauthorized={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to={isLogin ? '/profile' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
