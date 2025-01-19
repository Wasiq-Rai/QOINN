'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lock } from 'lucide-react'
import { useEffect, useState } from "react"
import { getAIInsights } from "@/utils/api"
import { Insight } from "@/utils/types"

export function AIInsights() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [isPremium, setIsPremium] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const insightsData = await getAIInsights()
      setInsights(insightsData)

      // TODO: Fetch user's premium status
      setIsPremium(false)
    }

    fetchData()
  }, [])

  return (
    <div className="relative">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {insights.slice(0, isPremium ? insights.length : 1).map((insight) => (
          <Card key={insight.id}>
            <CardHeader>
              <CardTitle>{insight.title}</CardTitle>
              <CardDescription>AI-generated insight</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-2">{insight.description}</p>
              <div className="flex flex-wrap gap-2">
                {insight.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {!isPremium && (
        <div className="absolute inset-0 bg-gray-200 bg-opacity-75 flex items-center justify-center">
          <div className="text-center">
            <Lock className="mx-auto mb-2" />
            <p className="font-semibold">Upgrade to Premium for more AI insights</p>
          </div>
        </div>
      )}
    </div>
  )
}

