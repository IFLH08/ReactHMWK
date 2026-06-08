import User from "../models/users.models.js"
import { protectPassword } from "../utils/hash.js"

const sanitizeUser = (user) => {
    if (!user) return null

    const plainUser = typeof user.toObject === 'function' ? user.toObject() : user
    const { password, salt, ...safeUser } = plainUser
    return {
        ...safeUser,
        role: safeUser.role || 'user',
    }
}

const canAccessUser = (auth, userId) => {
    if (!auth || !userId) {
        return false
    }

    return auth.role === 'admin' || auth.id === userId || auth.sub === userId
}

export const getUsers = async(req,res) => {
    try {
        const users = await User.find({}, '-password -salt').sort({ createdAt: -1 })
        res.json(users.map(sanitizeUser))
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al obtener usuarios' })
    }
}
export const getUser = async (req,res) => {
    try {
        const id = req.params.id
        if (!canAccessUser(req.auth, id)) {
            return res.status(403).json({ error: 'No tienes permiso para ver este usuario' })
        }

        const user = await User.findById(id, '-password -salt')
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })
        res.json(sanitizeUser(user))
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al obtener usuario' })
    }
}
export const postUser = async (req,res) => {
    try {
        const {name, username, password, role} = req.body || {}
        if (!name || !username || !password) {
            return res.status(400).json({ error: 'Faltan campos requeridos: name, username, password' })
        }
        const { salt, hashedPassword } = protectPassword(password)
        const user = new User({
            name,
            username,
            password: hashedPassword,
            salt,
            role: role || 'user',
        })
        await user.save()
        res.status(201).json(sanitizeUser(user))
    } catch (error) {
        console.error(error)
        if (error.code === 11000) {
            return res.status(409).json({ error: 'El nombre de usuario ya existe' })
        }
        res.status(500).json({ error: 'Error al crear usuario' })
    }
}
export const putUser = async (req, res) => {
    try {
        const {name, username, password, role} = req.body || {}
        const updateData = {}

        if (name !== undefined) updateData.name = name
        if (username !== undefined) updateData.username = username
        if (role !== undefined) updateData.role = role
        if (password !== undefined) {
            const { salt, hashedPassword } = protectPassword(password)
            updateData.password = hashedPassword
            updateData.salt = salt
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: 'No hay campos para actualizar' })
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password -salt')
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })
        res.json(sanitizeUser(user));
    } catch (error) {
        console.error(error)
        if (error.code === 11000) {
            return res.status(409).json({ error: 'El nombre de usuario ya existe' })
        }
        res.status(500).json({ error: 'Error al actualizar usuario' })
    }
}

export const delUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })
        res.json({ message: "Usuario eliminado correctamente", user: sanitizeUser(user) });
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al eliminar usuario' })
    }
}
