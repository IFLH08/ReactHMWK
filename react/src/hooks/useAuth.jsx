import { useEffect, useState } from 'react'

const AUTH_STORAGE_KEY = 'reacthmwk.auth'

const emptyAuthState = {
  isLogin: false,
  user: {},
  token: '',
}

const normalizeUser = (user = {}) => {
  if (!user || typeof user !== 'object') {
    return {}
  }

  return {
    ...user,
    role: user.role || 'user',
  }
}

const getStoredAuthState = () => {
  if (typeof window === 'undefined') {
    return emptyAuthState
  }

  try {
    const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY)

    if (!rawValue) {
      return emptyAuthState
    }

    const parsedValue = JSON.parse(rawValue)

    if (!parsedValue?.token) {
      return emptyAuthState
    }

    return {
      isLogin: true,
      user: normalizeUser(parsedValue.user),
      token: parsedValue.token,
    }
  } catch (error) {
    console.error('No se pudo restaurar la sesion guardada', error)
    return emptyAuthState
  }
}

const useAuth = () => {
  const [authState, setAuthState] = useState(getStoredAuthState)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    if (!authState.isLogin || !authState.token) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY)
      return
    }

    window.localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        user: authState.user,
        token: authState.token,
      }),
    )
  }, [authState])

  const setSession = ({ user = {}, token = '' }) => {
    if (!token) {
      setAuthState(emptyAuthState)
      return
    }

    setAuthState({
      isLogin: true,
      user: normalizeUser(user),
      token,
    })
  }

  const logout = () => {
    setAuthState(emptyAuthState)
  }

  return {
    ...authState,
    setSession,
    logout,
  }
}

export default useAuth
