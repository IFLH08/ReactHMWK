import React from 'react'

const User = ({user,deluser}) => {
  return (
    <tr>
        <td>{user._id}</td>
        <td>{user.name}</td>
        <td><button onClick={()=>deluser(user._id)}>Eliminar</button></td>
    </tr>
  )
}

export default User
