import React from 'react'
import Add from '../components/Add'
import User from '../components/User'

const Admin = ({ users = [], adduser, deluser }) => {
  return (
    <>
      <Add addUser={adduser} />
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Delete?</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <User key={u._id} user={u} deluser={deluser} />
          ))}
        </tbody>
      </table>
    </>
  )
}

export default Admin
