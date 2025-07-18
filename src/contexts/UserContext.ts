import { createContext } from 'react'
import type { User } from '../types'

export interface UserContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  refreshUser: () => Promise<void>
  updateUserRole: (role: 'client' | 'team' | 'admin') => Promise<void>
}

export const UserContext = createContext<UserContextType | undefined>(undefined)