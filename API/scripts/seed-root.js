import 'dotenv/config'
import mongoose from 'mongoose'
import User from '../models/users.models.js'
import { connectDB } from '../utils/db.js'
import { protectPassword } from '../utils/hash.js'

const ROOT_USER = {
    name: process.env.ROOT_NAME,
    username: process.env.ROOT_USERNAME,
    password: process.env.ROOT_PASSWORD,
    role: process.env.ROOT_ROLE || 'admin',
}

const seedRoot = async () => {
    if (!ROOT_USER.name || !ROOT_USER.username || !ROOT_USER.password) {
        throw new Error('ROOT_NAME, ROOT_USERNAME y ROOT_PASSWORD son obligatorios para seed:root')
    }

    if (!['admin', 'user'].includes(ROOT_USER.role)) {
        throw new Error('ROOT_ROLE debe ser "admin" o "user"')
    }

    console.log('Conectando a MongoDB...')
    await connectDB()

    const { salt, hashedPassword } = protectPassword(ROOT_USER.password)
    const existingUser = await User.findOne({ username: ROOT_USER.username })

    if (existingUser) {
        existingUser.name = ROOT_USER.name
        existingUser.role = ROOT_USER.role
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
        role: ROOT_USER.role,
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
