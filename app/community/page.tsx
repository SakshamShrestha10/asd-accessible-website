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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Loader2,
} from "lucide-react";
import Navigation from "@/components/navigation";
import Link from "next/link";

interface SupportGroup {
  id: number;
  name: string;
  description: string;
  location: string;
  address: string;
  schedule: string;
  contact: string;
  website: string;
  type: string;
  capacity: string;
  facilitator: string;
  cost: string;
  is_active: boolean;
  sort_order: number;
}

interface Activity {
  id: number;
  name: string;
  description: string;
  location: string;
  schedule: string;
  icon: string;
  color: string;
  cost: string;
  age_group: string;
  is_active: boolean;
  sort_order: number;
}

interface Service {
  id: number;
  name: string;
  description: string;
  contact: string;
  website: string;
  type: string;
  eligibility: string;
  is_active: boolean;
  sort_order: number;
}

export default function CommunityPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [supportGroups, setSupportGroups] = useState<SupportGroup[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch data from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch support groups
        const groupsRes = await fetch("/api/admin/support-groups");
        if (!groupsRes.ok) throw new Error("Failed to fetch support groups");
        const groupsData = await groupsRes.json();
        setSupportGroups(groupsData.supportGroups || []);

        // Fetch activities
        const activitiesRes = await fetch("/api/admin/activities");
        if (!activitiesRes.ok) throw new Error("Failed to fetch activities");
        const activitiesData = await activitiesRes.json();
        setActivities(activitiesData.activities || []);

        // Fetch services
        const servicesRes = await fetch("/api/admin/services");
        if (!servicesRes.ok) throw new Error("Failed to fetch services");
        const servicesData = await servicesRes.json();
        setServices(servicesData.services || []);
      } catch (e: any) {
        setError(e.message || "Error loading community resources");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter active items
  const activeSupportGroups = supportGroups.filter((group) => group.is_active);
  const activeActivities = activities.filter((activity) => activity.is_active);
  const activeServices = services.filter((service) => service.is_active);

  // Filter by search term
  const filteredSupportGroups = activeSupportGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredActivities = activeActivities.filter(
    (activity) =>
      activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredServices = activeServices.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
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
      Users,
      Heart,
      BookOpen,
      Coffee,
      Gamepad2,
      Music,
      Palette,
      Calendar,
      Clock,
      MapPin,
      Phone,
      Globe,
    };
    return iconMap[iconName] || Users;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-6xl mx-auto py-8 px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-slate-600">
              Loading community resources...
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
            Community Resources
          </h1>
          <p className="text-slate-600 leading-relaxed">
            Connect with local support groups, activities, and services designed
            for the autism community.
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
                  variant={
                    selectedLocation === "downtown" ? "default" : "outline"
                  }
                  onClick={() => setSelectedLocation("downtown")}
                  size="sm"
                >
                  Downtown
                </Button>
                <Button
                  variant={
                    selectedLocation === "westside" ? "default" : "outline"
                  }
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
            <TabsTrigger
              value="groups"
              className="data-[state=active]:bg-blue-100"
            >
              Support Groups ({filteredSupportGroups.length})
            </TabsTrigger>
            <TabsTrigger
              value="activities"
              className="data-[state=active]:bg-green-100"
            >
              Activities ({filteredActivities.length})
            </TabsTrigger>
            <TabsTrigger
              value="services"
              className="data-[state=active]:bg-purple-100"
            >
              Services ({filteredServices.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="groups" className="space-y-6">
            {filteredSupportGroups.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500">
                  No support groups found matching your search.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredSupportGroups.map((group) => (
                  <Card
                    key={group.id}
                    className="border-2 border-slate-200 hover:shadow-md transition-shadow duration-200"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle className="text-lg font-medium text-slate-800">
                            {group.name}
                          </CardTitle>
                          <Badge variant="secondary" className="text-xs">
                            {group.type}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(group.id.toString())}
                          className="p-1"
                        >
                          <Star
                            className={`h-4 w-4 ${
                              favorites.includes(group.id.toString())
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-slate-400"
                            }`}
                          />
                        </Button>
                      </div>
                      <CardDescription className="text-slate-600 leading-relaxed">
                        {group.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-slate-700">
                              {group.location}
                            </p>
                            <p className="text-slate-500">{group.address}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-600">
                            {group.schedule}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-600">
                            {group.contact}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-slate-400" />
                          <a
                            href={`https://${group.website}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {group.website}
                          </a>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200">
                        <div>
                          <p className="text-xs text-slate-500">Capacity</p>
                          <p className="text-sm font-medium text-slate-700">
                            {group.capacity}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Cost</p>
                          <p className="text-sm font-medium text-slate-700">
                            {group.cost}
                          </p>
                        </div>
                      </div>

                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Get More Information
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            {filteredActivities.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500">
                  No activities found matching your search.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredActivities.map((activity) => {
                  const Icon = getIconComponent(activity.icon);
                  return (
                    <Card
                      key={activity.id}
                      className="border-2 border-slate-200 hover:shadow-md transition-shadow duration-200"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(
                              activity.color
                            )}`}
                          >
                            <Icon className="h-6 w-6" />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              toggleFavorite(activity.id.toString())
                            }
                            className="p-1"
                          >
                            <Star
                              className={`h-4 w-4 ${
                                favorites.includes(activity.id.toString())
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-slate-400"
                              }`}
                            />
                          </Button>
                        </div>
                        <CardTitle className="text-lg font-medium text-slate-800">
                          {activity.name}
                        </CardTitle>
                        <CardDescription className="text-slate-600 leading-relaxed">
                          {activity.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-600">
                              {activity.location}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-600">
                              {activity.schedule}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">
                            {activity.age_group}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {activity.cost}
                          </Badge>
                        </div>

                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          Join Activity
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            {filteredServices.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500">
                  No services found matching your search.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredServices.map((service) => (
                  <Card
                    key={service.id}
                    className="border-2 border-slate-200 hover:shadow-md transition-shadow duration-200"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle className="text-lg font-medium text-slate-800">
                            {service.name}
                          </CardTitle>
                          <Badge variant="secondary" className="text-xs">
                            {service.type}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(service.id.toString())}
                          className="p-1"
                        >
                          <Star
                            className={`h-4 w-4 ${
                              favorites.includes(service.id.toString())
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-slate-400"
                            }`}
                          />
                        </Button>
                      </div>
                      <CardDescription className="text-slate-600 leading-relaxed">
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-600">
                            {service.contact}
                          </span>
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

                      <div className="pt-3 border-t border-slate-200">
                        <p className="text-xs text-slate-500 mb-1">
                          Eligibility
                        </p>
                        <p className="text-sm font-medium text-slate-700">
                          {service.eligibility}
                        </p>
                      </div>

                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        Contact Service
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
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
              <CardDescription>
                Quick access to the community resources you've saved
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {favorites.map((favoriteId) => (
                  <Badge
                    key={favoriteId}
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800"
                  >
                    {favoriteId}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
