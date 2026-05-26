import React from 'react'
import { Link } from 'react-router-dom'

const User = ({ user, deluser }) => {
  return (
    <tr>
        <td><Link to={`/users/${user._id}?react=889`}>{user._id}</Link></td>
        <td>{user.name}</td>
        <td><button onClick={() => deluser(user._id)}>Eliminar</button></td>
    </tr>
  )
}

export default User
