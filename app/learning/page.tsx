"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Clock, Star, Search, Filter, Play, FileText, Headphones, Gamepad2 } from "lucide-react"

interface LearningPath {
  id: number
  title: string
  description: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  duration: string
  category: string
  lessons: number
  completed: number
  rating: number
  type: "video" | "article" | "audio" | "interactive"
}

const mockLearningPaths: LearningPath[] = [
  {
    id: 1,
    title: "Understanding Autism Spectrum Disorder",
    description:
      "A comprehensive introduction to ASD, covering the basics of diagnosis, characteristics, and common experiences.",
    difficulty: "Beginner",
    duration: "2 hours",
    category: "Fundamentals",
    lessons: 8,
    completed: 3,
    rating: 4.8,
    type: "video",
  },
  {
    id: 2,
    title: "Communication Strategies",
    description:
      "Learn effective communication techniques and tools to improve social interactions and express needs clearly.",
    difficulty: "Intermediate",
    duration: "3 hours",
    category: "Communication",
    lessons: 12,
    completed: 0,
    rating: 4.9,
    type: "interactive",
  },
  {
    id: 3,
    title: "Sensory Processing and Management",
    description:
      "Understand sensory processing differences and learn practical strategies for managing sensory challenges.",
    difficulty: "Beginner",
    duration: "1.5 hours",
    category: "Sensory",
    lessons: 6,
    completed: 6,
    rating: 4.7,
    type: "article",
  },
  {
    id: 4,
    title: "Building Daily Routines",
    description: "Create structured, flexible routines that support independence and reduce anxiety in daily life.",
    difficulty: "Beginner",
    duration: "2.5 hours",
    category: "Life Skills",
    lessons: 10,
    completed: 1,
    rating: 4.6,
    type: "video",
  },
  {
    id: 5,
    title: "Workplace Success for Autistic Adults",
    description: "Navigate workplace challenges, develop professional skills, and advocate for accommodations.",
    difficulty: "Advanced",
    duration: "4 hours",
    category: "Career",
    lessons: 15,
    completed: 0,
    rating: 4.8,
    type: "interactive",
  },
  {
    id: 6,
    title: "Mindfulness and Emotional Regulation",
    description: "Learn mindfulness techniques and emotional regulation strategies tailored for autistic individuals.",
    difficulty: "Intermediate",
    duration: "2 hours",
    category: "Wellness",
    lessons: 8,
    completed: 2,
    rating: 4.9,
    type: "audio",
  },
]

const typeIcons = {
  video: Play,
  article: FileText,
  audio: Headphones,
  interactive: Gamepad2,
}

const difficultyColors = {
  Beginner: "bg-green-100 text-green-800",
  Intermediate: "bg-yellow-100 text-yellow-800",
  Advanced: "bg-red-100 text-red-800",
}

export default function LearningPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [filteredPaths, setFilteredPaths] = useState<LearningPath[]>(mockLearningPaths)

  const categories = ["all", "Fundamentals", "Communication", "Sensory", "Life Skills", "Career", "Wellness"]
  const difficulties = ["all", "Beginner", "Intermediate", "Advanced"]

  useEffect(() => {
    let filtered = mockLearningPaths

    if (searchTerm) {
      filtered = filtered.filter(
        (path) =>
          path.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          path.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((path) => path.category === selectedCategory)
    }

    if (selectedDifficulty !== "all") {
      filtered = filtered.filter((path) => path.difficulty === selectedDifficulty)
    }

    setFilteredPaths(filtered)
  }, [searchTerm, selectedCategory, selectedDifficulty])

  const getProgressPercentage = (completed: number, total: number) => {
    return Math.round((completed / total) * 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Learning Center</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explore our comprehensive learning paths designed specifically for individuals with autism spectrum
            disorder. Build skills, gain knowledge, and grow at your own pace.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search learning paths..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty === "all" ? "All Levels" : difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Learning Paths Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPaths.map((path) => {
            const TypeIcon = typeIcons[path.type]
            const progressPercentage = getProgressPercentage(path.completed, path.lessons)

            return (
              <Card key={path.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <TypeIcon className="h-5 w-5 text-blue-600" />
                      <Badge variant="secondary" className={difficultyColors[path.difficulty]}>
                        {path.difficulty}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600">{path.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{path.title}</CardTitle>
                  <CardDescription className="text-sm">{path.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Course Info */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{path.lessons} lessons</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{path.duration}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {path.completed > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="text-blue-600 font-medium">{progressPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <Button asChild className="w-full">
                      <Link href={`/learning/path/${path.id}`}>
                        {path.completed === 0
                          ? "Start Learning"
                          : path.completed === path.lessons
                            ? "Review"
                            : "Continue"}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* No Results */}
        {filteredPaths.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No learning paths found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("all")
                setSelectedDifficulty("all")
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Featured Resources */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Featured Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">Self-Assessment Tools</h3>
                <p className="text-sm text-slate-600 mb-2">
                  Discover your strengths and areas for growth with our comprehensive assessment tools.
                </p>
                <Link href="/assessment" className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                  Take Assessment →
                </Link>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">Community Support</h3>
                <p className="text-sm text-slate-600 mb-2">
                  Connect with others on similar learning journeys and share experiences.
                </p>
                <Link href="/community" className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                  Join Community →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
