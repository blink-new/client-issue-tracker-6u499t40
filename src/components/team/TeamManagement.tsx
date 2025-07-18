import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { 
  Plus, 
  Mail, 
  MoreHorizontal,
  Shield,
  Users,
  UserCheck,
  Edit,
  Trash2
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { useToast } from '../../hooks/use-toast'

interface TeamMember {
  id: string
  email: string
  displayName: string
  role: 'client' | 'team' | 'admin'
  status: 'active' | 'pending' | 'inactive'
  lastActive: string
  projectsCount: number
  issuesAssigned: number
}

export function TeamManagement() {
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: '1',
      email: 'john.doe@company.com',
      displayName: 'John Doe',
      role: 'admin',
      status: 'active',
      lastActive: '2024-01-16T10:30:00Z',
      projectsCount: 5,
      issuesAssigned: 12
    },
    {
      id: '2',
      email: 'jane.smith@company.com',
      displayName: 'Jane Smith',
      role: 'team',
      status: 'active',
      lastActive: '2024-01-16T09:15:00Z',
      projectsCount: 3,
      issuesAssigned: 8
    },
    {
      id: '3',
      email: 'client@acme.com',
      displayName: 'Alice Johnson',
      role: 'client',
      status: 'active',
      lastActive: '2024-01-15T16:45:00Z',
      projectsCount: 1,
      issuesAssigned: 0
    },
    {
      id: '4',
      email: 'newuser@company.com',
      displayName: 'Bob Wilson',
      role: 'team',
      status: 'pending',
      lastActive: '2024-01-10T14:20:00Z',
      projectsCount: 0,
      issuesAssigned: 0
    }
  ])

  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'client' | 'team' | 'admin'>('team')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4 text-red-500" />
      case 'team':
        return <Users className="h-4 w-4 text-blue-500" />
      case 'client':
        return <UserCheck className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: 'bg-red-100 text-red-800',
      team: 'bg-blue-100 text-blue-800',
      client: 'bg-green-100 text-green-800'
    }
    return variants[role as keyof typeof variants] || 'bg-gray-100 text-gray-800'
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      inactive: 'bg-gray-100 text-gray-800'
    }
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'
  }

  const handleInviteUser = async () => {
    if (!inviteEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      // In a real app, send invitation email
      const newMember: TeamMember = {
        id: Math.random().toString(36).substr(2, 9),
        email: inviteEmail.trim(),
        displayName: inviteEmail.split('@')[0],
        role: inviteRole,
        status: 'pending',
        lastActive: new Date().toISOString(),
        projectsCount: 0,
        issuesAssigned: 0
      }

      setMembers(prev => [...prev, newMember])
      
      toast({
        title: "Success",
        description: `Invitation sent to ${inviteEmail}`
      })

      setInviteEmail('')
      setInviteRole('team')
      setInviteModalOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = (memberId: string, newRole: 'client' | 'team' | 'admin') => {
    setMembers(prev => prev.map(member => 
      member.id === memberId ? { ...member, role: newRole } : member
    ))
    
    toast({
      title: "Success",
      description: "User role updated successfully"
    })
  }

  const handleRemoveMember = (memberId: string) => {
    setMembers(prev => prev.filter(member => member.id !== memberId))
    
    toast({
      title: "Success",
      description: "User removed from team"
    })
  }

  const stats = {
    totalMembers: members.length,
    activeMembers: members.filter(m => m.status === 'active').length,
    pendingInvites: members.filter(m => m.status === 'pending').length,
    adminCount: members.filter(m => m.role === 'admin').length,
    teamCount: members.filter(m => m.role === 'team').length,
    clientCount: members.filter(m => m.role === 'client').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Team Management</h2>
          <p className="text-gray-600">Manage team members and their permissions</p>
        </div>
        
        <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join your team
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={inviteRole} onValueChange={(value: any) => setInviteRole(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">
                      <div className="flex items-center space-x-2">
                        <UserCheck className="h-4 w-4 text-green-500" />
                        <span>Client</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="team">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span>Team Member</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-red-500" />
                        <span>Admin</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setInviteModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleInviteUser} disabled={loading}>
                {loading ? 'Sending...' : 'Send Invitation'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeMembers} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invites</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingInvites}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting response
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.teamCount}</div>
            <p className="text-xs text-muted-foreground">
              Internal team
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.clientCount}</div>
            <p className="text-xs text-muted-foreground">
              External clients
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Projects</TableHead>
                <TableHead>Issues</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {member.displayName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.displayName}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(member.role)}
                      <Badge className={getRoleBadge(member.role)}>
                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(member.status)}>
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{member.projectsCount}</TableCell>
                  <TableCell>{member.issuesAssigned}</TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(member.lastActive).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'admin')}>
                          <Shield className="mr-2 h-4 w-4" />
                          Make Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'team')}>
                          <Users className="mr-2 h-4 w-4" />
                          Make Team Member
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'client')}>
                          <UserCheck className="mr-2 h-4 w-4" />
                          Make Client
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}