export interface User {
  id: string
  email: string
  displayName: string
  avatarUrl?: string
  role: 'client' | 'team' | 'admin'
  userId: string // For role-based access control
  createdAt: string
  updatedAt?: string
}

export interface Project {
  id: string
  name: string
  description?: string
  clientId: string
  status: 'active' | 'completed' | 'on_hold' | 'cancelled'
  userId: string // For role-based access control
  createdAt: string
  updatedAt: string
}

export interface Issue {
  id: string
  title: string
  description?: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  projectId: string
  reporterId: string
  assigneeId?: string
  userId: string // For role-based access control
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  issueId: string
  userId: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface Attachment {
  id: string
  issueId: string
  filename: string
  fileUrl: string
  fileSize?: number
  mimeType?: string
  uploadedBy: string
  createdAt: string
}

export interface TeamMember {
  id: string
  projectId: string
  userId: string
  role: 'member' | 'admin'
  createdAt: string
}

export interface DashboardStats {
  totalIssues: number
  openIssues: number
  inProgressIssues: number
  resolvedIssues: number
  criticalIssues: number
  totalProjects: number
}