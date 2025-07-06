import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Heart,
  MessageCircle,
  Calendar,
  Users,
  BookOpen,
  Settings,
  HelpCircle,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/navigation"
import ToolsGrid from "@/components/tools-grid"
import ContentCards from "@/components/content-cards"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      {/* Hero Section - Calm and Welcoming */}
      <section className="bg-gradient-to-b from-blue-50 to-slate-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-medium text-slate-800 leading-relaxed">
              Welcome to Your Support Space
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              A calm, safe place to find tools, resources, and support. Everything is designed to be clear and easy to
              use.
            </p>
          </div>

          {/* Search Bar - Prominent and Clear */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                type="search"
                placeholder="Search for tools or information..."
                className="pl-10 py-3 text-base border-2 border-slate-200 focus:border-blue-300 rounded-lg"
                aria-label="Search for tools or information"
              />
            </div>
          </div>

          {/* Quick Access Badges */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            <Badge variant="secondary" className="text-sm py-1 px-3">
              New Here?
            </Badge>
            <Badge variant="secondary" className="text-sm py-1 px-3">
              Getting Started Guide
            </Badge>
            <Badge variant="secondary" className="text-sm py-1 px-3">
              Emergency Support
            </Badge>
          </div>
        </div>
      </section>

      {/* Main User Flows - Icon-Based Menu */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-medium text-slate-800 text-center mb-8">What would you like to do today?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Self-Assessment Tools */}
            <Card className="border-2 border-slate-200 hover:border-blue-300 transition-colors duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg font-medium text-slate-800">Self-Assessment Tools</CardTitle>
                <CardDescription className="text-slate-600 leading-relaxed">
                  Simple questionnaires to help you understand your needs and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href="/assessment">Start Assessment</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Coping Strategies */}
            <Card className="border-2 border-slate-200 hover:border-green-300 transition-colors duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-lg font-medium text-slate-800">Coping Strategies</CardTitle>
                <CardDescription className="text-slate-600 leading-relaxed">
                  Practical techniques and tools to help manage daily challenges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <Link href="/coping">View Strategies</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Communication Aids */}
            <Card className="border-2 border-slate-200 hover:border-purple-300 transition-colors duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-lg font-medium text-slate-800">Communication Aids</CardTitle>
                <CardDescription className="text-slate-600 leading-relaxed">
                  Tools to help express thoughts, feelings, and needs more easily
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  <Link href="/communication">Explore Tools</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Appointment Scheduling */}
            <Card className="border-2 border-slate-200 hover:border-orange-300 transition-colors duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-lg font-medium text-slate-800">Schedule Appointments</CardTitle>
                <CardDescription className="text-slate-600 leading-relaxed">
                  Book appointments with healthcare providers and support specialists
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                  <Link href="/appointments">Book Appointment</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Community Resources */}
            <Card className="border-2 border-slate-200 hover:border-teal-300 transition-colors duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-teal-600" />
                </div>
                <CardTitle className="text-lg font-medium text-slate-800">Community Resources</CardTitle>
                <CardDescription className="text-slate-600 leading-relaxed">
                  Connect with local support groups, services, and community programs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                  <Link href="/community">Find Resources</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Learning Center */}
            <Card className="border-2 border-slate-200 hover:border-indigo-300 transition-colors duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-indigo-600" />
                </div>
                <CardTitle className="text-lg font-medium text-slate-800">Learning Center</CardTitle>
                <CardDescription className="text-slate-600 leading-relaxed">
                  Educational resources, guides, and information about autism
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                  <Link href="/learning">Start Learning</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tools Dashboard Preview */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-medium text-slate-800 mb-4">Quick Access Tools</h2>
            <p className="text-slate-600 leading-relaxed">Helpful tools you can use right now</p>
          </div>
          <ToolsGrid />
        </div>
      </section>

      {/* Content Cards - Multiple Formats */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-medium text-slate-800 mb-4">Learn in Your Preferred Way</h2>
            <p className="text-slate-600 leading-relaxed">Choose from text, audio, or video content</p>
          </div>
          <ContentCards />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-100 py-8 px-4 mt-12">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="flex justify-center space-x-6">
            <Link href="/help" className="text-slate-600 hover:text-slate-800 flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Help & Support
            </Link>
            <Link href="/settings" className="text-slate-600 hover:text-slate-800 flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </div>
          <p className="text-sm text-slate-500">
            This website is designed to be calm, clear, and accessible for everyone.
          </p>
        </div>
      </footer>
    </div>
  )
}
