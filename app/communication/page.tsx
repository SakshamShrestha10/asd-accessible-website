"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Volume2,
  Type,
  ImageIcon,
  Download,
  Share,
  Loader2,
} from "lucide-react";
import Navigation from "@/components/navigation";
import Link from "next/link";

interface CommunicationTool {
  id: number;
  title: string;
  description: string;
  type: string;
  category: string;
  content: string;
  image_url?: string;
  audio_url?: string;
  tags: string[];
  difficulty: string;
  icon: string;
  color: string;
  is_active: boolean;
  sort_order: number;
}

export default function CommunicationPage() {
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [customMessage, setCustomMessage] = useState("");
  const [communicationTools, setCommunicationTools] = useState<
    CommunicationTool[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch communication tools from database
  useEffect(() => {
    const fetchCommunicationTools = async () => {
      try {
        const res = await fetch("/api/admin/communication-tools");
        if (!res.ok) throw new Error("Failed to fetch communication tools");
        const data = await res.json();
        setCommunicationTools(data.communicationTools || []);
      } catch (e: any) {
        setError(e.message || "Error loading communication tools");
      } finally {
        setLoading(false);
      }
    };

    fetchCommunicationTools();
  }, []);

  // Group tools by type
  const cards = communicationTools.filter(
    (tool) => tool.type === "card" && tool.is_active
  );
  const phrases = communicationTools.filter(
    (tool) => tool.type === "phrase" && tool.is_active
  );
  const visualAids = communicationTools.filter(
    (tool) => tool.type === "visual" && tool.is_active
  );
  const audioTools = communicationTools.filter(
    (tool) => tool.type === "audio" && tool.is_active
  );

  // Group cards by category
  const cardsByCategory = cards.reduce((acc, card) => {
    if (!acc[card.category]) {
      acc[card.category] = [];
    }
    acc[card.category].push(card);
    return acc;
  }, {} as Record<string, CommunicationTool[]>);

  const toggleCard = (cardId: string) => {
    setSelectedCards((prev) =>
      prev.includes(cardId)
        ? prev.filter((id) => id !== cardId)
        : [...prev, cardId]
    );
  };

  const clearSelection = () => {
    setSelectedCards([]);
  };

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const getSelectedText = () => {
    const selectedTexts = selectedCards
      .map((cardId) => {
        const card = cards.find((c) => c.id.toString() === cardId);
        return card ? card.content : "";
      })
      .filter(Boolean);

    return selectedTexts.join(". ");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-6xl mx-auto py-8 px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-slate-600">
              Loading communication tools...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-6xl mx-auto py-8 px-4">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-medium text-slate-800 mb-2">
            Communication Aids
          </h1>
          <p className="text-slate-600 leading-relaxed">
            Tools to help you express your thoughts, feelings, and needs more
            easily.
          </p>
        </div>

        <Tabs defaultValue="cards" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border-2 border-slate-200">
            <TabsTrigger
              value="cards"
              className="data-[state=active]:bg-blue-100"
            >
              Picture Cards
            </TabsTrigger>
            <TabsTrigger
              value="phrases"
              className="data-[state=active]:bg-green-100"
            >
              Quick Phrases
            </TabsTrigger>
            <TabsTrigger
              value="builder"
              className="data-[state=active]:bg-purple-100"
            >
              Message Builder
            </TabsTrigger>
            <TabsTrigger
              value="tools"
              className="data-[state=active]:bg-orange-100"
            >
              Other Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cards" className="space-y-6">
            {/* Selected Cards Display */}
            {selectedCards.length > 0 && (
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-slate-800">
                    Your Message
                  </CardTitle>
                  <CardDescription>
                    Tap cards below to build your message
                  </CardDescription>
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
                    <Button
                      onClick={clearSelection}
                      variant="outline"
                      disabled={selectedCards.length === 0}
                    >
                      Clear
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Communication Cards by Category */}
            <div className="space-y-8">
              {Object.entries(cardsByCategory).map(
                ([category, categoryCards]) => (
                  <div key={category}>
                    <h3 className="text-xl font-medium text-slate-800 mb-4 capitalize">
                      {category.replace("_", " ")}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {categoryCards.map((card) => (
                        <Button
                          key={card.id}
                          onClick={() => toggleCard(card.id.toString())}
                          variant={
                            selectedCards.includes(card.id.toString())
                              ? "default"
                              : "outline"
                          }
                          className={`h-24 flex flex-col items-center justify-center gap-2 text-center p-2 ${
                            selectedCards.includes(card.id.toString())
                              ? `bg-${card.color}-600 hover:bg-${card.color}-700 text-white`
                              : "bg-white hover:bg-slate-50"
                          }`}
                        >
                          <span className="text-2xl">{card.icon}</span>
                          <span className="text-xs leading-tight">
                            {card.content}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </TabsContent>

          <TabsContent value="phrases" className="space-y-6">
            <Card className="border-2 border-slate-200">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-slate-800">
                  Quick Phrases
                </CardTitle>
                <CardDescription>
                  Common phrases that might be helpful in different situations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {phrases.map((phrase) => (
                    <Card
                      key={phrase.id}
                      className="border border-slate-200 hover:shadow-sm transition-shadow duration-200"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-800 mb-1">
                              {phrase.title}
                            </h4>
                            <p className="text-slate-700 text-sm">
                              {phrase.content}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => speakText(phrase.content)}
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
                <CardTitle className="text-xl font-medium text-slate-800">
                  Custom Message Builder
                </CardTitle>
                <CardDescription>
                  Type your own message and have it spoken aloud
                </CardDescription>
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
                  <Button
                    onClick={() => setCustomMessage("")}
                    variant="outline"
                    disabled={!customMessage.trim()}
                  >
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <h4 className="font-medium text-slate-800 mb-2">
                  Tips for Better Communication
                </h4>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>• Use simple, clear sentences</li>
                  <li>• Take your time - there's no rush</li>
                  <li>• It's okay to ask for clarification</li>
                  <li>
                    • You can show this screen to others if speaking is
                    difficult
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Visual Aids */}
              {visualAids.map((tool) => (
                <Card key={tool.id} className="border-2 border-slate-200">
                  <CardHeader>
                    <div
                      className={`w-12 h-12 bg-${tool.color}-100 rounded-lg flex items-center justify-center mb-3`}
                    >
                      <span className="text-2xl">{tool.icon}</span>
                    </div>
                    <CardTitle className="text-lg font-medium text-slate-800">
                      {tool.title}
                    </CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 mb-3">
                      {tool.content}
                    </p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      View Tool
                    </Button>
                  </CardContent>
                </Card>
              ))}

              {/* Audio Tools */}
              {audioTools.map((tool) => (
                <Card key={tool.id} className="border-2 border-slate-200">
                  <CardHeader>
                    <div
                      className={`w-12 h-12 bg-${tool.color}-100 rounded-lg flex items-center justify-center mb-3`}
                    >
                      <Volume2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg font-medium text-slate-800">
                      {tool.title}
                    </CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 mb-3">
                      {tool.content}
                    </p>
                    {tool.audio_url && (
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700 flex items-center gap-2"
                        onClick={() => speakText(tool.content)}
                      >
                        <Volume2 className="h-4 w-4" />
                        Play Audio
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}

              {/* Static Tools */}
              <Card className="border-2 border-slate-200">
                <CardHeader>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                    <Download className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg font-medium text-slate-800">
                    Printable Cards
                  </CardTitle>
                  <CardDescription>
                    Download and print communication cards to use offline
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    Download PDF
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-slate-200">
                <CardHeader>
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-3">
                    <Share className="h-6 w-6 text-teal-600" />
                  </div>
                  <CardTitle className="text-lg font-medium text-slate-800">
                    Share with Others
                  </CardTitle>
                  <CardDescription>
                    Send your communication preferences to family or caregivers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-teal-600 hover:bg-teal-700">
                    Share Settings
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-slate-200">
                <CardHeader>
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
                    <Type className="h-6 w-6 text-indigo-600" />
                  </div>
                  <CardTitle className="text-lg font-medium text-slate-800">
                    Text-to-Speech Settings
                  </CardTitle>
                  <CardDescription>
                    Adjust voice speed, pitch, and language preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                    Voice Settings
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-slate-200">
                <CardHeader>
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-3">
                    <ImageIcon className="h-6 w-6 text-pink-600" />
                  </div>
                  <CardTitle className="text-lg font-medium text-slate-800">
                    Custom Cards
                  </CardTitle>
                  <CardDescription>
                    Create your own communication cards with personal photos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-pink-600 hover:bg-pink-700">
                    Create Cards
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
