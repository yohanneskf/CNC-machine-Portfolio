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
} from "react-icons/fi";

interface Project {
  id: string;
  titleEn: string;
  titleAm: string;
  category: string;
  materials: string[];
  featured: boolean;
  createdAt: string;
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
  status: "pending" | "contacted" | "quoted" | "completed" | "cancelled";
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
  });
  const router = useRouter();

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    try {
      setLoading(true);
      setAuthError("");

      // Check if we have a token
      const token = localStorage.getItem("admin_token");

      if (!token) {
        setAuthError("No authentication token found. Please login.");
        router.push("/admin/login");
        return;
      }

      // Try to verify token first (optional for now)
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
        // Continue anyway for now
      }

      // Fetch data
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
      console.log("Fetching data...");

      // Fetch projects without auth for now
      const projectsRes = await fetch("/api/projects");

      if (!projectsRes.ok) {
        throw new Error(`Projects fetch failed: ${projectsRes.status}`);
      }

      const projectsData = await projectsRes.json();
      setProjects(projectsData || []); // Ensure it's an array
      console.log("Projects loaded:", projectsData?.length || 0);

      // Fetch submissions with auth (try without auth if fails)
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
          console.warn("Submissions fetch failed with auth, trying without...");
          // Try without auth
          const publicRes = await fetch("/api/admin/submissions");
          if (publicRes.ok) {
            submissionsData = await publicRes.json();
          }
        }
      } catch (submissionsError) {
        console.warn("Submissions API error:", submissionsError);
      }

      setSubmissions(submissionsData || []);
      console.log("Submissions loaded:", submissionsData?.length || 0);

      // Update stats
      setStats({
        totalProjects: projectsData?.length || 0,
        totalSubmissions: submissionsData?.length || 0,
        pendingReviews: (submissionsData || []).filter(
          (s) => s.status === "pending"
        ).length,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setAuthError(
        `Failed to load data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    // Clear cookie
    document.cookie =
      "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/admin/login");
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleUpdate = () => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      fetchData(token);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (authError && authError.includes("No authentication token found")) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
          <FiAlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please login to access the admin dashboard
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push("/admin/login")}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Go to Login
            </button>
            <button
              onClick={checkAuthAndFetchData}
              className="w-full bg-gray-100 text-gray-800 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onLogout={handleLogout}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Manage projects, submissions, and view analytics
              </p>
            </div>
            {authError &&
              !authError.includes("No authentication token found") && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md">
                  <div className="flex items-center">
                    <FiAlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                    <p className="text-sm text-yellow-800">{authError}</p>
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Projects
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalProjects}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FiDatabase className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Submissions
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalSubmissions}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <FiUsers className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Pending Reviews
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.pendingReviews}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <FiCheckCircle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setActiveTab("projects")}
              className="bg-white rounded-xl shadow p-6 text-left hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <FiGrid className="h-8 w-8 text-blue-600" />
                <span className="text-blue-600 font-semibold">View All</span>
              </div>
              <h3 className="font-semibold text-gray-900">Projects</h3>
              <p className="text-sm text-gray-600 mt-1">
                Manage your portfolio projects
              </p>
            </button>

            <button
              onClick={() => setActiveTab("submissions")}
              className="bg-white rounded-xl shadow p-6 text-left hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <FiMessageSquare className="h-8 w-8 text-green-600" />
                <span className="text-green-600 font-semibold">View All</span>
              </div>
              <h3 className="font-semibold text-gray-900">Submissions</h3>
              <p className="text-sm text-gray-600 mt-1">
                Manage customer inquiries
              </p>
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className="bg-white rounded-xl shadow p-6 text-left hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <FiBarChart2 className="h-8 w-8 text-purple-600" />
                <span className="text-purple-600 font-semibold">View All</span>
              </div>
              <h3 className="font-semibold text-gray-900">Analytics</h3>
              <p className="text-sm text-gray-600 mt-1">
                View project statistics
              </p>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg">
          {/* Tab Navigation */}
          <div className="border-b">
            <nav className="flex -mb-px">
              {[
                {
                  id: "projects",
                  label: "Projects",
                  icon: <FiGrid className="h-5 w-5 mr-2" />,
                },
                {
                  id: "submissions",
                  label: "Submissions",
                  icon: <FiMessageSquare className="h-5 w-5 mr-2" />,
                },
                {
                  id: "analytics",
                  label: "Analytics",
                  icon: <FiBarChart2 className="h-5 w-5 mr-2" />,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "projects" && (
              <div className="space-y-8">
                <ProjectForm onSuccess={handleUpdate} />

                {projects.length > 0 ? (
                  <ProjectList projects={projects} onUpdate={handleUpdate} />
                ) : (
                  <div className="text-center py-12">
                    <FiDatabase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Projects Yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Add your first project using the form above
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "submissions" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Contact Submissions
                  </h2>
                  <p className="text-gray-600">
                    Manage customer inquiries and project requests
                  </p>
                </div>

                {/* FIXED: Check if submissions is defined and has length */}
                {submissions && submissions.length > 0 ? (
                  <ContactList
                    submissions={submissions}
                    onUpdate={handleUpdate}
                  />
                ) : (
                  <div className="text-center py-12">
                    <FiUsers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Submissions Yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Customer inquiries will appear here
                    </p>
                    <p className="text-sm text-gray-500">
                      Make sure your contact form is working and sending data to
                      the database
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Analytics Dashboard
                  </h2>
                  <p className="text-gray-600">
                    Overview of your portfolio performance
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Project Categories */}
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">
                      Project Categories
                    </h3>
                    <div className="space-y-3">
                      {(() => {
                        const categoryCount: Record<string, number> = {};
                        projects.forEach((project) => {
                          categoryCount[project.category] =
                            (categoryCount[project.category] || 0) + 1;
                        });

                        return Object.entries(categoryCount).map(
                          ([category, count]) => (
                            <div
                              key={category}
                              className="flex justify-between items-center"
                            >
                              <span className="text-blue-700 capitalize">
                                {category}
                              </span>
                              <span className="font-bold text-blue-900">
                                {count}
                              </span>
                            </div>
                          )
                        );
                      })()}
                    </div>
                  </div>

                  {/* Submission Status */}
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-900 mb-4">
                      Submission Status
                    </h3>
                    <div className="space-y-3">
                      {(() => {
                        const statusCount: Record<string, number> = {};
                        submissions.forEach((submission) => {
                          statusCount[submission.status] =
                            (statusCount[submission.status] || 0) + 1;
                        });

                        return Object.entries(statusCount).map(
                          ([status, count]) => (
                            <div
                              key={status}
                              className="flex justify-between items-center"
                            >
                              <span className="text-green-700 capitalize">
                                {status}
                              </span>
                              <span className="font-bold text-green-900">
                                {count}
                              </span>
                            </div>
                          )
                        );
                      })()}
                    </div>
                  </div>

                  {/* Featured Projects */}
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-900 mb-4">
                      Featured Projects
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-purple-700">Total Featured</span>
                        <span className="font-bold text-purple-900">
                          {projects.filter((p) => p.featured).length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-700">Total Projects</span>
                        <span className="font-bold text-purple-900">
                          {projects.length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-700">Featured Ratio</span>
                        <span className="font-bold text-purple-900">
                          {projects.length > 0
                            ? `${Math.round(
                                (projects.filter((p) => p.featured).length /
                                  projects.length) *
                                  100
                              )}%`
                            : "0%"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {projects.slice(0, 3).map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {project.titleEn}
                          </p>
                          <p className="text-sm text-gray-600 capitalize">
                            {project.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {new Date(project.createdAt).toLocaleDateString()}
                          </p>
                          {project.featured && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
