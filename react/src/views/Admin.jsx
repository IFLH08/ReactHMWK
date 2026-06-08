import Add from '../components/Add'
import User from '../components/User'

const Admin = ({ users = [], addUser, updateUser, deleteUser, currentUserId, loading, error, message }) => {
  return (
    <section>
      <h1>Panel de administracion</h1>
      <p>Desde aqui puedes crear, editar y eliminar usuarios.</p>
      <Add addUser={addUser} />
      {loading && <p>Cargando usuarios...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <User
              key={u._id}
              user={u}
              updateUser={updateUser}
              deleteUser={deleteUser}
              currentUserId={currentUserId}
            />
          ))}
        </tbody>
      </table>
      {!loading && users.length === 0 && <p>No hay usuarios para mostrar.</p>}
    </section>
  )
}

export default Admin
