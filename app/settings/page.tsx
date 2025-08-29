"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/layout/navbar"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ModeToggle } from "@/components/mode-toggle"
import {
  User,
  Shield,
  Palette,
  Eye,
  Heart,
  MessageSquare,
  Mail,
  Smartphone,
  Lock,
  AlertTriangle,
  Save,
  Trash2,
} from "lucide-react"
import { useSettingsStore, useAuthStore } from "@/lib/store"

export default function SettingsPage() {
  const { settings, isLoading, fetchSettings, updateSettings } = useSettingsStore()
  const { user, updateUser } = useAuthStore()
  const [localSettings, setLocalSettings] = useState<any>(null)

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings)
    }
  }, [settings])

  const handleSettingChange = (category: string, key: string, value: any) => {
    if (!localSettings) return

    setLocalSettings((prev: any) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }))
  }

  const handleSave = async () => {
    if (!localSettings) return

    const success = await updateSettings(localSettings)
    if (success) {
      // Update user email if changed
      if (localSettings.email !== user?.email) {
        updateUser({ email: localSettings.email })
      }
    }
  }

  const handleDeleteAccount = () => {
    // Mock delete account
    console.log("Deleting account")
  }

  if (isLoading || !localSettings) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading settings...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
            <p className="mt-2 text-muted-foreground">Manage your account preferences and privacy settings</p>
          </div>

          <Tabs defaultValue="account" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="danger">Danger Zone</TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Account Information
                  </CardTitle>
                  <CardDescription>Update your basic account information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={localSettings.email}
                        onChange={(e) => setLocalSettings({ ...localSettings, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={localSettings.phone}
                        onChange={(e) => setLocalSettings({ ...localSettings, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={localSettings.language}
                        onValueChange={(value) => setLocalSettings({ ...localSettings, language: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        value={localSettings.timezone}
                        onValueChange={(value) => setLocalSettings({ ...localSettings, timezone: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">Eastern Time</SelectItem>
                          <SelectItem value="America/Chicago">Central Time</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    Privacy & Visibility
                  </CardTitle>
                  <CardDescription>Control who can see your profile and information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Profile Visibility</Label>
                    <Select
                      value={localSettings.profileVisibility}
                      onValueChange={(value) => setLocalSettings({ ...localSettings, profileVisibility: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public - Visible to everyone</SelectItem>
                        <SelectItem value="members">Members only - Visible to registered users</SelectItem>
                        <SelectItem value="matches">Matches only - Visible to your matches</SelectItem>
                        <SelectItem value="private">Private - Hidden from search</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="flex items-center">
                          <Eye className="mr-2 h-4 w-4" />
                          Show Online Status
                        </Label>
                        <p className="text-sm text-muted-foreground">Let others see when you're online</p>
                      </div>
                      <Switch
                        checked={localSettings.showOnlineStatus}
                        onCheckedChange={(checked) => setLocalSettings({ ...localSettings, showOnlineStatus: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Show Last Seen</Label>
                        <p className="text-sm text-muted-foreground">Display when you were last active</p>
                      </div>
                      <Switch
                        checked={localSettings.showLastSeen}
                        onCheckedChange={(checked) => setLocalSettings({ ...localSettings, showLastSeen: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Hide from Colleagues</Label>
                        <p className="text-sm text-muted-foreground">Don't show my profile to people from my company</p>
                      </div>
                      <Switch
                        checked={localSettings.hideFromColleagues}
                        onCheckedChange={(checked) =>
                          setLocalSettings({ ...localSettings, hideFromColleagues: checked })
                        }
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Who can message you</Label>
                    <Select
                      value={localSettings.allowMessagesFrom}
                      onValueChange={(value) => setLocalSettings({ ...localSettings, allowMessagesFrom: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="everyone">Everyone</SelectItem>
                        <SelectItem value="members">All members</SelectItem>
                        <SelectItem value="matches">Matches only</SelectItem>
                        <SelectItem value="none">No one</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Privacy Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="mr-2 h-5 w-5" />
                    Email Notifications
                  </CardTitle>
                  <CardDescription>Choose what email notifications you want to receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(localSettings.emailNotifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="capitalize">
                          {key === "newMatches" && (
                            <>
                              <Heart className="mr-2 h-4 w-4 inline" />
                              New Matches
                            </>
                          )}
                          {key === "messages" && (
                            <>
                              <MessageSquare className="mr-2 h-4 w-4 inline" />
                              Messages
                            </>
                          )}
                          {key === "likes" && (
                            <>
                              <Heart className="mr-2 h-4 w-4 inline" />
                              Likes
                            </>
                          )}
                          {key === "profileViews" && (
                            <>
                              <Eye className="mr-2 h-4 w-4 inline" />
                              Profile Views
                            </>
                          )}
                          {key === "marketing" && (
                            <>
                              <Mail className="mr-2 h-4 w-4 inline" />
                              Marketing
                            </>
                          )}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {key === "newMatches" && "Get notified when you have new matches"}
                          {key === "messages" && "Get notified when you receive messages"}
                          {key === "likes" && "Get notified when someone likes your profile"}
                          {key === "profileViews" && "Get notified when someone views your profile"}
                          {key === "marketing" && "Receive updates about new features and promotions"}
                        </p>
                      </div>
                      <Switch
                        checked={value as boolean}
                        onCheckedChange={(checked) => handleSettingChange("emailNotifications", key, checked)}
                      />
                    </div>
                  ))}
                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Email Preferences
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Smartphone className="mr-2 h-5 w-5" />
                    Push Notifications
                  </CardTitle>
                  <CardDescription>Manage push notifications on your mobile device</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(localSettings.pushNotifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="capitalize">
                          {key === "newMatches" && "New Matches"}
                          {key === "messages" && "Messages"}
                          {key === "likes" && "Likes"}
                          {key === "profileViews" && "Profile Views"}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {key === "newMatches" && "Push notifications for new matches"}
                          {key === "messages" && "Push notifications for new messages"}
                          {key === "likes" && "Push notifications when someone likes you"}
                          {key === "profileViews" && "Push notifications for profile views"}
                        </p>
                      </div>
                      <Switch
                        checked={value as boolean}
                        onCheckedChange={(checked) => handleSettingChange("pushNotifications", key, checked)}
                      />
                    </div>
                  ))}
                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Push Preferences
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="mr-2 h-5 w-5" />
                    Appearance & Theme
                  </CardTitle>
                  <CardDescription>Customize how the app looks and feels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Theme</Label>
                      <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                    </div>
                    <ModeToggle />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">Use a more compact layout to fit more content</p>
                    </div>
                    <Switch
                      checked={localSettings.compactMode}
                      onCheckedChange={(checked) => setLocalSettings({ ...localSettings, compactMode: checked })}
                    />
                  </div>

                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Appearance Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="danger" className="space-y-6">
              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="flex items-center text-destructive">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription>Irreversible and destructive actions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      These actions are permanent and cannot be undone. Please proceed with caution.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <div className="p-4 border border-destructive rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-destructive">Delete Account</h3>
                          <p className="text-sm text-muted-foreground">
                            Permanently delete your account and all associated data
                          </p>
                        </div>
                        <Button variant="destructive" onClick={handleDeleteAccount}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Account
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">Deactivate Account</h3>
                          <p className="text-sm text-muted-foreground">
                            Temporarily hide your profile from other users
                          </p>
                        </div>
                        <Button variant="outline" className="bg-transparent">
                          <Lock className="mr-2 h-4 w-4" />
                          Deactivate
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
