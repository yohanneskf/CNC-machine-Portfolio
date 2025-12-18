"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiUpload, FiPlus, FiTrash2 } from "react-icons/fi";

interface ProjectFormProps {
  onSuccess: () => void;
}

type ProjectFormData = {
  titleEn: string;
  titleAm: string;
  descriptionEn: string;
  descriptionAm: string;
  category: string;
  materials: string[];
  dimensions: {
    length: string;
    width: string;
    height: string;
    unit: string;
  };
  featured: boolean;
};

export default function ProjectForm({ onSuccess }: ProjectFormProps) {
  const [images, setImages] = useState<string[]>([]);
  const [materials, setMaterials] = useState<string[]>([]);
  const [newMaterial, setNewMaterial] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const addMaterial = () => {
    if (newMaterial.trim()) {
      setMaterials((prev) => [...prev, newMaterial.trim()]);
      setNewMaterial("");
    }
  };

  const removeMaterial = (index: number) => {
    setMaterials((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProjectFormData) => {
    setLoading(true);

    try {
      const projectData = {
        ...data,
        materials,
        images,
      };

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        reset();
        setImages([]);
        setMaterials([]);
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Project</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              English Title *
            </label>
            <input
              type="text"
              {...register("titleEn", {
                required: "English title is required",
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.titleEn && (
              <p className="mt-1 text-sm text-red-600">
                {errors.titleEn.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amharic Title *
            </label>
            <input
              type="text"
              {...register("titleAm", {
                required: "Amharic title is required",
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.titleAm && (
              <p className="mt-1 text-sm text-red-600">
                {errors.titleAm.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              English Description *
            </label>
            <textarea
              rows={4}
              {...register("descriptionEn", {
                required: "English description is required",
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amharic Description *
            </label>
            <textarea
              rows={4}
              {...register("descriptionAm", {
                required: "Amharic description is required",
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            {...register("category", { required: "Category is required" })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select category</option>
            <option value="living">Living Room</option>
            <option value="bedroom">Bedroom</option>
            <option value="office">Office</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Materials
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newMaterial}
              onChange={(e) => setNewMaterial(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Add material (e.g., Oak Wood, Steel)"
            />
            <button
              type="button"
              onClick={addMaterial}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <FiPlus className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {materials.map((material, index) => (
              <div
                key={index}
                className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2"
              >
                <span>{material}</span>
                <button
                  type="button"
                  onClick={() => removeMaterial(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiTrash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Length
            </label>
            <input
              type="text"
              {...register("dimensions.length")}
              placeholder="e.g., 120"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Width
            </label>
            <input
              type="text"
              {...register("dimensions.width")}
              placeholder="e.g., 60"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Height
            </label>
            <input
              type="text"
              {...register("dimensions.height")}
              placeholder="e.g., 75"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unit
            </label>
            <select
              {...register("dimensions.unit")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            >
              <option value="cm">cm</option>
              <option value="inch">inch</option>
              <option value="mm">mm</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Images
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center justify-center"
            >
              <FiUpload className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">
                Click to upload project images
              </span>
            </label>
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Preview ${index}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            {...register("featured")}
            id="featured"
            className="h-4 w-4 text-blue-600 rounded"
          />
          <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
            Mark as featured project
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold"
        >
          {loading ? "Creating Project..." : "Add Project"}
        </button>
      </form>
    </div>
  );
}
