import jwt from 'jsonwebtoken'

const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET || process.env.JWT

    if (!secret) {
        throw new Error('JWT_SECRET no esta configurado en variables de entorno')
    }

    return secret
}

export const signJWT = (payload, options = {}) => {
    return jwt.sign(payload, getJwtSecret(), { expiresIn: '1h', ...options })
}

export const validateJWT = (req, res, next) => {
    try {
        const token = req.headers.authorization

        if (!token) {
            return res.status(401).json({ error: 'No token provided' })
        }

        const decoded = jwt.verify(token.trim(), getJwtSecret())

        req.auth = decoded
        next()
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token', details: error.message })
    }
}
