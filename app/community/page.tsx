"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  ArrowLeft,
  Search,
  MapPin,
  Calendar,
  Clock,
  Phone,
  Globe,
  Heart,
  BookOpen,
  Coffee,
  Gamepad2,
  Music,
  Palette,
  Star,
  ExternalLink,
} from "lucide-react"
import Navigation from "@/components/navigation"
import Link from "next/link"

export default function CommunityPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [favorites, setFavorites] = useState<string[]>([])

  const supportGroups = [
    {
      id: "adults-support",
      name: "Adults with Autism Support Group",
      description: "A safe space for adults on the autism spectrum to share experiences and support each other",
      location: "Downtown Community Center",
      address: "123 Main St, Downtown",
      schedule: "Every Tuesday, 7:00 PM - 8:30 PM",
      contact: "(555) 123-4567",
      website: "www.adultsautismsupport.org",
      type: "Support Group",
      capacity: "12-15 people",
      facilitator: "Licensed Social Worker",
      cost: "Free",
    },
    {
      id: "family-support",
      name: "Families & Caregivers Circle",
      description: "Support and resources for families and caregivers of individuals with autism",
      location: "Westside Family Center",
      address: "456 Oak Ave, Westside",
      schedule: "First Saturday of each month, 10:00 AM - 12:00 PM",
      contact: "(555) 234-5678",
      website: "www.familycaregivers.org",
      type: "Family Support",
      capacity: "20-25 people",
      facilitator: "Parent Advocate",
      cost: "Free",
    },
    {
      id: "young-adults",
      name: "Young Adults Transition Group",
      description: "For young adults (18-25) navigating independence, work, and relationships",
      location: "Youth Services Building",
      address: "789 Pine St, Midtown",
      schedule: "Every Thursday, 6:00 PM - 7:30 PM",
      contact: "(555) 345-6789",
      website: "www.youngadultstransition.org",
      type: "Transition Support",
      capacity: "8-10 people",
      facilitator: "Transition Specialist",
      cost: "Free",
    },
  ]

  const activities = [
    {
      id: "art-therapy",
      name: "Creative Art Therapy",
      description: "Express yourself through various art mediums in a supportive environment",
      location: "Arts & Wellness Center",
      schedule: "Wednesdays, 2:00 PM - 4:00 PM",
      icon: Palette,
      color: "purple",
      cost: "$15 per session",
      ageGroup: "All ages",
    },
    {
      id: "social-skills",
      name: "Social Skills Practice Group",
      description: "Practice conversation and social interaction in a comfortable setting",
      location: "Community Learning Center",
      schedule: "Saturdays, 11:00 AM - 12:30 PM",
      icon: Users,
      color: "blue",
      cost: "Free",
      ageGroup: "Adults",
    },
    {
      id: "game-night",
      name: "Board Game Night",
      description: "Enjoy board games and card games with others who share your interests",
      location: "Public Library - Community Room",
      schedule: "Every other Friday, 7:00 PM - 9:00 PM",
      icon: Gamepad2,
      color: "green",
      cost: "Free",
      ageGroup: "Teens & Adults",
    },
    {
      id: "music-group",
      name: "Music Appreciation Circle",
      description: "Listen to and discuss music, share favorite songs, and explore different genres",
      location: "Music Therapy Center",
      schedule: "Mondays, 4:00 PM - 5:30 PM",
      icon: Music,
      color: "orange",
      cost: "$10 per session",
      ageGroup: "All ages",
    },
    {
      id: "book-club",
      name: "Neurodivergent Book Club",
      description: "Read and discuss books with themes relevant to the autism community",
      location: "Central Library",
      schedule: "Last Sunday of each month, 2:00 PM - 4:00 PM",
      icon: BookOpen,
      color: "indigo",
      cost: "Free",
      ageGroup: "Adults",
    },
    {
      id: "coffee-social",
      name: "Coffee & Conversation",
      description: "Casual meetup for coffee and friendly conversation in a quiet environment",
      location: "Quiet Corner Café",
      schedule: "Sundays, 10:00 AM - 12:00 PM",
      icon: Coffee,
      color: "teal",
      cost: "Cost of your order",
      ageGroup: "Adults",
    },
  ]

  const services = [
    {
      id: "vocational",
      name: "Vocational Rehabilitation Services",
      description: "Job training, placement assistance, and workplace accommodations support",
      contact: "(555) 111-2222",
      website: "www.vocrehab.gov",
      type: "Employment",
      eligibility: "Adults with disabilities",
    },
    {
      id: "transportation",
      name: "Accessible Transportation Program",
      description: "Reduced-fare public transit and specialized transportation services",
      contact: "(555) 333-4444",
      website: "www.accessibletransit.org",
      type: "Transportation",
      eligibility: "Individuals with disabilities",
    },
    {
      id: "housing",
      name: "Independent Living Support",
      description: "Housing assistance, life skills training, and independent living resources",
      contact: "(555) 555-6666",
      website: "www.independentliving.org",
      type: "Housing",
      eligibility: "Adults seeking independence",
    },
    {
      id: "legal",
      name: "Disability Rights Legal Aid",
      description: "Free legal assistance for disability-related issues and advocacy",
      contact: "(555) 777-8888",
      website: "www.disabilitylegal.org",
      type: "Legal",
      eligibility: "Individuals with disabilities",
    },
    {
      id: "healthcare",
      name: "Autism Healthcare Network",
      description: "Directory of autism-informed healthcare providers and specialists",
      contact: "(555) 999-0000",
      website: "www.autismhealthcare.org",
      type: "Healthcare",
      eligibility: "All ages",
    },
  ]

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
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
          <h1 className="text-3xl font-medium text-slate-800 mb-2">Community Resources</h1>
          <p className="text-slate-600 leading-relaxed">
            Connect with local support groups, activities, and services designed for the autism community.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="border-2 border-slate-200 mb-8">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-2 border-slate-200 focus:border-blue-300"
                  aria-label="Search community resources"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedLocation === "all" ? "default" : "outline"}
                  onClick={() => setSelectedLocation("all")}
                  size="sm"
                >
                  All Areas
                </Button>
                <Button
                  variant={selectedLocation === "downtown" ? "default" : "outline"}
                  onClick={() => setSelectedLocation("downtown")}
                  size="sm"
                >
                  Downtown
                </Button>
                <Button
                  variant={selectedLocation === "westside" ? "default" : "outline"}
                  onClick={() => setSelectedLocation("westside")}
                  size="sm"
                >
                  Westside
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="groups" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white border-2 border-slate-200">
            <TabsTrigger value="groups" className="data-[state=active]:bg-blue-100">
              Support Groups
            </TabsTrigger>
            <TabsTrigger value="activities" className="data-[state=active]:bg-green-100">
              Activities
            </TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-purple-100">
              Services
            </TabsTrigger>
          </TabsList>

          <TabsContent value="groups" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {supportGroups.map((group) => (
                <Card
                  key={group.id}
                  className="border-2 border-slate-200 hover:shadow-md transition-shadow duration-200"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-lg font-medium text-slate-800">{group.name}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {group.type}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => toggleFavorite(group.id)} className="p-1">
                        <Star
                          className={`h-4 w-4 ${favorites.includes(group.id) ? "fill-yellow-400 text-yellow-400" : "text-slate-400"}`}
                        />
                      </Button>
                    </div>
                    <CardDescription className="text-slate-600 leading-relaxed">{group.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-slate-700">{group.location}</p>
                          <p className="text-slate-500">{group.address}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">{group.schedule}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">{group.contact}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-slate-400" />
                        <a href={`https://${group.website}`} className="text-blue-600 hover:text-blue-800">
                          {group.website}
                        </a>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200">
                      <div>
                        <p className="text-xs text-slate-500">Capacity</p>
                        <p className="text-sm font-medium text-slate-700">{group.capacity}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Cost</p>
                        <p className="text-sm font-medium text-slate-700">{group.cost}</p>
                      </div>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Get More Information</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map((activity) => {
                const Icon = activity.icon
                return (
                  <Card
                    key={activity.id}
                    className="border-2 border-slate-200 hover:shadow-md transition-shadow duration-200"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(activity.color)}`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => toggleFavorite(activity.id)} className="p-1">
                          <Star
                            className={`h-4 w-4 ${favorites.includes(activity.id) ? "fill-yellow-400 text-yellow-400" : "text-slate-400"}`}
                          />
                        </Button>
                      </div>
                      <CardTitle className="text-lg font-medium text-slate-800">{activity.name}</CardTitle>
                      <CardDescription className="text-slate-600 leading-relaxed">
                        {activity.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-600">{activity.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-600">{activity.schedule}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {activity.ageGroup}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {activity.cost}
                        </Badge>
                      </div>

                      <Button className="w-full bg-green-600 hover:bg-green-700">Join Activity</Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {services.map((service) => (
                <Card
                  key={service.id}
                  className="border-2 border-slate-200 hover:shadow-md transition-shadow duration-200"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-lg font-medium text-slate-800">{service.name}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {service.type}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => toggleFavorite(service.id)} className="p-1">
                        <Star
                          className={`h-4 w-4 ${favorites.includes(service.id) ? "fill-yellow-400 text-yellow-400" : "text-slate-400"}`}
                        />
                      </Button>
                    </div>
                    <CardDescription className="text-slate-600 leading-relaxed">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">{service.contact}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-slate-400" />
                        <a
                          href={`https://${service.website}`}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          {service.website}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">Eligibility</p>
                      <p className="text-sm text-slate-700">{service.eligibility}</p>
                    </div>

                    <Button className="w-full bg-purple-600 hover:bg-purple-700">Learn More</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <Card className="border-2 border-yellow-200 bg-yellow-50 mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Heart className="h-5 w-5 text-red-500" />
                Your Saved Resources
              </CardTitle>
              <CardDescription>Quick access to the community resources you've saved</CardDescription>
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
