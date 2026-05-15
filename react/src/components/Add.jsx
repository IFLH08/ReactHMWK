import TextField from '@mui/material/TextField'
import React, { useState } from 'react'

const Add = ({ addUser }) => {
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    
    const onSubmit = async (e)=>{
      e.preventDefault()
      if(!name || !username || !password){
        alert('Completa todos los campos')
        return
      }
      const created = await addUser({name, username, password})
      if (created) {
        setName('')
        setUsername('')
        setPassword('')
      }
    }
  return (
    <form onSubmit={onSubmit}>
        <TextField label='Name' value={name} onChange={(e)=>setName(e.target.value)}/>
        <TextField label='Username' value={username} onChange={(e)=>setUsername(e.target.value)}/>
        <TextField label='Password' type='password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
        <button type='submit'>Agregar</button>
    </form>
  )
}

export default Add
