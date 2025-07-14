"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, ArrowLeft, Home } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Access Denied</h1>
          <p className="mt-2 text-slate-600">You don't have permission to access this page</p>
        </div>

        {/* Error Card */}
        <Card className="border-2 border-red-200">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-medium text-red-800">Administrator Access Required</CardTitle>
            <CardDescription>
              This page is restricted to administrators only. If you believe you should have access, please contact
              support.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-3">
              <Button asChild variant="default" className="w-full">
                <Link href="/" className="flex items-center justify-center space-x-2">
                  <Home className="h-4 w-4" />
                  <span>Go to Home</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/auth/login" className="flex items-center justify-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Sign In with Different Account</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-sm text-slate-500">
            Need help? Contact support at{" "}
            <a href="mailto:support@supportspace.org" className="text-blue-600 hover:text-blue-500">
              support@supportspace.org
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
