import { useState } from 'react'
import { Link } from 'react-router-dom'

const User = ({ user, updateUser, deleteUser, currentUserId }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user.name || '')
  const [username, setUsername] = useState(user.username || '')
  const [role, setRole] = useState(user.role || 'user')
  const [password, setPassword] = useState('')

  const startEditing = () => {
    setName(user.name || '')
    setUsername(user.username || '')
    setRole(user.role || 'user')
    setPassword('')
    setIsEditing(true)
  }

  const handleSave = async () => {
    const payload = {
      name,
      username,
      role,
    }

    if (password.trim()) {
      payload.password = password.trim()
    }

    const updated = await updateUser(user._id, payload)

    if (updated) {
      setIsEditing(false)
      setPassword('')
    }
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(`Eliminar al usuario ${user.username}?`)

    if (confirmed) {
      await deleteUser(user._id)
    }
  }

  return (
    <tr>
      <td>
        {isEditing ? (
          <input value={name} onChange={(event) => setName(event.target.value)} />
        ) : (
          user.name
        )}
      </td>
      <td>
        {isEditing ? (
          <input value={username} onChange={(event) => setUsername(event.target.value)} />
        ) : (
          user.username
        )}
      </td>
      <td>
        {isEditing ? (
          <select value={role} onChange={(event) => setRole(event.target.value)}>
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
        ) : (
          user.role || 'user'
        )}
      </td>
      <td>
        <Link to={`/users/${user._id}`}>Detalles</Link>{' '}
        {isEditing ? (
          <>
            <input
              type="password"
              placeholder="Nueva password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button type="button" onClick={handleSave}>
              Guardar
            </button>{' '}
            <button type="button" onClick={() => setIsEditing(false)}>
              Cancelar
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={startEditing}>
              Editar
            </button>{' '}
            <button type="button" onClick={handleDelete}>
              Eliminar
            </button>
            {currentUserId === user._id ? ' (tu usuario)' : ''}
          </>
        )}
      </td>
    </tr>
  )
}

export default User
