"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  BookOpen,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Star,
  Share,
  Download,
} from "lucide-react"
import Navigation from "@/components/navigation"
import Link from "next/link"

interface LessonPageProps {
  params: {
    id: string
  }
}

export default function LessonPage({ params }: LessonPageProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)

  // Mock lesson data - in real app, this would come from API
  const lesson = {
    id: params.id,
    title: "Understanding Sensory Processing",
    description: "Learn about sensory differences and how they affect daily life",
    category: "Understanding Autism",
    duration: "12 minutes",
    difficulty: "Beginner",
    sections: [
      {
        id: "introduction",
        title: "What is Sensory Processing?",
        content: `
          <p>Sensory processing is how our nervous system receives and responds to sensory information from our environment. For many people on the autism spectrum, sensory processing can work differently.</p>
          
          <p>This doesn't mean it's wrong or broken - it's just different. Understanding these differences can help you:</p>
          
          <ul>
            <li>Recognize your sensory preferences</li>
            <li>Create more comfortable environments</li>
            <li>Develop coping strategies</li>
            <li>Communicate your needs to others</li>
          </ul>
        `,
        type: "text",
      },
      {
        id: "types",
        title: "Types of Sensory Processing",
        content: `
          <p>There are several ways sensory processing can be different:</p>
          
          <h3>Hypersensitivity (Over-responsive)</h3>
          <p>When your senses are more sensitive than typical. You might:</p>
          <ul>
            <li>Feel overwhelmed by loud noises</li>
            <li>Find certain textures uncomfortable</li>
            <li>Be bothered by bright lights</li>
            <li>Notice smells others don't</li>
          </ul>
          
          <h3>Hyposensitivity (Under-responsive)</h3>
          <p>When your senses need more input to register. You might:</p>
          <ul>
            <li>Seek out loud music or sounds</li>
            <li>Enjoy strong flavors or textures</li>
            <li>Need more physical activity</li>
            <li>Not notice when you're hurt</li>
          </ul>
        `,
        type: "text",
      },
      {
        id: "strategies",
        title: "Helpful Strategies",
        content: `
          <p>Here are some strategies that many people find helpful:</p>
          
          <h3>For Hypersensitivity:</h3>
          <ul>
            <li>Use noise-canceling headphones in loud environments</li>
            <li>Wear sunglasses or a hat to reduce light sensitivity</li>
            <li>Choose clothing with comfortable fabrics</li>
            <li>Take breaks in quiet, calm spaces</li>
          </ul>
          
          <h3>For Hyposensitivity:</h3>
          <ul>
            <li>Use fidget toys or stress balls</li>
            <li>Take movement breaks throughout the day</li>
            <li>Try weighted blankets or compression clothing</li>
            <li>Use timers to remind yourself to check in with your body</li>
          </ul>
          
          <p><strong>Remember:</strong> What works for one person might not work for another. It's about finding what works for you.</p>
        `,
        type: "text",
      },
      {
        id: "quiz",
        title: "Knowledge Check",
        content: "interactive-quiz",
        type: "interactive",
      },
    ],
    nextLesson: {
      id: "morning-routines",
      title: "Creating Effective Morning Routines",
    },
    previousLesson: {
      id: "what-is-autism",
      title: "What is Autism Spectrum Disorder?",
    },
  }

  const quizQuestions = [
    {
      question: "Sensory processing differences in autism are:",
      options: [
        "Always a problem that needs to be fixed",
        "Natural variations in how the nervous system works",
        "The same for everyone on the spectrum",
        "Only about being too sensitive",
      ],
      correct: 1,
    },
    {
      question: "If someone is hypersensitive to sound, they might:",
      options: [
        "Always enjoy loud music",
        "Need complete silence at all times",
        "Find certain sounds overwhelming or painful",
        "Not notice sounds at all",
      ],
      correct: 2,
    },
  ]

  const [quizAnswers, setQuizAnswers] = useState<number[]>([])
  const [showQuizResults, setShowQuizResults] = useState(false)

  useEffect(() => {
    // Simulate reading progress
    const timer = setInterval(() => {
      setReadingProgress((prev) => {
        const newProgress = prev + 1
        if (newProgress >= 100) {
          clearInterval(timer)
          return 100
        }
        return newProgress
      })
    }, 100)

    return () => clearInterval(timer)
  }, [currentSection])

  const handleSectionComplete = () => {
    if (currentSection < lesson.sections.length - 1) {
      setCurrentSection(currentSection + 1)
      setReadingProgress(0)
    } else {
      setIsCompleted(true)
    }
  }

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...quizAnswers]
    newAnswers[questionIndex] = answerIndex
    setQuizAnswers(newAnswers)
  }

  const submitQuiz = () => {
    setShowQuizResults(true)
    handleSectionComplete()
  }

  const getQuizScore = () => {
    let correct = 0
    quizQuestions.forEach((question, index) => {
      if (quizAnswers[index] === question.correct) {
        correct++
      }
    })
    return (correct / quizQuestions.length) * 100
  }

  const currentSectionData = lesson.sections[currentSection]
  const progressPercentage = ((currentSection + 1) / lesson.sections.length) * 100

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/learning" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Learning Center
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="space-y-2">
              <Badge variant="secondary" className="text-xs">
                {lesson.category}
              </Badge>
              <h1 className="text-3xl font-medium text-slate-800">{lesson.title}</h1>
              <p className="text-slate-600 leading-relaxed">{lesson.description}</p>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {lesson.duration}
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {lesson.difficulty}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsBookmarked(!isBookmarked)} className="p-2">
                <Star className={`h-4 w-4 ${isBookmarked ? "fill-yellow-400 text-yellow-400" : "text-slate-400"}`} />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Share className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <Card className="border-2 border-slate-200 mb-8">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">
                Section {currentSection + 1} of {lesson.sections.length}: {currentSectionData.title}
              </span>
              <span className="text-sm text-slate-500">{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="border-2 border-slate-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-medium text-slate-800">{currentSectionData.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setAudioEnabled(!audioEnabled)} className="p-2">
                      {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    </Button>
                    {audioEnabled && (
                      <Button variant="ghost" size="sm" onClick={() => setIsPlaying(!isPlaying)} className="p-2">
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentSectionData.type === "text" && (
                  <div
                    className="prose prose-slate max-w-none leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: currentSectionData.content }}
                  />
                )}

                {currentSectionData.type === "interactive" && currentSectionData.content === "interactive-quiz" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-slate-800">Test Your Understanding</h3>
                    {quizQuestions.map((question, questionIndex) => (
                      <Card key={questionIndex} className="border border-slate-200">
                        <CardContent className="p-4">
                          <h4 className="font-medium text-slate-800 mb-3">
                            {questionIndex + 1}. {question.question}
                          </h4>
                          <div className="space-y-2">
                            {question.options.map((option, optionIndex) => (
                              <label
                                key={optionIndex}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer"
                              >
                                <input
                                  type="radio"
                                  name={`question-${questionIndex}`}
                                  value={optionIndex}
                                  onChange={() => handleQuizAnswer(questionIndex, optionIndex)}
                                  className="text-blue-600"
                                />
                                <span className="text-slate-700">{option}</span>
                              </label>
                            ))}
                          </div>
                          {showQuizResults && (
                            <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                              <p className="text-sm text-blue-800">
                                {quizAnswers[questionIndex] === question.correct ? (
                                  <span className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    Correct!
                                  </span>
                                ) : (
                                  <span className="text-red-600">
                                    Correct answer: {question.options[question.correct]}
                                  </span>
                                )}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}

                    {!showQuizResults && quizAnswers.length === quizQuestions.length && (
                      <Button onClick={submitQuiz} className="w-full bg-blue-600 hover:bg-blue-700">
                        Submit Quiz
                      </Button>
                    )}

                    {showQuizResults && (
                      <Card className="border-2 border-green-200 bg-green-50">
                        <CardContent className="p-4 text-center">
                          <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                          <h3 className="font-medium text-slate-800 mb-1">Quiz Complete!</h3>
                          <p className="text-sm text-slate-600">
                            You scored {Math.round(getQuizScore())}% (
                            {quizAnswers.filter((answer, index) => answer === quizQuestions[index].correct).length} out
                            of {quizQuestions.length} correct)
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                    disabled={currentSection === 0}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  {currentSection < lesson.sections.length - 1 ? (
                    <Button
                      onClick={handleSectionComplete}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                      Next Section
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setIsCompleted(true)}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                      disabled={currentSectionData.type === "interactive" && !showQuizResults}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Complete Lesson
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Section Navigation */}
            <Card className="border-2 border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-slate-800">Lesson Sections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {lesson.sections.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSection(index)}
                    className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                      index === currentSection
                        ? "bg-blue-100 text-blue-800 border border-blue-200"
                        : index < currentSection
                          ? "bg-green-50 text-green-800 border border-green-200"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {index < currentSection ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : index === currentSection ? (
                        <div className="w-4 h-4 rounded-full bg-blue-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                      )}
                      <span className="text-sm font-medium">{section.title}</span>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Reading Progress */}
            <Card className="border-2 border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-slate-800">Reading Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Current Section</span>
                    <span className="font-medium text-slate-800">{Math.round(readingProgress)}%</span>
                  </div>
                  <Progress value={readingProgress} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-2 border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-slate-800">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restart Lesson
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Download Notes
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Share className="h-4 w-4 mr-2" />
                  Share Lesson
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Lesson Navigation */}
        {(lesson.previousLesson || lesson.nextLesson) && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {lesson.previousLesson && (
              <Card className="border-2 border-slate-200 hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-4">
                  <p className="text-sm text-slate-500 mb-1">Previous Lesson</p>
                  <Link
                    href={`/learning/lesson/${lesson.previousLesson.id}`}
                    className="font-medium text-slate-800 hover:text-blue-600"
                  >
                    {lesson.previousLesson.title}
                  </Link>
                </CardContent>
              </Card>
            )}
            {lesson.nextLesson && (
              <Card className="border-2 border-slate-200 hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-4 text-right">
                  <p className="text-sm text-slate-500 mb-1">Next Lesson</p>
                  <Link
                    href={`/learning/lesson/${lesson.nextLesson.id}`}
                    className="font-medium text-slate-800 hover:text-blue-600"
                  >
                    {lesson.nextLesson.title}
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Completion Modal */}
        {isCompleted && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="border-2 border-green-200 bg-green-50 max-w-md w-full">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-medium text-slate-800">Lesson Complete!</CardTitle>
                <CardDescription className="text-slate-600">
                  Great job completing "{lesson.title}". You're making excellent progress!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-2">
                  {lesson.nextLesson && (
                    <Button asChild className="bg-green-600 hover:bg-green-700">
                      <Link href={`/learning/lesson/${lesson.nextLesson.id}`}>Continue to Next Lesson</Link>
                    </Button>
                  )}
                  <Button asChild variant="outline" className="bg-transparent">
                    <Link href="/learning">Back to Learning Center</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
