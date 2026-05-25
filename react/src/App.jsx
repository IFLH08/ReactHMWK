import './App.css'
import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Login from './views/Login'
import Profile from './views/Profile'
import Contenido from './views/Contenido'
import ResponsiveAppBar from './components/AppBar'
import Admin from './views/Admin'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function App() {
  const [isLogin, setIsLogin] = useState(false)
  const [user, setUser] = useState({})
  const [users, setUsers] = useState([])
  const [token, setToken] = useState('')

  const logout = () => {
    setIsLogin(false)
    setUser({})
    setUsers([])
    setToken('')
  }

  useEffect(() => {
    if (!isLogin || !token) return

    const getUsers = async () => {
      try {
        const res = await fetch(`${API_URL}/users`, {
          headers: {
            authorization: token,
          },
        })

        if (!res.ok) {
          if (res.status === 401) {
            logout()
          }

          const err = await res.json().catch(() => ({}))
          alert(err.error || 'Error al obtener usuarios')
          return
        }

        const data = await res.json()
        setUsers(data)
      } catch (error) {
        console.error(error)
        alert('Error al obtener usuarios')
      }
    }

    getUsers()
  }, [isLogin, token])

  const login = async (credentials) => {
    const res = await fetch(`${API_URL}/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })
    const data = await res.json()

    setIsLogin(Boolean(data.login))
    setUser(data.user || {})
    setToken(data.token || '')

    return data
  }

  const delUser = async (id) => {
    try {
      const res = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: {
          authorization: token,
        },
      })

      if (!res.ok) {
        if (res.status === 401) {
          logout()
        }

        const err = await res.json().catch(() => ({}))
        alert(err.error || 'Error al eliminar usuario')
        return
      }

      setUsers((prev) => prev.filter((u) => u._id !== id))
    } catch (error) {
      console.error(error)
      alert('Error al eliminar usuario')
    }
  }

  const addUser = async (newUser) => {
    try {
      const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
        body: JSON.stringify(newUser),
      })

      if (!res.ok) {
        if (res.status === 401) {
          logout()
        }

        const err = await res.json().catch(() => ({}))
        alert(err.error || 'Error al crear usuario')
        return null
      }

      const data = await res.json()
      setUsers((prev) => [...prev, data])
      return data
    } catch (error) {
      console.error(error)
      alert('Error al crear usuario')
      return null
    }
  }

  return (
    <BrowserRouter>
      {isLogin && <ResponsiveAppBar onLogout={logout} user={user} />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login login={login} />} />
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
            isLogin ? <Admin users={users} deluser={delUser} adduser={addUser} /> : <Navigate to="/login" replace />
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
