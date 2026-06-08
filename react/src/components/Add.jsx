import TextField from '@mui/material/TextField'
import { useState } from 'react'

const Add = ({ addUser }) => {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')

  const onSubmit = async (event) => {
    event.preventDefault()

    if (!name || !username || !password) {
      alert('Completa todos los campos')
      return
    }

    const created = await addUser({ name, username, password, role })

    if (created) {
      setName('')
      setUsername('')
      setPassword('')
      setRole('user')
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="user">user</option>
        <option value="admin">admin</option>
      </select>
      <button type="submit">Agregar</button>
    </form>
  )
}

export default Add
