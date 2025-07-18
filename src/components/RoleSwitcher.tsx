import { useState } from 'react'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Badge } from './ui/badge'
import { UserCheck, Shield, Users } from 'lucide-react'

interface RoleSwitcherProps {
  currentRole: 'client' | 'team' | 'admin'
  onRoleChange: (role: 'client' | 'team' | 'admin') => void
  actualUserRole: 'client' | 'team' | 'admin'
}

export function RoleSwitcher({ currentRole, onRoleChange, actualUserRole }: RoleSwitcherProps) {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />
      case 'team':
        return <Users className="h-4 w-4" />
      case 'client':
        return <UserCheck className="h-4 w-4" />
      default:
        return null
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800'
      case 'team':
        return 'bg-blue-100 text-blue-800'
      case 'client':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const roles = [
    { id: 'admin' as const, name: 'Admin', description: 'Full access to all features' },
    { id: 'team' as const, name: 'Team Member', description: 'Can manage issues and projects' },
    { id: 'client' as const, name: 'Client', description: 'Can only view own issues' }
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          {getRoleIcon(currentRole)}
          <span>Switch Role</span>
          <Badge className={getRoleBadgeColor(currentRole)}>
            {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Test Different Roles</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {roles.map((role) => (
          <DropdownMenuItem
            key={role.id}
            onClick={() => onRoleChange(role.id)}
            className="flex items-start space-x-2 p-3"
          >
            <div className="flex items-center space-x-2">
              {getRoleIcon(role.id)}
              <div>
                <div className="font-medium">{role.name}</div>
                <div className="text-xs text-gray-500">{role.description}</div>
              </div>
            </div>
            {currentRole === role.id && (
              <Badge className={getRoleBadgeColor(role.id)} size="sm">
                Current
              </Badge>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}