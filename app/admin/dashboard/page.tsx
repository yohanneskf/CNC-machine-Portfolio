"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminNav from "@/components/AdminNav";
import ProjectForm from "@/components/ProjectForm";
import ProjectList from "@/components/ProjectList";
import ContactList from "@/components/ContactList";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiAlertCircle,
  FiLoader,
  FiDatabase,
  FiUsers,
  FiCheckCircle,
  FiPlus,
  FiRefreshCw,
  FiTrendingUp,
  FiMail,
  FiImage,
  FiActivity,
  FiTerminal,
  FiZap,
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
  images?: string[]; // Updated from 'files' to 'images' to match EdgeStore
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
      const token = localStorage.getItem("admin_token");
      if (!token) {
        router.push("/admin/login");
        return;
      }
      await fetchData(token);
    } catch (error) {
      setAuthError("Session expired or invalid.");
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (token: string) => {
    try {
      setRefreshing(true);

      // 1. Fetch Projects
      const projectsRes = await fetch("/api/projects");
      const projectsData = await projectsRes.json();
      setProjects(projectsData || []);

      // 2. Fetch Submissions (Using the consolidated API)
      const submissionsRes = await fetch("/api/contact", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!submissionsRes.ok) throw new Error("ACCESS_DENIED_BY_GATEWAY");

      const submissionsData = await submissionsRes.json();
      setSubmissions(submissionsData || []);

      // 3. Calculate Stats
      setStats({
        totalProjects: projectsData?.length || 0,
        totalSubmissions: submissionsData?.length || 0,
        pendingReviews: (submissionsData || []).filter(
          (s: ContactSubmission) => s.status === "pending"
        ).length,
        featuredProjects: (projectsData || []).filter(
          (p: Project) => p.featured
        ).length,
      });
    } catch (error) {
      setAuthError(
        `Load Error: ${error instanceof Error ? error.message : "Unknown"}`
      );
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  const handleDeleteSubmission = async (id: string) => {
    if (!confirm("CONFIRM_PERMANENT_ERASURE?")) return;
    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`/api/contact?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchData(token!);
    } catch (err) {
      console.error("ERASURE_FAILURE");
    }
  };

  const handleUpdate = () => {
    const token = localStorage.getItem("admin_token");
    if (token) fetchData(token);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <FiLoader className="h-12 w-12 text-amber-500 animate-spin mx-auto mb-4" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">
            Initializing_Admin_Kernel...
          </h3>
        </motion.div>
      </div>
    );
  }

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "projects":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-l-2 border-amber-600 pl-6">
              <div>
                <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em]">
                  Module_01
                </span>
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                  Project Catalog
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleUpdate}
                  className="p-3 bg-white/5 border border-white/10 text-gray-400 hover:text-amber-500"
                >
                  <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
                </button>
                <button
                  onClick={() => setShowProjectForm(!showProjectForm)}
                  className="bg-amber-600 text-[#030712] px-6 py-3 font-black uppercase text-[10px] tracking-widest hover:bg-amber-500"
                >
                  <FiPlus /> {showProjectForm ? "Close Editor" : "New Entry"}
                </button>
              </div>
            </div>
            {showProjectForm && (
              <div className="bg-white/5 border border-amber-500/20 p-8">
                <ProjectForm onSuccess={handleUpdate} />
              </div>
            )}
            <ProjectList projects={projects} onUpdate={handleUpdate} />
          </motion.div>
        );

      case "submissions":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="border-l-2 border-amber-600 pl-6 mb-12">
              <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em]">
                Module_02
              </span>
              <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                Inquiry Terminal
              </h1>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
              {[
                {
                  label: "Total",
                  val: stats.totalSubmissions,
                  icon: <FiUsers />,
                  color: "text-amber-500",
                },
                {
                  label: "Pending",
                  val: stats.pendingReviews,
                  icon: <FiAlertCircle />,
                  color: "text-red-500",
                },
                {
                  label: "Closed",
                  val: submissions.filter((s) => s.status === "completed")
                    .length,
                  icon: <FiZap />,
                  color: "text-green-500",
                },
                {
                  label: "Visuals",
                  val: submissions.filter(
                    (s) => s.images && s.images.length > 0
                  ).length,
                  icon: <FiImage />,
                  color: "text-blue-500",
                },
              ].map((stat, i) => (
                <div key={i} className="bg-[#030712] p-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                      {stat.label}
                    </span>
                    <span className={stat.color}>{stat.icon}</span>
                  </div>
                  <div className="text-3xl font-black text-white">
                    {stat.val}
                  </div>
                </div>
              ))}
            </div>

            <ContactList
              submissions={submissions}
              onDelete={handleDeleteSubmission}
            />
          </motion.div>
        );

      case "analytics":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="border-l-2 border-amber-600 pl-6 mb-12">
              <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em]">
                Module_03
              </span>
              <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                Diagnostics
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-[#0a0a0b] border border-white/10 p-8">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white mb-8 flex items-center gap-2">
                  <FiActivity className="text-amber-500" /> Project_Matrix
                </h3>
                <div className="space-y-6">
                  {Object.entries(
                    projects.reduce((acc: any, p) => {
                      acc[p.category] = (acc[p.category] || 0) + 1;
                      return acc;
                    }, {})
                  ).map(([cat, count]: any) => (
                    <div key={cat}>
                      <div className="flex justify-between text-[10px] font-mono mb-2 uppercase">
                        <span className="text-gray-400">{cat}</span>
                        <span className="text-amber-500">{count} Units</span>
                      </div>
                      <div className="h-1 bg-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(count / projects.length) * 100}%`,
                          }}
                          className="h-full bg-amber-600"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#0a0a0b] border border-white/10 p-8">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white mb-8 flex items-center gap-2">
                  <FiTerminal className="text-amber-500" /> Operational_Flow
                </h3>
                <div className="space-y-4">
                  {["pending", "contacted", "quoted", "completed"].map(
                    (status) => (
                      <div
                        key={status}
                        className="flex justify-between p-4 bg-white/5 border border-white/5"
                      >
                        <span className="text-[10px] font-bold uppercase text-gray-500">
                          {status}
                        </span>
                        <span className="text-xl font-black text-white">
                          {
                            submissions.filter((s) => s.status === status)
                              .length
                          }
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      {/* Background HUD Grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(245,158,11,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.2) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <AdminNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <main className="max-w-[1600px] mx-auto px-6 py-12 relative z-10">
        {renderActiveTabContent()}

        {authError && (
          <div className="fixed bottom-10 right-10 p-6 bg-red-900/20 border border-red-500/50 text-red-500 font-mono text-[10px] uppercase flex items-center gap-4">
            <FiAlertCircle /> SYST_ERROR: {authError}
            <button
              onClick={() => window.location.reload()}
              className="underline ml-4"
            >
              Retry
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
