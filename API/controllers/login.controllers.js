import User from "../models/users.models.js";
import { protectPassword, verifyPassword, isProtectedPassword } from "../utils/hash.js";
import { sanitizeUser } from "../utils/sanitize.js";
import { signJWT } from "../utils/jwt.js";

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

        let validCredentials = false

        if (isProtectedPassword(user)) {
            validCredentials = verifyPassword(password, user.salt, user.password)
        } else if (user.password === password) {
            const { salt, hashedPassword } = protectPassword(password)
            user.password = hashedPassword
            user.salt = salt
            await user.save()
            validCredentials = true
        }

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
