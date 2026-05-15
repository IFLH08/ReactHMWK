import crypto from 'crypto';

const HASH_OUTPUT_BYTES = 64

const getPepper = () => {
    const pepper = process.env.PEPPER
    if (!pepper) {
        throw new Error('PEPPER no esta configurado en variables de entorno')
    }
    return pepper
}

export const getSalt = () => {
    const size = Number(process.env.SALT_SIZE || 16)
    return crypto.randomBytes(size).toString('hex')
}

export const hashText = (text) => {
    return crypto.createHash('sha512').update(text).digest('hex')
}

export const hashPassword = (password, salt) => {
    const pepper = getPepper()
    return crypto.scryptSync(password, `${salt}${pepper}`, HASH_OUTPUT_BYTES).toString('hex')
}

export const verifyPassword = (password, salt, storedHash) => {
    if (!/^[a-f0-9]+$/i.test(storedHash)) {
        return false
    }

    const calculatedHash = hashPassword(password, salt)
    const calculatedBuffer = Buffer.from(calculatedHash, 'hex')
    const storedBuffer = Buffer.from(storedHash, 'hex')

    if (calculatedBuffer.length !== storedBuffer.length) {
        return false
    }

    return crypto.timingSafeEqual(calculatedBuffer, storedBuffer)
}

export const protectPassword = (password) => {
    const salt = getSalt()
    const hashedPassword = hashPassword(password, salt)
    return { salt, hashedPassword }
}

export const isProtectedPassword = (user) => {
    return Boolean(user?.salt && /^[a-f0-9]{128}$/i.test(user?.password || ''))
}
