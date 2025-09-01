"use client"

import { Navbar } from "@/components/common/layout/navbar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatEnumLabel, calculateProfileCompletion, getProfileMissingFields } from "@/lib/utils"
import { useAuthStore, useProfileStore } from "@/store"
import { AuthProfile } from "@/types/auth"
import {
  ArrowRight,
  Calendar,
  Camera,
  Eye,
  GraduationCap,
  Heart,
  MapPin,
  Star,
  Target,
  TrendingUp,
  Users,
  UserCheck
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { user, isLoading } = useAuthStore()

    const router = useRouter()

  useEffect(() => {
    // Check if user is new and redirect to onboarding
    if (user?.isNew) {
      console.log('User is new, redirecting to onboarding')
      router.push('/onboarding')
      return
    }
    
  }, [user, router])

  // Show loading while checking if user should be redirected
  if (user?.isNew) {
    return (
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Redirecting to onboarding...</p>
            </div>
          </div>
        </div>
    )
  }

  const stats = {
    totalMatches: 0,
    newMatches: 0,
    profileViews: 0,
    interests: 0,
  }

  if (!user?.profile || isLoading) {
    return (
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading profile...</p>
            </div>
          </div>
        </div>
    );
  }



  return (
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Welcome back, {user?.profile?.name || "User"}
                </h1>
                <p className="mt-2 text-muted-foreground">Here&apos;s what&apos;s happening with your matches today</p>
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
                <div className="text-2xl font-bold">{user?.profile ? calculateProfileCompletion(user.profile) : 0}%</div>
                <p className="text-xs text-muted-foreground">Profile completion</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Profile Completion */}
              {(() => {
                const completion = user?.profile ? calculateProfileCompletion(user.profile) : 0
                const missingFields = user?.profile ? getProfileMissingFields(user.profile) : []
                return completion < 100 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Target className="mr-2 h-5 w-5 text-primary" />
                        Complete Your Profile
                      </CardTitle>
                      <CardDescription>A complete profile gets 3x more matches. Required fields are worth 70%, optional fields 30%.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Profile Completion</span>
                          <span className="text-sm text-muted-foreground">{completion}%</span>
                        </div>
                        <Progress value={completion} className="h-2" />
                        
                        {missingFields.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs text-muted-foreground">Missing fields:</p>
                            <div className="flex flex-wrap gap-1">
                              {missingFields.map((field, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground"
                                >
                                  {field}
                                </span>
                              ))}
                              {missingFields.length >= 5 && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">
                                  +{missingFields.length - 5} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Complete your profile to get more matches</p>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href="/profile">
                              <UserCheck className="mr-2 h-4 w-4" />
                              Complete Profile
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })()}

              {/* Recent Matches */}
              {/* <Card>
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
                          <AvatarImage src={match.profile?.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{match.profile.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-foreground truncate">{match.profile?.name}</p>
                            <Badge variant="secondary" className="ml-2">
                              {match.compatibilityScore}% Match
                            </Badge>
                          </div>
                          <div className="flex items-center mt-1 text-xs text-muted-foreground">
                            <MapPin className="mr-1 h-3 w-3" />
                            {match.profile?.city}, {match.profile?.state}
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
              </Card> */}

              {/* Purpose Insights */}
              {/* <Card>
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
              </Card> */}
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
                      <AvatarImage src={user?.profile?.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{user?.profile?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{user?.profile?.name || "User"}</h3>
                      <p className="text-sm text-muted-foreground">{formatEnumLabel(user?.profile?.profession || "")}</p>
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        <MapPin className="mr-1 h-3 w-3" />
                        {user?.profile?.city}, {user?.profile?.state}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>
                        Member since {user?.profile?.createdAt ? new Date(user.profile.createdAt).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <GraduationCap className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{formatEnumLabel(user?.profile?.education || "")}</span>
                    </div>
                    <div className="flex items-center">
                      <Target className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>
                        Profile: {user?.profile ? calculateProfileCompletion(user.profile) : 0}% complete
                      </span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-transparent" variant="outline" asChild>
                    <Link href="/profile">Edit Profile</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Who's Interested */}
              {/* <Card>
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
              </Card> */}

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
  )
}
