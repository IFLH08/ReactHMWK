export const sanitizeUser = (user) => {
    if (!user) return null

    const plainUser = typeof user.toObject === 'function' ? user.toObject() : user
    const { password, salt, ...safeUser } = plainUser
    return safeUser
}
