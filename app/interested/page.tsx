"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/layout/navbar"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Star, MapPin, Briefcase, Eye, Clock, Target } from "lucide-react"
import { useMatchesStore } from "@/lib/store"
import Link from "next/link"

export default function InterestedPage() {
  const { interests, fetchInterests, likeBack } = useMatchesStore()
  const [localInterests, setLocalInterests] = useState<any[]>([])

  useEffect(() => {
    fetchInterests()
  }, [fetchInterests])

  useEffect(() => {
    setLocalInterests(interests)
  }, [interests])

  const handleLikeBack = async (interestId: string) => {
    await likeBack(interestId)
    // Remove from local state for immediate UI update
    setLocalInterests(localInterests.filter((interest) => interest.id !== interestId))
  }

  const handlePass = (interestId: string) => {
    setLocalInterests(localInterests.filter((interest) => interest.id !== interestId))
  }

  const likes = localInterests.filter((interest) => interest.type === "like")
  const superLikes = localInterests.filter((interest) => interest.type === "super_like")

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Who's Interested</h1>
            <p className="mt-2 text-muted-foreground">People who have shown interest in your profile</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{likes.length}</div>
                <p className="text-xs text-muted-foreground">People who liked you</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Super Likes</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{superLikes.length}</div>
                <p className="text-xs text-muted-foreground">Really interested</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <p className="text-xs text-muted-foreground">Your like-back rate</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All ({localInterests.length})</TabsTrigger>
              <TabsTrigger value="likes">Likes ({likes.length})</TabsTrigger>
              <TabsTrigger value="super-likes">Super Likes ({superLikes.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {localInterests.map((interest) => (
                  <InterestCard key={interest.id} interest={interest} onLikeBack={handleLikeBack} onPass={handlePass} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="likes">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {likes.map((interest) => (
                  <InterestCard key={interest.id} interest={interest} onLikeBack={handleLikeBack} onPass={handlePass} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="super-likes">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {superLikes.map((interest) => (
                  <InterestCard key={interest.id} interest={interest} onLikeBack={handleLikeBack} onPass={handlePass} />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {localInterests.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No one has liked you yet</h3>
                <p className="text-muted-foreground mb-4">
                  Keep improving your profile and browsing matches to get more visibility.
                </p>
                <Button asChild>
                  <Link href="/matches">Browse Matches</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}

interface InterestCardProps {
  interest: any
  onLikeBack: (id: string) => void
  onPass: (id: string) => void
}

function InterestCard({ interest, onLikeBack, onPass }: InterestCardProps) {
  const { profile } = interest

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <div className="aspect-[4/5] overflow-hidden">
          <img src={profile.avatar || "/placeholder.svg"} alt={profile.name} className="w-full h-full object-cover" />

          {/* Interest Type Badge */}
          <div className="absolute top-4 right-4">
            {interest.type === "super_like" ? (
              <Badge className="bg-yellow-500 text-white">
                <Star className="mr-1 h-3 w-3" />
                Super Like
              </Badge>
            ) : (
              <Badge className="bg-red-500 text-white">
                <Heart className="mr-1 h-3 w-3" />
                Like
              </Badge>
            )}
          </div>

          {/* Time Badge */}
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-black/50 text-white">
              <Clock className="mr-1 h-3 w-3" />
              {new Date(interest.createdAt).toLocaleDateString()}
            </Badge>
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Basic info overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h3 className="text-xl font-bold mb-1">
              {profile.name}, {profile.age}
            </h3>
            <div className="flex items-center text-sm opacity-90 mb-2">
              <MapPin className="mr-1 h-3 w-3" />
              {profile.city}, {profile.state}
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Professional Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Briefcase className="mr-2 h-4 w-4" />
              <span className="truncate">{profile.profession}</span>
            </div>
          </div>

          {/* Purpose */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className="text-xs">
                {profile.purpose.domain}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {profile.purpose.archetype}
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => onPass(interest.id)} className="flex-1 bg-transparent">
              Pass
            </Button>
            <Button size="sm" onClick={() => onLikeBack(interest.id)} className="flex-1">
              <Heart className="mr-1 h-4 w-4" />
              Like Back
            </Button>
          </div>

          {/* View Profile */}
          <Button variant="ghost" size="sm" className="w-full mt-2" asChild>
            <Link href={`/matches/${interest.fromUserId}`}>
              <Eye className="mr-1 h-4 w-4" />
              View Profile
            </Link>
          </Button>
        </CardContent>
      </div>
    </Card>
  )
}
