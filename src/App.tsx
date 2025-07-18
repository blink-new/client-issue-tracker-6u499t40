import { useState } from 'react'
import { UserProvider } from './contexts/UserProvider'
import { useUser } from './hooks/useUser'
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { Dashboard } from './components/dashboard/Dashboard'
import { IssuesTable } from './components/issues/IssuesTable'
import { Settings } from './components/settings/Settings'
import { TeamManagement } from './components/team/TeamManagement'
import { RoleSwitcher } from './components/RoleSwitcher'
import { Toaster } from './components/ui/toaster'
import { blink } from './blink/client'

type View = 'dashboard' | 'issues' | 'settings' | 'team'

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('dashboard')
  const [viewAsRole, setViewAsRole] = useState<'client' | 'team' | 'admin'>('client')
  const { user, isLoading, isAuthenticated } = useUser()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-16 w-16 rounded-lg bg-blue-600 flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-xl">IT</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Issue Tracker</h1>
          <p className="text-gray-600">Please sign in to continue</p>
          <button
            onClick={() => blink.auth.login()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard userRole={viewAsRole} />
      case 'issues':
        return <IssuesTable userRole={viewAsRole} />
      case 'settings':
        return <Settings />
      case 'team':
        return <TeamManagement />
      default:
        return <Dashboard userRole={viewAsRole} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      <div className="flex">
        <Sidebar 
          currentPage={currentView} 
          onPageChange={setCurrentView}
          userRole={user.role}
        />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <RoleSwitcher 
              currentRole={viewAsRole} 
              onRoleChange={setViewAsRole}
              actualUserRole={user.role}
            />
          </div>
          {renderContent()}
        </main>
      </div>
      <Toaster />
    </div>
  )
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  )
}

export default App