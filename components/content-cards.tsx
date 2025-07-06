import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Headphones, Video, Clock, User } from "lucide-react"
import Link from "next/link"

export default function ContentCards() {
  const content = [
    {
      type: "text",
      icon: FileText,
      title: "Understanding Sensory Processing",
      description: "A clear guide about how our senses work and what to do when they feel overwhelming.",
      duration: "5 min read",
      difficulty: "Beginner",
      href: "/content/sensory-processing",
      badge: "Article",
    },
    {
      type: "audio",
      icon: Headphones,
      title: "Guided Breathing Exercise",
      description: "A gentle audio guide to help you relax and feel more calm when things get stressful.",
      duration: "10 min listen",
      difficulty: "All levels",
      href: "/content/breathing-exercise",
      badge: "Audio",
    },
    {
      type: "video",
      icon: Video,
      title: "Daily Routine Tips",
      description: "Watch simple strategies for creating routines that work for you. Includes captions and transcript.",
      duration: "8 min watch",
      difficulty: "Beginner",
      href: "/content/routine-tips",
      badge: "Video",
    },
    {
      type: "text",
      icon: FileText,
      title: "Communication Strategies",
      description: "Practical ways to express your needs and feelings, especially in challenging situations.",
      duration: "7 min read",
      difficulty: "Intermediate",
      href: "/content/communication-strategies",
      badge: "Guide",
    },
    {
      type: "audio",
      icon: Headphones,
      title: "Sleep Stories for Adults",
      description:
        "Calming stories designed to help your mind relax before sleep. Choose from different voices and themes.",
      duration: "15-30 min",
      difficulty: "All levels",
      href: "/content/sleep-stories",
      badge: "Audio",
    },
    {
      type: "video",
      icon: Video,
      title: "Workplace Accommodations",
      description:
        "Learn about your rights and how to ask for helpful changes at work. Fully accessible with sign language.",
      duration: "12 min watch",
      difficulty: "Intermediate",
      href: "/content/workplace-accommodations",
      badge: "Video",
    },
  ]

  const getTypeColor = (type: string) => {
    const colorMap = {
      text: "bg-blue-100 text-blue-700",
      audio: "bg-green-100 text-green-700",
      video: "bg-purple-100 text-purple-700",
    }
    return colorMap[type as keyof typeof colorMap] || colorMap.text
  }

  const getDifficultyColor = (difficulty: string) => {
    const colorMap = {
      Beginner: "bg-green-50 text-green-700 border-green-200",
      Intermediate: "bg-orange-50 text-orange-700 border-orange-200",
      "All levels": "bg-slate-50 text-slate-700 border-slate-200",
    }
    return colorMap[difficulty as keyof typeof colorMap] || colorMap["All levels"]
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {content.map((item) => {
        const Icon = item.icon
        return (
          <Card
            key={item.href}
            className="border-2 border-slate-200 hover:shadow-md transition-shadow duration-200 h-full flex flex-col"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(item.type)}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  {item.badge}
                </Badge>
              </div>
              <CardTitle className="text-lg font-medium text-slate-800 leading-snug">{item.title}</CardTitle>
              <CardDescription className="text-slate-600 leading-relaxed">{item.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 flex-1 flex flex-col justify-between">
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{item.duration}</span>
                  </div>
                </div>
                <Badge variant="outline" className={`text-xs ${getDifficultyColor(item.difficulty)}`}>
                  <User className="h-3 w-3 mr-1" />
                  {item.difficulty}
                </Badge>
              </div>
              <Button asChild className="w-full">
                <Link href={item.href}>
                  {item.type === "text" && "Read Article"}
                  {item.type === "audio" && "Listen Now"}
                  {item.type === "video" && "Watch Video"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
