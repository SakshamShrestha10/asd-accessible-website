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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  ArrowLeft,
  Search,
  Brain,
  Waves,
  Timer,
  Palette,
  Volume2,
  Moon,
  Star,
  Play,
  Pause,
  Loader2,
} from "lucide-react";
import Navigation from "@/components/navigation";
import Link from "next/link";

interface CopingStrategy {
  id: number;
  title: string;
  description: string;
  category: string;
  duration: string;
  difficulty: string;
  icon: string;
  color: string;
  steps: string[];
  benefits: string[];
  is_active: boolean;
  sort_order: number;
}

export default function CopingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeAudio, setActiveAudio] = useState<string | null>(null);
  const [copingStrategies, setCopingStrategies] = useState<CopingStrategy[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch data from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/admin/coping-strategies");
        if (!res.ok) throw new Error("Failed to fetch coping strategies");
        const data = await res.json();
        setCopingStrategies(data.copingStrategies || []);
      } catch (e: any) {
        setError(e.message || "Error loading coping strategies");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter active strategies
  const activeStrategies = copingStrategies.filter(
    (strategy) => strategy.is_active
  );

  // Filter by search term
  const filteredStrategies = activeStrategies.filter(
    (strategy) =>
      strategy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      strategy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      strategy.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group strategies by category
  const immediateStrategies = filteredStrategies.filter(
    (strategy) => strategy.category === "immediate"
  );
  const dailyStrategies = filteredStrategies.filter(
    (strategy) => strategy.category === "daily"
  );
  const audioStrategies = filteredStrategies.filter(
    (strategy) => strategy.category === "audio"
  );

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const toggleAudio = (id: string) => {
    setActiveAudio(activeAudio === id ? null : id);
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600",
      purple: "bg-purple-100 text-purple-600",
      orange: "bg-orange-100 text-orange-600",
      teal: "bg-teal-100 text-teal-600",
      indigo: "bg-indigo-100 text-indigo-600",
      red: "bg-red-100 text-red-600",
      pink: "bg-pink-100 text-pink-600",
      yellow: "bg-yellow-100 text-yellow-600",
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, any> = {
      Heart,
      Brain,
      Waves,
      Timer,
      Palette,
      Volume2,
      Moon,
      Star,
      Play,
      Pause,
    };
    return iconMap[iconName] || Heart;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-6xl mx-auto py-8 px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-slate-600">
              Loading coping strategies...
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
            Coping Strategies
          </h1>
          <p className="text-slate-600 leading-relaxed">
            Practical tools and techniques to help you manage stress and feel
            more comfortable throughout your day.
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
            <TabsTrigger
              value="immediate"
              className="data-[state=active]:bg-blue-100"
            >
              Quick Relief ({immediateStrategies.length})
            </TabsTrigger>
            <TabsTrigger
              value="daily"
              className="data-[state=active]:bg-green-100"
            >
              Daily Tools ({dailyStrategies.length})
            </TabsTrigger>
            <TabsTrigger
              value="audio"
              className="data-[state=active]:bg-purple-100"
            >
              Audio Support ({audioStrategies.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="immediate" className="space-y-6">
            {immediateStrategies.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500">
                  No immediate relief strategies found matching your search.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {immediateStrategies.map((strategy) => {
                  const Icon = getIconComponent(strategy.icon);
                  return (
                    <Card
                      key={strategy.id}
                      className="border-2 border-slate-200 hover:shadow-md transition-shadow duration-200"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(
                              strategy.color
                            )}`}
                          >
                            <Icon className="h-6 w-6" />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              toggleFavorite(strategy.id.toString())
                            }
                            className="p-1"
                          >
                            <Star
                              className={`h-4 w-4 ${
                                favorites.includes(strategy.id.toString())
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-slate-400"
                              }`}
                            />
                          </Button>
                        </div>
                        <CardTitle className="text-lg font-medium text-slate-800">
                          {strategy.title}
                        </CardTitle>
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

                        {strategy.steps && strategy.steps.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-slate-800 text-sm">
                              Steps:
                            </h4>
                            <ol className="space-y-1 text-sm text-slate-600">
                              {strategy.steps.map((step, index) => (
                                <li key={index} className="flex gap-2">
                                  <span className="text-slate-400">
                                    {index + 1}.
                                  </span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}

                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                          Try This Now
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="daily" className="space-y-6">
            {dailyStrategies.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500">
                  No daily tools found matching your search.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dailyStrategies.map((strategy) => {
                  const Icon = getIconComponent(strategy.icon);
                  return (
                    <Card
                      key={strategy.id}
                      className="border-2 border-slate-200 hover:shadow-md transition-shadow duration-200"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(
                              strategy.color
                            )}`}
                          >
                            <Icon className="h-6 w-6" />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              toggleFavorite(strategy.id.toString())
                            }
                            className="p-1"
                          >
                            <Star
                              className={`h-4 w-4 ${
                                favorites.includes(strategy.id.toString())
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-slate-400"
                              }`}
                            />
                          </Button>
                        </div>
                        <CardTitle className="text-lg font-medium text-slate-800">
                          {strategy.title}
                        </CardTitle>
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

                        {strategy.benefits && strategy.benefits.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-slate-800 text-sm">
                              Benefits:
                            </h4>
                            <ul className="space-y-1 text-sm text-slate-600">
                              {strategy.benefits.map((benefit, index) => (
                                <li key={index} className="flex gap-2">
                                  <span className="text-green-500">•</span>
                                  <span>{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          Learn More
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="audio" className="space-y-6">
            {audioStrategies.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500">
                  No audio support found matching your search.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {audioStrategies.map((audio) => {
                  const Icon = getIconComponent(audio.icon);
                  const isPlaying = activeAudio === audio.id.toString();
                  return (
                    <Card
                      key={audio.id}
                      className="border-2 border-slate-200 hover:shadow-md transition-shadow duration-200"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(
                              audio.color
                            )}`}
                          >
                            <Icon className="h-6 w-6" />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFavorite(audio.id.toString())}
                            className="p-1"
                          >
                            <Star
                              className={`h-4 w-4 ${
                                favorites.includes(audio.id.toString())
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-slate-400"
                              }`}
                            />
                          </Button>
                        </div>
                        <CardTitle className="text-lg font-medium text-slate-800">
                          {audio.title}
                        </CardTitle>
                        <CardDescription className="text-slate-600 leading-relaxed">
                          {audio.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {audio.duration}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {audio.difficulty}
                          </Badge>
                        </div>

                        <Button
                          onClick={() => toggleAudio(audio.id.toString())}
                          className={`w-full flex items-center gap-2 ${
                            isPlaying
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-purple-600 hover:bg-purple-700"
                          }`}
                        >
                          {isPlaying ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                          {isPlaying ? "Stop" : "Play"}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
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
              <CardDescription>
                Quick access to the coping strategies you've saved
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {favorites.map((favoriteId) => {
                  const strategy = copingStrategies.find(
                    (s) => s.id.toString() === favoriteId
                  );
                  return (
                    <Badge
                      key={favoriteId}
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-800"
                    >
                      {strategy?.title || favoriteId}
                    </Badge>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
