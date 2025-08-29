"use client"

import { useState } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MatchCard } from "@/components/matches/match-card"
import { MatchFilters } from "@/components/matches/match-filters"
import { mockMatches } from "@/lib/mock-data"
import { Filter, SlidersHorizontal, Heart, Users, Target } from "lucide-react"

export default function MatchesPage() {
  const [matches, setMatches] = useState(mockMatches)
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("compatibility")
  const [filters, setFilters] = useState({
    ageRange: { min: 25, max: 40 },
    location: "",
    education: "",
    profession: "",
    purpose: "",
    interests: [] as string[],
  })

  const handleLike = (matchId: string) => {
    setMatches(matches.map((match) => (match.id === matchId ? { ...match, status: "liked" as const } : match)))
  }

  const handlePass = (matchId: string) => {
    setMatches(matches.map((match) => (match.id === matchId ? { ...match, status: "passed" as const } : match)))
  }

  const handleSuperLike = (matchId: string) => {
    setMatches(matches.map((match) => (match.id === matchId ? { ...match, status: "liked" as const } : match)))
  }

  const filteredMatches = matches.filter((match) => match.status === "pending")

  const sortedMatches = [...filteredMatches].sort((a, b) => {
    switch (sortBy) {
      case "compatibility":
        return b.compatibilityScore - a.compatibilityScore
      case "purpose":
        return b.purposeAlignment - a.purposeAlignment
      case "recent":
        return new Date(b.matchedAt).getTime() - new Date(a.matchedAt).getTime()
      default:
        return 0
    }
  })

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

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Matches</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredMatches.length}</div>
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
                {Math.round(
                  filteredMatches.reduce((acc, match) => acc + match.compatibilityScore, 0) / filteredMatches.length,
                )}
                %
              </div>
              <p className="text-xs text-muted-foreground">Purpose alignment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Connections</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{matches.filter((m) => m.status === "mutual").length}</div>
              <p className="text-xs text-muted-foreground">Mutual matches</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1">
              <MatchFilters filters={filters} onFiltersChange={setFilters} />
            </div>
          )}

          {/* Matches Grid */}
          <div className={`${showFilters ? "lg:col-span-3" : "lg:col-span-4"}`}>
            {sortedMatches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    onLike={handleLike}
                    onPass={handlePass}
                    onSuperLike={handleSuperLike}
                  />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No matches found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or check back later for new matches.
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
