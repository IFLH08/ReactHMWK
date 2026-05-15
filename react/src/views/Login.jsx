import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = ({ login }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (event) => {
    event.preventDefault()

    if (!username || !password) {
      setError('Ingresa usuario y contrasena')
      return
    }

    const res = await login({ username, password })

    if (res.login === true) {
      setUsername('')
      setPassword('')
      setError('')
      navigate('/profile')
    } else {
      setError('Usuario o contrasena incorrectos')
    }
  }

  return (
    <div className="login-page">
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="username">Usuario</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Contrasena</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Entrar</button>
      </form>
    </div>
  )
}

export default Login
