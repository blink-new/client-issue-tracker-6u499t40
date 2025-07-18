import React, { useState, useEffect, ReactNode } from 'react'
import { blink } from '../blink/client'
import { DataService } from '../services/dataService'
import { UserContext } from './UserContext'
import type { User } from '../types'

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const refreshUser = async () => {
    try {
      const currentUser = await DataService.getCurrentUser()
      setUser(currentUser)
      setIsAuthenticated(!!currentUser)
    } catch (error) {
      console.error('Error refreshing user:', error)
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  const updateUserRole = async (role: 'client' | 'team' | 'admin') => {
    if (!user) return
    
    try {
      const updatedUser = await DataService.updateUser(user.id, { role })
      setUser(updatedUser)
    } catch (error) {
      console.error('Error updating user role:', error)
    }
  }

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged(async (state) => {
      setIsLoading(state.isLoading)
      
      if (state.user && state.isAuthenticated) {
        await refreshUser()
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    })

    return unsubscribe
  }, [])

  const value = {
    user,
    isLoading,
    isAuthenticated,
    refreshUser,
    updateUserRole
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}