"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Heart,
  X,
  Star,
  MapPin,
  Briefcase,
  GraduationCap,
  Target,
  ArrowLeft,
  Calendar,
  Users,
  Camera,
  Lightbulb,
  Zap,
} from "lucide-react"
import { mockMatches } from "@/lib/mock-data"
import Link from "next/link"

export default function MatchDetailPage() {
  const params = useParams()
  const router = useRouter()
  const matchId = params.id as string

  const match = mockMatches.find((m) => m.id === matchId)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  if (!match) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-8 text-center">
          <h1 className="text-2xl font-bold">Match not found</h1>
          <Button asChild className="mt-4">
            <Link href="/matches">Back to Matches</Link>
          </Button>
        </div>
      </div>
    )
  }

  const { profile } = match
  const photos = profile.avatar ? [profile.avatar] : ["/placeholder.svg"]

  const handleLike = () => {
    // Mock like action
    console.log("Liked", match.id)
    router.push("/matches")
  }

  const handlePass = () => {
    // Mock pass action
    console.log("Passed", match.id)
    router.push("/matches")
  }

  const handleSuperLike = () => {
    // Mock super like action
    console.log("Super liked", match.id)
    router.push("/matches")
  }

  const compatibilityBreakdown = [
    { category: "Purpose Alignment", score: match.purposeAlignment, description: "Shared values and life direction" },
    { category: "Professional Compatibility", score: 85, description: "Career goals and work-life balance" },
    { category: "Lifestyle Match", score: 78, description: "Daily habits and preferences" },
    { category: "Interest Overlap", score: 82, description: "Hobbies and recreational activities" },
    { category: "Communication Style", score: 88, description: "How you express and connect" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Matches
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {profile.name}, {profile.age}
              </h1>
              <div className="flex items-center mt-2 text-muted-foreground">
                <MapPin className="mr-1 h-4 w-4" />
                {profile.city}, {profile.state}
                <span className="mx-2">•</span>
                <Briefcase className="mr-1 h-4 w-4" />
                {profile.profession}
              </div>
            </div>
            <Badge className="bg-primary text-primary-foreground text-lg px-4 py-2">
              {match.compatibilityScore}% Match
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="purpose">Purpose</TabsTrigger>
                <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
                <TabsTrigger value="photos">Photos</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* About */}
                <Card>
                  <CardHeader>
                    <CardTitle>About {profile.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground leading-relaxed mb-4">{profile.purpose.narrative}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{profile.age} years old</span>
                        </div>
                        <div className="flex items-center">
                          <GraduationCap className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{profile.education}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{profile.maritalStatus}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium">Height:</span>
                          <span className="text-sm ml-2">{profile.height} cm</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Religion:</span>
                          <span className="text-sm ml-2">{profile.religion}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Languages:</span>
                          <span className="text-sm ml-2">{profile.language}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Interests */}
                <Card>
                  <CardHeader>
                    <CardTitle>Interests & Hobbies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest) => (
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
                        <span className="text-sm font-medium text-muted-foreground">Smoking</span>
                        <p className="text-foreground">{profile.smoke}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Drinking</span>
                        <p className="text-foreground">{profile.alcohol}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Exercise</span>
                        <p className="text-foreground">Regularly</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="purpose" className="space-y-6">
                {/* Purpose Profile */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="mr-2 h-5 w-5 text-primary" />
                      {profile.name}'s Purpose Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-accent/50 rounded-lg">
                        <Lightbulb className="h-8 w-8 text-primary mx-auto mb-2" />
                        <h3 className="font-semibold">Domain</h3>
                        <p className="text-sm text-muted-foreground mt-1">{profile.purpose.domain}</p>
                      </div>
                      <div className="text-center p-4 bg-accent/50 rounded-lg">
                        <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                        <h3 className="font-semibold">Archetype</h3>
                        <p className="text-sm text-muted-foreground mt-1">{profile.purpose.archetype}</p>
                      </div>
                      <div className="text-center p-4 bg-accent/50 rounded-lg">
                        <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
                        <h3 className="font-semibold">Modality</h3>
                        <p className="text-sm text-muted-foreground mt-1">{profile.purpose.modality}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Purpose Narrative</h3>
                      <p className="text-foreground leading-relaxed bg-accent/30 p-4 rounded-lg">
                        {profile.purpose.narrative}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Purpose Alignment */}
                <Card>
                  <CardHeader>
                    <CardTitle>Why You're Compatible</CardTitle>
                    <CardDescription>{match.narrative}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Purpose Alignment</span>
                        <Badge variant="secondary">{match.purposeAlignment}%</Badge>
                      </div>
                      <Progress value={match.purposeAlignment} className="h-3" />
                      <p className="text-sm text-muted-foreground">
                        Your shared focus on {profile.purpose.domain.toLowerCase()} and{" "}
                        {profile.purpose.modality.toLowerCase()} approach creates strong compatibility for long-term
                        partnership.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="compatibility" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Compatibility Breakdown</CardTitle>
                    <CardDescription>
                      Detailed analysis of your compatibility across different dimensions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {compatibilityBreakdown.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{item.category}</span>
                          <Badge variant="secondary">{item.score}%</Badge>
                        </div>
                        <Progress value={item.score} className="h-2" />
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="photos">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Camera className="mr-2 h-5 w-5" />
                      Photos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {photos.map((photo, index) => (
                        <div key={index} className="aspect-square overflow-hidden rounded-lg">
                          <img
                            src={photo || "/placeholder.svg"}
                            alt={`${profile.name} photo ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
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

            {/* Action Buttons */}
            <Card>
              <CardHeader>
                <CardTitle>Take Action</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleLike} className="w-full">
                  <Heart className="mr-2 h-4 w-4" />
                  Like {profile.name}
                </Button>
                <Button onClick={handleSuperLike} variant="outline" className="w-full bg-transparent">
                  <Star className="mr-2 h-4 w-4 text-yellow-500" />
                  Super Like
                </Button>
                <Button onClick={handlePass} variant="outline" className="w-full bg-transparent">
                  <X className="mr-2 h-4 w-4" />
                  Pass
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Overall Match</span>
                  <span className="font-semibold">{match.compatibilityScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Purpose Alignment</span>
                  <span className="font-semibold">{match.purposeAlignment}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Shared Interests</span>
                  <span className="font-semibold">{profile.interests.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Distance</span>
                  <span className="font-semibold">12 miles</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
