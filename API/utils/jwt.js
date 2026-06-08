import jwt from 'jsonwebtoken'

const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET || process.env.JWT

    if (!secret) {
        throw new Error('JWT_SECRET no esta configurado en variables de entorno')
    }

    return secret
}

const normalizeAuthPayload = (payload = {}) => ({
    ...payload,
    id: payload.id || payload.sub,
    role: payload.role || 'user',
})

const extractToken = (authorizationHeader = '') => {
    if (typeof authorizationHeader !== 'string') {
        return ''
    }

    const trimmedHeader = authorizationHeader.trim()

    if (!trimmedHeader) {
        return ''
    }

    if (trimmedHeader.toLowerCase().startsWith('bearer ')) {
        return trimmedHeader.slice(7).trim()
    }

    return trimmedHeader
}

export const signJWT = (payload, options = {}) => {
    return jwt.sign(payload, getJwtSecret(), { expiresIn: '1h', ...options })
}

export const validateJWT = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization

        if (!authorizationHeader) {
            return res.status(401).json({ error: 'No authorization header provided' })
        }

        const token = extractToken(authorizationHeader)

        if (!token) {
            return res.status(401).json({ error: 'No token provided' })
        }

        const decoded = jwt.verify(token, getJwtSecret())

        req.auth = normalizeAuthPayload(decoded)
        next()
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token', details: error.message })
    }
}

export const requireAdmin = (req, res, next) => {
    if (req.auth?.role !== 'admin') {
        return res.status(403).json({ error: 'Admin role required' })
    }

    next()
}
