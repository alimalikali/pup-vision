"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Navbar } from "@/components/layout/navbar"
import { ProtectedRoute } from "@/components/auth/protected-route"
import {
  Heart,
  Users,
  Eye,
  Star,
  TrendingUp,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  Target,
  ArrowRight,
  Camera,
} from "lucide-react"
import Link from "next/link"
import { mockMatches, mockInterests } from "@/lib/mock-data"
import { useAuthStore, useMatchesStore } from "@/lib/store"

export default function DashboardPage() {
  const { user } = useAuthStore()
  const { matches, interests, fetchMatches, fetchInterests } = useMatchesStore()

  useEffect(() => {
    fetchMatches()
    fetchInterests()
  }, [fetchMatches, fetchInterests])

  const stats = {
    totalMatches: matches.length || mockMatches.length,
    newMatches: 2,
    profileViews: 47,
    interests: interests.length || mockInterests.length,
  }

  const recentMatches = (matches.length > 0 ? matches : mockMatches).slice(0, 3)
  const recentInterests = (interests.length > 0 ? interests : mockInterests).slice(0, 2)

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Welcome back, {user?.name || "User"}
                </h1>
                <p className="mt-2 text-muted-foreground">Here's what's happening with your matches today</p>
              </div>
              <Button asChild>
                <Link href="/matches">
                  View All Matches
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalMatches}</div>
                <p className="text-xs text-muted-foreground">+{stats.newMatches} new this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.profileViews}</div>
                <p className="text-xs text-muted-foreground">+12% from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Interested</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.interests}</div>
                <p className="text-xs text-muted-foreground">People who liked you</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profile Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user?.profileCompletion || 85}%</div>
                <p className="text-xs text-muted-foreground">Profile completion</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Profile Completion */}
              {(user?.profileCompletion || 85) < 100 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="mr-2 h-5 w-5 text-primary" />
                      Complete Your Profile
                    </CardTitle>
                    <CardDescription>A complete profile gets 3x more matches</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Profile Completion</span>
                        <span className="text-sm text-muted-foreground">{user?.profileCompletion || 85}%</span>
                      </div>
                      <Progress value={user?.profileCompletion || 85} className="h-2" />
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Add more photos</p>
                          <p className="text-xs text-muted-foreground">Upload 2 more photos</p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/profile">
                            <Camera className="mr-2 h-4 w-4" />
                            Add Photos
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recent Matches */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recent Matches</CardTitle>
                      <CardDescription>Your latest purpose-based matches</CardDescription>
                    </div>
                    <Button variant="outline" asChild>
                      <Link href="/matches">View All</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentMatches.map((match) => (
                      <div key={match.id} className="flex items-center space-x-4 p-4 rounded-lg border">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={match.profile.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{match.profile.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-foreground truncate">{match.profile.name}</p>
                            <Badge variant="secondary" className="ml-2">
                              {match.compatibilityScore}% Match
                            </Badge>
                          </div>
                          <div className="flex items-center mt-1 text-xs text-muted-foreground">
                            <MapPin className="mr-1 h-3 w-3" />
                            {match.profile.city}, {match.profile.state}
                            <span className="mx-2">•</span>
                            <Briefcase className="mr-1 h-3 w-3" />
                            {match.profile.profession}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{match.narrative}</p>
                        </div>
                        <Button size="sm" asChild>
                          <Link href={`/matches/${match.id}`}>View</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Purpose Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-5 w-5 text-primary" />
                    Your Purpose Insights
                  </CardTitle>
                  <CardDescription>How your purpose aligns with potential matches</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Technology & Innovation</span>
                          <span className="text-sm text-muted-foreground">85%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Collaborative Approach</span>
                          <span className="text-sm text-muted-foreground">92%</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                    </div>
                    <div className="p-4 bg-accent/50 rounded-lg">
                      <p className="text-sm text-foreground">
                        <strong>Insight:</strong> You have strong alignment with professionals in tech and healthcare
                        who value collaborative innovation. Consider expanding your search to include related fields.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{user?.name || "User"}</h3>
                      <p className="text-sm text-muted-foreground">Software Engineer</p>
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        <MapPin className="mr-1 h-3 w-3" />
                        San Francisco, CA
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>
                        Member since {user?.memberSince ? new Date(user.memberSince).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <GraduationCap className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Masters in Computer Science</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-transparent" variant="outline" asChild>
                    <Link href="/profile">Edit Profile</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Who's Interested */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Who's Interested</CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/interested">View All</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentInterests.map((interest) => (
                      <div key={interest.id} className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={interest.profile.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{interest.profile.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{interest.profile.name}</p>
                          <p className="text-xs text-muted-foreground">{interest.profile.profession}</p>
                        </div>
                        <div className="flex items-center">
                          {interest.type === "super_like" ? (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          ) : (
                            <Heart className="h-4 w-4 text-red-500 fill-current" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full" asChild>
                    <Link href="/matches">
                      <Users className="mr-2 h-4 w-4" />
                      Browse Matches
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/interested">
                      <Star className="mr-2 h-4 w-4" />
                      See Who Likes You
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/profile">
                      <Camera className="mr-2 h-4 w-4" />
                      Update Photos
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
