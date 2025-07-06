import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Timer, Volume2, Palette, Thermometer, Moon } from "lucide-react"
import Link from "next/link"

export default function ToolsGrid() {
  const tools = [
    {
      icon: Brain,
      title: "Mood Tracker",
      description: "Track how you're feeling throughout the day",
      href: "/tools/mood-tracker",
      color: "blue",
    },
    {
      icon: Timer,
      title: "Focus Timer",
      description: "Break tasks into manageable time chunks",
      href: "/tools/focus-timer",
      color: "green",
    },
    {
      icon: Volume2,
      title: "Calming Sounds",
      description: "Nature sounds and white noise for relaxation",
      href: "/tools/calming-sounds",
      color: "purple",
    },
    {
      icon: Palette,
      title: "Visual Schedule",
      description: "Plan your day with pictures and colors",
      href: "/tools/visual-schedule",
      color: "orange",
    },
    {
      icon: Thermometer,
      title: "Stress Level Check",
      description: "Quick check-in on your stress levels",
      href: "/tools/stress-check",
      color: "red",
    },
    {
      icon: Moon,
      title: "Sleep Helper",
      description: "Tools to help you prepare for better sleep",
      href: "/tools/sleep-helper",
      color: "indigo",
    },
  ]

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-blue-100 text-blue-600 hover:bg-blue-200",
      green: "bg-green-100 text-green-600 hover:bg-green-200",
      purple: "bg-purple-100 text-purple-600 hover:bg-purple-200",
      orange: "bg-orange-100 text-orange-600 hover:bg-orange-200",
      red: "bg-red-100 text-red-600 hover:bg-red-200",
      indigo: "bg-indigo-100 text-indigo-600 hover:bg-indigo-200",
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tools.map((tool) => {
        const Icon = tool.icon
        return (
          <Card key={tool.href} className="border-2 border-slate-200 hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${getColorClasses(tool.color)}`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <CardTitle className="text-base font-medium text-slate-800">{tool.title}</CardTitle>
              <CardDescription className="text-sm text-slate-600 leading-relaxed">{tool.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button asChild variant="outline" size="sm" className="w-full bg-transparent">
                <Link href={tool.href}>Use Tool</Link>
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
