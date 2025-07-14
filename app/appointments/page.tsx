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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  ArrowLeft,
  Clock,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Navigation from "@/components/navigation";
import Link from "next/link";

interface Provider {
  id: string | number;
  name: string;
  specialty: string;
  location?: string;
  rating?: string | number;
  experience?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  bio?: string;
  education?: string;
  is_accepting_patients?: boolean;
}

export default function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<string | number>("");
  const [appointmentType, setAppointmentType] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch doctors and appointments from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch doctors
        const doctorsResponse = await fetch("/api/doctors");
        if (doctorsResponse.ok) {
          const doctorsData = await doctorsResponse.json();
          setProviders(doctorsData.doctors || []);
        } else {
          console.error("Failed to fetch doctors");
          setProviders([]);
        }

        // Fetch user's appointments
        const appointmentsResponse = await fetch("/api/appointments");
        if (appointmentsResponse.ok) {
          const appointmentsData = await appointmentsResponse.json();
          setUpcomingAppointments(appointmentsData.appointments || []);
        } else {
          console.error("Failed to fetch appointments");
          setUpcomingAppointments([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setProviders([]);
        setUpcomingAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const appointmentTypes = [
    { value: "initial", label: "Initial Consultation", duration: "60 min" },
    { value: "followup", label: "Follow-up Visit", duration: "30 min" },
    { value: "therapy", label: "Therapy Session", duration: "45 min" },
    { value: "assessment", label: "Assessment", duration: "90 min" },
    { value: "telehealth", label: "Telehealth Visit", duration: "30 min" },
  ];

  const availableTimes = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
  ];

  const handleBookAppointment = async () => {
    setIsBooking(true);
    try {
      // Combine date and time into a single ISO string
      const appointmentDateTime = new Date(
        `${selectedDate}T${convertTo24Hour(selectedTime)}`
      ).toISOString();

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider_id: selectedProvider,
          appointment_date: appointmentDateTime,
          appointment_type: appointmentType,
          duration: getAppointmentDuration(appointmentType),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to book appointment");
      }

      setShowConfirmation(true);
      // Refresh appointments
      const appointmentsResponse = await fetch("/api/appointments");
      if (appointmentsResponse.ok) {
        const appointmentsData = await appointmentsResponse.json();
        setUpcomingAppointments(appointmentsData.appointments || []);
      }
    } catch (error: any) {
      alert(error.message || "Failed to book appointment");
    } finally {
      setIsBooking(false);
    }
  };

  // Helper to convert 12-hour time to 24-hour format for ISO string
  function convertTo24Hour(time12h: string) {
    if (!time12h) return "00:00";
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");
    if (hours === "12") hours = "00";
    if (modifier === "PM") hours = String(parseInt(hours, 10) + 12);
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
  }

  // Helper to get duration from appointment type
  function getAppointmentDuration(type: string) {
    switch (type) {
      case "initial":
        return 60;
      case "followup":
        return 30;
      case "therapy":
        return 45;
      case "assessment":
        return 90;
      case "telehealth":
        return 30;
      default:
        return 60;
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-6xl mx-auto py-8 px-4">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-slate-600">Loading providers...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-2xl mx-auto py-8 px-4">
          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-medium text-slate-800">
                Appointment Booked!
              </CardTitle>
              <CardDescription className="text-slate-600">
                Your appointment has been successfully scheduled
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-white p-4 rounded-lg border border-green-200 space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Provider:</span>
                  <span className="font-medium text-slate-800">
                    {
                      providers.find(
                        (p) => p.id.toString() === selectedProvider
                      )?.name
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Date:</span>
                  <span className="font-medium text-slate-800">
                    {selectedDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Time:</span>
                  <span className="font-medium text-slate-800">
                    {selectedTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Type:</span>
                  <span className="font-medium text-slate-800">
                    {
                      appointmentTypes.find((t) => t.value === appointmentType)
                        ?.label
                    }
                  </span>
                </div>
              </div>

              <div className="text-center space-y-3">
                <p className="text-sm text-slate-600">
                  A confirmation email has been sent to you with all the
                  details.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => setShowConfirmation(false)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    View All Appointments
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/">Back to Home</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
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
            Schedule Appointments
          </h1>
          <p className="text-slate-600 leading-relaxed">
            Book appointments with healthcare providers and support specialists
            who understand autism.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2 border-slate-200">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-slate-800">
                  Book New Appointment
                </CardTitle>
                <CardDescription>
                  Fill out the form below to schedule your appointment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Provider Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-medium text-slate-700">
                    Choose Provider
                  </Label>
                  <div className="space-y-3">
                    {providers.map((provider) => (
                      <Card
                        key={provider.id}
                        className={`border-2 cursor-pointer transition-colors duration-200 ${
                          selectedProvider === provider.id
                            ? "border-blue-300 bg-blue-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                        onClick={() =>
                          setSelectedProvider(provider.id.toString())
                        }
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <h3 className="font-medium text-slate-800">
                                {provider.name}
                              </h3>
                              <p className="text-sm text-slate-600">
                                {provider.specialty}
                              </p>
                              <p className="text-sm text-slate-500 flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {provider.address ||
                                  provider.location ||
                                  "Location not specified"}
                              </p>
                              <p className="text-xs text-slate-500">
                                {provider.bio ||
                                  provider.description ||
                                  "No description available"}
                              </p>
                            </div>
                            <div className="text-right space-y-1">
                              {provider.rating && (
                                <Badge variant="secondary" className="text-xs">
                                  ⭐ {provider.rating}
                                </Badge>
                              )}
                              {provider.experience && (
                                <p className="text-xs text-slate-500">
                                  {provider.experience}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Appointment Type */}
                <div className="space-y-3">
                  <Label className="text-base font-medium text-slate-700">
                    Appointment Type
                  </Label>
                  <Select
                    value={appointmentType}
                    onValueChange={setAppointmentType}
                  >
                    <SelectTrigger className="border-2 border-slate-200 focus:border-blue-300">
                      <SelectValue placeholder="Select appointment type" />
                    </SelectTrigger>
                    <SelectContent>
                      {appointmentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex justify-between items-center w-full">
                            <span>{type.label}</span>
                            <span className="text-slate-500 ml-4">
                              ({type.duration})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-medium text-slate-700">
                    Preferred Date
                  </Label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border-2 border-slate-200 focus:border-blue-300"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                {/* Time Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-medium text-slate-700">
                    Preferred Time
                  </Label>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                    {availableTimes.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                        className={
                          selectedTime === time
                            ? "bg-blue-600 hover:bg-blue-700"
                            : ""
                        }
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-base font-medium text-slate-700">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        className="border-2 border-slate-200 focus:border-blue-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        className="border-2 border-slate-200 focus:border-blue-300"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      className="border-2 border-slate-200 focus:border-blue-300"
                    />
                  </div>
                </div>

                {/* Special Requests */}
                <div className="space-y-3">
                  <Label
                    htmlFor="notes"
                    className="text-base font-medium text-slate-700"
                  >
                    Special Requests or Notes (Optional)
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Any specific needs, accommodations, or information you'd like to share..."
                    className="border-2 border-slate-200 focus:border-blue-300"
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleBookAppointment}
                  disabled={
                    !selectedProvider ||
                    !appointmentType ||
                    !selectedDate ||
                    !selectedTime ||
                    isBooking
                  }
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isBooking ? "Booking..." : "Book Appointment"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Appointments */}
            <Card className="border-2 border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-slate-800 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingAppointments.length === 0 ? (
                  <div className="text-center py-4 text-slate-500">
                    No upcoming appointments.
                  </div>
                ) : (
                  upcomingAppointments.map((appointment) => {
                    const dateObj = appointment.appointment_date
                      ? new Date(appointment.appointment_date)
                      : null;
                    const dateStr = dateObj ? dateObj.toLocaleDateString() : "";
                    const timeStr = dateObj
                      ? dateObj.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "";
                    return (
                      <div
                        key={appointment.id}
                        className="p-3 bg-slate-50 rounded-lg space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-slate-800 text-sm">
                            {appointment.provider_name || "Provider"}
                          </h4>
                          <Badge
                            variant={
                              appointment.status === "confirmed"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {appointment.status}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-xs text-slate-600">
                          <p className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {dateStr}
                          </p>
                          <p className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {timeStr}
                          </p>
                          <p className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {appointment.provider_address ||
                              "Location not specified"}
                          </p>
                          <p className="flex items-center gap-1">
                            <span>Type:</span>
                            <span>{appointment.appointment_type}</span>
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <Button
                  asChild
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  <Link href="/appointments/manage">Manage Appointments</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Help & Support */}
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-slate-800 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-slate-600 leading-relaxed">
                  If you need assistance booking an appointment or have
                  questions about providers, we're here to help.
                </p>
                <div className="space-y-2">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent"
                  >
                    <Link href="/help" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Call Support
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent"
                  >
                    <Link href="/help" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Support
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Appointment Tips */}
            <Card className="border-2 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-slate-800">
                  Appointment Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Arrive 10-15 minutes early</li>
                  <li>• Bring a list of questions or concerns</li>
                  <li>• Consider bringing a support person</li>
                  <li>• Let us know about any sensory needs</li>
                  <li>• It's okay to ask for breaks during appointments</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
