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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  FileText,
  Shield,
  Eye,
  Edit,
  Trash2,
  Plus,
  Save,
  Loader2,
  FolderPlus,
} from "lucide-react";
import { toast } from "sonner";

interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

interface LearningPath {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  content_type: string;
  is_published: boolean;
  category_id: number;
  estimated_duration?: number;
  created_at: string;
  category_name?: string;
}

interface LearningCategory {
  id: number;
  name: string;
  description: string;
  color: string;
}

interface ContentFormData {
  title: string;
  description: string;
  difficulty: string;
  content_type: string;
  category_id: string;
  estimated_duration: string;
}

interface CategoryFormData {
  name: string;
  description: string;
  color: string;
}

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  email?: string;
  phone?: string;
  address?: string;
  bio?: string;
  experience?: string;
  education?: string;
  languages?: string[];
  insurance_accepted?: string[];
  certifications?: string[];
  availability?: any;
  rating?: number;
  total_appointments?: number;
  is_accepting_patients: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface DoctorFormData {
  name: string;
  specialty: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  experience: string;
  education: string;
  languages: string[];
  insurance_accepted: string[];
  certifications: string[];
  availability: any;
  is_accepting_patients: boolean;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [categories, setCategories] = useState<LearningCategory[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showContentForm, setShowContentForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [editingContent, setEditingContent] = useState<LearningPath | null>(
    null
  );
  const [editingCategory, setEditingCategory] =
    useState<LearningCategory | null>(null);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [activeTab, setActiveTab] = useState("content");

  const [contentForm, setContentForm] = useState<ContentFormData>({
    title: "",
    description: "",
    difficulty: "Beginner",
    content_type: "article",
    category_id: "",
    estimated_duration: "",
  });

  const [categoryForm, setCategoryForm] = useState<CategoryFormData>({
    name: "",
    description: "",
    color: "#3B82F6",
  });

  const [doctorForm, setDoctorForm] = useState<DoctorFormData>({
    name: "",
    specialty: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    experience: "",
    education: "",
    languages: [],
    insurance_accepted: [],
    certifications: [],
    availability: {},
    is_accepting_patients: true,
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch users
      const usersResponse = await fetch("/api/admin/users");
      if (!usersResponse.ok) {
        throw new Error("Failed to fetch users");
      }
      const usersData = await usersResponse.json();
      setUsers(usersData.users || []);

      // Fetch learning paths
      const pathsResponse = await fetch("/api/admin/learning-paths");
      if (!pathsResponse.ok) {
        throw new Error("Failed to fetch learning paths");
      }
      const pathsData = await pathsResponse.json();
      setLearningPaths(pathsData.learningPaths || []);

      // Fetch categories
      const categoriesResponse = await fetch("/api/admin/categories");
      if (!categoriesResponse.ok) {
        throw new Error("Failed to fetch categories");
      }
      const categoriesData = await categoriesResponse.json();
      console.log("Categories data:", categoriesData); // Debug log
      setCategories(categoriesData.categories || []);

      // Fetch doctors
      const doctorsResponse = await fetch("/api/admin/doctors");
      if (!doctorsResponse.ok) {
        throw new Error("Failed to fetch doctors");
      }
      const doctorsData = await doctorsResponse.json();
      setDoctors(doctorsData.doctors || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleContentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !contentForm.title ||
      !contentForm.description ||
      !contentForm.category_id
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);

      const method = editingContent ? "PUT" : "POST";
      const body = editingContent
        ? {
            id: editingContent.id,
            title: contentForm.title,
            description: contentForm.description,
            difficulty: contentForm.difficulty,
            content_type: contentForm.content_type,
            category_id: parseInt(contentForm.category_id),
            estimated_duration: contentForm.estimated_duration
              ? parseInt(contentForm.estimated_duration)
              : null,
            is_published: editingContent.is_published,
          }
        : {
            title: contentForm.title,
            description: contentForm.description,
            difficulty: contentForm.difficulty,
            content_type: contentForm.content_type,
            category_id: parseInt(contentForm.category_id),
            estimated_duration: contentForm.estimated_duration
              ? parseInt(contentForm.estimated_duration)
              : null,
          };

      const response = await fetch("/api/admin/learning-paths", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Failed to ${editingContent ? "update" : "create"} content`
        );
      }

      toast.success(
        `Content ${editingContent ? "updated" : "created"} successfully!`
      );
      setContentForm({
        title: "",
        description: "",
        difficulty: "Beginner",
        content_type: "article",
        category_id: "",
        estimated_duration: "",
      });
      setShowContentForm(false);
      setEditingContent(null);
      fetchData(); // Refresh the data
    } catch (error: any) {
      console.error("Error saving content:", error);
      toast.error(
        error.message ||
          `Failed to ${editingContent ? "update" : "create"} content`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditContent = (content: LearningPath) => {
    setEditingContent(content);
    setContentForm({
      title: content.title,
      description: content.description,
      difficulty: content.difficulty,
      content_type: content.content_type,
      category_id: content.category_id.toString(),
      estimated_duration: content.estimated_duration?.toString() || "",
    });
    setShowContentForm(true);
    setActiveTab("content"); // Switch to content tab to show the form
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryForm.name || !categoryForm.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);

      const method = editingCategory ? "PUT" : "POST";
      const body = editingCategory
        ? {
            id: editingCategory.id,
            name: categoryForm.name,
            description: categoryForm.description,
            color: categoryForm.color,
          }
        : {
            name: categoryForm.name,
            description: categoryForm.description,
            color: categoryForm.color,
          };

      const response = await fetch("/api/admin/categories", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Failed to ${editingCategory ? "update" : "create"} category`
        );
      }

      toast.success(
        `Category ${editingCategory ? "updated" : "created"} successfully!`
      );
      setCategoryForm({
        name: "",
        description: "",
        color: "#3B82F6",
      });
      setShowCategoryForm(false);
      setEditingCategory(null);
      fetchData(); // Refresh the data
    } catch (error: any) {
      console.error("Error saving category:", error);
      toast.error(
        error.message ||
          `Failed to ${editingCategory ? "update" : "create"} category`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditCategory = (category: LearningCategory) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description,
      color: category.color,
    });
    setShowCategoryForm(true);
    setActiveTab("categories"); // Switch to categories tab to show the form
  };

  const handleDeleteCategory = async (id: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this category? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/categories?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete category");
      }

      toast.success("Category deleted successfully!");
      fetchData(); // Refresh the data
    } catch (error: any) {
      console.error("Error deleting category:", error);
      toast.error(error.message || "Failed to delete category");
    }
  };

  const handleDeleteContent = async (id: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this content? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/learning-paths?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete content");
      }

      toast.success("Content deleted successfully!");
      fetchData(); // Refresh the data
    } catch (error: any) {
      console.error("Error deleting content:", error);
      toast.error(error.message || "Failed to delete content");
    }
  };

  const toggleContentStatus = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/learning-paths/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_published: !currentStatus,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update content status");
      }

      toast.success(
        `Content ${!currentStatus ? "published" : "unpublished"} successfully!`
      );
      fetchData(); // Refresh the data
    } catch (error: any) {
      console.error("Error updating content status:", error);
      toast.error(error.message || "Failed to update content status");
    }
  };

  // Doctor management functions
  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!doctorForm.name || !doctorForm.specialty) {
      toast.error("Name and specialty are required");
      return;
    }

    try {
      setSubmitting(true);

      const method = editingDoctor ? "PUT" : "POST";
      const body = editingDoctor
        ? {
            id: editingDoctor.id,
            ...doctorForm,
          }
        : doctorForm;

      const response = await fetch("/api/admin/doctors", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Failed to ${editingDoctor ? "update" : "create"} doctor`
        );
      }

      toast.success(
        `Doctor ${editingDoctor ? "updated" : "created"} successfully!`
      );
      setDoctorForm({
        name: "",
        specialty: "",
        email: "",
        phone: "",
        address: "",
        bio: "",
        experience: "",
        education: "",
        languages: [],
        insurance_accepted: [],
        certifications: [],
        availability: {},
        is_accepting_patients: true,
      });
      setShowDoctorForm(false);
      setEditingDoctor(null);
      fetchData(); // Refresh the data
    } catch (error: any) {
      console.error("Error saving doctor:", error);
      toast.error(
        error.message ||
          `Failed to ${editingDoctor ? "update" : "create"} doctor`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditDoctor = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setDoctorForm({
      name: doctor.name,
      specialty: doctor.specialty,
      email: doctor.email || "",
      phone: doctor.phone || "",
      address: doctor.address || "",
      bio: doctor.bio || "",
      experience: doctor.experience || "",
      education: doctor.education || "",
      languages: doctor.languages || [],
      insurance_accepted: doctor.insurance_accepted || [],
      certifications: doctor.certifications || [],
      availability: doctor.availability || {},
      is_accepting_patients: doctor.is_accepting_patients,
    });
    setShowDoctorForm(true);
    setActiveTab("doctors"); // Switch to doctors tab to show the form
  };

  const handleDeleteDoctor = async (id: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this doctor? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/doctors?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete doctor");
      }

      toast.success("Doctor deleted successfully!");
      fetchData(); // Refresh the data
    } catch (error: any) {
      console.error("Error deleting doctor:", error);
      toast.error(error.message || "Failed to delete doctor");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading admin dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Header */}
      <div className="bg-white border-b-2 border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-medium text-slate-800">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-slate-600">
                  Manage content and users
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700"
              >
                System Healthy
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-slate-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">
                {users.length}
              </div>
              <p className="text-xs text-slate-600 mt-1">Registered users</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-slate-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Content Items
                </CardTitle>
                <FileText className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">
                {learningPaths.length}
              </div>
              <p className="text-xs text-slate-600 mt-1">Learning paths</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-slate-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Published Content
                </CardTitle>
                <Eye className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">
                {learningPaths.filter((path) => path.is_published).length}
              </div>
              <p className="text-xs text-slate-600 mt-1">Publicly available</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-slate-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Healthcare Providers
                </CardTitle>
                <Users className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">
                {doctors.length}
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Doctors & specialists
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 bg-white border-2 border-slate-200">
            <TabsTrigger
              value="content"
              className="data-[state=active]:bg-blue-100"
            >
              Content Management
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              className="data-[state=active]:bg-purple-100"
            >
              Categories
            </TabsTrigger>
            <TabsTrigger
              value="doctors"
              className="data-[state=active]:bg-orange-100"
            >
              Doctors
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-green-100"
            >
              User Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium text-slate-800">
                Content Management
              </h2>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setShowContentForm(!showContentForm)}
              >
                <Plus className="h-4 w-4 mr-2" />
                {showContentForm ? "Cancel" : "Add New Content"}
              </Button>
            </div>

            {/* Content Form */}
            {showContentForm && (
              <Card className="border-2 border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-slate-800">
                    {editingContent
                      ? "Edit Learning Path"
                      : "Add New Learning Path"}
                  </CardTitle>
                  <CardDescription>
                    Create a new learning path for users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContentSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          value={contentForm.title}
                          onChange={(e) =>
                            setContentForm({
                              ...contentForm,
                              title: e.target.value,
                            })
                          }
                          placeholder="Enter content title"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        {categories.length === 0 ? (
                          <div className="space-y-2">
                            <p className="text-sm text-red-600">
                              No categories available
                            </p>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setActiveTab("categories")}
                              className="w-full"
                            >
                              <FolderPlus className="h-4 w-4 mr-2" />
                              Create Category First
                            </Button>
                          </div>
                        ) : (
                          <Select
                            value={contentForm.category_id}
                            onValueChange={(value) =>
                              setContentForm({
                                ...contentForm,
                                category_id: value,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id.toString()}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={contentForm.description}
                        onChange={(e) =>
                          setContentForm({
                            ...contentForm,
                            description: e.target.value,
                          })
                        }
                        placeholder="Enter content description"
                        rows={3}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="difficulty">Difficulty</Label>
                        <Select
                          value={contentForm.difficulty}
                          onValueChange={(value) =>
                            setContentForm({
                              ...contentForm,
                              difficulty: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">
                              Intermediate
                            </SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="content_type">Content Type</Label>
                        <Select
                          value={contentForm.content_type}
                          onValueChange={(value) =>
                            setContentForm({
                              ...contentForm,
                              content_type: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="article">Article</SelectItem>
                            <SelectItem value="audio">Audio</SelectItem>
                            <SelectItem value="interactive">
                              Interactive
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Input
                          id="duration"
                          type="number"
                          value={contentForm.estimated_duration}
                          onChange={(e) =>
                            setContentForm({
                              ...contentForm,
                              estimated_duration: e.target.value,
                            })
                          }
                          placeholder="Estimated duration"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="submit"
                        disabled={submitting || categories.length === 0}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            {editingContent
                              ? "Update Content"
                              : "Create Content"}
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowContentForm(false);
                          setEditingContent(null);
                          setContentForm({
                            title: "",
                            description: "",
                            difficulty: "Beginner",
                            content_type: "article",
                            category_id: "",
                            estimated_duration: "",
                          });
                        }}
                        disabled={submitting}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Content List */}
            <Card className="border-2 border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-slate-800">
                  Learning Paths
                </CardTitle>
                <CardDescription>Manage all learning content</CardDescription>
              </CardHeader>
              <CardContent>
                {learningPaths.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    No learning paths found. Create your first one!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {learningPaths.map((path) => (
                      <div
                        key={path.id}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                      >
                        <div className="space-y-1">
                          <h3 className="font-medium text-slate-800">
                            {path.title}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-slate-600">
                            <Badge variant="outline" className="text-xs">
                              {path.content_type}
                            </Badge>
                            <Badge
                              variant={
                                path.is_published ? "default" : "secondary"
                              }
                              className="text-xs"
                            >
                              {path.is_published ? "Published" : "Draft"}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {path.difficulty}
                            </Badge>
                            {path.category_name && (
                              <Badge variant="outline" className="text-xs">
                                {path.category_name}
                              </Badge>
                            )}
                            <span>
                              Created:{" "}
                              {new Date(path.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 max-w-md truncate">
                            {path.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              toggleContentStatus(path.id, path.is_published)
                            }
                          >
                            {path.is_published ? "Unpublish" : "Publish"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditContent(path)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteContent(path.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium text-slate-800">
                Category Management
              </h2>
              <Button
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => setShowCategoryForm(!showCategoryForm)}
              >
                <Plus className="h-4 w-4 mr-2" />
                {showCategoryForm ? "Cancel" : "Add New Category"}
              </Button>
            </div>

            {/* Category Form */}
            {showCategoryForm && (
              <Card className="border-2 border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-slate-800">
                    {editingCategory ? "Edit Category" : "Add New Category"}
                  </CardTitle>
                  <CardDescription>
                    Create a new learning category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCategorySubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category-name">Name *</Label>
                        <Input
                          id="category-name"
                          value={categoryForm.name}
                          onChange={(e) =>
                            setCategoryForm({
                              ...categoryForm,
                              name: e.target.value,
                            })
                          }
                          placeholder="Enter category name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category-color">Color</Label>
                        <Input
                          id="category-color"
                          type="color"
                          value={categoryForm.color}
                          onChange={(e) =>
                            setCategoryForm({
                              ...categoryForm,
                              color: e.target.value,
                            })
                          }
                          className="h-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category-description">
                        Description *
                      </Label>
                      <Textarea
                        id="category-description"
                        value={categoryForm.description}
                        onChange={(e) =>
                          setCategoryForm({
                            ...categoryForm,
                            description: e.target.value,
                          })
                        }
                        placeholder="Enter category description"
                        rows={3}
                        required
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            {editingCategory
                              ? "Update Category"
                              : "Create Category"}
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowCategoryForm(false);
                          setEditingCategory(null);
                          setCategoryForm({
                            name: "",
                            description: "",
                            color: "#3B82F6",
                          });
                        }}
                        disabled={submitting}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Categories List */}
            <Card className="border-2 border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-slate-800">
                  Learning Categories
                </CardTitle>
                <CardDescription>Manage content categories</CardDescription>
              </CardHeader>
              <CardContent>
                {categories.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    No categories found. Create your first category to organize
                    content!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <div className="space-y-1">
                            <h3 className="font-medium text-slate-800">
                              {category.name}
                            </h3>
                            <p className="text-sm text-slate-600">
                              {category.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCategory(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="doctors" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium text-slate-800">
                Doctor Management
              </h2>
              <Button
                className="bg-orange-600 hover:bg-orange-700"
                onClick={() => setShowDoctorForm(!showDoctorForm)}
              >
                <Plus className="h-4 w-4 mr-2" />
                {showDoctorForm ? "Cancel" : "Add New Doctor"}
              </Button>
            </div>

            {/* Doctor Form */}
            {showDoctorForm && (
              <Card className="border-2 border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-slate-800">
                    {editingDoctor ? "Edit Doctor" : "Add New Doctor"}
                  </CardTitle>
                  <CardDescription>
                    Add a new healthcare provider to the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleDoctorSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="doctor-name">Name *</Label>
                        <Input
                          id="doctor-name"
                          value={doctorForm.name}
                          onChange={(e) =>
                            setDoctorForm({
                              ...doctorForm,
                              name: e.target.value,
                            })
                          }
                          placeholder="Enter doctor's name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doctor-specialty">Specialty *</Label>
                        <Input
                          id="doctor-specialty"
                          value={doctorForm.specialty}
                          onChange={(e) =>
                            setDoctorForm({
                              ...doctorForm,
                              specialty: e.target.value,
                            })
                          }
                          placeholder="e.g., Autism Specialist, Behavioral Therapist"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="doctor-email">Email</Label>
                        <Input
                          id="doctor-email"
                          type="email"
                          value={doctorForm.email}
                          onChange={(e) =>
                            setDoctorForm({
                              ...doctorForm,
                              email: e.target.value,
                            })
                          }
                          placeholder="Enter email address"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doctor-phone">Phone</Label>
                        <Input
                          id="doctor-phone"
                          value={doctorForm.phone}
                          onChange={(e) =>
                            setDoctorForm({
                              ...doctorForm,
                              phone: e.target.value,
                            })
                          }
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="doctor-address">Address</Label>
                      <Input
                        id="doctor-address"
                        value={doctorForm.address}
                        onChange={(e) =>
                          setDoctorForm({
                            ...doctorForm,
                            address: e.target.value,
                          })
                        }
                        placeholder="Enter office address"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="doctor-bio">Bio</Label>
                      <Textarea
                        id="doctor-bio"
                        value={doctorForm.bio}
                        onChange={(e) =>
                          setDoctorForm({
                            ...doctorForm,
                            bio: e.target.value,
                          })
                        }
                        placeholder="Enter doctor's bio and background"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="doctor-experience">Experience</Label>
                        <Input
                          id="doctor-experience"
                          value={doctorForm.experience}
                          onChange={(e) =>
                            setDoctorForm({
                              ...doctorForm,
                              experience: e.target.value,
                            })
                          }
                          placeholder="e.g., 15+ years"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doctor-education">Education</Label>
                        <Input
                          id="doctor-education"
                          value={doctorForm.education}
                          onChange={(e) =>
                            setDoctorForm({
                              ...doctorForm,
                              education: e.target.value,
                            })
                          }
                          placeholder="e.g., MD, PhD, etc."
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="doctor-accepting"
                        checked={doctorForm.is_accepting_patients}
                        onChange={(e) =>
                          setDoctorForm({
                            ...doctorForm,
                            is_accepting_patients: e.target.checked,
                          })
                        }
                        className="rounded border-slate-300"
                      />
                      <Label htmlFor="doctor-accepting">
                        Currently accepting new patients
                      </Label>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            {editingDoctor ? "Update Doctor" : "Create Doctor"}
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowDoctorForm(false);
                          setEditingDoctor(null);
                          setDoctorForm({
                            name: "",
                            specialty: "",
                            email: "",
                            phone: "",
                            address: "",
                            bio: "",
                            experience: "",
                            education: "",
                            languages: [],
                            insurance_accepted: [],
                            certifications: [],
                            availability: {},
                            is_accepting_patients: true,
                          });
                        }}
                        disabled={submitting}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Doctors List */}
            <Card className="border-2 border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-slate-800">
                  Healthcare Providers
                </CardTitle>
                <CardDescription>
                  Manage doctors and specialists
                </CardDescription>
              </CardHeader>
              <CardContent>
                {doctors.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    No doctors found. Add your first healthcare provider!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {doctors.map((doctor) => (
                      <div
                        key={doctor.id}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                      >
                        <div className="space-y-1">
                          <h3 className="font-medium text-slate-800">
                            {doctor.name}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-slate-600">
                            <span>{doctor.specialty}</span>
                            {doctor.experience && (
                              <span>• {doctor.experience}</span>
                            )}
                            {doctor.email && <span>• {doctor.email}</span>}
                            <Badge
                              variant={
                                doctor.is_accepting_patients
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {doctor.is_accepting_patients
                                ? "Accepting Patients"
                                : "Not Accepting"}
                            </Badge>
                          </div>
                          {doctor.bio && (
                            <p className="text-sm text-slate-500 mt-1">
                              {doctor.bio.substring(0, 100)}
                              {doctor.bio.length > 100 && "..."}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditDoctor(doctor)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteDoctor(doctor.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium text-slate-800">
                User Management
              </h2>
            </div>

            <Card className="border-2 border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-slate-800">
                  User Accounts
                </CardTitle>
                <CardDescription>
                  Manage user accounts and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {users.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    No users found.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                      >
                        <div className="space-y-1">
                          <h3 className="font-medium text-slate-800">
                            {user.name}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-slate-600">
                            <span>{user.email}</span>
                            <Badge variant="outline" className="text-xs">
                              {user.is_admin ? "Admin" : "User"}
                            </Badge>
                            <Badge
                              variant={user.is_active ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {user.is_active ? "Active" : "Inactive"}
                            </Badge>
                            <span>
                              Joined:{" "}
                              {new Date(user.created_at).toLocaleDateString()}
                            </span>
                            {user.last_login && (
                              <span>
                                Last login:{" "}
                                {new Date(user.last_login).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
