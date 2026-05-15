import React from 'react'

const Profile = ({ user }) => {
  if (!user || Object.keys(user).length === 0) {
    return (
      <>
        <div>profile</div>
        <p>No hay usuario conectado.</p>
      </>
    )
  }

  return (
    <>
      <div>profile</div>
      <h1>Nombre: {user.name}</h1>
      <h2>Id: {user._id}</h2>
    </>
  )
}

export default Profile
