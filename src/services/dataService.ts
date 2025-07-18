import { blink } from '../blink/client'
import type { User, Project, Issue, Comment, Attachment } from '../types'

export class DataService {
  // User operations
  static async createUser(userData: Partial<User>): Promise<User> {
    const user = await blink.auth.me()
    const newUser = {
      id: user.id,
      email: user.email,
      displayName: userData.displayName || user.displayName || user.email,
      avatarUrl: userData.avatarUrl || user.avatarUrl,
      role: userData.role || 'client',
      userId: user.id // For role-based access
    }
    
    return await blink.db.users.create(newUser)
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const authUser = await blink.auth.me()
      const users = await blink.db.users.list({
        where: { id: authUser.id },
        limit: 1
      })
      
      if (users.length === 0) {
        // Create user if doesn't exist
        return await this.createUser({
          displayName: authUser.displayName || authUser.email,
          avatarUrl: authUser.avatarUrl
        })
      }
      
      return users[0]
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  }

  static async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    return await blink.db.users.update(userId, updates)
  }

  static async getAllUsers(): Promise<User[]> {
    return await blink.db.users.list({
      orderBy: { createdAt: 'desc' }
    })
  }

  // Project operations
  static async createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const user = await blink.auth.me()
    const project = {
      ...projectData,
      id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id
    }
    
    return await blink.db.projects.create(project)
  }

  static async getProjects(userRole?: string): Promise<Project[]> {
    const user = await blink.auth.me()
    
    if (userRole === 'client') {
      // Clients only see their own projects
      return await blink.db.projects.list({
        where: { clientId: user.id },
        orderBy: { createdAt: 'desc' }
      })
    }
    
    // Team members and admins see all projects
    return await blink.db.projects.list({
      orderBy: { createdAt: 'desc' }
    })
  }

  static async getProjectById(projectId: string): Promise<Project | null> {
    const projects = await blink.db.projects.list({
      where: { id: projectId },
      limit: 1
    })
    return projects[0] || null
  }

  static async updateProject(projectId: string, updates: Partial<Project>): Promise<Project> {
    return await blink.db.projects.update(projectId, updates)
  }

  // Issue operations
  static async createIssue(issueData: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>): Promise<Issue> {
    const user = await blink.auth.me()
    const issue = {
      ...issueData,
      id: `issue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      reporterId: user.id,
      userId: user.id // For role-based access
    }
    
    return await blink.db.issues.create(issue)
  }

  static async getIssues(userRole?: string, userId?: string): Promise<Issue[]> {
    const user = await blink.auth.me()
    
    if (userRole === 'client') {
      // Clients only see their own issues
      return await blink.db.issues.list({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      })
    }
    
    // Team members and admins see all issues
    return await blink.db.issues.list({
      orderBy: { createdAt: 'desc' }
    })
  }

  static async getIssueById(issueId: string): Promise<Issue | null> {
    const issues = await blink.db.issues.list({
      where: { id: issueId },
      limit: 1
    })
    return issues[0] || null
  }

  static async updateIssue(issueId: string, updates: Partial<Issue>): Promise<Issue> {
    return await blink.db.issues.update(issueId, {
      ...updates,
      updatedAt: new Date().toISOString()
    })
  }

  static async deleteIssue(issueId: string): Promise<void> {
    await blink.db.issues.delete(issueId)
  }

  // Comment operations
  static async createComment(commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Comment> {
    const user = await blink.auth.me()
    const comment = {
      ...commentData,
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id
    }
    
    return await blink.db.comments.create(comment)
  }

  static async getCommentsByIssue(issueId: string): Promise<Comment[]> {
    return await blink.db.comments.list({
      where: { issueId },
      orderBy: { createdAt: 'asc' }
    })
  }

  static async updateComment(commentId: string, updates: Partial<Comment>): Promise<Comment> {
    return await blink.db.comments.update(commentId, {
      ...updates,
      updatedAt: new Date().toISOString()
    })
  }

  static async deleteComment(commentId: string): Promise<void> {
    await blink.db.comments.delete(commentId)
  }

  // Attachment operations
  static async createAttachment(attachmentData: Omit<Attachment, 'id' | 'createdAt'>): Promise<Attachment> {
    const user = await blink.auth.me()
    const attachment = {
      ...attachmentData,
      id: `attachment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      uploadedBy: user.id
    }
    
    return await blink.db.attachments.create(attachment)
  }

  static async getAttachmentsByIssue(issueId: string): Promise<Attachment[]> {
    return await blink.db.attachments.list({
      where: { issueId },
      orderBy: { createdAt: 'desc' }
    })
  }

  static async deleteAttachment(attachmentId: string): Promise<void> {
    await blink.db.attachments.delete(attachmentId)
  }

  // File upload helper
  static async uploadFile(file: File, path: string): Promise<{ publicUrl: string }> {
    return await blink.storage.upload(file, path, { upsert: true })
  }

  // Statistics for dashboard
  static async getDashboardStats(userRole?: string): Promise<{
    totalIssues: number
    openIssues: number
    inProgressIssues: number
    resolvedIssues: number
    criticalIssues: number
    totalProjects: number
  }> {
    const issues = await this.getIssues(userRole)
    const projects = await this.getProjects(userRole)
    
    return {
      totalIssues: issues.length,
      openIssues: issues.filter(i => i.status === 'open').length,
      inProgressIssues: issues.filter(i => i.status === 'in_progress').length,
      resolvedIssues: issues.filter(i => i.status === 'resolved').length,
      criticalIssues: issues.filter(i => i.priority === 'critical').length,
      totalProjects: projects.length
    }
  }
}