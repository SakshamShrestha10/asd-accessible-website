"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle, ArrowLeft, ArrowRight, RotateCcw, FileText } from "lucide-react"
import Navigation from "@/components/navigation"
import Link from "next/link"

export default function AssessmentPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [isComplete, setIsComplete] = useState(false)

  const assessments = [
    {
      id: "sensory",
      title: "Sensory Processing Assessment",
      description: "Understand how you process different sensory experiences",
      duration: "5-7 minutes",
      questions: 8,
    },
    {
      id: "social",
      title: "Social Communication Assessment",
      description: "Explore your communication preferences and challenges",
      duration: "6-8 minutes",
      questions: 10,
    },
    {
      id: "routine",
      title: "Daily Routine Assessment",
      description: "Identify what helps you feel organized and calm",
      duration: "4-6 minutes",
      questions: 6,
    },
    {
      id: "stress",
      title: "Stress and Coping Assessment",
      description: "Learn about your stress triggers and coping strategies",
      duration: "7-9 minutes",
      questions: 12,
    },
  ]

  const sampleQuestions = [
    {
      question: "How do you usually feel in crowded, noisy places like shopping centers?",
      options: [
        "Very comfortable - I enjoy the energy",
        "Somewhat comfortable - I can manage for a while",
        "Somewhat uncomfortable - I prefer quieter places",
        "Very uncomfortable - I try to avoid these places",
        "It depends on the day and my energy level",
      ],
    },
    {
      question: "When you need to focus on something important, what helps you most?",
      options: [
        "Complete silence",
        "Soft background music or sounds",
        "A specific routine or ritual",
        "Being in a familiar space",
        "Having all distractions removed",
      ],
    },
    {
      question: "How do you prefer to receive new information or instructions?",
      options: [
        "Written down step-by-step",
        "Explained verbally with examples",
        "Shown through pictures or diagrams",
        "Demonstrated first, then I try",
        "A combination of methods",
      ],
    },
  ]

  const handleAnswerChange = (value: string) => {
    setAnswers({ ...answers, [currentQuestion]: value })
  }

  const handleNext = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setIsComplete(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setIsComplete(false)
  }

  const progress = ((currentQuestion + 1) / sampleQuestions.length) * 100

  if (isComplete) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-2xl mx-auto py-8 px-4">
          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-medium text-slate-800">Assessment Complete!</CardTitle>
              <CardDescription className="text-slate-600">
                Thank you for taking the time to share about your experiences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h3 className="font-medium text-slate-800 mb-2">Your Results Summary</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Based on your responses, we've identified some areas where specific tools and strategies might be
                  helpful. Your personalized recommendations are being prepared.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleRestart} variant="outline" className="flex items-center gap-2 bg-transparent">
                  <RotateCcw className="h-4 w-4" />
                  Take Again
                </Button>
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <Link href="/coping">View Recommended Tools</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-medium text-slate-800 mb-2">Self-Assessment Tools</h1>
          <p className="text-slate-600 leading-relaxed">
            These assessments help you understand your preferences and needs. Take your time and answer honestly.
          </p>
        </div>

        {currentQuestion === 0 && Object.keys(answers).length === 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assessments.map((assessment) => (
                <Card
                  key={assessment.id}
                  className="border-2 border-slate-200 hover:shadow-md transition-shadow duration-200"
                >
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg font-medium text-slate-800">{assessment.title}</CardTitle>
                    <CardDescription className="text-slate-600 leading-relaxed">
                      {assessment.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm text-slate-500">
                        <span>{assessment.questions} questions</span>
                        <span>{assessment.duration}</span>
                      </div>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => setCurrentQuestion(0)}>
                        Start Assessment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <h3 className="font-medium text-slate-800 mb-2">Before You Begin</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• There are no right or wrong answers</li>
                  <li>• You can take breaks anytime you need</li>
                  <li>• Your responses are private and secure</li>
                  <li>• You can retake any assessment later</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-slate-200">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-slate-500">
                    Question {currentQuestion + 1} of {sampleQuestions.length}
                  </span>
                  <span className="text-sm text-slate-500">{Math.round(progress)}% complete</span>
                </div>
                <Progress value={progress} className="mb-4" />
                <CardTitle className="text-xl font-medium text-slate-800 leading-relaxed">
                  {sampleQuestions[currentQuestion].question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup
                  value={answers[currentQuestion] || ""}
                  onValueChange={handleAnswerChange}
                  className="space-y-3"
                >
                  {sampleQuestions[currentQuestion].options.map((option, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50">
                      <RadioGroupItem value={option} id={`option-${index}`} className="mt-1" />
                      <Label
                        htmlFor={`option-${index}`}
                        className="text-slate-700 leading-relaxed cursor-pointer flex-1"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <div className="flex justify-between pt-4">
                  <Button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    variant="outline"
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!answers[currentQuestion]}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    {currentQuestion === sampleQuestions.length - 1 ? "Complete" : "Next"}
                    <ArrowRight className="h-4 w-4" />
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
