"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, ArrowLeft, Search, Brain, Waves, Timer, Palette, Volume2, Moon, Star, Play, Pause } from "lucide-react"
import Navigation from "@/components/navigation"
import Link from "next/link"

export default function CopingPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])
  const [activeAudio, setActiveAudio] = useState<string | null>(null)

  const copingStrategies = {
    immediate: [
      {
        id: "breathing",
        title: "4-7-8 Breathing",
        description: "A simple breathing technique to calm your nervous system quickly",
        duration: "2-3 minutes",
        difficulty: "Easy",
        icon: Waves,
        color: "blue",
        steps: [
          "Breathe in through your nose for 4 counts",
          "Hold your breath for 7 counts",
          "Breathe out through your mouth for 8 counts",
          "Repeat 3-4 times",
        ],
      },
      {
        id: "grounding",
        title: "5-4-3-2-1 Grounding",
        description: "Use your senses to feel more present and calm",
        duration: "3-5 minutes",
        difficulty: "Easy",
        icon: Brain,
        color: "green",
        steps: [
          "Name 5 things you can see",
          "Name 4 things you can touch",
          "Name 3 things you can hear",
          "Name 2 things you can smell",
          "Name 1 thing you can taste",
        ],
      },
      {
        id: "progressive",
        title: "Progressive Muscle Relaxation",
        description: "Tense and relax different muscle groups to release physical stress",
        duration: "10-15 minutes",
        difficulty: "Medium",
        icon: Heart,
        color: "purple",
        steps: [
          "Start with your toes - tense for 5 seconds, then relax",
          "Move up to your calves, thighs, and so on",
          "Work through each muscle group",
          "End with your face and head muscles",
        ],
      },
    ],
    daily: [
      {
        id: "routine",
        title: "Morning Routine Builder",
        description: "Create a calming start to your day with predictable steps",
        duration: "15-30 minutes",
        difficulty: "Easy",
        icon: Timer,
        color: "orange",
        benefits: ["Reduces morning anxiety", "Creates predictability", "Builds positive momentum"],
      },
      {
        id: "sensory",
        title: "Sensory Break Kit",
        description: "Tools and techniques for when you feel overwhelmed",
        duration: "5-10 minutes",
        difficulty: "Easy",
        icon: Palette,
        color: "teal",
        benefits: ["Prevents sensory overload", "Quick reset", "Portable solutions"],
      },
      {
        id: "boundaries",
        title: "Energy Management",
        description: "Learn to recognize and respect your energy limits",
        duration: "Ongoing",
        difficulty: "Medium",
        icon: Moon,
        color: "indigo",
        benefits: ["Prevents burnout", "Improves self-awareness", "Better planning"],
      },
    ],
    audio: [
      {
        id: "nature",
        title: "Forest Sounds",
        description: "Gentle rain and bird sounds for relaxation",
        duration: "30 minutes",
        type: "Nature",
        icon: Volume2,
        color: "green",
      },
      {
        id: "white-noise",
        title: "White Noise",
        description: "Consistent sound to mask distracting noises",
        duration: "60 minutes",
        type: "Focus",
        icon: Volume2,
        color: "blue",
      },
      {
        id: "meditation",
        title: "Guided Body Scan",
        description: "Gentle voice guiding you through relaxation",
        duration: "15 minutes",
        type: "Meditation",
        icon: Volume2,
        color: "purple",
      },
    ],
  }

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
  }

  const toggleAudio = (id: string) => {
    setActiveAudio(activeAudio === id ? null : id)
  }

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600",
      purple: "bg-purple-100 text-purple-600",
      orange: "bg-orange-100 text-orange-600",
      teal: "bg-teal-100 text-teal-600",
      indigo: "bg-indigo-100 text-indigo-600",
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-medium text-slate-800 mb-2">Coping Strategies</h1>
          <p className="text-slate-600 leading-relaxed">
            Practical tools and techniques to help you manage stress and feel more comfortable throughout your day.
          </p>
        </div>

        {/* Search */}
        <Card className="border-2 border-slate-200 mb-8">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search coping strategies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-2 border-slate-200 focus:border-blue-300"
                aria-label="Search coping strategies"
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="immediate" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white border-2 border-slate-200">
            <TabsTrigger value="immediate" className="data-[state=active]:bg-blue-100">
              Quick Relief
            </TabsTrigger>
            <TabsTrigger value="daily" className="data-[state=active]:bg-green-100">
              Daily Tools
            </TabsTrigger>
            <TabsTrigger value="audio" className="data-[state=active]:bg-purple-100">
              Audio Support
            </TabsTrigger>
          </TabsList>

          <TabsContent value="immediate" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {copingStrategies.immediate.map((strategy) => {
                const Icon = strategy.icon
                return (
                  <Card
                    key={strategy.id}
                    className="border-2 border-slate-200 hover:shadow-md transition-shadow duration-200"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(strategy.color)}`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => toggleFavorite(strategy.id)} className="p-1">
                          <Star
                            className={`h-4 w-4 ${favorites.includes(strategy.id) ? "fill-yellow-400 text-yellow-400" : "text-slate-400"}`}
                          />
                        </Button>
                      </div>
                      <CardTitle className="text-lg font-medium text-slate-800">{strategy.title}</CardTitle>
                      <CardDescription className="text-slate-600 leading-relaxed">
                        {strategy.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {strategy.duration}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {strategy.difficulty}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-slate-800 text-sm">Steps:</h4>
                        <ol className="space-y-1 text-sm text-slate-600">
                          {strategy.steps.map((step, index) => (
                            <li key={index} className="flex gap-2">
                              <span className="text-slate-400">{index + 1}.</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      <Button className="w-full bg-blue-600 hover:bg-blue-700">Try This Now</Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="daily" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {copingStrategies.daily.map((strategy) => {
                const Icon = strategy.icon
                return (
                  <Card
                    key={strategy.id}
                    className="border-2 border-slate-200 hover:shadow-md transition-shadow duration-200"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(strategy.color)}`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => toggleFavorite(strategy.id)} className="p-1">
                          <Star
                            className={`h-4 w-4 ${favorites.includes(strategy.id) ? "fill-yellow-400 text-yellow-400" : "text-slate-400"}`}
                          />
                        </Button>
                      </div>
                      <CardTitle className="text-lg font-medium text-slate-800">{strategy.title}</CardTitle>
                      <CardDescription className="text-slate-600 leading-relaxed">
                        {strategy.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {strategy.duration}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {strategy.difficulty}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-slate-800 text-sm">Benefits:</h4>
                        <ul className="space-y-1 text-sm text-slate-600">
                          {strategy.benefits.map((benefit, index) => (
                            <li key={index} className="flex gap-2">
                              <span className="text-green-500">•</span>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button className="w-full bg-green-600 hover:bg-green-700">Learn More</Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="audio" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {copingStrategies.audio.map((audio) => {
                const Icon = audio.icon
                const isPlaying = activeAudio === audio.id
                return (
                  <Card
                    key={audio.id}
                    className="border-2 border-slate-200 hover:shadow-md transition-shadow duration-200"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(audio.color)}`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => toggleFavorite(audio.id)} className="p-1">
                          <Star
                            className={`h-4 w-4 ${favorites.includes(audio.id) ? "fill-yellow-400 text-yellow-400" : "text-slate-400"}`}
                          />
                        </Button>
                      </div>
                      <CardTitle className="text-lg font-medium text-slate-800">{audio.title}</CardTitle>
                      <CardDescription className="text-slate-600 leading-relaxed">{audio.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {audio.duration}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {audio.type}
                        </Badge>
                      </div>

                      <Button
                        onClick={() => toggleAudio(audio.id)}
                        className={`w-full flex items-center gap-2 ${
                          isPlaying ? "bg-red-600 hover:bg-red-700" : "bg-purple-600 hover:bg-purple-700"
                        }`}
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        {isPlaying ? "Stop" : "Play"}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <Card className="border-2 border-yellow-200 bg-yellow-50 mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Star className="h-5 w-5 text-yellow-500" />
                Your Favorite Strategies
              </CardTitle>
              <CardDescription>Quick access to the coping strategies you've saved</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {favorites.map((favoriteId) => (
                  <Badge key={favoriteId} variant="secondary" className="bg-yellow-100 text-yellow-800">
                    {favoriteId}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
