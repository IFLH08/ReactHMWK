import User from "../models/users.models.js";
import { verifyPassword } from "../utils/hash.js";
import { signJWT } from "../utils/jwt.js";

const sanitizeUser = (user) => {
    if (!user) return null

    const plainUser = typeof user.toObject === 'function' ? user.toObject() : user
    const { password, salt, ...safeUser } = plainUser
    return safeUser
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body || {}

        if (!username || !password) {
            return res.status(400).json({ login: false, msg: "Username and password required", user: {}, token: "" })
        }

        const user = await User.findOne({ username })

        if (!user) {
            return res.status(404).json({ login: false, msg: "User not found", user: {}, token: "" })
        }

        const validCredentials = verifyPassword(password, user.salt, user.password)

        if (!validCredentials) {
            return res.status(401).json({ login: false, msg: "Wrong credentials", user: {}, token: "" })
        }

        const safeUser = sanitizeUser(user)
        const token = signJWT({ sub: user._id.toString(), username: user.username })

        return res.json({ login: true, msg: "Ok", user: safeUser, token })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ login: false, msg: "Server error", user: {}, token: "" })
    }
}
