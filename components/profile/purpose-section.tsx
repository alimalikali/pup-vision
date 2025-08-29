"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, Lightbulb, Users, Zap } from "lucide-react"

interface PurposeSectionProps {
  purpose: {
    domain: string
    archetype: string
    modality: string
    narrative: string
  }
}

export function PurposeSection({ purpose }: PurposeSectionProps) {
  const purposeInsights = [
    { label: "Domain Alignment", value: 92, description: "Strong match with tech professionals" },
    { label: "Archetype Compatibility", value: 88, description: "Great fit with other creators" },
    { label: "Modality Synergy", value: 85, description: "Collaborative approach resonates well" },
    { label: "Narrative Strength", value: 90, description: "Clear and compelling purpose story" },
  ]

  return (
    <div className="space-y-6">
      {/* Purpose Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="mr-2 h-5 w-5 text-primary" />
            Your Purpose Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-accent/50 rounded-lg">
              <Lightbulb className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">Domain</h3>
              <p className="text-sm text-muted-foreground mt-1">{purpose.domain}</p>
            </div>
            <div className="text-center p-4 bg-accent/50 rounded-lg">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">Archetype</h3>
              <p className="text-sm text-muted-foreground mt-1">{purpose.archetype}</p>
            </div>
            <div className="text-center p-4 bg-accent/50 rounded-lg">
              <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">Modality</h3>
              <p className="text-sm text-muted-foreground mt-1">{purpose.modality}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Your Purpose Narrative</h3>
            <p className="text-foreground leading-relaxed bg-accent/30 p-4 rounded-lg">{purpose.narrative}</p>
          </div>
        </CardContent>
      </Card>

      {/* Purpose Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Purpose Matching Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {purposeInsights.map((insight, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{insight.label}</span>
                <Badge variant="secondary">{insight.value}%</Badge>
              </div>
              <Progress value={insight.value} className="h-2" />
              <p className="text-xs text-muted-foreground">{insight.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Purpose Compatibility */}
      <Card>
        <CardHeader>
          <CardTitle>Best Matches For Your Purpose</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
              <div>
                <p className="font-medium">Healthcare & Wellness + The Healer</p>
                <p className="text-sm text-muted-foreground">Shared focus on helping others</p>
              </div>
              <Badge>95% Match</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
              <div>
                <p className="font-medium">Education & Learning + The Teacher</p>
                <p className="text-sm text-muted-foreground">Collaborative knowledge sharing</p>
              </div>
              <Badge>88% Match</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
              <div>
                <p className="font-medium">Social Impact + The Advocate</p>
                <p className="text-sm text-muted-foreground">Purpose-driven change makers</p>
              </div>
              <Badge>82% Match</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
