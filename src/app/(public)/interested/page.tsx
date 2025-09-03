"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/common/layout/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Star, MapPin, Briefcase, Eye, Target, GraduationCap, MessageCircle, X } from "lucide-react"
import { useMatchesStore, useAuthStore } from "@/store"
import { MatchProfile } from "@/types/matches"
import Link from "next/link"
import Image from "next/image"
import { LoaderWait } from "@/components/common/layout/loader-wait"

export default function InterestedPage() {
  const { user, status } = useAuthStore()
  const {
    admireData,
    isLoadingAdmire,
    error,
    fetchAdmireData,
    admireUser,
    passUser,
    clearError
  } = useMatchesStore()

  // Initialize data on component mount
  useEffect(() => {
    if (status === "authenticated" && user && !admireData) {
      fetchAdmireData()
    }
  }, [status, user, fetchAdmireData, admireData])

  const handleLikeBack = async (userId: string) => {
    const success = await admireUser(userId)
    if (success) {
      // Refresh admire data to show updated state
      await fetchAdmireData()
    }
  }

  const handlePass = async (userId: string) => {
    const success = await passUser(userId)
    if (success) {
      // Refresh admire data to show updated state
      await fetchAdmireData()
    }
  }

  // Show loading state during auth initialization
  if (status === "loading" || status === "idle") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <LoaderWait variant="spinner" size="lg" color="primary" text="Loading..." />
      </div>
    )
  }

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <p className="text-muted-foreground">Please log in to view who&apos;s interested.</p>
          </div>
        </div>
      </div>
    )
  }

  // Show loading state while fetching admire data
  if (isLoadingAdmire) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <LoaderWait variant="heart" size="lg" color="primary" text="Loading interest data..." />
      </div>
    )
  }

  const admirers = admireData?.admirers || []
  const admired = admireData?.admired || []
  const matches = admireData?.matches || []

  return (
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Who&apos;s Interested</h1>
            <p className="mt-2 text-muted-foreground">People who have shown interest in your profile</p>
          </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive text-sm">{error}</p>
            <Button variant="outline" size="sm" onClick={clearError} className="mt-2">
              Dismiss
            </Button>
          </div>
        )}

          {/* Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Who Likes You</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
              <div className="text-2xl font-bold">{admirers.length}</div>
              <p className="text-xs text-muted-foreground">People who admired you</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">You Admire</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
              <div className="text-2xl font-bold">{admired.length}</div>
              <p className="text-xs text-muted-foreground">People you admired</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Matches</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{matches.length}</div>
              <p className="text-xs text-muted-foreground">Mutual connections</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
              <div className="text-2xl font-bold">
                {admirers.length > 0 ? Math.round((matches.length / admirers.length) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">Your match rate</p>
              </CardContent>
            </Card>
          </div>

        <Tabs defaultValue="admirers" className="space-y-6">
            <TabsList>
            <TabsTrigger value="admirers">Who Likes You ({admirers.length})</TabsTrigger>
            <TabsTrigger value="admired">You Admire ({admired.length})</TabsTrigger>
            <TabsTrigger value="matches">Matches ({matches.length})</TabsTrigger>
            </TabsList>

          <TabsContent value="admirers">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {admirers.map((profile) => (
                <InterestCard 
                  key={profile.id} 
                  profile={profile} 
                  type="admirer"
                  onLikeBack={() => handleLikeBack(profile.userId)} 
                  onPass={() => handlePass(profile.userId)} 
                />
                ))}
              </div>
            {admirers.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No one has admired you yet</h3>
                <p className="text-muted-foreground mb-4">
                  Keep improving your profile and browsing matches to get more visibility.
                </p>
                <Button asChild>
                  <Link href="/matches">Browse Matches</Link>
                </Button>
              </CardContent>
            </Card>
          )}
          </TabsContent>

          <TabsContent value="admired">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {admired.map((profile) => (
                <InterestCard 
                  key={profile.id} 
                  profile={profile} 
                  type="admired"
                  onLikeBack={() => {}} 
                  onPass={() => handlePass(profile.userId)} 
                />
              ))}
            </div>
            {admired.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">You haven&apos;t admired anyone yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start browsing matches to find people you&apos;re interested in.
                  </p>
                  <Button asChild>
                    <Link href="/matches">Browse Matches</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="matches">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match) => (
                <InterestCard 
                  key={match.id} 
                  profile={match.otherUser} 
                  type="match"
                  matchScore={match.compatibilityScore}
                  onLikeBack={() => {}} 
                  onPass={() => {}} 
                />
              ))}
            </div>
            {matches.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No matches yet</h3>
                  <p className="text-muted-foreground mb-4">
                    When someone you admire also admires you back, you&apos;ll have a match!
                  </p>
                  <Button asChild>
                    <Link href="/matches">Browse Matches</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
        </div>
      </div>
  )
}

interface InterestCardProps {
  profile: MatchProfile
  type: "admirer" | "admired" | "match"
  matchScore?: number
  onLikeBack: () => void
  onPass: () => void
}

function InterestCard({ profile, type, matchScore, onLikeBack, onPass }: InterestCardProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleAction = (action: () => void) => {
    setIsAnimating(true)
    setTimeout(() => {
      action()
      setIsAnimating(false)
    }, 300)
  }

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${isAnimating ? "scale-95 opacity-50" : ""}`}
    >
      <div className="relative">
        {/* Photo */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={profile.avatar || "/placeholder.svg"}
            alt={profile.name}
            fill
            className="object-cover"
          />

          {/* Interest Type Badge */}
          <div className="absolute top-4 right-4">
            {type === "match" ? (
              <Badge className="bg-green-500 text-white font-semibold">
                <Heart className="mr-1 h-3 w-3" />
                It&apos;s a Match!
              </Badge>
            ) : type === "admirer" ? (
              <Badge className="bg-red-500 text-white font-semibold">
                <Heart className="mr-1 h-3 w-3" />
                Likes You
              </Badge>
            ) : (
              <Badge className="bg-blue-500 text-white font-semibold">
                <Eye className="mr-1 h-3 w-3" />
                You Like
              </Badge>
            )}
          </div>

          {/* Match Score Badge */}
          {type === "match" && matchScore && (
          <div className="absolute top-4 left-4">
              <Badge className="bg-primary text-primary-foreground font-semibold">
                {matchScore}% Match
            </Badge>
          </div>
          )}



          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Basic info overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h3 className="text-xl font-bold mb-1">
              {profile.name}, {profile.age || "N/A"}
            </h3>
            <div className="flex items-center text-sm opacity-90 mb-2">
              <MapPin className="mr-1 h-3 w-3" />
              {profile.city && profile.state ? `${profile.city}, ${profile.state}` : "Location not specified"}
            </div>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4">
          {/* Professional Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Briefcase className="mr-2 h-4 w-4" />
              <span className="truncate">{profile.profession}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <GraduationCap className="mr-2 h-4 w-4" />
              <span className="truncate">{profile.education}</span>
            </div>
          </div>

          {/* Purpose Alignment (for matches) */}
          {type === "match" && matchScore && (
          <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center text-sm font-medium">
                  <Target className="mr-1 h-4 w-4 text-primary" />
                  Purpose Alignment
                </div>
                <span className="text-sm font-semibold">{matchScore}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${matchScore}%` }}
                />
              </div>
            </div>
          )}

          {/* Purpose Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
              <Badge variant="outline" className="text-xs">
              {profile.purposeDomain}
              </Badge>
              <Badge variant="outline" className="text-xs">
              {profile.purposeArchetype}
              </Badge>
          </div>

          {/* Interests */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {profile.interests?.slice(0, 3).map((interest) => (
                <Badge key={interest} variant="secondary" className="text-xs">
                  {interest}
                </Badge>
              ))}
              {profile.interests && profile.interests.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{profile.interests.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {type === "admirer" && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAction(onPass)}
                  className="flex-1"
                >
                  <X className="mr-1 h-4 w-4" />
              Pass
            </Button>
                <Button
                  size="sm"
                  onClick={() => handleAction(onLikeBack)}
                  className="flex-1"
                >
              <Heart className="mr-1 h-4 w-4" />
              Like Back
            </Button>
          </div>
            )}

            {type === "admired" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAction(onPass)}
                className="w-full"
              >
                <X className="mr-1 h-4 w-4" />
                Remove
              </Button>
            )}

            {type === "match" && (
              <Button size="sm" className="w-full" asChild>
                <Link href={`/matches/${profile.userId}`}>
                  <MessageCircle className="mr-1 h-4 w-4" />
                  Start Chat
                </Link>
              </Button>
            )}

            {/* View Profile Link */}
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href={`/matches/${profile.userId}`}>
              <Eye className="mr-1 h-4 w-4" />
                View Full Profile
            </Link>
          </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
