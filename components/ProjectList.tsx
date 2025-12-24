"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEdit2,
  FiTrash2,
  FiEye,
  FiX,
  FiBox,
  FiStar,
  FiCpu,
  FiImage,
  FiLoader,
  FiAlertTriangle,
  FiActivity,
  FiMaximize2,
  FiDownload,
  FiArrowLeft,
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

interface ProjectListProps {
  projects: Project[];
  onUpdate: () => void;
}

export default function ProjectList({ projects, onUpdate }: ProjectListProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectToPurge, setProjectToPurge] = useState<Project | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const categories: Record<string, string> = {
    living: "Living_Area",
    bedroom: "Sleeping_Quarters",
    office: "Work_Station",
    commercial: "Business_Retail",
  };

  // Close zoom on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsZoomed(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `ASSET_EXPORT_${selectedProject?.id.slice(-5)}.jpg`;
      link.click();
    } catch (e) {
      window.open(url, "_blank");
    }
  };

  async function handlePurge() {
    if (!projectToPurge) return;
    setIsProcessing(projectToPurge.id);
    try {
      const res = await fetch(`/api/projects?id=${projectToPurge.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        onUpdate();
        setProjectToPurge(null);
      }
    } catch (error) {
      console.error("ERASURE_FAILURE", error);
    } finally {
      setIsProcessing(null);
    }
  }

  async function toggleFeatured(id: string, currentStatus: boolean) {
    setIsProcessing(id);
    try {
      const res = await fetch(`/api/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          featured: !currentStatus,
          updateOnly: true,
        }),
      });
      if (res.ok) onUpdate();
    } catch (error) {
      console.error("PRIORITY_UPDATE_FAILURE", error);
    } finally {
      setIsProcessing(null);
    }
  }

  return (
    <div className="space-y-6 font-mono selection:bg-blue-500/30">
      {/* Module Header */}
      <div className="bg-[#05070a] border border-white/5 p-4 md:p-6 relative overflow-hidden">
        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <FiActivity className="text-blue-500 animate-pulse text-sm md:text-base" />
            </div>
            <div>
              <h3 className="text-[8px] md:text-[10px] font-black text-blue-500/50 uppercase tracking-[0.4em]">
                Asset_Inventory
              </h3>
              <p className="text-lg md:text-2xl font-black text-white uppercase italic">
                Managed Assets ({projects.length})
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- DESKTOP TABLE VIEW --- */}
      <div className="hidden md:block bg-[#05070a] border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/[0.02] border-b border-white/5">
            <tr>
              <th className="px-6 py-4 text-[9px] font-black text-blue-500/40 uppercase tracking-widest">
                Payload
              </th>
              <th className="px-6 py-4 text-[9px] font-black text-blue-500/40 uppercase tracking-widest">
                Designation
              </th>
              <th className="px-6 py-4 text-[9px] font-black text-blue-500/40 uppercase tracking-widest text-center">
                Priority
              </th>
              <th className="px-6 py-4 text-[9px] font-black text-blue-500/40 uppercase tracking-widest text-right">
                Execute
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {projects.map((project) => (
              <tr
                key={project.id}
                className="hover:bg-blue-500/[0.02] group transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="w-12 h-12 border border-white/10 bg-black overflow-hidden">
                    <img
                      src={project.images[0]}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0"
                      alt=""
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-white font-bold uppercase text-sm">
                    {project.titleEn}
                  </div>
                  <div className="text-[10px] text-blue-500/60 uppercase">
                    {categories[project.category] || project.category}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => toggleFeatured(project.id, project.featured)}
                    className={`p-2 border transition-all ${
                      project.featured
                        ? "bg-amber-500/10 border-amber-500/40 text-amber-500"
                        : "border-white/5 text-gray-700 hover:text-white"
                    }`}
                  >
                    <FiStar
                      className={project.featured ? "fill-current" : ""}
                    />
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedProject(project);
                        setActiveImgIndex(0);
                      }}
                      className="p-2 border border-white/10 hover:border-blue-500 text-gray-500 hover:text-blue-500 transition-all"
                    >
                      <FiEye />
                    </button>
                    <button
                      onClick={() => setProjectToPurge(project)}
                      className="p-2 border border-white/10 hover:border-red-500 text-gray-500 hover:text-red-500 transition-all"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MOBILE CARD VIEW --- */}
      <div className="md:hidden space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-[#05070a] border border-white/5 p-4 space-y-4"
          >
            <div className="flex gap-4">
              <div className="w-16 h-16 border border-white/10 bg-black overflow-hidden shrink-0">
                <img
                  src={project.images[0]}
                  className="w-full h-full object-cover grayscale"
                  alt=""
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-bold uppercase text-sm truncate">
                  {project.titleEn}
                </div>
                <div className="text-[9px] text-blue-500/60 uppercase mb-2">
                  {categories[project.category] || project.category}
                </div>
                <button
                  onClick={() => toggleFeatured(project.id, project.featured)}
                  className={`text-[8px] font-black px-2 py-1 border flex items-center gap-1 ${
                    project.featured
                      ? "border-amber-500/40 text-amber-500"
                      : "border-white/10 text-gray-600"
                  }`}
                >
                  <FiStar /> {project.featured ? "PRIORITY_01" : "STANDARD"}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
              <button
                onClick={() => {
                  setSelectedProject(project);
                  setActiveImgIndex(0);
                }}
                className="flex items-center justify-center gap-2 py-3 border border-white/10 text-[9px] font-black uppercase text-blue-500"
              >
                <FiEye /> Inspect
              </button>
              <button
                onClick={() => setProjectToPurge(project)}
                className="flex items-center justify-center gap-2 py-3 border border-white/10 text-[9px] font-black uppercase text-red-500"
              >
                <FiTrash2 /> Purge
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- DETAIL MODAL --- */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-[#030712]/98 backdrop-blur-md"
            />
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="relative w-full h-full md:h-auto md:max-w-6xl bg-[#080a0f] border-t md:border border-blue-500/20 overflow-hidden flex flex-col md:max-h-[90vh]"
            >
              <div className="flex justify-between items-center p-4 md:p-6 border-b border-white/5 bg-blue-500/[0.02]">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="md:hidden text-blue-500 flex items-center gap-2 text-[10px] font-black uppercase"
                >
                  <FiArrowLeft /> Back
                </button>
                <div className="hidden md:flex items-center gap-3">
                  <FiCpu className="text-blue-500" />
                  <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">
                    Asset_Report // ID_{selectedProject.id.slice(-5)}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-500 hover:text-white p-2"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="p-4 md:p-8 overflow-y-auto flex-1 custom-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-7 space-y-6">
                    <div>
                      <span className="text-[7px] text-blue-500/50 uppercase tracking-widest block mb-1">
                        Designation
                      </span>
                      <h2 className="text-2xl md:text-3xl font-black text-white uppercase">
                        {selectedProject.titleEn}
                      </h2>
                      <p className="text-lg text-gray-500 font-amharic">
                        {selectedProject.titleAm}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-px bg-white/5 border border-white/5">
                      <div className="bg-[#080a0f] p-4">
                        <span className="text-[7px] text-blue-500/50 uppercase block mb-1">
                          Category
                        </span>
                        <span className="text-xs font-bold text-white uppercase">
                          {categories[selectedProject.category] || "General"}
                        </span>
                      </div>
                      <div className="bg-[#080a0f] p-4">
                        <span className="text-[7px] text-blue-500/50 uppercase block mb-1">
                          Status
                        </span>
                        <span
                          className={`text-xs font-bold ${
                            selectedProject.featured
                              ? "text-amber-500"
                              : "text-gray-500"
                          }`}
                        >
                          {selectedProject.featured
                            ? "FEATURED_ASSET"
                            : "STANDARD_ASSET"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[7px] text-blue-500/50 uppercase block mb-3">
                        Composition_Matrix
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.materials.map((m, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 text-[9px] bg-blue-500/10 border border-blue-500/30 text-blue-400 font-black"
                          >
                            {m.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-4">
                    <span className="text-[7px] text-blue-500/50 uppercase block">
                      Visual_Payload
                    </span>
                    <div
                      className="relative group border border-white/10 p-1 bg-black aspect-square cursor-zoom-in"
                      onClick={() => setIsZoomed(true)}
                    >
                      <img
                        src={selectedProject.images[activeImgIndex]}
                        className="w-full h-full object-contain grayscale hover:grayscale-0 transition-all duration-700"
                        alt=""
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                        <FiMaximize2 className="text-blue-500 text-3xl" />
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        handleDownload(selectedProject.images[activeImgIndex])
                      }
                      className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-black text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                    >
                      <FiDownload /> Download_Full_Asset
                    </button>
                    <div className="grid grid-cols-4 gap-2">
                      {selectedProject.images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveImgIndex(i)}
                          className={`aspect-square border transition-all ${
                            activeImgIndex === i
                              ? "border-blue-500 p-0.5"
                              : "border-white/10 opacity-50"
                          }`}
                        >
                          <img
                            src={img}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- ZOOM OVERLAY --- */}
      <AnimatePresence>
        {isZoomed && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/98 flex flex-col items-center justify-center p-4"
            onClick={() => setIsZoomed(false)}
          >
            <button className="absolute top-6 right-6 p-4 bg-white/5 border border-white/10 text-white flex items-center gap-2 text-[10px] font-black uppercase">
              <FiX size={24} /> Close_Viewer
            </button>
            <img
              src={selectedProject.images[activeImgIndex]}
              className="max-w-full max-h-[80vh] object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              alt=""
            />
            <div
              className="mt-8 flex gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() =>
                  handleDownload(selectedProject.images[activeImgIndex])
                }
                className="px-8 py-3 bg-blue-500 text-black font-black uppercase text-[10px] flex items-center gap-2"
              >
                <FiDownload /> Export_Source
              </button>
              <button
                onClick={() => setIsZoomed(false)}
                className="px-8 py-3 border border-white/10 text-white font-black uppercase text-[10px]"
              >
                Back
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- PURGE MODAL --- */}
      <AnimatePresence>
        {projectToPurge && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isProcessing && setProjectToPurge(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-[#080a0f] border border-red-500/30 p-8 text-center"
            >
              <FiAlertTriangle className="text-red-500 text-4xl mx-auto mb-4 animate-pulse" />
              <h3 className="text-white font-black uppercase tracking-widest mb-2 text-sm">
                Purge_Request // {projectToPurge.titleEn}
              </h3>
              <p className="text-gray-500 text-[10px] uppercase mb-8">
                Data clusters will be scrubbed. This action is irreversible.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setProjectToPurge(null)}
                  disabled={!!isProcessing}
                  className="py-3 border border-white/10 text-gray-500 text-[10px] font-black uppercase hover:text-white transition-colors"
                >
                  Abort
                </button>
                <button
                  onClick={handlePurge}
                  disabled={!!isProcessing}
                  className="py-3 bg-red-600 text-white text-[10px] font-black uppercase flex items-center justify-center gap-2"
                >
                  {isProcessing === projectToPurge.id ? (
                    <FiLoader className="animate-spin" />
                  ) : (
                    <>
                      <FiTrash2 /> Confirm
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
// End of file
