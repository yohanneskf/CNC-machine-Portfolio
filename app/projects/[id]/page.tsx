"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import {
  FiArrowLeft,
  FiShare2,
  FiHeart,
  FiCalendar,
  FiPackage,
  FiTool,
  FiDroplet,
  FiMaximize2,
} from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

interface Project {
  id: string;
  titleEn: string;
  titleAm: string;
  descriptionEn: string;
  descriptionAm: string;
  category: string;
  materials: string[];
  dimensions: any;
  images: string[];
  createdAt: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const { language } = useLanguage();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProject();
  }, [params.id]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}`);
      const data = await response.json();
      setProject(data);
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Project not found
          </h2>
          <Link
            href="/projects"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const title = language === "en" ? project.titleEn : project.titleAm;
  const description =
    language === "en" ? project.descriptionEn : project.descriptionAm;

  const categories = {
    living: "Living Room",
    bedroom: "Bedroom",
    office: "Office",
    commercial: "Commercial",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link
            href="/projects"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
          >
            <FiArrowLeft className="h-5 w-5 mr-2" />
            Back to Projects
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
              <Swiper
                modules={[Navigation, Thumbs]}
                navigation
                thumbs={{ swiper: thumbsSwiper }}
                className="rounded-lg overflow-hidden"
              >
                {project.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative aspect-square">
                      <Image
                        src={image}
                        alt={`${title} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg">
                        <FiMaximize2 className="h-5 w-5 text-gray-700" />
                      </button>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Thumbnails */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <Swiper
                modules={[Thumbs]}
                watchSlidesProgress
                onSwiper={setThumbsSwiper as any}
                spaceBetween={10}
                slidesPerView={4}
                className="thumbnails"
              >
                {project.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <button
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden ${
                        selectedImage === index ? "ring-2 ring-blue-500" : ""
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* Project Details */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="inline-block bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-semibold mb-3">
                    {categories[project.category as keyof typeof categories]}
                  </span>
                  <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <FiHeart className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <FiShare2 className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 mb-8 leading-relaxed">
                {description}
              </p>

              {/* Specifications */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Specifications
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <FiPackage className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Dimensions</p>
                      <p className="font-medium">
                        {project.dimensions?.length} ×{" "}
                        {project.dimensions?.width} ×{" "}
                        {project.dimensions?.height} {project.dimensions?.unit}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <FiCalendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Completed</p>
                      <p className="font-medium">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Materials */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Materials Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.materials.map((material, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center"
                    >
                      <FiTool className="h-4 w-4 mr-2" />
                      {material}
                    </span>
                  ))}
                </div>
              </div>

              {/* Finishes */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Finishes
                </h3>
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <FiDroplet className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Finish Type</p>
                    <p className="font-medium">Matte Lacquer Finish</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex space-x-4">
                <Link
                  href="/contact"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-center transition-colors"
                >
                  Request Similar Design
                </Link>
                <button className="flex-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition-colors">
                  Download Spec Sheet
                </button>
              </div>
            </div>

            {/* Related Projects */}
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Related Projects
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Add related projects here */}
                <div className="bg-white rounded-xl shadow-lg p-4">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                  <h4 className="font-semibold text-gray-900">
                    Modern Bookshelf
                  </h4>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-4">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                  <h4 className="font-semibold text-gray-900">Office Desk</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
