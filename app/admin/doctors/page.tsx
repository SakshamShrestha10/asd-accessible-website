"use client"

import { requireAdmin } from "@/lib/auth"
import {
  getHealthcareProviders,
  createProvider,
  updateProvider,
  deleteProvider,
  getAppointments,
  getProviderStats,
  getAppointmentStats,
} from "@/lib/data/providers"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  UserPlus,
  Edit,
  Trash2,
  Eye,
  Save,
  Search,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Star,
  Users,
  Award,
} from "lucide-react"

export default async function AdminDoctorsPage() {
  await requireAdmin()

  const providers = await getHealthcareProviders()
  const appointments = await getAppointments()
  const providerStats = await getProviderStats()
  const appointmentStats = await getAppointmentStats()

  const [doctors, setDoctors] = useState(providers)

  const [isCreateDoctorOpen, setIsCreateDoctorOpen] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterSpecialty, setFilterSpecialty] = useState("all")

  const [newDoctor, setNewDoctor] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "",
    location: "",
    address: "",
    experience: "",
    bio: "",
    availability: "",
    languages: "",
    insurance: "",
    education: "",
    certifications: "",
    status: "active",
  })

  const specialties = [
    "Autism Specialist",
    "Behavioral Therapist",
    "Occupational Therapist",
    "Speech Therapist",
    "Psychiatrist",
    "Psychologist",
    "Social Worker",
  ]

  const handleCreateDoctor = async () => {
    const doctor = {
      id: Date.now().toString(),
      ...newDoctor,
      rating: 0,
      totalAppointments: 0,
      upcomingAppointments: 0,
      languages: newDoctor.languages.split(",").map((l) => l.trim()),
      insurance: newDoctor.insurance.split(",").map((i) => i.trim()),
      certifications: newDoctor.certifications.split(",").map((c) => c.trim()),
    }
    await createProvider(doctor)
    setDoctors([...doctors, doctor])
    setNewDoctor({
      name: "",
      email: "",
      phone: "",
      specialty: "",
      location: "",
      address: "",
      experience: "",
      bio: "",
      availability: "",
      languages: "",
      insurance: "",
      education: "",
      certifications: "",
      status: "active",
    })
    setIsCreateDoctorOpen(false)
  }

  const handleUpdateDoctor = async (id: string, updates: any) => {
    await updateProvider(id, updates)
    setDoctors(doctors.map((doctor) => (doctor.id === id ? { ...doctor, ...updates } : doctor)))
  }

  const handleDeleteDoctor = async (id: string) => {
    await deleteProvider(id)
    setDoctors(doctors.filter((doctor) => doctor.id !== id))
  }

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || doctor.status === filterStatus
    const matchesSpecialty = filterSpecialty === "all" || doctor.specialty === filterSpecialty
    return matchesSearch && matchesStatus && matchesSpecialty
  })

  const todaysAppointments = appointments.filter((apt) => apt.date === new Date().toISOString().split("T")[0])

  const analytics = {
    totalDoctors: doctors.length,
    activeDoctors: doctors.filter((d) => d.status === "active").length,
    totalAppointments: appointments.length,
    todaysAppointments: todaysAppointments.length,
    averageRating: doctors.reduce((sum, d) => sum + d.rating, 0) / doctors.length,
    totalPatients: 1247,
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Header */}
      <div className="bg-white border-b-2 border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-medium text-slate-800">Doctor & Appointment Management</h1>
              <p className="text-sm text-slate-600">Manage healthcare providers and appointment scheduling</p>
            </div>
            <Dialog open={isCreateDoctorOpen} onOpenChange={setIsCreateDoctorOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add New Doctor
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Healthcare Provider</DialogTitle>
                  <DialogDescription>Add a new doctor or healthcare provider to the system</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={newDoctor.name}
                        onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                        placeholder="Dr. John Smith"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialty">Specialty</Label>
                      <Select
                        value={newDoctor.specialty}
                        onValueChange={(value) => setNewDoctor({ ...newDoctor, specialty: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select specialty" />
                        </SelectTrigger>
                        <SelectContent>
                          {specialties.map((specialty) => (
                            <SelectItem key={specialty} value={specialty}>
                              {specialty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newDoctor.email}
                        onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                        placeholder="doctor@clinic.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={newDoctor.phone}
                        onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location/Clinic</Label>
                      <Input
                        id="location"
                        value={newDoctor.location}
                        onChange={(e) => setNewDoctor({ ...newDoctor, location: e.target.value })}
                        placeholder="Downtown Medical Center"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience</Label>
                      <Input
                        id="experience"
                        value={newDoctor.experience}
                        onChange={(e) => setNewDoctor({ ...newDoctor, experience: e.target.value })}
                        placeholder="10+ years"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={newDoctor.address}
                      onChange={(e) => setNewDoctor({ ...newDoctor, address: e.target.value })}
                      placeholder="123 Main St, City, State"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio/Description</Label>
                    <Textarea
                      id="bio"
                      value={newDoctor.bio}
                      onChange={(e) => setNewDoctor({ ...newDoctor, bio: e.target.value })}
                      placeholder="Brief description of expertise and approach"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="availability">Availability</Label>
                      <Input
                        id="availability"
                        value={newDoctor.availability}
                        onChange={(e) => setNewDoctor({ ...newDoctor, availability: e.target.value })}
                        placeholder="Mon-Fri 9AM-5PM"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="education">Education</Label>
                      <Input
                        id="education"
                        value={newDoctor.education}
                        onChange={(e) => setNewDoctor({ ...newDoctor, education: e.target.value })}
                        placeholder="MD from University"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="languages">Languages (comma-separated)</Label>
                      <Input
                        id="languages"
                        value={newDoctor.languages}
                        onChange={(e) => setNewDoctor({ ...newDoctor, languages: e.target.value })}
                        placeholder="English, Spanish, French"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="insurance">Insurance Accepted (comma-separated)</Label>
                      <Input
                        id="insurance"
                        value={newDoctor.insurance}
                        onChange={(e) => setNewDoctor({ ...newDoctor, insurance: e.target.value })}
                        placeholder="Blue Cross, Aetna, Medicare"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="certifications">Certifications (comma-separated)</Label>
                    <Input
                      id="certifications"
                      value={newDoctor.certifications}
                      onChange={(e) => setNewDoctor({ ...newDoctor, certifications: e.target.value })}
                      placeholder="Board Certified, Autism Specialist"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsCreateDoctorOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateDoctor} className="bg-blue-600 hover:bg-blue-700">
                      <Save className="h-4 w-4 mr-2" />
                      Add Doctor
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-slate-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600">Total Doctors</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{analytics.totalDoctors}</div>
              <p className="text-xs text-green-600 mt-1">{analytics.activeDoctors} active</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-slate-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600">Today's Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{analytics.todaysAppointments}</div>
              <p className="text-xs text-blue-600 mt-1">{analytics.totalAppointments} total scheduled</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-slate-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600">Average Rating</CardTitle>
                <Star className="h-4 w-4 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{analytics.averageRating.toFixed(1)}</div>
              <p className="text-xs text-yellow-600 mt-1">Out of 5.0 stars</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-slate-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600">Total Patients</CardTitle>
                <Award className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{analytics.totalPatients.toLocaleString()}</div>
              <p className="text-xs text-purple-600 mt-1">Registered users</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="doctors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white border-2 border-slate-200">
            <TabsTrigger value="doctors" className="data-[state=active]:bg-blue-100">
              Healthcare Providers
            </TabsTrigger>
            <TabsTrigger value="appointments" className="data-[state=active]:bg-green-100">
              Appointments
            </TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-purple-100">
              Schedule Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="doctors" className="space-y-6">
            {/* Filters */}
            <Card className="border-2 border-slate-200">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      type="search"
                      placeholder="Search doctors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-2 border-slate-200 focus:border-blue-300"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Specialties</SelectItem>
                        {specialties.map((specialty) => (
                          <SelectItem key={specialty} value={specialty}>
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Doctors Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredDoctors.map((doctor) => (
                <Card
                  key={doctor.id}
                  className="border-2 border-slate-200 hover:shadow-md transition-shadow duration-200"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-lg font-medium text-slate-800">{doctor.name}</CardTitle>
                          <Badge variant={doctor.status === "active" ? "default" : "secondary"} className="text-xs">
                            {doctor.status}
                          </Badge>
                        </div>
                        <p className="text-slate-600">{doctor.specialty}</p>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium text-slate-700">{doctor.rating}</span>
                          <span className="text-sm text-slate-500">({doctor.totalAppointments} appointments)</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setEditingDoctor(doctor)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDoctor(doctor.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">{doctor.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">{doctor.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">{doctor.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">{doctor.availability}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-slate-600 leading-relaxed">{doctor.bio}</p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {doctor.languages.map((lang) => (
                        <Badge key={lang} variant="outline" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200">
                      <div>
                        <p className="text-xs text-slate-500">Experience</p>
                        <p className="text-sm font-medium text-slate-700">{doctor.experience}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Upcoming</p>
                        <p className="text-sm font-medium text-slate-700">{doctor.upcomingAppointments} appointments</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium text-slate-800">Appointment Management</h2>
              <Button className="bg-green-600 hover:bg-green-700">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Appointment
              </Button>
            </div>

            <Card className="border-2 border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-slate-800">Recent Appointments</CardTitle>
                <CardDescription>Manage and monitor appointment bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.map((appointment) => {
                    const doctor = doctors.find((d) => d.id === appointment.doctorId)
                    return (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium text-slate-800">{appointment.patientName}</h3>
                            <Badge
                              variant={
                                appointment.status === "confirmed"
                                  ? "default"
                                  : appointment.status === "pending"
                                    ? "secondary"
                                    : "outline"
                              }
                              className="text-xs"
                            >
                              {appointment.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {appointment.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-6 text-sm text-slate-600">
                            <span>Doctor: {doctor?.name}</span>
                            <span>Date: {appointment.date}</span>
                            <span>Time: {appointment.time}</span>
                            <span>Duration: {appointment.duration}</span>
                          </div>
                          <p className="text-sm text-slate-500">{appointment.notes}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <h2 className="text-xl font-medium text-slate-800">Schedule Management</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-2 border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-slate-800">Availability Settings</CardTitle>
                  <CardDescription>Manage doctor availability and time slots</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {doctors.slice(0, 3).map((doctor) => (
                      <div key={doctor.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-800">{doctor.name}</p>
                          <p className="text-sm text-slate-600">{doctor.availability}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch defaultChecked />
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-slate-800">Appointment Statistics</CardTitle>
                  <CardDescription>Overview of appointment metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Scheduled</span>
                      <span className="font-medium text-slate-800">{appointments.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Confirmed</span>
                      <span className="font-medium text-slate-800">
                        {appointments.filter((a) => a.status === "confirmed").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Pending</span>
                      <span className="font-medium text-slate-800">
                        {appointments.filter((a) => a.status === "pending").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Today's Appointments</span>
                      <span className="font-medium text-slate-800">{todaysAppointments.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
