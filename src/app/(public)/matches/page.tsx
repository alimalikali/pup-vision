"use client"

import { Navbar } from "@/components/common/layout/navbar"
import { MatchCard } from "@/components/feature/matches/match-card"
import { MatchFilters } from "@/components/feature/matches/match-filters"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuthStore, useMatchesStore } from "@/store"
import { Filter, Heart, SlidersHorizontal, Target, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { LoaderWait } from "@/components/common/layout/loader-wait"

export default function MatchesPage() {
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("compatibility")
  
  const { user, status } = useAuthStore()
  const {
    profiles,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    filters,
    fetchProfiles,
    loadMoreProfiles,
    admireUser,
    passUser,
    updateFilters,
    clearError
  } = useMatchesStore()

  // Initialize data on component mount
  useEffect(() => {
    if (status === "authenticated" && user && profiles.length === 0) {
      fetchProfiles(true)
    }
  }, [status, user, fetchProfiles, profiles.length])

  const handleLike = async (profileId: string) => {
    const success = await admireUser(profileId)
    if (success) {
      console.log("User admired successfully")
    }
  }

  const handlePass = async (profileId: string) => {
    const success = await passUser(profileId)
    if (success) {
      console.log("User passed successfully")
    }
  }

  const handleSuperLike = async (profileId: string) => {
    // For now, treat super like as regular like
    await handleLike(profileId)
  }

  const handleFiltersChange = (newFilters: Record<string, unknown>) => {
    // Convert the filter format to match our API
    const ageRange = newFilters.ageRange as { min?: number; max?: number } | undefined
    const apiFilters = {
      ageMin: ageRange?.min,
      ageMax: ageRange?.max,
      city: newFilters.location as string | undefined,
      education: newFilters.education as string | undefined,
      profession: newFilters.profession as string | undefined,
      purposeDomain: newFilters.purpose as string | undefined,
      interests: newFilters.interests as string[] | undefined
    }
    
    updateFilters(apiFilters)
  }

  const sortedProfiles = [...profiles].sort((a, b) => {
    switch (sortBy) {
      case "compatibility":
        return (b.compatibilityScore || 0) - (a.compatibilityScore || 0)
      case "recent":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      default:
        return 0
    }
  })

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
            <p className="text-muted-foreground">Please log in to view matches.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Your Matches</h1>
              <p className="mt-2 text-muted-foreground">
                Discover meaningful connections based on shared purpose and values
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compatibility">Best Match</SelectItem>
                  <SelectItem value="purpose">Purpose Alignment</SelectItem>
                  <SelectItem value="recent">Most Recent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Profiles</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profiles.length}</div>
              <p className="text-xs text-muted-foreground">Ready to explore</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Compatibility</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {profiles.length > 0 
                  ? Math.round(
                      profiles.reduce((acc, profile) => acc + (profile.compatibilityScore || 0), 0) / profiles.length
                    )
                  : 0
                }%
              </div>
              <p className="text-xs text-muted-foreground">Purpose alignment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">More Available</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hasMore ? "Yes" : "No"}</div>
              <p className="text-xs text-muted-foreground">Load more profiles</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1">
              <MatchFilters 
                filters={{
                  ageRange: { min: filters.ageMin || 18, max: filters.ageMax || 100 },
                  location: filters.city || "",
                  education: filters.education || "",
                  profession: filters.profession || "",
                  purpose: filters.purposeDomain || "",
                  interests: filters.interests || []
                }} 
                onFiltersChange={handleFiltersChange} 
              />
            </div>
          )}

          {/* Matches Grid */}
          <div className={`${showFilters ? "lg:col-span-3" : "lg:col-span-4"}`}>
            {isLoading ? (
              <LoaderWait variant="target" size="lg" color="primary" text="Loading profiles..." />
            ) : sortedProfiles.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sortedProfiles.map((profile) => (
                    <MatchCard
                      key={profile.id}
                      match={{
                        id: profile.id,
                        compatibilityScore: profile.compatibilityScore || 0,
                        purposeAlignment: profile.compatibilityScore || 0,
                        matchedAt: profile.createdAt,
                        status: "pending",
                        narrative: `Great compatibility based on shared interests and values.`,
                        profile: {
                          id: profile.id,
                          name: profile.name,
                          age: profile.age || 25,
                          avatar: profile.avatar,
                          city: profile.city || "Unknown",
                          state: profile.state || "Unknown",
                          profession: profile.profession,
                          education: profile.education,
                          purpose: {
                            domain: profile.purposeDomain,
                            archetype: profile.purposeArchetype,
                            modality: profile.purposeModality,
                            narrative: profile.purposeNarrative || "No narrative provided"
                          },
                          interests: profile.interests,
                          maritalStatus: profile.maritalStatus,
                          height: profile.height || 170,
                          religion: profile.religion,
                          language: profile.language,
                          smoke: profile.smoke,
                          alcohol: profile.alcohol
                        }
                      }}
                      onLike={() => handleLike(profile.userId)}
                      onPass={() => handlePass(profile.userId)}
                      onSuperLike={() => handleSuperLike(profile.userId)}
                    />
                  ))}
                </div>
                
                {/* Load More Button */}
                {hasMore && (
                  <div className="mt-8 text-center">
                    <Button 
                      onClick={loadMoreProfiles} 
                      disabled={isLoadingMore}
                      variant="outline"
                    >
                      {isLoadingMore ? (
                        <>
                          <LoaderWait variant="spinner" size="sm" color="white" centered={false} />
                          Loading...
                        </>
                      ) : (
                        "Load More Profiles"
                      )}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No profiles found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or check back later for new profiles.
                  </p>
                  <Button onClick={() => setShowFilters(true)}>
                    <Filter className="mr-2 h-4 w-4" />
                    Adjust Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
