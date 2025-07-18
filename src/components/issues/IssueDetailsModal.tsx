import { useState, useEffect } from 'react'
import { blink } from '../../blink/client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Textarea } from '../ui/textarea'
import { Separator } from '../ui/separator'
import { ScrollArea } from '../ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { 
  Calendar,
  User,
  MessageSquare,
  Paperclip,
  Download,
  Send,
  Edit,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react'
import { useToast } from '../../hooks/use-toast'
import type { Issue, Comment, Attachment } from '../../types'

interface IssueDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  issue: Issue | null
  userRole: 'client' | 'team' | 'admin'
  onIssueUpdated?: () => void
}

interface ExtendedIssue extends Issue {
  comments?: Comment[]
  attachments?: Attachment[]
  assignedToName?: string
  reporterName?: string
}

export function IssueDetailsModal({ open, onOpenChange, issue, userRole, onIssueUpdated }: IssueDetailsModalProps) {
  const [extendedIssue, setExtendedIssue] = useState<ExtendedIssue | null>(null)
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [editingStatus, setEditingStatus] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (issue && open) {
      // Mock data for demonstration
      const mockComments: Comment[] = [
        {
          id: '1',
          issueId: issue.id,
          userId: 'user-1',
          content: 'I can reproduce this issue on Chrome and Firefox. It seems to be related to the CSS media queries.',
          createdAt: '2024-01-15T11:30:00Z'
        },
        {
          id: '2', 
          issueId: issue.id,
          userId: 'user-2',
          content: 'Thanks for the report. I\'ve assigned this to our frontend team and we\'ll have a fix ready by end of week.',
          createdAt: '2024-01-15T14:20:00Z'
        }
      ]

      const mockAttachments: Attachment[] = [
        {
          id: '1',
          issueId: issue.id,
          filename: 'screenshot-mobile-issue.png',
          fileUrl: 'https://example.com/screenshot.png',
          fileSize: 245760,
          mimeType: 'image/png',
          uploadedBy: 'user-1',
          createdAt: '2024-01-15T10:30:00Z'
        }
      ]

      // In a real app, fetch additional data here
      setExtendedIssue({
        ...issue,
        comments: mockComments,
        attachments: mockAttachments,
        assignedToName: 'John Doe',
        reporterName: 'Jane Smith'
      })
    }
  }, [issue, open])

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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!extendedIssue) return

    setLoading(true)
    try {
      // In a real app, update the issue status in the database
      setExtendedIssue(prev => prev ? { ...prev, status: newStatus as any } : null)
      
      toast({
        title: "Success",
        description: `Issue status updated to ${newStatus.replace('_', ' ')}`
      })
      
      setEditingStatus(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update issue status",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim() || !extendedIssue) return

    setLoading(true)
    try {
      const comment: Comment = {
        id: Math.random().toString(36).substr(2, 9),
        issueId: extendedIssue.id,
        userId: 'current-user',
        content: newComment.trim(),
        createdAt: new Date().toISOString()
      }

      setExtendedIssue(prev => prev ? {
        ...prev,
        comments: [...(prev.comments || []), comment]
      } : null)

      setNewComment('')
      
      toast({
        title: "Success",
        description: "Comment added successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (!extendedIssue) return null

  const canEditStatus = userRole === 'team' || userRole === 'admin'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-xl">{extendedIssue.title}</DialogTitle>
              <DialogDescription>
                Issue #{extendedIssue.id} • Created {new Date(extendedIssue.createdAt).toLocaleDateString()}
              </DialogDescription>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(extendedIssue.status)}
              {editingStatus && canEditStatus ? (
                <Select value={extendedIssue.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge className={getStatusBadge(extendedIssue.status)}>
                  {extendedIssue.status.replace('_', ' ')}
                </Badge>
              )}
              {canEditStatus && !editingStatus && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingStatus(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[60vh]">
            <div className="space-y-6 pr-4">
              {/* Issue Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <AlertCircle className="h-4 w-4" />
                      <span>Priority</span>
                    </div>
                    <Badge className={getPriorityBadge(extendedIssue.priority)}>
                      {extendedIssue.priority}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <User className="h-4 w-4" />
                      <span>Assigned to</span>
                    </div>
                    {extendedIssue.assignedToName ? (
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {extendedIssue.assignedToName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{extendedIssue.assignedToName}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Unassigned</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Reporter</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {extendedIssue.reporterName?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{extendedIssue.reporterName || 'Unknown'}</span>
                  </div>
                </div>

                {extendedIssue.description && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Description</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm whitespace-pre-wrap">{extendedIssue.description}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Attachments */}
              {extendedIssue.attachments && extendedIssue.attachments.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Paperclip className="h-4 w-4 text-gray-600" />
                    <h4 className="font-medium">Attachments</h4>
                  </div>
                  <div className="space-y-2">
                    {extendedIssue.attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 bg-blue-100 rounded flex items-center justify-center">
                            <Paperclip className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{attachment.filename}</p>
                            <p className="text-xs text-gray-500">
                              {attachment.fileSize && formatFileSize(attachment.fileSize)}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Comments */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-gray-600" />
                  <h4 className="font-medium">
                    Comments ({extendedIssue.comments?.length || 0})
                  </h4>
                </div>

                <div className="space-y-4">
                  {extendedIssue.comments?.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {comment.userId.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">User {comment.userId}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Comment */}
                <div className="space-y-3">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleAddComment}
                      disabled={!newComment.trim() || loading}
                      size="sm"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Add Comment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}