import { useState, useEffect } from 'react'
import { blink } from '../../blink/client'
import { DataService } from '../../services/dataService'
import type { Project } from '../../types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Badge } from '../ui/badge'
import { Upload, X, FileText, Image, File } from 'lucide-react'
import { useToast } from '../../hooks/use-toast'

interface CreateIssueModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onIssueCreated?: () => void
}

interface AttachmentFile {
  id: string
  file: File
  preview?: string
}

export function CreateIssueModal({ open, onOpenChange, onIssueCreated }: CreateIssueModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium')
  const [projectId, setProjectId] = useState('')
  const [attachments, setAttachments] = useState<AttachmentFile[]>([])
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projectsData = await DataService.getProjects()
        setProjects(projectsData)
      } catch (error) {
        console.error('Error loading projects:', error)
      }
    }
    
    if (open) {
      loadProjects()
    }
  }, [open])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    
    files.forEach(file => {
      const id = Math.random().toString(36).substr(2, 9)
      const newAttachment: AttachmentFile = { id, file }
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setAttachments(prev => prev.map(att => 
            att.id === id ? { ...att, preview: e.target?.result as string } : att
          ))
        }
        reader.readAsDataURL(file)
      }
      
      setAttachments(prev => [...prev, newAttachment])
    })
  }

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id))
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="h-4 w-4" />
    if (mimeType.includes('pdf')) return <FileText className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-blue-100 text-blue-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'critical': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for the issue",
        variant: "destructive"
      })
      return
    }

    if (!projectId) {
      toast({
        title: "Error", 
        description: "Please select a project",
        variant: "destructive"
      })
      return
    }

    setLoading(true)

    try {
      // Upload attachments first
      const uploadedAttachments = []
      for (const attachment of attachments) {
        try {
          const { publicUrl } = await blink.storage.upload(
            attachment.file,
            `issues/attachments/${Date.now()}-${attachment.file.name}`,
            { upsert: true }
          )
          uploadedAttachments.push({
            filename: attachment.file.name,
            fileUrl: publicUrl,
            fileSize: attachment.file.size,
            mimeType: attachment.file.type
          })
        } catch (error) {
          console.error('Failed to upload attachment:', error)
        }
      }

      // Create issue
      const newIssue = await DataService.createIssue({
        title: title.trim(),
        description: description.trim(),
        priority,
        projectId,
        status: 'open'
      })

      // Create attachments if any
      for (const attachment of uploadedAttachments) {
        await DataService.createAttachment({
          issueId: newIssue.id,
          filename: attachment.filename,
          fileUrl: attachment.fileUrl,
          fileSize: attachment.fileSize,
          mimeType: attachment.mimeType
        })
      }

      toast({
        title: "Success",
        description: "Issue created successfully"
      })

      // Reset form
      setTitle('')
      setDescription('')
      setPriority('medium')
      setProjectId('')
      setAttachments([])
      
      onIssueCreated?.()
      onOpenChange(false)

    } catch (error) {
      console.error('Failed to create issue:', error)
      toast({
        title: "Error",
        description: "Failed to create issue. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Issue</DialogTitle>
          <DialogDescription>
            Report a new issue or request. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Brief description of the issue"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project">Project *</Label>
            <Select value={projectId} onValueChange={setProjectId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    <div className="flex flex-col">
                      <span>{project.name}</span>
                      <span className="text-xs text-gray-500">{project.description || 'No description'}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-blue-100 text-blue-800">Low</Badge>
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                  </div>
                </SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-orange-100 text-orange-800">High</Badge>
                  </div>
                </SelectItem>
                <SelectItem value="critical">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-red-100 text-red-800">Critical</Badge>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Detailed description of the issue, steps to reproduce, expected behavior, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Attachments</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Drop files here or click to upload
                    </span>
                    <span className="mt-1 block text-xs text-gray-500">
                      PNG, JPG, PDF up to 10MB each
                    </span>
                  </label>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>
            </div>

            {attachments.length > 0 && (
              <div className="space-y-2">
                <Label>Attached Files</Label>
                <div className="space-y-2">
                  {attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {attachment.preview ? (
                          <img 
                            src={attachment.preview} 
                            alt={attachment.file.name}
                            className="h-10 w-10 object-cover rounded"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                            {getFileIcon(attachment.file.type)}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium">{attachment.file.name}</p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(attachment.file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(attachment.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Issue'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}