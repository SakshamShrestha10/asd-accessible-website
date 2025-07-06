"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Volume2, Type, ImageIcon, Download, Share } from "lucide-react"
import Navigation from "@/components/navigation"
import Link from "next/link"

export default function CommunicationPage() {
  const [selectedCards, setSelectedCards] = useState<string[]>([])
  const [customMessage, setCustomMessage] = useState("")

  const communicationCards = {
    needs: [
      { id: "water", icon: "💧", text: "I need water", category: "basic" },
      { id: "food", icon: "🍎", text: "I'm hungry", category: "basic" },
      { id: "bathroom", icon: "🚽", text: "I need the bathroom", category: "basic" },
      { id: "break", icon: "⏸️", text: "I need a break", category: "basic" },
      { id: "quiet", icon: "🤫", text: "I need quiet", category: "sensory" },
      { id: "space", icon: "🏠", text: "I need space", category: "sensory" },
      { id: "help", icon: "🆘", text: "I need help", category: "support" },
      { id: "time", icon: "⏰", text: "I need more time", category: "support" },
    ],
    feelings: [
      { id: "happy", icon: "😊", text: "I feel happy", category: "positive" },
      { id: "sad", icon: "😢", text: "I feel sad", category: "negative" },
      { id: "angry", icon: "😠", text: "I feel angry", category: "negative" },
      { id: "worried", icon: "😰", text: "I feel worried", category: "negative" },
      { id: "tired", icon: "😴", text: "I feel tired", category: "physical" },
      { id: "excited", icon: "🤩", text: "I feel excited", category: "positive" },
      { id: "confused", icon: "😕", text: "I feel confused", category: "neutral" },
      { id: "overwhelmed", icon: "🤯", text: "I feel overwhelmed", category: "negative" },
    ],
    social: [
      { id: "hello", icon: "👋", text: "Hello", category: "greeting" },
      { id: "goodbye", icon: "👋", text: "Goodbye", category: "greeting" },
      { id: "please", icon: "🙏", text: "Please", category: "polite" },
      { id: "thankyou", icon: "🙏", text: "Thank you", category: "polite" },
      { id: "yes", icon: "✅", text: "Yes", category: "response" },
      { id: "no", icon: "❌", text: "No", category: "response" },
      { id: "maybe", icon: "🤔", text: "Maybe", category: "response" },
      { id: "sorry", icon: "😔", text: "I'm sorry", category: "polite" },
    ],
  }

  const quickPhrases = [
    "I need a moment to process this",
    "Can you repeat that more slowly?",
    "I understand better with written instructions",
    "This is too loud/bright for me",
    "I'm feeling overwhelmed right now",
    "Can we take a break?",
    "I need to think about this",
    "Thank you for being patient with me",
  ]

  const toggleCard = (cardId: string) => {
    setSelectedCards((prev) => (prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId]))
  }

  const clearSelection = () => {
    setSelectedCards([])
  }

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      utterance.pitch = 1
      speechSynthesis.speak(utterance)
    }
  }

  const getSelectedText = () => {
    const selectedTexts = selectedCards
      .map((cardId) => {
        for (const category of Object.values(communicationCards)) {
          const card = category.find((c) => c.id === cardId)
          if (card) return card.text
        }
        return ""
      })
      .filter(Boolean)

    return selectedTexts.join(". ")
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
          <h1 className="text-3xl font-medium text-slate-800 mb-2">Communication Aids</h1>
          <p className="text-slate-600 leading-relaxed">
            Tools to help you express your thoughts, feelings, and needs more easily.
          </p>
        </div>

        <Tabs defaultValue="cards" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border-2 border-slate-200">
            <TabsTrigger value="cards" className="data-[state=active]:bg-blue-100">
              Picture Cards
            </TabsTrigger>
            <TabsTrigger value="phrases" className="data-[state=active]:bg-green-100">
              Quick Phrases
            </TabsTrigger>
            <TabsTrigger value="builder" className="data-[state=active]:bg-purple-100">
              Message Builder
            </TabsTrigger>
            <TabsTrigger value="tools" className="data-[state=active]:bg-orange-100">
              Other Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cards" className="space-y-6">
            {/* Selected Cards Display */}
            {selectedCards.length > 0 && (
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-slate-800">Your Message</CardTitle>
                  <CardDescription>Tap cards below to build your message</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-xl text-slate-800 p-4 bg-white rounded-lg border border-blue-200">
                    {getSelectedText() || "Select cards to build your message"}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => speakText(getSelectedText())}
                      className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                      disabled={selectedCards.length === 0}
                    >
                      <Volume2 className="h-4 w-4" />
                      Speak
                    </Button>
                    <Button onClick={clearSelection} variant="outline" disabled={selectedCards.length === 0}>
                      Clear
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Communication Cards */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-medium text-slate-800 mb-4">Basic Needs</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {communicationCards.needs.map((card) => (
                    <Button
                      key={card.id}
                      onClick={() => toggleCard(card.id)}
                      variant={selectedCards.includes(card.id) ? "default" : "outline"}
                      className={`h-24 flex flex-col items-center justify-center gap-2 text-center p-2 ${
                        selectedCards.includes(card.id)
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-white hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-2xl">{card.icon}</span>
                      <span className="text-xs leading-tight">{card.text}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium text-slate-800 mb-4">Feelings</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {communicationCards.feelings.map((card) => (
                    <Button
                      key={card.id}
                      onClick={() => toggleCard(card.id)}
                      variant={selectedCards.includes(card.id) ? "default" : "outline"}
                      className={`h-24 flex flex-col items-center justify-center gap-2 text-center p-2 ${
                        selectedCards.includes(card.id)
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-white hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-2xl">{card.icon}</span>
                      <span className="text-xs leading-tight">{card.text}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium text-slate-800 mb-4">Social</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {communicationCards.social.map((card) => (
                    <Button
                      key={card.id}
                      onClick={() => toggleCard(card.id)}
                      variant={selectedCards.includes(card.id) ? "default" : "outline"}
                      className={`h-24 flex flex-col items-center justify-center gap-2 text-center p-2 ${
                        selectedCards.includes(card.id)
                          ? "bg-purple-600 hover:bg-purple-700 text-white"
                          : "bg-white hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-2xl">{card.icon}</span>
                      <span className="text-xs leading-tight">{card.text}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="phrases" className="space-y-6">
            <Card className="border-2 border-slate-200">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-slate-800">Quick Phrases</CardTitle>
                <CardDescription>Common phrases that might be helpful in different situations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickPhrases.map((phrase, index) => (
                    <Card
                      key={index}
                      className="border border-slate-200 hover:shadow-sm transition-shadow duration-200"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-slate-700 flex-1">{phrase}</p>
                          <Button
                            size="sm"
                            onClick={() => speakText(phrase)}
                            className="bg-green-600 hover:bg-green-700 flex-shrink-0"
                          >
                            <Volume2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="builder" className="space-y-6">
            <Card className="border-2 border-slate-200">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-slate-800">Custom Message Builder</CardTitle>
                <CardDescription>Type your own message and have it spoken aloud</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Type your message here..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="min-h-32 text-lg border-2 border-slate-200 focus:border-purple-300"
                  rows={4}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => speakText(customMessage)}
                    disabled={!customMessage.trim()}
                    className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
                  >
                    <Volume2 className="h-4 w-4" />
                    Speak Message
                  </Button>
                  <Button onClick={() => setCustomMessage("")} variant="outline" disabled={!customMessage.trim()}>
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <h4 className="font-medium text-slate-800 mb-2">Tips for Better Communication</h4>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>• Use simple, clear sentences</li>
                  <li>• Take your time - there's no rush</li>
                  <li>• It's okay to ask for clarification</li>
                  <li>• You can show this screen to others if speaking is difficult</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-slate-200">
                <CardHeader>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                    <Download className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg font-medium text-slate-800">Printable Cards</CardTitle>
                  <CardDescription>Download and print communication cards to use offline</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">Download PDF</Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-slate-200">
                <CardHeader>
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-3">
                    <Share className="h-6 w-6 text-teal-600" />
                  </div>
                  <CardTitle className="text-lg font-medium text-slate-800">Share with Others</CardTitle>
                  <CardDescription>Send your communication preferences to family or caregivers</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-teal-600 hover:bg-teal-700">Share Settings</Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-slate-200">
                <CardHeader>
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
                    <Type className="h-6 w-6 text-indigo-600" />
                  </div>
                  <CardTitle className="text-lg font-medium text-slate-800">Text-to-Speech Settings</CardTitle>
                  <CardDescription>Adjust voice speed, pitch, and language preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Voice Settings</Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-slate-200">
                <CardHeader>
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-3">
                    <ImageIcon className="h-6 w-6 text-pink-600" />
                  </div>
                  <CardTitle className="text-lg font-medium text-slate-800">Custom Cards</CardTitle>
                  <CardDescription>Create your own communication cards with personal photos</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-pink-600 hover:bg-pink-700">Create Cards</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
