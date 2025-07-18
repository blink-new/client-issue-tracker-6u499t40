import { useState } from 'react'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface SidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
  userRole: 'client' | 'team' | 'admin'
}

export function Sidebar({ currentPage, onPageChange, userRole }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  const navigation = [
    {
      name: 'Dashboard',
      id: 'dashboard',
      icon: LayoutDashboard,
      roles: ['client', 'team', 'admin']
    },
    {
      name: 'Issues',
      id: 'issues',
      icon: FileText,
      roles: ['client', 'team', 'admin'],
      badge: userRole === 'client' ? undefined : '8' // Show count for team/admin
    },
    {
      name: 'Team',
      id: 'team',
      icon: Users,
      roles: ['team', 'admin'] // Only team and admin can see team page
    },
    {
      name: 'Settings',
      id: 'settings',
      icon: Settings,
      roles: ['team', 'admin']
    }
  ]

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(userRole)
  )

  return (
    <div className={cn(
      "bg-white border-r transition-all duration-300 flex flex-col",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Toggle Button */}
      <div className="p-4 border-b">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full justify-center"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {filteredNavigation.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  collapsed && "justify-center px-2"
                )}
                onClick={() => onPageChange(item.id)}
              >
                <Icon className={cn("h-4 w-4", !collapsed && "mr-2")} />
                {!collapsed && (
                  <>
                    <span>{item.name}</span>
                    {item.badge && (
                      <Badge 
                        variant="secondary" 
                        className="ml-auto bg-blue-100 text-blue-800"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            )
          })}
        </div>
      </nav>

      {/* Role Badge */}
      {!collapsed && (
        <div className="p-4 border-t">
          <div className="flex items-center justify-center">
            <Badge 
              className={cn(
                "text-xs",
                userRole === 'admin' && "bg-red-100 text-red-800",
                userRole === 'team' && "bg-blue-100 text-blue-800",
                userRole === 'client' && "bg-green-100 text-green-800"
              )}
            >
              {userRole.charAt(0).toUpperCase() + userRole.slice(1)} View
            </Badge>
          </div>
        </div>
      )}
    </div>
  )
}