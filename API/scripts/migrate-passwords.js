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
    let roleBackfillCount = 0

    for (const user of users) {
        let shouldSave = false

        if (!user.role) {
            user.role = 'user'
            roleBackfillCount += 1
            shouldSave = true
        }

        if (isProtectedPassword(user)) {
            if (shouldSave) {
                await user.save()
            }
            skippedCount += 1
            continue
        }

        if (!user.password) {
            if (shouldSave) {
                await user.save()
            }
            skippedCount += 1
            continue
        }

        const { salt, hashedPassword } = protectPassword(user.password)
        user.password = hashedPassword
        user.salt = salt
        shouldSave = true
        await user.save()
        migratedCount += 1
    }

    console.log(`Usuarios migrados: ${migratedCount}`)
    console.log(`Usuarios omitidos: ${skippedCount}`)
    console.log(`Roles completados: ${roleBackfillCount}`)
}

migratePasswords()
    .catch((error) => {
        console.error('Error al migrar contraseñas:', error)
        process.exitCode = 1
    })
    .finally(async () => {
        await mongoose.connection.close()
    })
