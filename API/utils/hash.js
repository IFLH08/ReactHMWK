import crypto from 'crypto';



const getPepper = () => {
    const pepper = process.env.PEPPER || process.env.PASSWORD_PEPPER

    return pepper
}

const createSalt = () => {
    return crypto.randomBytes(16).toString('hex')
}

const hashPassword = (password, salt) => {
    const pepper = getPepper()
    return crypto.scryptSync(`${password}${pepper}`, salt, 64).toString('hex')
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
