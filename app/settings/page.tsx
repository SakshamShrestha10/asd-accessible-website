"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Palette, Volume2, Eye, Moon, Sun, Save, RotateCcw } from "lucide-react"
import Navigation from "@/components/navigation"

export default function SettingsPage() {
  const [fontSize, setFontSize] = useState([16])
  const [contrast, setContrast] = useState([100])
  const [soundVolume, setSoundVolume] = useState([50])
  const [darkMode, setDarkMode] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [autoSave, setAutoSave] = useState(true)
  const [colorTheme, setColorTheme] = useState("default")
  const [fontFamily, setFontFamily] = useState("arial")

  const handleSaveSettings = () => {
    // In a real app, this would save to localStorage or a database
    alert("Settings saved successfully!")
  }

  const handleResetSettings = () => {
    setFontSize([16])
    setContrast([100])
    setSoundVolume([50])
    setDarkMode(false)
    setReducedMotion(false)
    setAutoSave(true)
    setColorTheme("default")
    setFontFamily("arial")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-slate-800 mb-2">Personalization Settings</h1>
          <p className="text-slate-600 leading-relaxed">
            Adjust these settings to make the website work better for you. Your preferences will be saved automatically.
          </p>
        </div>

        <div className="space-y-6">
          {/* Visual Settings */}
          <Card className="border-2 border-slate-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Eye className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-medium text-slate-800">Visual Settings</CardTitle>
                  <CardDescription>Adjust how text and colors appear on the screen</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Font Size */}
              <div className="space-y-3">
                <Label className="text-base font-medium text-slate-700">Text Size: {fontSize[0]}px</Label>
                <Slider
                  value={fontSize}
                  onValueChange={setFontSize}
                  max={24}
                  min={12}
                  step={1}
                  className="w-full"
                  aria-label="Adjust text size"
                />
                <p className="text-sm text-slate-500">Make text larger or smaller to match your preference</p>
              </div>

              <Separator />

              {/* Font Family */}
              <div className="space-y-3">
                <Label className="text-base font-medium text-slate-700">Font Style</Label>
                <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="arial">Arial (recommended)</SelectItem>
                    <SelectItem value="verdana">Verdana</SelectItem>
                    <SelectItem value="helvetica">Helvetica</SelectItem>
                    <SelectItem value="opensans">Open Sans</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-slate-500">Choose a font that's easy for you to read</p>
              </div>

              <Separator />

              {/* Contrast */}
              <div className="space-y-3">
                <Label className="text-base font-medium text-slate-700">Contrast Level: {contrast[0]}%</Label>
                <Slider
                  value={contrast}
                  onValueChange={setContrast}
                  max={150}
                  min={75}
                  step={5}
                  className="w-full"
                  aria-label="Adjust contrast level"
                />
                <p className="text-sm text-slate-500">Higher contrast makes text stand out more from the background</p>
              </div>
            </CardContent>
          </Card>

          {/* Color and Theme Settings */}
          <Card className="border-2 border-slate-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Palette className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-medium text-slate-800">Colors and Theme</CardTitle>
                  <CardDescription>Choose colors that feel comfortable for you</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Dark Mode */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium text-slate-700">Dark Mode</Label>
                  <p className="text-sm text-slate-500">Use dark backgrounds with light text</p>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-slate-400" />
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} aria-label="Toggle dark mode" />
                  <Moon className="h-4 w-4 text-slate-400" />
                </div>
              </div>

              <Separator />

              {/* Color Theme */}
              <div className="space-y-3">
                <Label className="text-base font-medium text-slate-700">Color Theme</Label>
                <Select value={colorTheme} onValueChange={setColorTheme}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default (Soft Blues)</SelectItem>
                    <SelectItem value="warm">Warm (Soft Oranges)</SelectItem>
                    <SelectItem value="cool">Cool (Soft Greens)</SelectItem>
                    <SelectItem value="neutral">Neutral (Grays)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-slate-500">Choose colors that feel calming to you</p>
              </div>
            </CardContent>
          </Card>

          {/* Motion and Sound Settings */}
          <Card className="border-2 border-slate-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Volume2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-medium text-slate-800">Motion and Sound</CardTitle>
                  <CardDescription>Control movement and audio on the website</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Reduced Motion */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium text-slate-700">Reduce Motion</Label>
                  <p className="text-sm text-slate-500">Turn off animations and moving elements</p>
                </div>
                <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} aria-label="Toggle reduced motion" />
              </div>

              <Separator />

              {/* Sound Volume */}
              <div className="space-y-3">
                <Label className="text-base font-medium text-slate-700">Sound Volume: {soundVolume[0]}%</Label>
                <Slider
                  value={soundVolume}
                  onValueChange={setSoundVolume}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                  aria-label="Adjust sound volume"
                />
                <p className="text-sm text-slate-500">Control the volume of notification sounds and audio content</p>
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card className="border-2 border-slate-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Save className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-medium text-slate-800">System Settings</CardTitle>
                  <CardDescription>How the website saves and handles your information</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Auto Save */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium text-slate-700">Auto-Save Settings</Label>
                  <p className="text-sm text-slate-500">Automatically save your preferences as you change them</p>
                </div>
                <Switch checked={autoSave} onCheckedChange={setAutoSave} aria-label="Toggle auto-save" />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button
              onClick={handleSaveSettings}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="h-4 w-4" />
              Save All Settings
            </Button>
            <Button onClick={handleResetSettings} variant="outline" className="flex items-center gap-2 bg-transparent">
              <RotateCcw className="h-4 w-4" />
              Reset to Defaults
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
