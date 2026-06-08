import crypto from 'crypto';

const HASHED_PASSWORD_REGEX = /^[a-f0-9]{128}$/i;

const getPepper = () => {
    const pepper = process.env.PEPPER || process.env.PASSWORD_PEPPER

    if (!pepper) {
        throw new Error('PEPPER no esta configurado en variables de entorno')
    }

    return pepper
}

const createSalt = () => {
    return crypto.randomBytes(16).toString('hex')
}

const hashPassword = (password, salt) => {
    const pepper = getPepper()
    return crypto.scryptSync(`${password}${pepper}`, salt, 64).toString('hex')
}

export const hashText = (text) => {
    return crypto.createHash('sha256').update(`${text}${getPepper()}`).digest('hex')
}

export const isProtectedPassword = (valueOrUser, maybeSalt) => {
    const password = typeof valueOrUser === 'object' && valueOrUser !== null
        ? valueOrUser.password
        : valueOrUser
    const salt = typeof valueOrUser === 'object' && valueOrUser !== null
        ? valueOrUser.salt
        : maybeSalt

    return typeof salt === 'string' && salt.length > 0 && typeof password === 'string' && HASHED_PASSWORD_REGEX.test(password)
}

export const verifyPassword = (password, salt, storedHash) => {
    if (!salt || typeof storedHash !== 'string' || !/^[a-f0-9]+$/i.test(storedHash)) {
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
    const salt = createSalt()
    const hashedPassword = hashPassword(password, salt)
    return { salt, hashedPassword }
}
