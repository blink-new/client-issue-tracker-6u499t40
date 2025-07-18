import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Switch } from '../ui/switch'
import { Separator } from '../ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { 
  User, 
  Bell, 
  Shield, 
  Palette,
  Database,
  Mail,
  Smartphone,
  Globe,
  Save,
  Upload
} from 'lucide-react'
import { useToast } from '../../hooks/use-toast'

export function Settings() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Profile settings
  const [profile, setProfile] = useState({
    displayName: 'John Doe',
    email: 'john.doe@company.com',
    bio: 'Senior Developer at Acme Corp',
    timezone: 'America/New_York',
    language: 'en'
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    issueUpdates: true,
    weeklyDigest: true,
    mentionAlerts: true,
    projectUpdates: false
  })

  // Security settings
  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    loginAlerts: true
  })

  // Appearance settings
  const [appearance, setAppearance] = useState({
    theme: 'light',
    compactMode: false,
    showAvatars: true,
    animationsEnabled: true
  })

  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      // In a real app, save to database
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Success",
        description: "Profile updated successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveNotifications = async () => {
    setLoading(true)
    try {
      // In a real app, save to database
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Success",
        description: "Notification preferences updated"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notifications",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Navigation */}
        <div className="space-y-2">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-1">
                <a href="#profile" className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </a>
                <a href="#notifications" className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                </a>
                <a href="#security" className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                  <Shield className="h-4 w-4" />
                  <span>Security</span>
                </a>
                <a href="#appearance" className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                  <Palette className="h-4 w-4" />
                  <span>Appearance</span>
                </a>
                <a href="#data" className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                  <Database className="h-4 w-4" />
                  <span>Data & Privacy</span>
                </a>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <Card id="profile">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-lg">
                    {profile.displayName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Change Avatar
                  </Button>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={profile.displayName}
                    onChange={(e) => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    value={profile.timezone}
                    onChange={(e) => setProfile(prev => ({ ...prev, timezone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Input
                    id="language"
                    value={profile.language}
                    onChange={(e) => setProfile(prev => ({ ...prev, language: e.target.value }))}
                  />
                </div>
              </div>

              <Button onClick={handleSaveProfile} disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? 'Saving...' : 'Save Profile'}
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card id="notifications">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <Label>Email Notifications</Label>
                    </div>
                    <p className="text-sm text-gray-500">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, emailNotifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="h-4 w-4 text-gray-500" />
                      <Label>Push Notifications</Label>
                    </div>
                    <p className="text-sm text-gray-500">
                      Receive push notifications on your device
                    </p>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, pushNotifications: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Issue Updates</Label>
                    <p className="text-sm text-gray-500">
                      Get notified when issues are updated
                    </p>
                  </div>
                  <Switch
                    checked={notifications.issueUpdates}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, issueUpdates: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Digest</Label>
                    <p className="text-sm text-gray-500">
                      Receive a weekly summary of activity
                    </p>
                  </div>
                  <Switch
                    checked={notifications.weeklyDigest}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, weeklyDigest: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Mention Alerts</Label>
                    <p className="text-sm text-gray-500">
                      Get notified when you're mentioned
                    </p>
                  </div>
                  <Switch
                    checked={notifications.mentionAlerts}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, mentionAlerts: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Project Updates</Label>
                    <p className="text-sm text-gray-500">
                      Get notified about project changes
                    </p>
                  </div>
                  <Switch
                    checked={notifications.projectUpdates}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, projectUpdates: checked }))
                    }
                  />
                </div>
              </div>

              <Button onClick={handleSaveNotifications} disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? 'Saving...' : 'Save Preferences'}
              </Button>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card id="security">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security & Privacy</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={security.twoFactorEnabled ? "default" : "secondary"}>
                      {security.twoFactorEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                    <Button variant="outline" size="sm">
                      {security.twoFactorEnabled ? "Disable" : "Enable"}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Login Alerts</Label>
                    <p className="text-sm text-gray-500">
                      Get notified of new login attempts
                    </p>
                  </div>
                  <Switch
                    checked={security.loginAlerts}
                    onCheckedChange={(checked) => 
                      setSecurity(prev => ({ ...prev, loginAlerts: checked }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={security.sessionTimeout}
                    onChange={(e) => setSecurity(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                    className="w-32"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Button variant="outline">Change Password</Button>
                <Button variant="outline">Download Account Data</Button>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card id="appearance">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Appearance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Theme</Label>
                    <p className="text-sm text-gray-500">
                      Choose your preferred theme
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant={appearance.theme === 'light' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setAppearance(prev => ({ ...prev, theme: 'light' }))}
                    >
                      Light
                    </Button>
                    <Button 
                      variant={appearance.theme === 'dark' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setAppearance(prev => ({ ...prev, theme: 'dark' }))}
                    >
                      Dark
                    </Button>
                    <Button 
                      variant={appearance.theme === 'system' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setAppearance(prev => ({ ...prev, theme: 'system' }))}
                    >
                      System
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Compact Mode</Label>
                    <p className="text-sm text-gray-500">
                      Use a more compact layout
                    </p>
                  </div>
                  <Switch
                    checked={appearance.compactMode}
                    onCheckedChange={(checked) => 
                      setAppearance(prev => ({ ...prev, compactMode: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Avatars</Label>
                    <p className="text-sm text-gray-500">
                      Display user avatars throughout the app
                    </p>
                  </div>
                  <Switch
                    checked={appearance.showAvatars}
                    onCheckedChange={(checked) => 
                      setAppearance(prev => ({ ...prev, showAvatars: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Animations</Label>
                    <p className="text-sm text-gray-500">
                      Enable smooth animations and transitions
                    </p>
                  </div>
                  <Switch
                    checked={appearance.animationsEnabled}
                    onCheckedChange={(checked) => 
                      setAppearance(prev => ({ ...prev, animationsEnabled: checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}