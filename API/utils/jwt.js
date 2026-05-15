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
        const authHeader = req.headers.authorization

        if (!authHeader) {
            return res.status(401).json({ error: 'No token provided' })
        }

        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Invalid authorization format' })
        }

        const token = authHeader.slice(7).trim()
        const decoded = jwt.verify(token, getJwtSecret())

        req.auth = decoded
        next()
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token', details: error.message })
    }
}
