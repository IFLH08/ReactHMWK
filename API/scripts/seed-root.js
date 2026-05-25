import 'dotenv/config'
import mongoose from 'mongoose'
import User from '../models/users.models.js'
import { connectDB } from '../utils/db.js'
import { protectPassword } from '../utils/hash.js'

const ROOT_USER = {
    name: 'Root',
    username: 'root',
    password: 'root'
}

const seedRoot = async () => {
    console.log('Conectando a MongoDB...')
    await connectDB()

    const { salt, hashedPassword } = protectPassword(ROOT_USER.password)
    const existingUser = await User.findOne({ username: ROOT_USER.username })

    if (existingUser) {
        existingUser.name = ROOT_USER.name
        existingUser.password = hashedPassword
        existingUser.salt = salt
        await existingUser.save()
        console.log(`Usuario "${ROOT_USER.username}" actualizado correctamente.`)
        return
    }

    const user = new User({
        name: ROOT_USER.name,
        username: ROOT_USER.username,
        password: hashedPassword,
        salt,
    })

    await user.save()
    console.log(`Usuario "${ROOT_USER.username}" creado correctamente.`)
}

seedRoot()
    .catch((error) => {
        console.error('Error al ejecutar seed root:', error)
        process.exitCode = 1
    })
    .finally(async () => {
        await mongoose.connection.close()
        console.log('Conexion cerrada.')
    })
