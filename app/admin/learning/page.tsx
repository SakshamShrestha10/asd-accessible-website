"use client"

import { requireAdmin } from "@/lib/auth"
import { getLessons, createLesson, updateLesson, deleteLesson, getCategories, getLessonStats } from "@/lib/data/lessons"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BookOpen, Plus, Edit, Trash2, Eye, Save, Search, BarChart3, CheckCircle, TrendingUp } from "lucide-react"

export default async function AdminLearningPage() {
  await requireAdmin() // Ensure user is admin

  const lessons = await getLessons()
  const categories = await getCategories()
  const stats = await getLessonStats()

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingLesson, setEditingLesson] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")

  const [newLesson, setNewLesson] = useState({
    title: "",
    description: "",
    category: "",
    type: "article",
    difficulty: "beginner",
    duration: "",
    content: "",
    tags: "",
    status: "draft",
  })

  const analytics = {
    totalLessons: stats.totalLessons,
    publishedLessons: stats.publishedLessons,
    totalViews: stats.totalViews,
    totalCompletions: stats.totalCompletions,
    averageRating: stats.averageRating,
    activeUsers: 1247,
    completionRate: 72,
    engagementRate: 85,
  }

  const handleCreateLesson = async () => {
    const lesson = {
      title: newLesson.title,
      description: newLesson.description,
      category: newLesson.category,
      type: newLesson.type,
      difficulty: newLesson.difficulty,
      duration: newLesson.duration,
      content: newLesson.content,
      tags: newLesson.tags,
      status: newLesson.status,
    }

    await createLesson(lesson)
    setNewLesson({
      title: "",
      description: "",
      category: "",
      type: "article",
      difficulty: "beginner",
      duration: "",
      content: "",
      tags: "",
      status: "draft",
    })
    setIsCreateDialogOpen(false)
  }

  const handleUpdateLesson = async (id: string, updates: any) => {
    await updateLesson(id, updates)
  }

  const handleDeleteLesson = async (id: string) => {
    await deleteLesson(id)
  }

  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || lesson.status === filterStatus
    const matchesCategory = filterCategory === "all" || lesson.category === filterCategory
    return matchesSearch && matchesStatus && matchesCategory
  })

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Header */}
      <div className="bg-white border-b-2 border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-medium text-slate-800">Learning Content Management</h1>
              <p className="text-sm text-slate-600">Manage educational resources and learning paths</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Lesson
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Lesson</DialogTitle>
                  <DialogDescription>Add a new educational resource to the learning center</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Lesson Title</Label>
                      <Input
                        id="title"
                        value={newLesson.title}
                        onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                        placeholder="Enter lesson title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        value={newLesson.duration}
                        onChange={(e) => setNewLesson({ ...newLesson, duration: e.target.value })}
                        placeholder="e.g., 10 min read"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newLesson.description}
                      onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
                      placeholder="Brief description of the lesson content"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newLesson.category}
                        onValueChange={(value) => setNewLesson({ ...newLesson, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Content Type</Label>
                      <Select
                        value={newLesson.type}
                        onValueChange={(value) => setNewLesson({ ...newLesson, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="article">Article</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="audio">Audio</SelectItem>
                          <SelectItem value="interactive">Interactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <Select
                        value={newLesson.difficulty}
                        onValueChange={(value) => setNewLesson({ ...newLesson, difficulty: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Lesson Content</Label>
                    <Textarea
                      id="content"
                      value={newLesson.content}
                      onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })}
                      placeholder="Enter the main lesson content (HTML supported)"
                      rows={8}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        value={newLesson.tags}
                        onChange={(e) => setNewLesson({ ...newLesson, tags: e.target.value })}
                        placeholder="autism, sensory, daily-life"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={newLesson.status}
                        onValueChange={(value) => setNewLesson({ ...newLesson, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="review">Under Review</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateLesson} className="bg-blue-600 hover:bg-blue-700">
                      <Save className="h-4 w-4 mr-2" />
                      Create Lesson
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-slate-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600">Total Lessons</CardTitle>
                <BookOpen className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{analytics.totalLessons}</div>
              <p className="text-xs text-green-600 mt-1">{analytics.publishedLessons} published</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-slate-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{analytics.totalViews.toLocaleString()}</div>
              <p className="text-xs text-green-600 mt-1">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                +15% this month
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-slate-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600">Completions</CardTitle>
                <CheckCircle className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{analytics.totalCompletions.toLocaleString()}</div>
              <p className="text-xs text-purple-600 mt-1">{analytics.completionRate}% completion rate</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-slate-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600">Avg Rating</CardTitle>
                <BarChart3 className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{analytics.averageRating.toFixed(1)}</div>
              <p className="text-xs text-orange-600 mt-1">Out of 5.0 stars</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="lessons" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border-2 border-slate-200">
            <TabsTrigger value="lessons" className="data-[state=active]:bg-blue-100">
              Lessons
            </TabsTrigger>
            <TabsTrigger value="categories" className="data-[state=active]:bg-green-100">
              Categories
            </TabsTrigger>
            <TabsTrigger value="paths" className="data-[state=active]:bg-purple-100">
              Learning Paths
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-orange-100">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lessons" className="space-y-6">
            {/* Filters */}
            <Card className="border-2 border-slate-200">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      type="search"
                      placeholder="Search lessons..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-2 border-slate-200 focus:border-blue-300"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lessons Table */}
            <Card className="border-2 border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-slate-800">Learning Content</CardTitle>
                <CardDescription>Manage all educational resources and lessons</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredLessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium text-slate-800">{lesson.title}</h3>
                          <Badge
                            variant={
                              lesson.status === "published"
                                ? "default"
                                : lesson.status === "draft"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="text-xs"
                          >
                            {lesson.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {lesson.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {lesson.difficulty}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-slate-600">
                          <span>Category: {categories.find((c) => c.id === lesson.category)?.name}</span>
                          <span>Duration: {lesson.duration}</span>
                          <span>Views: {lesson.views?.toLocaleString()}</span>
                          <span>Completions: {lesson.completions?.toLocaleString()}</span>
                          {lesson.rating > 0 && <span>Rating: {lesson.rating}/5</span>}
                          <span>Modified: {lesson.lastModified}</span>
                          <span>Author: {lesson.author}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setEditingLesson(lesson)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteLesson(lesson.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium text-slate-800">Content Categories</h2>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Card key={category.id} className="border-2 border-slate-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-medium text-slate-800">{category.name}</CardTitle>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Total Lessons</span>
                        <span className="font-medium text-slate-800">{category.lessons}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Status</span>
                        <Badge className="bg-green-100 text-green-700">Active</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="paths" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium text-slate-800">Learning Paths</h2>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Learning Path
              </Button>
            </div>

            <div className="space-y-4">
              {/* {learningPaths.map((path) => (
                <Card key={path.id} className="border-2 border-slate-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg font-medium text-slate-800">{path.title}</CardTitle>
                        <CardDescription>{path.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-700">{path.status}</Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-slate-600">Lessons</span>
                        <p className="font-medium text-slate-800">{path.lessons.length}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Enrollments</span>
                        <p className="font-medium text-slate-800">{path.enrollments}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Completions</span>
                        <p className="font-medium text-slate-800">{path.completions}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Completion Rate</span>
                        <p className="font-medium text-slate-800">
                          {Math.round((path.completions / path.enrollments) * 100)}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))} */}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-xl font-medium text-slate-800">Learning Analytics</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-2 border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-slate-800">User Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Active Learners</span>
                      <span className="font-medium text-slate-800">{analytics.activeUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Avg. Session Time</span>
                      <span className="font-medium text-slate-800">18m 34s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Completion Rate</span>
                      <span className="font-medium text-slate-800">{analytics.completionRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Engagement Rate</span>
                      <span className="font-medium text-slate-800">{analytics.engagementRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-slate-800">Popular Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lessons
                      .sort((a, b) => b.views - a.views)
                      .slice(0, 5)
                      .map((lesson, index) => (
                        <div key={lesson.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-500">#{index + 1}</span>
                            <span className="text-sm font-medium text-slate-800">{lesson.title}</span>
                          </div>
                          <span className="text-sm text-slate-600">{lesson.views} views</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
