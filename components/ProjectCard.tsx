"use client";

import Link from "next/link";
import Image from "next/image";
import { FiExternalLink, FiSettings } from "react-icons/fi";

interface ProjectCardProps {
  project: {
    id: string;
    titleEn: string;
    titleAm: string;
    descriptionEn: string;
    descriptionAm: string;
    category: string;
    materials: string[];
    images: string[];
  };
  language: "en" | "am";
}

export default function ProjectCard({ project, language }: ProjectCardProps) {
  const title = language === "en" ? project.titleEn : project.titleAm;
  const description =
    language === "en"
      ? (project.descriptionEn?.substring(0, 100) || "") + "..."
      : (project.descriptionAm?.substring(0, 100) || "") + "...";

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-64 overflow-hidden">
        {project.images && project.images[0] ? (
          <Image
            src={project.images[0]}
            alt={title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-gray-100 flex items-center justify-center">
            <FiSettings className="h-16 w-16 text-gray-400" />
          </div>
        )}
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {project.category}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.materials.slice(0, 3).map((material, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
            >
              {material}
            </span>
          ))}
          {project.materials.length > 3 && (
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
              +{project.materials.length - 3}
            </span>
          )}
        </div>

        {/* THIS IS THE CRITICAL LINK */}
        <Link
          href={`/projects/${project.id}`}
          className="inline-flex items-center justify-center w-full bg-gray-900 hover:bg-black text-white px-4 py-3 rounded-lg font-semibold transition-colors"
        >
          {language === "en" ? "View Details" : "ዝርዝሮችን ይመልከቱ"}
          <FiExternalLink className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
