"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import ProjectCard from "@/components/ProjectCard";
import Link from "next/link";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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
}

export default function FeaturedProjects() {
  const { language } = useLanguage();
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProjects();
  }, []);

  const fetchFeaturedProjects = async () => {
    try {
      const response = await fetch("/api/projects/featured");
      const data = await response.json();
      setFeaturedProjects(data);
    } catch (error) {
      console.error("Error fetching featured projects:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (featuredProjects.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Featured Works</h3>
          <p className="text-gray-600 mt-2">
            Our most outstanding CNC furniture projects
          </p>
        </div>
        <Link
          href="/projects"
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold"
        >
          <span>View All Projects</span>
          <FiArrowRight className="h-5 w-5" />
        </Link>
      </div>

      <div className="relative">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="featured-swiper"
        >
          {featuredProjects.map((project) => (
            <SwiperSlide key={project.id}>
              <ProjectCard project={project} language={language} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <button className="swiper-button-prev absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow">
          <FiChevronLeft className="h-6 w-6 text-gray-700" />
        </button>
        <button className="swiper-button-next absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow">
          <FiChevronRight className="h-6 w-6 text-gray-700" />
        </button>
      </div>

      <style jsx global>{`
        .featured-swiper {
          padding: 20px 0 40px;
        }
        .swiper-pagination {
          bottom: 0 !important;
        }
        .swiper-pagination-bullet {
          background-color: #2563eb;
        }
      `}</style>
    </div>
  );
}
