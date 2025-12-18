"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminNav from "@/components/AdminNav";
import ProjectForm from "@/components/ProjectForm";
import ProjectList from "@/components/ProjectList";
import ContactList from "@/components/ContactList";
import {
  FiAlertCircle,
  FiLoader,
  FiDatabase,
  FiUsers,
  FiCheckCircle,
  FiGrid,
  FiMessageSquare,
  FiBarChart2,
  FiPlus,
  FiRefreshCw,
  FiTrendingUp,
  FiFolder,
  FiMail,
  FiImage,
} from "react-icons/fi";

interface Project {
  id: string;
  titleEn: string;
  titleAm: string;
  category: string;
  materials: string[];
  featured: boolean;
  createdAt: string;
  images: string[];
}

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  description: string;
  budget?: string;
  timeline?: string;
  files?: string[];
  status: "pending" | "contacted" | "quoted" | "completed" | "cancelled";
  language: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalSubmissions: 0,
    pendingReviews: 0,
    featuredProjects: 0,
  });
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    try {
      setLoading(true);
      setAuthError("");

      const token = localStorage.getItem("admin_token");

      if (!token) {
        setAuthError("No authentication token found. Please login.");
        router.push("/admin/login");
        return;
      }

      try {
        const verifyResponse = await fetch("/api/admin/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!verifyResponse.ok) {
          console.warn("Token verification failed, but continuing anyway");
        }
      } catch (verifyError) {
        console.warn("Token verification error:", verifyError);
      }

      await fetchData(token);
    } catch (error) {
      console.error("Auth check failed:", error);
      setAuthError("Authentication failed. Please login again.");
      localStorage.removeItem("admin_token");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (token: string) => {
    try {
      setRefreshing(true);

      // Fetch projects
      const projectsRes = await fetch("/api/projects");
      if (!projectsRes.ok) {
        throw new Error(`Projects fetch failed: ${projectsRes.status}`);
      }
      const projectsData = await projectsRes.json();
      setProjects(projectsData || []);

      // Fetch submissions
      let submissionsData: ContactSubmission[] = [];
      try {
        const submissionsRes = await fetch("/api/admin/submissions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (submissionsRes.ok) {
          submissionsData = await submissionsRes.json();
        } else {
          const publicRes = await fetch("/api/admin/submissions");
          if (publicRes.ok) {
            submissionsData = await publicRes.json();
          }
        }
      } catch (submissionsError) {
        console.warn("Submissions API error:", submissionsError);
      }

      setSubmissions(submissionsData || []);

      // Update stats
      const featuredCount = (projectsData || []).filter(
        (p: Project) => p.featured
      ).length;
      const pendingCount = (submissionsData || []).filter(
        (s) => s.status === "pending"
      ).length;

      setStats({
        totalProjects: projectsData?.length || 0,
        totalSubmissions: submissionsData?.length || 0,
        pendingReviews: pendingCount,
        featuredProjects: featuredCount,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setAuthError(
        `Failed to load data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    document.cookie =
      "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/admin/login");
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setShowProjectForm(false);
    // Scroll to top when changing tabs
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = () => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      fetchData(token);
    }
  };

  const refreshData = () => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      fetchData(token);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <FiLoader className="h-16 w-16 text-blue-600 animate-spin mx-auto mb-4" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-white rounded-full"></div>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Dashboard
          </h3>
          <p className="text-gray-600">
            Please wait while we load your data...
          </p>
        </div>
      </div>
    );
  }

  if (authError && authError.includes("No authentication token found")) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiAlertCircle className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Authentication Required
            </h2>
            <p className="text-gray-600 mb-8">
              Please login to access the admin dashboard
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push("/admin/login")}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                Go to Login
              </button>
              <button
                onClick={checkAuthAndFetchData}
                className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 py-3 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Helper function to render only active tab content
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "projects":
        return (
          <div className="space-y-8">
            {/* Projects Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Projects Management
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage your CNC furniture portfolio
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={refreshData}
                  disabled={refreshing}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <FiRefreshCw
                    className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                  />
                  <span className="text-sm font-medium">Refresh</span>
                </button>
                <button
                  onClick={() => setShowProjectForm(!showProjectForm)}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold"
                >
                  <FiPlus className="h-5 w-5" />
                  {showProjectForm ? "Hide Form" : "Add Project"}
                </button>
              </div>
            </div>

            {/* Project Form */}
            {showProjectForm && (
              <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <ProjectForm onSuccess={handleUpdate} />
              </div>
            )}

            {/* Projects List */}
            {projects.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    All Projects ({projects.length})
                  </h2>
                  <div className="text-sm text-gray-500">
                    {stats.featuredProjects} featured •{" "}
                    {projects.length - stats.featuredProjects} regular
                  </div>
                </div>
                <ProjectList projects={projects} onUpdate={handleUpdate} />
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiDatabase className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Projects Yet
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Start building your portfolio by adding your first CNC
                  furniture project
                </p>
                <button
                  onClick={() => setShowProjectForm(true)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold"
                >
                  <FiPlus className="h-5 w-5" />
                  Create Your First Project
                </button>
              </div>
            )}
          </div>
        );

      case "submissions":
        return (
          <div className="space-y-8">
            {/* Submissions Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Contact Submissions
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage customer inquiries and project requests
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={refreshData}
                  disabled={refreshing}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <FiRefreshCw
                    className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                  />
                  <span className="text-sm font-medium">Refresh</span>
                </button>
              </div>
            </div>

            {/* Submissions Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Total</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {stats.totalSubmissions}
                    </p>
                  </div>
                  <div className="bg-blue-100 p-2.5 rounded-lg">
                    <FiUsers className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-white border border-yellow-100 rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-700">
                      Pending
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {stats.pendingReviews}
                    </p>
                  </div>
                  <div className="bg-yellow-100 p-2.5 rounded-lg">
                    <FiAlertCircle className="h-5 w-5 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">
                      Contacted
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {
                        submissions.filter((s) => s.status === "contacted")
                          .length
                      }
                    </p>
                  </div>
                  <div className="bg-green-100 p-2.5 rounded-lg">
                    <FiCheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700">
                      Completed
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {
                        submissions.filter((s) => s.status === "completed")
                          .length
                      }
                    </p>
                  </div>
                  <div className="bg-purple-100 p-2.5 rounded-lg">
                    <FiTrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Submissions List */}
            {submissions && submissions.length > 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <ContactList
                  submissions={submissions}
                  onUpdate={handleUpdate}
                />
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-green-50 to-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiMail className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Submissions Yet
                </h3>
                <p className="text-gray-600 mb-4 max-w-md mx-auto">
                  Customer inquiries from your contact form will appear here
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>✓ Make sure your contact form is working</p>
                  <p>✓ Check database connection</p>
                  <p>✓ Test the contact form on your website</p>
                </div>
              </div>
            )}
          </div>
        );

      case "analytics":
        return (
          <div className="space-y-8">
            {/* Analytics Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Analytics Dashboard
                </h1>
                <p className="text-gray-600 mt-2">
                  Overview of your portfolio performance and insights
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={refreshData}
                  disabled={refreshing}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <FiRefreshCw
                    className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                  />
                  <span className="text-sm font-medium">Refresh Data</span>
                </button>
              </div>
            </div>

            {/* Main Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Project Categories */}
              <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Project Categories
                  </h3>
                  <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {new Set(projects.map((p) => p.category)).size} categories
                  </div>
                </div>
                <div className="space-y-4">
                  {(() => {
                    const categoryCount: Record<string, number> = {};
                    projects.forEach((project) => {
                      categoryCount[project.category] =
                        (categoryCount[project.category] || 0) + 1;
                    });

                    return Object.entries(categoryCount)
                      .sort(([, a], [, b]) => b - a)
                      .map(([category, count]) => {
                        const percentage =
                          projects.length > 0
                            ? (count / projects.length) * 100
                            : 0;
                        return (
                          <div key={category} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-3 h-3 rounded-full bg-gradient-to-r ${getCategoryColor(
                                    category
                                  )}`}
                                ></div>
                                <span className="font-medium text-gray-900 capitalize">
                                  {category}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-gray-900">
                                  {count}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {percentage.toFixed(1)}%
                                </span>
                              </div>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full bg-gradient-to-r ${getCategoryColor(
                                  category
                                )}`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      });
                  })()}
                </div>
              </div>

              {/* Submission Status */}
              <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Submission Status
                  </h3>
                  <div className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {stats.totalSubmissions} total
                  </div>
                </div>
                <div className="space-y-4">
                  {(() => {
                    const statusCount: Record<string, number> = {};
                    submissions.forEach((submission) => {
                      statusCount[submission.status] =
                        (statusCount[submission.status] || 0) + 1;
                    });

                    const statusOrder = [
                      "pending",
                      "contacted",
                      "quoted",
                      "completed",
                      "cancelled",
                    ];
                    return statusOrder
                      .filter((status) => statusCount[status])
                      .map((status) => {
                        const count = statusCount[status] || 0;
                        const percentage =
                          submissions.length > 0
                            ? (count / submissions.length) * 100
                            : 0;
                        const statusColors: Record<string, string> = {
                          pending: "from-yellow-500 to-amber-500",
                          contacted: "from-blue-500 to-blue-600",
                          quoted: "from-purple-500 to-purple-600",
                          completed: "from-green-500 to-green-600",
                          cancelled: "from-red-500 to-red-600",
                        };

                        return (
                          <div key={status} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-3 h-3 rounded-full bg-gradient-to-r ${
                                    statusColors[status] ||
                                    "from-gray-500 to-gray-600"
                                  }`}
                                ></div>
                                <span className="font-medium text-gray-900 capitalize">
                                  {status}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-gray-900">
                                  {count}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {percentage.toFixed(1)}%
                                </span>
                              </div>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full bg-gradient-to-r ${
                                  statusColors[status] ||
                                  "from-gray-500 to-gray-600"
                                }`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      });
                  })()}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {[...projects]
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .slice(0, 3)
                  .map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-blue-200 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
                          {project.images?.[0] ? (
                            <img
                              src={project.images[0]}
                              alt={project.titleEn}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FiImage className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {project.titleEn}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                              {project.category}
                            </span>
                            {project.featured && (
                              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {project.materials.slice(0, 2).join(", ")}
                          {project.materials.length > 2 && "..."}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      living: "from-blue-500 to-blue-600",
      bedroom: "from-purple-500 to-purple-600",
      office: "from-green-500 to-green-600",
      commercial: "from-orange-500 to-orange-600",
      default: "from-gray-500 to-gray-600",
    };
    return colors[category] || colors.default;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AdminNav
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onLogout={handleLogout}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Only show active tab content */}
        {renderActiveTabContent()}

        {/* Global Error Message */}
        {authError && !authError.includes("No authentication token found") && (
          <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <FiAlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-yellow-800">
                  Attention Required
                </p>
                <p className="text-sm text-yellow-700 mt-1">{authError}</p>
                <button
                  onClick={checkAuthAndFetchData}
                  className="mt-2 text-sm text-yellow-800 hover:text-yellow-900 font-medium"
                >
                  Try reloading data
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
