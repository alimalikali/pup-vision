"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Interest } from "@/types/enums"
import type { Match } from "@/types/matches"
import { Briefcase, Eye, GraduationCap, Heart, MapPin, Sparkles, Target, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

interface MatchCardProps {
  match: Match
  onLike: (matchId: string) => void
  onPass: (matchId: string) => void
}

export function MatchCard({ match, onLike, onPass }: MatchCardProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  const { profile } = match

  const handleAction = (action: () => void) => {
    setIsAnimating(true)
    setTimeout(() => {
      action()
      setIsAnimating(false)
    }, 300)
  }

  const photo = profile.avatar || "/placeholder.svg"

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${isAnimating ? "scale-95 opacity-50" : ""}`}
    >
      <div className="relative">
        {/* Photo */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            fill
            src={photo|| "/placeholder.svg"}
            alt={profile.name}
            className="w-full h-full object-cover"
          />

          {/* Photo indicators */}
          {/* {photos.length > 1 && (
            <div className="absolute top-4 left-4 right-4 flex space-x-1">
              {photos.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-full ${index === currentPhotoIndex ? "bg-white" : "bg-white/50"}`}
                />
              ))}
            </div>
          )} */}

          {/* Compatibility Score */}
          <div className="absolute top-4 right-4">
            <Badge className="bg-primary text-primary-foreground font-semibold">
              {match.compatibilityScore}% Match
            </Badge>
          </div>

          {/* New Badge */}
          {profile.isNew && (
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="bg-green-500 text-white">
                <Sparkles className="mr-1 h-3 w-3" />
                New
              </Badge>
            </div>
          )}

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

          {/* Purpose Alignment */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center text-sm font-medium">
                <Target className="mr-1 h-4 w-4 text-primary" />
                Purpose Alignment
              </div>
              <span className="text-sm font-semibold">{match.purposeAlignment}%</span>
            </div>
            <Progress value={match.purposeAlignment} className="h-2 mb-2" />
            <p className="text-xs text-muted-foreground line-clamp-2">{match.narrative}</p>
          </div>

          {/* Purpose Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            <Badge variant="outline" className="text-xs">
              {profile.purpose.domain}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {profile.purpose.archetype}
            </Badge>
          </div>

          {/* Interests */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {profile.interests.slice(0, 3).map((interest: Interest) => (
                <Badge key={interest} variant="secondary" className="text-xs">
                  {interest}
                </Badge>
              ))}
              {profile.interests.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{profile.interests.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction(() => onPass(match.id))}
              className="flex-1 mr-2"
            >
              <X className="mr-1 h-4 w-4" />
              Pass
            </Button>



            <Button size="sm" onClick={() => handleAction(() => onLike(match.id))} className="flex-1">
              <Heart className="mr-1 h-4 w-4" />
              Admire
            </Button>
          </div>

          {/* View Profile Link */}
          <Button variant="ghost" size="sm" className="w-full mt-2" asChild>
            <Link href={`/matches/${match.id}`}>
              <Eye className="mr-1 h-4 w-4" />
              View Full Profile
            </Link>
          </Button>
        </CardContent>
      </div>
    </Card>
  )
}
