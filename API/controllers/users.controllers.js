import User from "../models/users.models.js"
import { protectPassword } from "../utils/hash.js"
import { sanitizeUser } from "../utils/sanitize.js"
export const getUsers = async(req,res) => {
    try {
        const users = await User.find({}, '-password -salt')
        res.json(users)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al obtener usuarios' })
    }
}
export const getUser = async (req,res) => {
    try {
        const id = req.params.id
        const user = await User.findById(id, '-password -salt')
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })
        res.json(user)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al obtener usuario' })
    }
}
export const postUser = async (req,res) => {
    try {
        const {name, username, password} = req.body || {}
        if (!name || !username || !password) {
            return res.status(400).json({ error: 'Faltan campos requeridos: name, username, password' })
        }
        const { salt, hashedPassword } = protectPassword(password)
        const user = new User({name, username, password: hashedPassword, salt})
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
        const {name, username, password} = req.body || {}
        const updateData = {}

        if (name !== undefined) updateData.name = name
        if (username !== undefined) updateData.username = username
        if (password !== undefined) {
            const { salt, hashedPassword } = protectPassword(password)
            updateData.password = hashedPassword
            updateData.salt = salt
        }

        const user = await User.findByIdAndUpdate(req.params.id, updateData, {new: true, runValidators: true, select: '-password -salt'});
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })
        res.json(user);
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
