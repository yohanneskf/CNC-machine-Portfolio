"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail,
  FiPhone,
  FiX,
  FiEye,
  FiTrash2,
  FiCpu,
  FiActivity,
  FiImage,
  FiUsers,
  FiGlobe,
  FiDownload,
  FiAlertTriangle,
  FiLoader,
  FiChevronLeft,
  FiChevronRight,
  FiMaximize2,
} from "react-icons/fi";

interface Submission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  language?: string;
  description?: string;
  images?: string[];
  projectType?: string;
  budget?: string | number;
  status?: string;
  createdAt: string;
}

interface ContactListProps {
  submissions?: Submission[];
  onDelete?: (id: string) => void;
}

export default function ContactList({
  submissions = [],
  onDelete,
}: ContactListProps) {
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [submissionToPurge, setSubmissionToPurge] = useState<Submission | null>(
    null
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- PROTOCOL: DOWNLOAD PACKET ---
  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `SCHEMATIC_${selectedSubmission?.id.slice(-5)}_${
        currentImageIndex + 1
      }.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Download failed", e);
    }
  };

  const executePurge = async () => {
    if (!submissionToPurge || !onDelete) return;
    setIsProcessing(true);
    try {
      await onDelete(submissionToPurge.id);
      setSubmissionToPurge(null);
    } catch (e) {
      console.error("Purge failed", e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 font-mono selection:bg-amber-500/30">
      {/* Activity Monitor Header */}
      <div className="bg-[#05070a] border border-white/5 p-4 md:p-6 relative overflow-hidden">
        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <FiActivity className="text-amber-500 animate-pulse" />
            </div>
            <div>
              <h3 className="text-[8px] md:text-[10px] font-black text-amber-500/50 uppercase tracking-[0.4em]">
                System_Intake
              </h3>
              <p className="text-lg md:text-2xl font-black text-white uppercase italic">
                Active Inquiries
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- DESKTOP TABLE --- */}
      <div className="hidden md:block bg-[#05070a] border border-white/5 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-white/[0.02] border-b border-white/5 uppercase text-amber-500/40">
            <tr>
              <th className="px-6 py-4 tracking-widest">Identifier</th>
              <th className="px-6 py-4 tracking-widest">Classification</th>
              <th className="px-6 py-4 tracking-widest text-right">Execute</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {submissions.map((sub) => (
              <tr
                key={sub.id}
                className="hover:bg-amber-500/[0.02] transition-colors group"
              >
                <td className="px-6 py-5">
                  <div className="text-white font-bold uppercase">
                    {sub.name}
                  </div>
                  <div className="text-[10px] text-gray-500">{sub.email}</div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-[9px] font-black bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-1 uppercase">
                    {sub.projectType}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedSubmission(sub);
                        setCurrentImageIndex(0);
                      }}
                      className="p-2 border border-white/10 hover:border-amber-500 text-gray-500 hover:text-amber-500 transition-all"
                    >
                      <FiEye />
                    </button>
                    <button
                      onClick={() => setSubmissionToPurge(sub)}
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

      {/* --- MOBILE CARDS --- */}
      <div className="md:hidden space-y-4">
        {submissions.map((sub) => (
          <div
            key={sub.id}
            className="bg-[#05070a] border border-white/5 p-4 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="text-white font-bold uppercase text-sm">
                  {sub.name}
                </div>
                <div className="text-[10px] text-gray-500 truncate max-w-[150px]">
                  {sub.email}
                </div>
              </div>
              <span className="text-[8px] font-black bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-1 uppercase">
                {sub.projectType}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setSelectedSubmission(sub);
                  setCurrentImageIndex(0);
                }}
                className="flex items-center justify-center gap-2 py-3 border border-white/10 text-[9px] font-black uppercase text-amber-500"
              >
                <FiEye /> View
              </button>
              <button
                onClick={() => setSubmissionToPurge(sub)}
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
        {selectedSubmission && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSubmission(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-6xl bg-[#080a0f] border border-amber-500/20 overflow-hidden shadow-2xl flex flex-col max-h-[95vh]"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-4 md:p-6 border-b border-white/5 bg-amber-500/[0.02]">
                <div className="flex items-center gap-3">
                  <FiCpu className="text-amber-500" />
                  <h3 className="text-[10px] md:text-xs font-black text-white uppercase tracking-[0.2em]">
                    Diag_View //{" "}
                    <span className="text-amber-500">
                      ID_{selectedSubmission.id.slice(-5)}
                    </span>
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-gray-500 hover:text-white transition-colors p-2"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="p-4 md:p-8 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                  {/* Left: Info */}
                  <div className="lg:col-span-6 space-y-8">
                    <section>
                      <h4 className="text-[9px] font-black text-amber-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                        <span className="w-1 h-1 bg-amber-500" />{" "}
                        Client_Metadata
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5 border border-white/5">
                        {[
                          {
                            label: "Name",
                            val: selectedSubmission.name,
                            icon: <FiUsers />,
                          },
                          {
                            label: "Email",
                            val: selectedSubmission.email,
                            icon: <FiMail />,
                          },
                          {
                            label: "Phone",
                            val: selectedSubmission.phone || "N/A",
                            icon: <FiPhone />,
                          },
                          {
                            label: "Type",
                            val: selectedSubmission.projectType,
                            icon: <FiGlobe />,
                          },
                        ].map((item, i) => (
                          <div
                            key={i}
                            className="bg-[#080a0f] p-4 flex flex-col gap-1"
                          >
                            <span className="text-[7px] text-gray-600 uppercase flex items-center gap-2">
                              {item.icon} {item.label}
                            </span>
                            <span className="text-xs font-bold text-white break-all uppercase tracking-wide">
                              {item.val}
                            </span>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h4 className="text-[9px] font-black text-amber-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                        <span className="w-1 h-1 bg-amber-500" />{" "}
                        Technical_Brief
                      </h4>
                      <div className="bg-amber-500/[0.03] border border-amber-500/10 p-6">
                        <p className="text-xs md:text-sm text-gray-300 leading-relaxed italic whitespace-pre-wrap">
                          "{selectedSubmission.description}"
                        </p>
                      </div>
                    </section>
                  </div>

                  {/* Right: Visuals */}
                  <div className="lg:col-span-6 space-y-6">
                    <h4 className="text-[9px] font-black text-amber-500 uppercase tracking-[0.3em] flex justify-between items-center">
                      <span>Visual_Payload</span>
                      {selectedSubmission.images &&
                        selectedSubmission.images.length > 1 && (
                          <span className="text-gray-600 font-mono text-[8px] tracking-normal">
                            {currentImageIndex + 1} /{" "}
                            {selectedSubmission.images.length}
                          </span>
                        )}
                    </h4>

                    {selectedSubmission.images?.length ? (
                      <div className="space-y-4">
                        <div className="relative group border border-white/10 p-1 bg-black aspect-square overflow-hidden">
                          <img
                            src={selectedSubmission.images[currentImageIndex]}
                            className="w-full h-full object-contain cursor-pointer transition-all duration-500 hover:scale-105"
                            onClick={() => setIsZoomed(true)}
                          />

                          {/* Navigation Controls */}
                          {selectedSubmission.images.length > 1 && (
                            <>
                              <button
                                onClick={() =>
                                  setCurrentImageIndex((prev) =>
                                    prev === 0
                                      ? selectedSubmission.images!.length - 1
                                      : prev - 1
                                  )
                                }
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/80 border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <FiChevronLeft />
                              </button>
                              <button
                                onClick={() =>
                                  setCurrentImageIndex((prev) =>
                                    prev ===
                                    selectedSubmission.images!.length - 1
                                      ? 0
                                      : prev + 1
                                  )
                                }
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/80 border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <FiChevronRight />
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => setIsZoomed(true)}
                            className="absolute bottom-4 right-4 p-2 bg-amber-500 text-black text-xs font-black shadow-xl opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FiMaximize2 />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <button
                            onClick={() =>
                              handleDownload(
                                selectedSubmission.images![currentImageIndex]
                              )
                            }
                            className="py-4 bg-white/5 border border-white/10 text-[9px] font-black uppercase text-gray-400 hover:text-white hover:border-amber-500/50 transition-all flex items-center justify-center gap-2"
                          >
                            <FiDownload /> Download_IMG
                          </button>
                          <button
                            onClick={() => setSelectedSubmission(null)}
                            className="py-4 bg-white/5 border border-white/10 text-[9px] font-black uppercase text-gray-400 hover:bg-white/10 transition-all"
                          >
                            Close_Record
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-square border border-dashed border-white/5 flex flex-col items-center justify-center text-gray-800 bg-white/[0.01]">
                        <FiImage size={32} className="opacity-20 mb-2" />
                        <span className="text-[8px] uppercase tracking-[0.3em]">
                          No_Visual_Payload
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- LIGHTBOX (ZOOMED VIEW) --- */}
      <AnimatePresence>
        {isZoomed && selectedSubmission?.images && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/98 flex items-center justify-center p-4"
          >
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-6 right-6 p-4 bg-white/5 rounded-full text-white hover:text-amber-500 transition-all z-[210]"
            >
              <FiX size={32} />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={selectedSubmission.images[currentImageIndex]}
              className="max-w-full max-h-full object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- PURGE MODAL --- */}
      <AnimatePresence>
        {submissionToPurge && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isProcessing && setSubmissionToPurge(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-[#080a0f] border border-red-500/30 p-8 shadow-2xl"
            >
              <div className="flex items-center gap-3 text-red-500 mb-6">
                <FiAlertTriangle className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                  Critical_Purge_Action
                </span>
              </div>
              <p className="text-gray-400 text-xs mb-8 leading-relaxed">
                System is about to scrub{" "}
                <span className="text-white font-bold">
                  {submissionToPurge.name}
                </span>
                's inquiry from memory. This action is irreversible.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setSubmissionToPurge(null)}
                  disabled={isProcessing}
                  className="flex-1 py-3 border border-white/10 text-gray-500 text-[9px] font-black uppercase hover:bg-white/5"
                >
                  Abort
                </button>
                <button
                  onClick={executePurge}
                  disabled={isProcessing}
                  className="flex-1 py-3 bg-red-900/40 hover:bg-red-600 text-white border border-red-500/50 text-[9px] font-black uppercase flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <FiLoader className="animate-spin" />
                  ) : (
                    <>
                      {" "}
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
