import 'dotenv/config'
import mongoose from 'mongoose'
import User from '../models/users.models.js'
import { connectDB } from '../utils/db.js'
import { protectPassword, isProtectedPassword } from '../utils/hash.js'

const migratePasswords = async () => {
    await connectDB()

    const users = await User.find()
    let migratedCount = 0
    let skippedCount = 0

    for (const user of users) {
        if (isProtectedPassword(user)) {
            skippedCount += 1
            continue
        }

        if (!user.password) {
            skippedCount += 1
            continue
        }

        const { salt, hashedPassword } = protectPassword(user.password)
        user.password = hashedPassword
        user.salt = salt
        await user.save()
        migratedCount += 1
    }

    console.log(`Usuarios migrados: ${migratedCount}`)
    console.log(`Usuarios omitidos: ${skippedCount}`)
}

migratePasswords()
    .catch((error) => {
        console.error('Error al migrar contraseñas:', error)
        process.exitCode = 1
    })
    .finally(async () => {
        await mongoose.connection.close()
    })
