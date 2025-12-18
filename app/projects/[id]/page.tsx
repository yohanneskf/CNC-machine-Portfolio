"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, FreeMode } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import {
  FiArrowLeft,
  FiShare2,
  FiCalendar,
  FiPackage,
  FiTool,
  FiDroplet,
  FiMaximize2,
  FiMessageSquare,
  FiTag,
  FiLoader,
  FiExternalLink,
} from "react-icons/fi";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";

interface Project {
  id: string;
  titleEn: string;
  titleAm: string;
  descriptionEn: string;
  descriptionAm: string;
  category: string;
  materials: string[];
  dimensions?: {
    length?: string;
    width?: string;
    height?: string;
    unit?: string;
  };
  images: string[];
  featured: boolean;
  createdAt: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { language } = useLanguage();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Get the project ID from URL params
  const projectId = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (projectId) {
      fetchProject();
    } else {
      setError("No project ID provided");
      setLoading(false);
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching project with ID:", projectId);

      const response = await fetch(`/api/projects/${projectId}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Project not found");
        }
        throw new Error(`Failed to fetch project: ${response.status}`);
      }

      const data = await response.json();
      setProject(data);
    } catch (error) {
      console.error("Error fetching project:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: project?.titleEn || "CNC Project",
          text:
            project?.descriptionEn?.substring(0, 100) + "..." ||
            "Check out this CNC furniture project",
          url: window.location.href,
        });
      } catch (error) {
        console.log("Sharing cancelled or failed");
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">
            {language === "en"
              ? "Loading project details..."
              : "የፕሮጀክት ዝርዝሮች በመጫን ላይ..."}
          </p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="text-center max-w-md p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiMessageSquare className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {language === "en" ? "Project Not Found" : "ፕሮጀክት አልተገኙም"}
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The project you are looking for does not exist."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <FiArrowLeft className="mr-2 h-5 w-5" />
              {language === "en" ? "Back to Projects" : "ወደ ፕሮጀክቶች ተመለስ"}
            </Link>
            <button
              onClick={() => router.refresh()}
              className="inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {language === "en" ? "Try Again" : "እንደገና ይሞክሩ"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const title = language === "en" ? project.titleEn : project.titleAm;
  const description =
    language === "en" ? project.descriptionEn : project.descriptionAm;

  const categories: Record<string, string> = {
    living: language === "en" ? "Living Room" : "ክፍል አቀማመጥ",
    bedroom: language === "en" ? "Bedroom" : "የእርግብ ክፍል",
    office: language === "en" ? "Office" : "ቢሮ",
    commercial: language === "en" ? "Commercial" : "ንግድ",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link
            href="/projects"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold group"
          >
            <FiArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            {language === "en" ? "Back to Projects" : "ወደ ፕሮጀክቶች ተመለስ"}
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative aspect-square">
                {project.images.length > 0 ? (
                  <Image
                    src={project.images[activeImageIndex]}
                    alt={`${title} - Main view`}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-gray-100 flex items-center justify-center">
                    <FiPackage className="h-16 w-16 text-gray-400" />
                    <span className="ml-3 text-gray-500">
                      {language === "en" ? "No image available" : "ምስል አልተገኘም"}
                    </span>
                  </div>
                )}
                <button
                  onClick={handleShare}
                  className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                  title={language === "en" ? "Share" : "አጋራ"}
                >
                  <FiShare2 className="h-5 w-5 text-gray-700" />
                </button>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {project.images.length > 1 && (
              <div className="bg-white rounded-2xl shadow-lg p-4">
                <Swiper
                  modules={[FreeMode, Thumbs]}
                  spaceBetween={8}
                  slidesPerView={4}
                  freeMode={true}
                  watchSlidesProgress={true}
                  onSwiper={setThumbsSwiper}
                  className="thumbnails"
                >
                  {project.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <button
                        onClick={() => setActiveImageIndex(index)}
                        className={`relative aspect-square rounded-lg overflow-hidden transition-all ${
                          activeImageIndex === index
                            ? "ring-2 ring-blue-500 ring-offset-2"
                            : "opacity-60 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${title} - Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>

          {/* Project Details */}
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full text-sm font-semibold">
                      <FiTag className="h-4 w-4" />
                      {categories[project.category] || project.category}
                    </span>
                    {project.featured && (
                      <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-1.5 rounded-full text-sm font-semibold">
                        <FiTag className="h-4 w-4" />
                        {language === "en" ? "Featured" : "የተለዩ"}
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    {title}
                  </h1>
                  <p className="text-gray-500 mt-2 flex items-center">
                    <FiCalendar className="h-4 w-4 mr-2" />
                    {new Date(project.createdAt).toLocaleDateString(
                      language === "en" ? "en-US" : "am-ET",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {language === "en" ? "Description" : "መግለጫ"}
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {project.dimensions && (
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <FiPackage className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {language === "en" ? "Dimensions" : "የመጠን መለኪያዎች"}
                        </h4>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          {project.dimensions.length || "N/A"} ×{" "}
                          {project.dimensions.width || "N/A"} ×{" "}
                          {project.dimensions.height || "N/A"}{" "}
                          {project.dimensions.unit || ""}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <FiDroplet className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {language === "en" ? "Finish" : "መጨረሻ"}
                      </h4>
                      <p className="text-lg text-gray-700 mt-1">
                        {language === "en"
                          ? "Matte Lacquer Finish"
                          : "ማት ላከር መጨረሻ"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Materials */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {language === "en" ? "Materials Used" : "የተጠቀሙ ቁሳቁሶች"}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {project.materials.map((material, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2.5 rounded-lg"
                    >
                      <FiTool className="h-4 w-4" />
                      {material}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl font-semibold text-center transition-colors flex items-center justify-center gap-2"
                >
                  <FiMessageSquare className="h-5 w-5" />
                  {language === "en"
                    ? "Request Similar Design"
                    : "ተመሳሳይ ዲዛይን ይጠይቁ"}
                </Link>
                <button
                  onClick={handleShare}
                  className="flex-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <FiShare2 className="h-5 w-5" />
                  {language === "en" ? "Share Project" : "ፕሮጀክት አጋራ"}
                </button>
              </div>
            </div>

            {/* Related Projects */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                {language === "en" ? "You Might Also Like" : "ሊወዱት ይችላሉ"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/projects"
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                >
                  <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <FiPackage className="h-8 w-8 text-gray-400 group-hover:text-blue-400" />
                  </div>
                  <p className="font-medium text-gray-900 group-hover:text-blue-600">
                    {language === "en"
                      ? "View All Projects"
                      : "ሁሉንም ፕሮጀክቶች ይመልከቱ"}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <FiExternalLink className="h-3 w-3 mr-1" />
                    {language === "en" ? "Explore more" : "ተጨማሪ ያስሱ"}
                  </p>
                </Link>
                <Link
                  href="/contact"
                  className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors group"
                >
                  <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <FiMessageSquare className="h-8 w-8 text-gray-400 group-hover:text-green-400" />
                  </div>
                  <p className="font-medium text-gray-900 group-hover:text-green-600">
                    {language === "en"
                      ? "Custom Design Request"
                      : "ብጁ ዲዛይን ጥያቄ"}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <FiExternalLink className="h-3 w-3 mr-1" />
                    {language === "en" ? "Start a project" : "ፕሮጀክት ይጀምሩ"}
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .thumbnails .swiper-slide {
          opacity: 0.4;
          transition: opacity 0.3s;
        }
        .thumbnails .swiper-slide-thumb-active {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
