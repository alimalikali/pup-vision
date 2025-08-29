"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/layout/navbar"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Edit, Camera, MapPin, Briefcase, GraduationCap, Heart, Target, User, Settings, Eye, Star } from "lucide-react"
import { ProfileEditForm } from "@/components/profile/profile-edit-form"
import { PhotoGallery } from "@/components/profile/photo-gallery"
import { PurposeSection } from "@/components/profile/purpose-section"
import { useProfileStore, useAuthStore } from "@/lib/store"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const { profile, isLoading, fetchProfile, updateProfile } = useProfileStore()
  const { user } = useAuthStore()

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handleSaveProfile = async (profileData: any) => {
    const success = await updateProfile(profileData)
    if (success) {
      setIsEditing(false)
    }
  }

  if (isLoading || !profile) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading profile...</p>
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Your Profile</h1>
                <p className="mt-2 text-muted-foreground">Manage your profile and preferences</p>
              </div>
              <Button onClick={() => setIsEditing(!isEditing)}>
                <Edit className="mr-2 h-4 w-4" />
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </div>

          {isEditing ? (
            <ProfileEditForm profile={profile} onSave={() => handleSaveProfile(profile)} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Profile Content */}
              <div className="lg:col-span-2">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="purpose">Purpose</TabsTrigger>
                    <TabsTrigger value="photos">Photos</TabsTrigger>
                    <TabsTrigger value="preferences">Preferences</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6">
                    {/* Basic Info */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <User className="mr-2 h-5 w-5" />
                          Basic Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Name</label>
                              <p className="text-foreground">{profile.name}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Age</label>
                              <p className="text-foreground">{profile.age} years old</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Location</label>
                              <p className="text-foreground flex items-center">
                                <MapPin className="mr-1 h-4 w-4" />
                                {profile.city}, {profile.state}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Profession</label>
                              <p className="text-foreground flex items-center">
                                <Briefcase className="mr-1 h-4 w-4" />
                                {profile.profession}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Education</label>
                              <p className="text-foreground flex items-center">
                                <GraduationCap className="mr-1 h-4 w-4" />
                                {profile.education}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Company</label>
                              <p className="text-foreground">{profile.company}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Bio */}
                    <Card>
                      <CardHeader>
                        <CardTitle>About Me</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-foreground leading-relaxed">{profile.bio}</p>
                      </CardContent>
                    </Card>

                    {/* Interests */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Interests</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {profile.interests.map((interest: string) => (
                            <Badge key={interest} variant="secondary">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Lifestyle */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Lifestyle</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Smoking</label>
                            <p className="text-foreground">{profile.lifestyle.smoking}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Drinking</label>
                            <p className="text-foreground">{profile.lifestyle.drinking}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Exercise</label>
                            <p className="text-foreground">{profile.lifestyle.exercise}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="purpose">
                    <PurposeSection purpose={profile.purpose} />
                  </TabsContent>

                  <TabsContent value="photos">
                    <PhotoGallery photos={profile.photos} />
                  </TabsContent>

                  <TabsContent value="preferences">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Settings className="mr-2 h-5 w-5" />
                          Dating Preferences
                        </CardTitle>
                        <CardDescription>Your preferences for potential matches</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Age Range</label>
                            <p className="text-foreground">
                              {profile.preferences.ageRange.min} - {profile.preferences.ageRange.max} years
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Location</label>
                            <p className="text-foreground">{profile.preferences.location}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Education</label>
                            <p className="text-foreground">{profile.preferences.education}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Looking For</label>
                            <p className="text-foreground">{profile.preferences.lookingFor}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Profile Card */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Avatar className="h-24 w-24 mx-auto mb-4">
                        <AvatarImage src={profile.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-lg">{profile.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <h3 className="text-xl font-semibold">{profile.name}</h3>
                      <p className="text-muted-foreground">{profile.profession}</p>
                      <div className="flex items-center justify-center mt-2 text-sm text-muted-foreground">
                        <MapPin className="mr-1 h-4 w-4" />
                        {profile.city}, {profile.state}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Profile Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Profile Views</span>
                      </div>
                      <span className="font-semibold">{profile.stats.profileViews}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Heart className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Likes Received</span>
                      </div>
                      <span className="font-semibold">{profile.stats.likes}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Matches</span>
                      </div>
                      <span className="font-semibold">{profile.stats.matches}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Profile Completion */}
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Completion</CardTitle>
                    <CardDescription>Complete your profile to get more matches</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Overall</span>
                        <span className="text-sm text-muted-foreground">{profile.stats.completion}%</span>
                      </div>
                      <Progress value={profile.stats.completion} className="h-2" />
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span>Add more photos</span>
                          <Badge variant={profile.photos.length >= 3 ? "secondary" : "outline"}>
                            {profile.photos.length >= 3 ? "Done" : "Pending"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Complete bio</span>
                          <Badge variant={profile.bio && profile.bio.length > 50 ? "secondary" : "outline"}>
                            {profile.bio && profile.bio.length > 50 ? "Done" : "Pending"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button className="w-full bg-transparent" variant="outline" onClick={() => setActiveTab("photos")}>
                      <Camera className="mr-2 h-4 w-4" />
                      Upload Photos
                    </Button>
                    <Button className="w-full bg-transparent" variant="outline" onClick={() => setActiveTab("purpose")}>
                      <Target className="mr-2 h-4 w-4" />
                      Update Purpose
                    </Button>
                    <Button
                      className="w-full bg-transparent"
                      variant="outline"
                      onClick={() => setActiveTab("preferences")}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Edit Preferences
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
