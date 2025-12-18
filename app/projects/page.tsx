"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import ProjectCard from "@/components/ProjectCard";
import ProjectFilter from "@/components/ProjectFilter";
import Link from "next/link";
import { FiArrowRight, FiLoader } from "react-icons/fi";

interface Project {
  id: string;
  titleEn: string;
  titleAm: string;
  descriptionEn: string;
  descriptionAm: string;
  category: string;
  materials: string[];
  images: string[];
  featured: boolean;
  dimensions?: {
    length?: string;
    width?: string;
    height?: string;
    unit?: string;
  };
}

export default function ProjectsPage() {
  const { language, t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/projects");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProjects(data);
      setFilteredProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to load projects. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === "all") {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(
        (project) => project.category === category
      );
      setFilteredProjects(filtered);
    }
  };

  const categories = [
    { id: "all", label: t("projects.category.all") },
    { id: "living", label: t("projects.category.living") },
    { id: "bedroom", label: t("projects.category.bedroom") },
    { id: "office", label: t("projects.category.office") },
    { id: "commercial", label: t("projects.category.commercial") },
  ];

  const retryFetch = () => {
    fetchProjects();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t("projects.title")}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {language === "en"
              ? "Explore our portfolio of precision CNC furniture designs"
              : "የትክክለኛ CNC የዕቃ ንድፎቻችንን ፖርትፎሊዮ ያስሱ"}
          </p>
        </div>

        {/* Filter Section */}
        <div className="mb-8">
          <ProjectFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex flex-col items-center justify-center text-center py-8">
              <div className="text-red-600 mb-4">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Error Loading Projects
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={retryFetch}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && !error && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <FiLoader className="h-12 w-12 text-blue-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-gray-50 rounded-full"></div>
              </div>
            </div>
            <p className="mt-4 text-gray-600">Loading projects...</p>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  language={language}
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredProjects.length === 0 && (
              <div className="text-center py-16">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {language === "en" ? "No Projects Found" : "ፕሮጀክቶች አልተገኙም"}
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {language === "en"
                    ? "No projects match the selected category. Try choosing a different category."
                    : "በተመረጠው ምድብ ውስጥ ምንም ፕሮጀክቶች አልተገኙም። ሌላ ምድብ ይሞክሩ።"}
                </p>
                <button
                  onClick={() => handleCategoryChange("all")}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  {t("projects.category.all")}
                </button>
              </div>
            )}

            {/* Stats and CTA */}
            {filteredProjects.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      {filteredProjects.length}
                    </div>
                    <div className="text-gray-600">
                      {language === "en"
                        ? "Projects Displayed"
                        : "የተቀመጡ ፕሮጀክቶች"}
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      {new Set(filteredProjects.map((p) => p.category)).size}
                    </div>
                    <div className="text-gray-600">
                      {language === "en" ? "Categories" : "ምድቦች"}
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      {filteredProjects.filter((p) => p.featured).length}
                    </div>
                    <div className="text-gray-600">
                      {language === "en" ? "Featured Projects" : "የተለዩ ፕሮጀክቶች"}
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="inline-flex flex-col sm:flex-row items-center gap-4">
                    <div className="text-gray-600">
                      {language === "en"
                        ? "Looking for a custom design?"
                        : "ብጁ ዲዛይን ይፈልጋሉ?"}
                    </div>
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-lg font-semibold transition-colors group"
                    >
                      <span>
                        {language === "en" ? "Request a Quote" : "ዋጋ ይጠይቁ"}
                      </span>
                      <FiArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
