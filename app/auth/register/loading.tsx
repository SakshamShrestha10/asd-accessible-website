import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Heart } from "lucide-react"

export default function RegisterLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-800">Support Space</span>
          </div>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1">
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
          </CardHeader>

          <CardContent className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
