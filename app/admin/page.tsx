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

  // Add new state for static content management
  const [supportGroups, setSupportGroups] = useState([]);
  const [activities, setActivities] = useState([]);
  const [services, setServices] = useState([]);
  const [copingStrategies, setCopingStrategies] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [assessmentTypes, setAssessmentTypes] = useState([]);
  const [assessmentQuestions, setAssessmentQuestions] = useState([]);
  const [communicationCards, setCommunicationCards] = useState([]);
  const [communicationPhrases, setCommunicationPhrases] = useState([]);

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

  // Add state for support group form and editing
  const [supportGroupForm, setSupportGroupForm] = useState({
    id: null,
    name: "",
    description: "",
    location: "",
    address: "",
    schedule: "",
    contact: "",
    website: "",
    type: "",
    capacity: "",
    facilitator: "",
    cost: "",
    is_active: true,
    sort_order: 0,
  });
  const [showSupportGroupForm, setShowSupportGroupForm] = useState(false);
  const [editingSupportGroup, setEditingSupportGroup] = useState(null);
  const [loadingSupportGroups, setLoadingSupportGroups] = useState(false);
  const [supportGroupError, setSupportGroupError] = useState("");

  // Add state for activities form and editing
  const [activityForm, setActivityForm] = useState({
    id: null,
    name: "",
    description: "",
    location: "",
    schedule: "",
    icon: "",
    color: "",
    cost: "",
    age_group: "",
    is_active: true,
    sort_order: 0,
  });
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [activityError, setActivityError] = useState("");

  // Add state for services form and editing
  const [serviceForm, setServiceForm] = useState({
    id: null,
    name: "",
    description: "",
    contact: "",
    website: "",
    type: "",
    eligibility: "",
    is_active: true,
    sort_order: 0,
  });
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [loadingServices, setLoadingServices] = useState(false);
  const [serviceError, setServiceError] = useState("");

  // Add state for coping strategies form and editing
  const [copingStrategyForm, setCopingStrategyForm] = useState({
    id: null,
    title: "",
    description: "",
    duration: "",
    difficulty: "",
    icon: "",
    color: "",
    category: "",
    steps: [],
    benefits: [],
    audio_url: "",
    audio_duration: "",
    audio_type: "",
    is_active: true,
    sort_order: 0,
  });
  const [showCopingStrategyForm, setShowCopingStrategyForm] = useState(false);
  const [editingCopingStrategy, setEditingCopingStrategy] = useState(null);
  const [loadingCopingStrategies, setLoadingCopingStrategies] = useState(false);
  const [copingStrategyError, setCopingStrategyError] = useState("");
  const [assessments, setAssessments] = useState([]);
  const [assessmentForm, setAssessmentForm] = useState({
    id: null,
    title: "",
    description: "",
    type: "",
    category: "",
    questions: [],
    instructions: "",
    duration: "",
    difficulty: "",
    icon: "",
    color: "",
    is_active: true,
    sort_order: 0,
  });
  const [showAssessmentForm, setShowAssessmentForm] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState(null);
  const [loadingAssessments, setLoadingAssessments] = useState(false);
  const [assessmentError, setAssessmentError] = useState("");

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch support groups
  const fetchSupportGroups = async () => {
    setLoadingSupportGroups(true);
    setSupportGroupError("");
    try {
      const res = await fetch("/api/admin/support-groups");
      if (!res.ok) throw new Error("Failed to fetch support groups");
      const data = await res.json();
      setSupportGroups(data.supportGroups || []);
    } catch (e: any) {
      setSupportGroupError(e.message || "Error loading support groups");
    } finally {
      setLoadingSupportGroups(false);
    }
  };

  // Fetch on tab open
  useEffect(() => {
    if (activeTab === "support-groups") fetchSupportGroups();
    // eslint-disable-next-line
  }, [activeTab]);

  // Handle form changes
  const handleSupportGroupFormChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setSupportGroupForm((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle create or update
  const handleSupportGroupSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    setSupportGroupError("");
    try {
      const method = editingSupportGroup ? "PUT" : "POST";
      const res = await fetch("/api/admin/support-groups", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(supportGroupForm),
      });
      if (!res.ok) throw new Error("Failed to save support group");
      setShowSupportGroupForm(false);
      setEditingSupportGroup(null);
      setSupportGroupForm({
        id: null,
        name: "",
        description: "",
        location: "",
        address: "",
        schedule: "",
        contact: "",
        website: "",
        type: "",
        capacity: "",
        facilitator: "",
        cost: "",
        is_active: true,
        sort_order: 0,
      });
      fetchSupportGroups();
      toast.success("Support group saved");
    } catch (e: any) {
      setSupportGroupError(e.message || "Error saving support group");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit
  const handleEditSupportGroup = (group: any) => {
    setEditingSupportGroup(group);
    setSupportGroupForm({ ...group });
    setShowSupportGroupForm(true);
  };

  // Handle delete
  const handleDeleteSupportGroup = async (id: number) => {
    if (!confirm("Delete this support group?")) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/support-groups", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete support group");
      fetchSupportGroups();
      toast.success("Support group deleted");
    } catch (e: any) {
      toast.error(e.message || "Error deleting support group");
    } finally {
      setSubmitting(false);
    }
  };

  // Fetch activities
  const fetchActivities = async () => {
    setLoadingActivities(true);
    setActivityError("");
    try {
      const res = await fetch("/api/admin/activities");
      if (!res.ok) throw new Error("Failed to fetch activities");
      const data = await res.json();
      setActivities(data.activities || []);
    } catch (e: any) {
      setActivityError(e.message || "Error loading activities");
    } finally {
      setLoadingActivities(false);
    }
  };

  // Fetch on tab open
  useEffect(() => {
    if (activeTab === "activities") fetchActivities();
    // eslint-disable-next-line
  }, [activeTab]);

  // Handle form changes
  const handleActivityFormChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setActivityForm((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle create or update
  const handleActivitySubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    setActivityError("");
    try {
      const method = editingActivity ? "PUT" : "POST";
      const res = await fetch("/api/admin/activities", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activityForm),
      });
      if (!res.ok) throw new Error("Failed to save activity");
      setShowActivityForm(false);
      setEditingActivity(null);
      setActivityForm({
        id: null,
        name: "",
        description: "",
        location: "",
        schedule: "",
        icon: "",
        color: "",
        cost: "",
        age_group: "",
        is_active: true,
        sort_order: 0,
      });
      fetchActivities();
      toast.success("Activity saved");
    } catch (e: any) {
      setActivityError(e.message || "Error saving activity");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit
  const handleEditActivity = (activity: any) => {
    setEditingActivity(activity);
    setActivityForm({ ...activity });
    setShowActivityForm(true);
  };

  // Handle delete
  const handleDeleteActivity = async (id: number) => {
    if (!confirm("Delete this activity?")) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/activities", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete activity");
      fetchActivities();
      toast.success("Activity deleted");
    } catch (e: any) {
      toast.error(e.message || "Error deleting activity");
    } finally {
      setSubmitting(false);
    }
  };

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

  // Fetch services
  const fetchServices = async () => {
    setLoadingServices(true);
    setServiceError("");
    try {
      const res = await fetch("/api/admin/services");
      if (!res.ok) throw new Error("Failed to fetch services");
      const data = await res.json();
      setServices(data.services || []);
    } catch (e: any) {
      setServiceError(e.message || "Error loading services");
    } finally {
      setLoadingServices(false);
    }
  };

  // Fetch on tab open
  useEffect(() => {
    if (activeTab === "services") fetchServices();
    // eslint-disable-next-line
  }, [activeTab]);

  // Handle form changes
  const handleServiceFormChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setServiceForm((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle create or update
  const handleServiceSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    setServiceError("");
    try {
      const method = editingService ? "PUT" : "POST";
      const res = await fetch("/api/admin/services", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceForm),
      });
      if (!res.ok) throw new Error("Failed to save service");
      setShowServiceForm(false);
      setEditingService(null);
      setServiceForm({
        id: null,
        name: "",
        description: "",
        contact: "",
        website: "",
        type: "",
        eligibility: "",
        is_active: true,
        sort_order: 0,
      });
      fetchServices();
      toast.success("Service saved");
    } catch (e: any) {
      setServiceError(e.message || "Error saving service");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit
  const handleEditService = (service: any) => {
    setEditingService(service);
    setServiceForm({ ...service });
    setShowServiceForm(true);
  };

  // Handle delete
  const handleDeleteService = async (id: number) => {
    if (!confirm("Delete this service?")) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/services", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete service");
      fetchServices();
      toast.success("Service deleted");
    } catch (e: any) {
      toast.error(e.message || "Error deleting service");
    } finally {
      setSubmitting(false);
    }
  };

  // Fetch coping strategies
  const fetchCopingStrategies = async () => {
    setLoadingCopingStrategies(true);
    setCopingStrategyError("");
    try {
      const res = await fetch("/api/admin/coping-strategies");
      if (!res.ok) throw new Error("Failed to fetch coping strategies");
      const data = await res.json();
      setCopingStrategies(data.copingStrategies || []);
    } catch (e: any) {
      setCopingStrategyError(e.message || "Error loading coping strategies");
    } finally {
      setLoadingCopingStrategies(false);
    }
  };

  // Fetch on tab open
  useEffect(() => {
    if (activeTab === "coping") fetchCopingStrategies();
    if (activeTab === "assessments") fetchAssessments();
    // eslint-disable-next-line
  }, [activeTab]);

  // Handle form changes
  const handleCopingStrategyFormChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setCopingStrategyForm((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle create or update
  const handleCopingStrategySubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    setCopingStrategyError("");
    try {
      const method = editingCopingStrategy ? "PUT" : "POST";
      const res = await fetch("/api/admin/coping-strategies", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(copingStrategyForm),
      });
      if (!res.ok) throw new Error("Failed to save coping strategy");
      setShowCopingStrategyForm(false);
      setEditingCopingStrategy(null);
      setCopingStrategyForm({
        id: null,
        title: "",
        description: "",
        duration: "",
        difficulty: "",
        icon: "",
        color: "",
        category: "",
        steps: [],
        benefits: [],
        audio_url: "",
        audio_duration: "",
        audio_type: "",
        is_active: true,
        sort_order: 0,
      });
      fetchCopingStrategies();
      toast.success("Coping strategy saved");
    } catch (e: any) {
      setCopingStrategyError(e.message || "Error saving coping strategy");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit
  const handleEditCopingStrategy = (strategy: any) => {
    setEditingCopingStrategy(strategy);
    setCopingStrategyForm({ ...strategy });
    setShowCopingStrategyForm(true);
  };

  // Handle delete
  const handleDeleteCopingStrategy = async (id: number) => {
    if (!confirm("Delete this coping strategy?")) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/coping-strategies", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete coping strategy");
      fetchCopingStrategies();
      toast.success("Coping strategy deleted");
    } catch (e: any) {
      toast.error(e.message || "Error deleting coping strategy");
    } finally {
      setSubmitting(false);
    }
  };

  // Fetch assessments
  const fetchAssessments = async () => {
    setLoadingAssessments(true);
    setAssessmentError("");
    try {
      const res = await fetch("/api/admin/assessments");
      if (!res.ok) throw new Error("Failed to fetch assessments");
      const data = await res.json();
      setAssessments(data.assessments || []);
    } catch (e: any) {
      setAssessmentError(e.message || "Error loading assessments");
    } finally {
      setLoadingAssessments(false);
    }
  };

  // Handle form changes
  const handleAssessmentFormChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setAssessmentForm((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle create or update
  const handleAssessmentSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    setAssessmentError("");
    try {
      const method = editingAssessment ? "PUT" : "POST";
      const res = await fetch("/api/admin/assessments", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assessmentForm),
      });
      if (!res.ok) throw new Error("Failed to save assessment");
      setShowAssessmentForm(false);
      setEditingAssessment(null);
      setAssessmentForm({
        id: null,
        title: "",
        description: "",
        type: "",
        category: "",
        questions: [],
        instructions: "",
        duration: "",
        difficulty: "",
        icon: "",
        color: "",
        is_active: true,
        sort_order: 0,
      });
      fetchAssessments();
      toast.success("Assessment saved");
    } catch (e: any) {
      setAssessmentError(e.message || "Error saving assessment");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit
  const handleEditAssessment = (assessment: any) => {
    setEditingAssessment(assessment);
    setAssessmentForm({ ...assessment });
    setShowAssessmentForm(true);
  };

  // Handle delete
  const handleDeleteAssessment = async (id: number) => {
    if (!confirm("Delete this assessment?")) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/assessments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete assessment");
      fetchAssessments();
      toast.success("Assessment deleted");
    } catch (e: any) {
      toast.error(e.message || "Error deleting assessment");
    } finally {
      setSubmitting(false);
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
        <h1 className="text-3xl font-medium text-slate-800 mb-6">
          Admin Panel
        </h1>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 grid grid-cols-5 md:grid-cols-10 gap-2">
            <TabsTrigger value="content">Learning Content</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="doctors">Doctors</TabsTrigger>
            {/* New static content tabs */}
            <TabsTrigger value="support-groups">Support Groups</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="coping">Coping Strategies</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="communication">Communication Tools</TabsTrigger>
          </TabsList>
          {/* Existing tabs... */}
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

          {/* New static content tabs */}
          <TabsContent value="support-groups">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Community Support Groups</CardTitle>
                <Button
                  onClick={() => {
                    setShowSupportGroupForm(true);
                    setEditingSupportGroup(null);
                    setSupportGroupForm({
                      id: null,
                      name: "",
                      description: "",
                      location: "",
                      address: "",
                      schedule: "",
                      contact: "",
                      website: "",
                      type: "",
                      capacity: "",
                      facilitator: "",
                      cost: "",
                      is_active: true,
                      sort_order: 0,
                    });
                  }}
                >
                  + Add Support Group
                </Button>
              </CardHeader>
              <CardContent>
                {supportGroupError && (
                  <div className="text-red-600 mb-2">{supportGroupError}</div>
                )}
                {loadingSupportGroups ? (
                  <div className="py-8 text-center text-slate-500">
                    Loading...
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="p-2 border">Name</th>
                          <th className="p-2 border">Location</th>
                          <th className="p-2 border">Schedule</th>
                          <th className="p-2 border">Contact</th>
                          <th className="p-2 border">Active</th>
                          <th className="p-2 border">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {supportGroups.map((group: any) => (
                          <tr key={group.id} className="border-b">
                            <td className="p-2 border font-medium">
                              {group.name}
                            </td>
                            <td className="p-2 border">{group.location}</td>
                            <td className="p-2 border">{group.schedule}</td>
                            <td className="p-2 border">{group.contact}</td>
                            <td className="p-2 border text-center">
                              {group.is_active ? "Yes" : "No"}
                            </td>
                            <td className="p-2 border text-center">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditSupportGroup(group)}
                                className="mr-2"
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  handleDeleteSupportGroup(group.id)
                                }
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {/* Form for add/edit */}
                {showSupportGroupForm && (
                  <form
                    onSubmit={handleSupportGroupSubmit}
                    className="mt-8 space-y-4 bg-slate-50 p-6 rounded-lg border"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Name</Label>
                        <Input
                          name="name"
                          value={supportGroupForm.name}
                          onChange={handleSupportGroupFormChange}
                          required
                        />
                      </div>
                      <div>
                        <Label>Location</Label>
                        <Input
                          name="location"
                          value={supportGroupForm.location}
                          onChange={handleSupportGroupFormChange}
                        />
                      </div>
                      <div>
                        <Label>Schedule</Label>
                        <Input
                          name="schedule"
                          value={supportGroupForm.schedule}
                          onChange={handleSupportGroupFormChange}
                        />
                      </div>
                      <div>
                        <Label>Contact</Label>
                        <Input
                          name="contact"
                          value={supportGroupForm.contact}
                          onChange={handleSupportGroupFormChange}
                        />
                      </div>
                      <div>
                        <Label>Website</Label>
                        <Input
                          name="website"
                          value={supportGroupForm.website}
                          onChange={handleSupportGroupFormChange}
                        />
                      </div>
                      <div>
                        <Label>Type</Label>
                        <Input
                          name="type"
                          value={supportGroupForm.type}
                          onChange={handleSupportGroupFormChange}
                        />
                      </div>
                      <div>
                        <Label>Capacity</Label>
                        <Input
                          name="capacity"
                          value={supportGroupForm.capacity}
                          onChange={handleSupportGroupFormChange}
                        />
                      </div>
                      <div>
                        <Label>Facilitator</Label>
                        <Input
                          name="facilitator"
                          value={supportGroupForm.facilitator}
                          onChange={handleSupportGroupFormChange}
                        />
                      </div>
                      <div>
                        <Label>Cost</Label>
                        <Input
                          name="cost"
                          value={supportGroupForm.cost}
                          onChange={handleSupportGroupFormChange}
                        />
                      </div>
                      <div>
                        <Label>Sort Order</Label>
                        <Input
                          name="sort_order"
                          type="number"
                          value={supportGroupForm.sort_order}
                          onChange={handleSupportGroupFormChange}
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-6">
                        <input
                          type="checkbox"
                          name="is_active"
                          checked={supportGroupForm.is_active}
                          onChange={handleSupportGroupFormChange}
                          id="is_active"
                        />
                        <Label htmlFor="is_active">Active</Label>
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        name="description"
                        value={supportGroupForm.description}
                        onChange={handleSupportGroupFormChange}
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {submitting
                          ? "Saving..."
                          : editingSupportGroup
                          ? "Update"
                          : "Create"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowSupportGroupForm(false);
                          setEditingSupportGroup(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="activities">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Community Activities</CardTitle>
                <Button
                  onClick={() => {
                    setShowActivityForm(true);
                    setEditingActivity(null);
                    setActivityForm({
                      id: null,
                      name: "",
                      description: "",
                      location: "",
                      schedule: "",
                      icon: "",
                      color: "",
                      cost: "",
                      age_group: "",
                      is_active: true,
                      sort_order: 0,
                    });
                  }}
                >
                  + Add Activity
                </Button>
              </CardHeader>
              <CardContent>
                {activityError && (
                  <div className="text-red-600 mb-2">{activityError}</div>
                )}
                {loadingActivities ? (
                  <div className="py-8 text-center text-slate-500">
                    Loading...
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="p-2 border">Name</th>
                          <th className="p-2 border">Location</th>
                          <th className="p-2 border">Schedule</th>
                          <th className="p-2 border">Cost</th>
                          <th className="p-2 border">Age Group</th>
                          <th className="p-2 border">Active</th>
                          <th className="p-2 border">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activities.map((activity: any) => (
                          <tr key={activity.id} className="border-b">
                            <td className="p-2 border font-medium">
                              {activity.name}
                            </td>
                            <td className="p-2 border">{activity.location}</td>
                            <td className="p-2 border">{activity.schedule}</td>
                            <td className="p-2 border">{activity.cost}</td>
                            <td className="p-2 border">{activity.age_group}</td>
                            <td className="p-2 border text-center">
                              {activity.is_active ? "Yes" : "No"}
                            </td>
                            <td className="p-2 border text-center">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditActivity(activity)}
                                className="mr-2"
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  handleDeleteActivity(activity.id)
                                }
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {/* Form for add/edit */}
                {showActivityForm && (
                  <form
                    onSubmit={handleActivitySubmit}
                    className="mt-8 space-y-4 bg-slate-50 p-6 rounded-lg border"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Name</Label>
                        <Input
                          name="name"
                          value={activityForm.name}
                          onChange={handleActivityFormChange}
                          required
                        />
                      </div>
                      <div>
                        <Label>Location</Label>
                        <Input
                          name="location"
                          value={activityForm.location}
                          onChange={handleActivityFormChange}
                        />
                      </div>
                      <div>
                        <Label>Schedule</Label>
                        <Input
                          name="schedule"
                          value={activityForm.schedule}
                          onChange={handleActivityFormChange}
                        />
                      </div>
                      <div>
                        <Label>Icon</Label>
                        <Input
                          name="icon"
                          value={activityForm.icon}
                          onChange={handleActivityFormChange}
                          placeholder="e.g., Palette, Users, Gamepad2"
                        />
                      </div>
                      <div>
                        <Label>Color</Label>
                        <Input
                          name="color"
                          value={activityForm.color}
                          onChange={handleActivityFormChange}
                          placeholder="e.g., purple, blue, green"
                        />
                      </div>
                      <div>
                        <Label>Cost</Label>
                        <Input
                          name="cost"
                          value={activityForm.cost}
                          onChange={handleActivityFormChange}
                          placeholder="e.g., Free, $15 per session"
                        />
                      </div>
                      <div>
                        <Label>Age Group</Label>
                        <Input
                          name="age_group"
                          value={activityForm.age_group}
                          onChange={handleActivityFormChange}
                          placeholder="e.g., All ages, Adults, Teens & Adults"
                        />
                      </div>
                      <div>
                        <Label>Sort Order</Label>
                        <Input
                          name="sort_order"
                          type="number"
                          value={activityForm.sort_order}
                          onChange={handleActivityFormChange}
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-6">
                        <input
                          type="checkbox"
                          name="is_active"
                          checked={activityForm.is_active}
                          onChange={handleActivityFormChange}
                          id="activity_is_active"
                        />
                        <Label htmlFor="activity_is_active">Active</Label>
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        name="description"
                        value={activityForm.description}
                        onChange={handleActivityFormChange}
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {submitting
                          ? "Saving..."
                          : editingActivity
                          ? "Update"
                          : "Create"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowActivityForm(false);
                          setEditingActivity(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="services">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Community Services</CardTitle>
                <Button
                  onClick={() => {
                    setShowServiceForm(true);
                    setEditingService(null);
                    setServiceForm({
                      id: null,
                      name: "",
                      description: "",
                      contact: "",
                      website: "",
                      type: "",
                      eligibility: "",
                      is_active: true,
                      sort_order: 0,
                    });
                  }}
                >
                  + Add Service
                </Button>
              </CardHeader>
              <CardContent>
                {serviceError && (
                  <div className="text-red-600 mb-2">{serviceError}</div>
                )}
                {loadingServices ? (
                  <div className="py-8 text-center text-slate-500">
                    Loading...
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="p-2 border">Name</th>
                          <th className="p-2 border">Type</th>
                          <th className="p-2 border">Contact</th>
                          <th className="p-2 border">Website</th>
                          <th className="p-2 border">Eligibility</th>
                          <th className="p-2 border">Active</th>
                          <th className="p-2 border">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {services.map((service: any) => (
                          <tr key={service.id} className="border-b">
                            <td className="p-2 border font-medium">
                              {service.name}
                            </td>
                            <td className="p-2 border">{service.type}</td>
                            <td className="p-2 border">{service.contact}</td>
                            <td className="p-2 border">{service.website}</td>
                            <td className="p-2 border">
                              {service.eligibility}
                            </td>
                            <td className="p-2 border text-center">
                              {service.is_active ? "Yes" : "No"}
                            </td>
                            <td className="p-2 border text-center">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditService(service)}
                                className="mr-2"
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteService(service.id)}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {/* Form for add/edit */}
                {showServiceForm && (
                  <form
                    onSubmit={handleServiceSubmit}
                    className="mt-8 space-y-4 bg-slate-50 p-6 rounded-lg border"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Name</Label>
                        <Input
                          name="name"
                          value={serviceForm.name}
                          onChange={handleServiceFormChange}
                          required
                        />
                      </div>
                      <div>
                        <Label>Type</Label>
                        <Input
                          name="type"
                          value={serviceForm.type}
                          onChange={handleServiceFormChange}
                          placeholder="e.g., Employment, Transportation, Healthcare"
                        />
                      </div>
                      <div>
                        <Label>Contact</Label>
                        <Input
                          name="contact"
                          value={serviceForm.contact}
                          onChange={handleServiceFormChange}
                          placeholder="e.g., (555) 123-4567"
                        />
                      </div>
                      <div>
                        <Label>Website</Label>
                        <Input
                          name="website"
                          value={serviceForm.website}
                          onChange={handleServiceFormChange}
                          placeholder="e.g., www.example.org"
                        />
                      </div>
                      <div>
                        <Label>Eligibility</Label>
                        <Input
                          name="eligibility"
                          value={serviceForm.eligibility}
                          onChange={handleServiceFormChange}
                          placeholder="e.g., Adults with disabilities, All ages"
                        />
                      </div>
                      <div>
                        <Label>Sort Order</Label>
                        <Input
                          name="sort_order"
                          type="number"
                          value={serviceForm.sort_order}
                          onChange={handleServiceFormChange}
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-6">
                        <input
                          type="checkbox"
                          name="is_active"
                          checked={serviceForm.is_active}
                          onChange={handleServiceFormChange}
                          id="service_is_active"
                        />
                        <Label htmlFor="service_is_active">Active</Label>
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        name="description"
                        value={serviceForm.description}
                        onChange={handleServiceFormChange}
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {submitting
                          ? "Saving..."
                          : editingService
                          ? "Update"
                          : "Create"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowServiceForm(false);
                          setEditingService(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="coping">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Coping Strategies</CardTitle>
                <Button
                  onClick={() => {
                    setShowCopingStrategyForm(true);
                    setEditingCopingStrategy(null);
                    setCopingStrategyForm({
                      id: null,
                      title: "",
                      description: "",
                      duration: "",
                      difficulty: "",
                      icon: "",
                      color: "",
                      category: "",
                      steps: [],
                      benefits: [],
                      audio_url: "",
                      audio_duration: "",
                      audio_type: "",
                      is_active: true,
                      sort_order: 0,
                    });
                  }}
                >
                  + Add Coping Strategy
                </Button>
              </CardHeader>
              <CardContent>
                {copingStrategyError && (
                  <div className="text-red-600 mb-2">{copingStrategyError}</div>
                )}
                {loadingCopingStrategies ? (
                  <div className="py-8 text-center text-slate-500">
                    Loading...
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="p-2 border">Title</th>
                          <th className="p-2 border">Category</th>
                          <th className="p-2 border">Duration</th>
                          <th className="p-2 border">Difficulty</th>
                          <th className="p-2 border">Icon</th>
                          <th className="p-2 border">Active</th>
                          <th className="p-2 border">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {copingStrategies.map((strategy: any) => (
                          <tr key={strategy.id} className="border-b">
                            <td className="p-2 border font-medium">
                              {strategy.title}
                            </td>
                            <td className="p-2 border">
                              <Badge
                                variant={
                                  strategy.category === "immediate"
                                    ? "default"
                                    : strategy.category === "daily"
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {strategy.category}
                              </Badge>
                            </td>
                            <td className="p-2 border">{strategy.duration}</td>
                            <td className="p-2 border">
                              {strategy.difficulty}
                            </td>
                            <td className="p-2 border">{strategy.icon}</td>
                            <td className="p-2 border text-center">
                              {strategy.is_active ? "Yes" : "No"}
                            </td>
                            <td className="p-2 border text-center">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleEditCopingStrategy(strategy)
                                }
                                className="mr-2"
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  handleDeleteCopingStrategy(strategy.id)
                                }
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {/* Form for add/edit */}
                {showCopingStrategyForm && (
                  <form
                    onSubmit={handleCopingStrategySubmit}
                    className="mt-8 space-y-4 bg-slate-50 p-6 rounded-lg border"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Title</Label>
                        <Input
                          name="title"
                          value={copingStrategyForm.title}
                          onChange={handleCopingStrategyFormChange}
                          required
                        />
                      </div>
                      <div>
                        <Label>Category</Label>
                        <Select
                          name="category"
                          value={copingStrategyForm.category}
                          onValueChange={(value) =>
                            setCopingStrategyForm((prev) => ({
                              ...prev,
                              category: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediate">
                              Immediate Relief
                            </SelectItem>
                            <SelectItem value="daily">Daily Tools</SelectItem>
                            <SelectItem value="audio">Audio Support</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Duration</Label>
                        <Input
                          name="duration"
                          value={copingStrategyForm.duration}
                          onChange={handleCopingStrategyFormChange}
                          placeholder="e.g., 5-10 minutes"
                        />
                      </div>
                      <div>
                        <Label>Difficulty</Label>
                        <Select
                          name="difficulty"
                          value={copingStrategyForm.difficulty}
                          onValueChange={(value) =>
                            setCopingStrategyForm((prev) => ({
                              ...prev,
                              difficulty: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Easy">Easy</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Icon</Label>
                        <Input
                          name="icon"
                          value={copingStrategyForm.icon}
                          onChange={handleCopingStrategyFormChange}
                          placeholder="e.g., Waves, Brain, Heart"
                        />
                      </div>
                      <div>
                        <Label>Color</Label>
                        <Input
                          name="color"
                          value={copingStrategyForm.color}
                          onChange={handleCopingStrategyFormChange}
                          placeholder="e.g., blue, green, purple"
                        />
                      </div>
                      <div>
                        <Label>Sort Order</Label>
                        <Input
                          name="sort_order"
                          type="number"
                          value={copingStrategyForm.sort_order}
                          onChange={handleCopingStrategyFormChange}
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-6">
                        <input
                          type="checkbox"
                          name="is_active"
                          checked={copingStrategyForm.is_active}
                          onChange={handleCopingStrategyFormChange}
                          id="coping_is_active"
                        />
                        <Label htmlFor="coping_is_active">Active</Label>
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        name="description"
                        value={copingStrategyForm.description}
                        onChange={handleCopingStrategyFormChange}
                        rows={3}
                      />
                    </div>
                    {/* Audio fields for audio category */}
                    {copingStrategyForm.category === "audio" && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Audio URL</Label>
                          <Input
                            name="audio_url"
                            value={copingStrategyForm.audio_url}
                            onChange={handleCopingStrategyFormChange}
                            placeholder="Audio file URL"
                          />
                        </div>
                        <div>
                          <Label>Audio Duration</Label>
                          <Input
                            name="audio_duration"
                            value={copingStrategyForm.audio_duration}
                            onChange={handleCopingStrategyFormChange}
                            placeholder="e.g., 30 minutes"
                          />
                        </div>
                        <div>
                          <Label>Audio Type</Label>
                          <Input
                            name="audio_type"
                            value={copingStrategyForm.audio_type}
                            onChange={handleCopingStrategyFormChange}
                            placeholder="e.g., Nature, Focus, Meditation"
                          />
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2 mt-4">
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {submitting
                          ? "Saving..."
                          : editingCopingStrategy
                          ? "Update"
                          : "Create"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowCopingStrategyForm(false);
                          setEditingCopingStrategy(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assessments">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Assessment Types & Questions</CardTitle>
                <Button
                  onClick={() => {
                    setShowAssessmentForm(true);
                    setEditingAssessment(null);
                    setAssessmentForm({
                      id: null,
                      title: "",
                      description: "",
                      type: "",
                      category: "",
                      questions: [],
                      instructions: "",
                      duration: "",
                      difficulty: "",
                      icon: "",
                      color: "",
                      is_active: true,
                      sort_order: 0,
                    });
                  }}
                >
                  + Add Assessment
                </Button>
              </CardHeader>
              <CardContent>
                {assessmentError && (
                  <div className="text-red-600 mb-2">{assessmentError}</div>
                )}
                {loadingAssessments ? (
                  <div className="py-8 text-center text-slate-500">
                    Loading...
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="p-2 border">Title</th>
                          <th className="p-2 border">Type</th>
                          <th className="p-2 border">Category</th>
                          <th className="p-2 border">Duration</th>
                          <th className="p-2 border">Difficulty</th>
                          <th className="p-2 border">Questions</th>
                          <th className="p-2 border">Active</th>
                          <th className="p-2 border">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assessments.map((assessment: any) => (
                          <tr key={assessment.id} className="border-b">
                            <td className="p-2 border font-medium">
                              {assessment.title}
                            </td>
                            <td className="p-2 border">
                              <Badge
                                variant={
                                  assessment.type === "screening"
                                    ? "default"
                                    : assessment.type === "diagnostic"
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {assessment.type}
                              </Badge>
                            </td>
                            <td className="p-2 border">
                              <Badge variant="outline">
                                {assessment.category}
                              </Badge>
                            </td>
                            <td className="p-2 border">
                              {assessment.duration}
                            </td>
                            <td className="p-2 border">
                              {assessment.difficulty}
                            </td>
                            <td className="p-2 border text-center">
                              {assessment.questions?.length || 0}
                            </td>
                            <td className="p-2 border text-center">
                              {assessment.is_active ? "Yes" : "No"}
                            </td>
                            <td className="p-2 border text-center">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditAssessment(assessment)}
                                className="mr-2"
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  handleDeleteAssessment(assessment.id)
                                }
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {/* Form for add/edit */}
                {showAssessmentForm && (
                  <form
                    onSubmit={handleAssessmentSubmit}
                    className="mt-8 space-y-4 bg-slate-50 p-6 rounded-lg border"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Title</Label>
                        <Input
                          name="title"
                          value={assessmentForm.title}
                          onChange={handleAssessmentFormChange}
                          required
                        />
                      </div>
                      <div>
                        <Label>Type</Label>
                        <Select
                          name="type"
                          value={assessmentForm.type}
                          onValueChange={(value) =>
                            setAssessmentForm((prev) => ({
                              ...prev,
                              type: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="screening">Screening</SelectItem>
                            <SelectItem value="diagnostic">
                              Diagnostic
                            </SelectItem>
                            <SelectItem value="progress">
                              Progress Tracking
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Category</Label>
                        <Select
                          name="category"
                          value={assessmentForm.category}
                          onValueChange={(value) =>
                            setAssessmentForm((prev) => ({
                              ...prev,
                              category: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="autism">Autism</SelectItem>
                            <SelectItem value="sensory">
                              Sensory Processing
                            </SelectItem>
                            <SelectItem value="communication">
                              Communication
                            </SelectItem>
                            <SelectItem value="mental_health">
                              Mental Health
                            </SelectItem>
                            <SelectItem value="cognitive">Cognitive</SelectItem>
                            <SelectItem value="behavioral">
                              Behavioral
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Duration</Label>
                        <Input
                          name="duration"
                          value={assessmentForm.duration}
                          onChange={handleAssessmentFormChange}
                          placeholder="e.g., 10-15 minutes"
                        />
                      </div>
                      <div>
                        <Label>Difficulty</Label>
                        <Select
                          name="difficulty"
                          value={assessmentForm.difficulty}
                          onValueChange={(value) =>
                            setAssessmentForm((prev) => ({
                              ...prev,
                              difficulty: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Easy">Easy</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Icon</Label>
                        <Input
                          name="icon"
                          value={assessmentForm.icon}
                          onChange={handleAssessmentFormChange}
                          placeholder="e.g., ClipboardCheck, Brain, Heart"
                        />
                      </div>
                      <div>
                        <Label>Color</Label>
                        <Input
                          name="color"
                          value={assessmentForm.color}
                          onChange={handleAssessmentFormChange}
                          placeholder="e.g., blue, green, purple"
                        />
                      </div>
                      <div>
                        <Label>Sort Order</Label>
                        <Input
                          name="sort_order"
                          type="number"
                          value={assessmentForm.sort_order}
                          onChange={handleAssessmentFormChange}
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-6">
                        <input
                          type="checkbox"
                          name="is_active"
                          checked={assessmentForm.is_active}
                          onChange={handleAssessmentFormChange}
                          id="assessment_is_active"
                        />
                        <Label htmlFor="assessment_is_active">Active</Label>
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        name="description"
                        value={assessmentForm.description}
                        onChange={handleAssessmentFormChange}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>Instructions</Label>
                      <Textarea
                        name="instructions"
                        value={assessmentForm.instructions}
                        onChange={handleAssessmentFormChange}
                        rows={3}
                        placeholder="Instructions for taking the assessment"
                      />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {submitting
                          ? "Saving..."
                          : editingAssessment
                          ? "Update"
                          : "Create"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowAssessmentForm(false);
                          setEditingAssessment(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="communication">
            <Card>
              <CardHeader>
                <CardTitle>Communication Cards & Phrases</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Manage communication cards and phrases here. (CRUD UI coming
                  soon)
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
