import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { 
  Search, 
  Plus, 
  Filter,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { CreateIssueModal } from './CreateIssueModal'
import { IssueDetailsModal } from './IssueDetailsModal'
import { DataService } from '../../services/dataService'
import type { Issue } from '../../types'

interface IssuesTableProps {
  userRole?: 'client' | 'team' | 'admin'
}

export function IssuesTable({ userRole = 'team' }: IssuesTableProps) {
  const [issues, setIssues] = useState<Issue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('all')
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)

  useEffect(() => {
    loadIssues()
  }, [userRole]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadIssues = async () => {
    try {
      setIsLoading(true)
      const issuesData = await DataService.getIssues(userRole)
      setIssues(issuesData)
    } catch (error) {
      console.error('Error loading issues:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'in_progress':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'closed':
        return <XCircle className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      open: 'bg-red-100 text-red-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    }
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    }
    return variants[priority as keyof typeof variants] || 'bg-gray-100 text-gray-800'
  }

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || issue.priority === priorityFilter
    const matchesTab = activeTab === 'all' || issue.status === activeTab
    
    return matchesSearch && matchesStatus && matchesPriority && matchesTab
  })

  const getTabCount = (status: string) => {
    if (status === 'all') return issues.length
    return issues.filter(issue => issue.status === status).length
  }

  const handleIssueClick = (issue: Issue) => {
    setSelectedIssue(issue)
    setDetailsModalOpen(true)
  }

  const handleIssueCreated = () => {
    loadIssues() // Refresh the issues list
  }

  const handleIssueUpdated = () => {
    loadIssues() // Refresh the issues list
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Issues</h2>
            <p className="text-gray-600">Loading issues...</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Issues</h2>
          <p className="text-gray-600">
            {userRole === 'client' ? 'Your issues and requests' : 'Track and manage project issues'}
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Issue
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search issues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Status Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            All ({getTabCount('all')})
          </TabsTrigger>
          <TabsTrigger value="open">
            Open ({getTabCount('open')})
          </TabsTrigger>
          <TabsTrigger value="in_progress">
            In Progress ({getTabCount('in_progress')})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Resolved ({getTabCount('resolved')})
          </TabsTrigger>
          <TabsTrigger value="closed">
            Closed ({getTabCount('closed')})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Issue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIssues.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-2">
                        <Filter className="h-8 w-8 text-gray-400" />
                        <p className="text-gray-500">No issues found</p>
                        <p className="text-sm text-gray-400">
                          {issues.length === 0 
                            ? 'Create your first issue to get started'
                            : 'Try adjusting your filters or search terms'
                          }
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredIssues.map((issue) => (
                    <TableRow 
                      key={issue.id} 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleIssueClick(issue)}
                    >
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(issue.status)}
                            <span className="font-medium">{issue.title}</span>
                          </div>
                          {issue.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {issue.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(issue.status)}>
                          {issue.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityBadge(issue.priority)}>
                          {issue.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {issue.assigneeId ? (
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {issue.assigneeId.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{issue.assigneeId}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(issue.updatedAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <CreateIssueModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onIssueCreated={handleIssueCreated}
      />

      <IssueDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        issue={selectedIssue}
        userRole={userRole}
        onIssueUpdated={handleIssueUpdated}
      />
    </div>
  )
}