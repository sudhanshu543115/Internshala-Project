import React, { createContext, useContext, useState, useCallback } from 'react'
import { api } from '../lib/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchMe = useCallback(async () => {
    try {
      const me = await api.get('/api/auth/me')
      setUser(me)
    } catch {
      setUser(null)
    }
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const res = await api.post('/api/auth/login', { email, password })
      setUser(res)
      return res
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    await api.post('/api/auth/logout')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout, fetchMe }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
