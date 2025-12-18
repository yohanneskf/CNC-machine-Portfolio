"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminNav from "@/components/AdminNav";
import ProjectForm from "@/components/ProjectForm";
import ProjectList from "@/components/ProjectList";
import ContactList from "@/components/ContactList";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("projects");
  const [projects, setProjects] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [projectsRes, submissionsRes] = await Promise.all([
      fetch("/api/projects"),
      fetch("/api/admin/submissions"),
    ]);

    const projectsData = await projectsRes.json();
    const submissionsData = await submissionsRes.json();

    setProjects(projectsData);
    setSubmissions(submissionsData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "projects" && (
          <div className="space-y-8">
            <ProjectForm onSuccess={fetchData} />
            <ProjectList projects={projects} onUpdate={fetchData} />
          </div>
        )}

        {activeTab === "submissions" && (
          <ContactList submissions={submissions} onUpdate={fetchData} />
        )}

        {activeTab === "analytics" && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Analytics Dashboard
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900">
                  Total Projects
                </h3>
                <p className="text-3xl font-bold text-blue-700 mt-2">
                  {projects.length}
                </p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900">
                  Total Submissions
                </h3>
                <p className="text-3xl font-bold text-green-700 mt-2">
                  {submissions.length}
                </p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-900">
                  Pending Reviews
                </h3>
                <p className="text-3xl font-bold text-purple-700 mt-2">
                  {
                    submissions.filter((s: any) => s.status === "pending")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
