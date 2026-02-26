import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getToken, getUser, clearAuth } from '../utils/secureStore'
import { AuthResponse } from '../types/student.types'

interface AuthContextType {
  user: any | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (data: AuthResponse) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Restore session on app start
    restoreSession()
  }, [])

  const restoreSession = async () => {
    try {
      const token = await getToken()
      if (token) {
        const savedUser = await getUser()
        if (savedUser) setUser(savedUser)
      }
    } catch (err) {
      console.error('Session restore error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const login = (data: AuthResponse) => {
    setUser(data.student)
  }

  const logout = async () => {
    await clearAuth()
    setUser(null)
  }

    return React.createElement(
      AuthContext.Provider,
      { value: { user, isAuthenticated: !!user, isLoading, login, logout } },
      children,
    );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}