"use client";

import { useState } from "react";
import { FiEdit2, FiTrash2, FiEye, FiCheck, FiX } from "react-icons/fi";

interface Project {
  id: string;
  titleEn: string;
  titleAm: string;
  category: string;
  materials: string[];
  featured: boolean;
  createdAt: string;
}

interface ProjectListProps {
  projects: Project[];
  onUpdate: () => void;
}

export default function ProjectList({ projects, onUpdate }: ProjectListProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const deleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    setIsDeleting(id);
    try {
      await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });
      onUpdate();
    } catch (error) {
      console.error("Error deleting project:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !currentFeatured }),
      });
      onUpdate();
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const categories = {
    living: "Living Room",
    bedroom: "Bedroom",
    office: "Office",
    commercial: "Commercial",
  };

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Projects ({projects.length})
          </h2>
          <div className="text-sm text-gray-500">
            {projects.filter((p) => p.featured).length} featured
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Materials
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Featured
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">
                      {project.titleEn}
                    </div>
                    <div className="text-sm text-gray-500">
                      {project.titleAm}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {categories[project.category as keyof typeof categories] ||
                      project.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {project.materials.slice(0, 2).map((material, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                      >
                        {material}
                      </span>
                    ))}
                    {project.materials.length > 2 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        +{project.materials.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleFeatured(project.id, project.featured)}
                    className={`p-2 rounded-full ${
                      project.featured
                        ? "bg-green-100 text-green-600 hover:bg-green-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    title={
                      project.featured
                        ? "Remove from featured"
                        : "Add to featured"
                    }
                  >
                    {project.featured ? (
                      <FiCheck className="h-4 w-4" />
                    ) : (
                      <FiX className="h-4 w-4" />
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(project.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="text-blue-600 hover:text-blue-900 p-2"
                      title="View Details"
                    >
                      <FiEye className="h-4 w-4" />
                    </button>
                    <button
                      className="text-yellow-600 hover:text-yellow-900 p-2"
                      title="Edit"
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteProject(project.id)}
                      disabled={isDeleting === project.id}
                      className="text-red-600 hover:text-red-900 p-2 disabled:opacity-50"
                      title="Delete"
                    >
                      {isDeleting === project.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      ) : (
                        <FiTrash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Project Details
                </h3>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">English Title</p>
                  <p className="font-medium">{selectedProject.titleEn}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amharic Title</p>
                  <p className="font-medium amharic-text">
                    {selectedProject.titleAm}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {
                      categories[
                        selectedProject.category as keyof typeof categories
                      ]
                    }
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Materials</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedProject.materials.map((material, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded"
                      >
                        {material}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Featured</p>
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${
                      selectedProject.featured
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  `}
                  >
                    {selectedProject.featured ? "Yes" : "No"}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created Date</p>
                  <p className="font-medium">
                    {new Date(selectedProject.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
