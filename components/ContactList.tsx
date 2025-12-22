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
  FiChevronRight,
  FiChevronLeft,
  FiActivity,
  FiImage,
  FiUsers,
  FiGlobe,
  FiDownload,
  FiAlertTriangle,
  FiLoader,
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
  onUpdateStatus?: (id: string, newStatus: string) => void;
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
  const [statusFilter, setStatusFilter] = useState("all");
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
      link.download = `SCHEMATIC_${selectedSubmission?.id.slice(-5)}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Download failed", e);
    }
  };

  // --- PROTOCOL: EXECUTE PURGE (NO BROWSER CONFIRM) ---
  const executePurge = async () => {
    if (!submissionToPurge || !onDelete) return;
    setIsProcessing(true);
    try {
      // We call the parent onDelete directly.
      // Ensure the parent function does NOT have a confirm() inside it.
      await onDelete(submissionToPurge.id);
      setSubmissionToPurge(null);
    } catch (e) {
      console.error("Purge failed", e);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredSubmissions =
    statusFilter === "all"
      ? submissions
      : submissions.filter((sub) => sub.status === statusFilter);

  return (
    <div className="space-y-6 font-mono selection:bg-amber-500/30">
      {/* Activity Monitor Header */}
      <div className="bg-[#05070a] border border-white/5 p-6 relative overflow-hidden">
        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <FiActivity className="text-amber-500 animate-pulse" />
            </div>
            <div>
              <h3 className="text-[10px] font-black text-amber-500/50 uppercase tracking-[0.4em]">
                System_Intake
              </h3>
              <p className="text-2xl font-black text-white uppercase italic">
                Active Inquiries
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-[#05070a] border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/[0.02] border-b border-white/5">
            <tr>
              <th className="px-6 py-4 text-[9px] font-black text-amber-500/40 uppercase tracking-widest">
                Identifier
              </th>
              <th className="px-6 py-4 text-[9px] font-black text-amber-500/40 uppercase tracking-widest">
                Classification
              </th>
              <th className="px-6 py-4 text-[9px] font-black text-amber-500/40 uppercase tracking-widest text-right">
                Execute
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {filteredSubmissions.map((sub) => (
              <tr
                key={sub.id}
                className="hover:bg-amber-500/[0.02] group transition-colors"
              >
                <td className="px-6 py-5">
                  <div className="text-white font-bold uppercase text-sm">
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

      {/* --- PROFESSIONAL PURGE PROTOCOL MODAL --- */}
      <AnimatePresence>
        {submissionToPurge && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
              onClick={() => !isProcessing && setSubmissionToPurge(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-[#080a0f] border border-red-500/30 overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.1)]"
            >
              <div className="bg-red-500/10 p-4 border-b border-red-500/20 flex items-center gap-3">
                <FiAlertTriangle className="text-red-500 animate-pulse" />
                <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em]">
                  Security_Warning // Inquiry_Purge
                </span>
              </div>

              <div className="p-8 text-center">
                <p className="text-gray-400 text-[11px] uppercase tracking-widest mb-6 leading-relaxed">
                  Initiating{" "}
                  <span className="text-white">Permanent_Erasure</span> of
                  inquiry from:
                  <br />
                  <span className="text-amber-500 font-bold text-sm block mt-2">
                    [{submissionToPurge.name.toUpperCase()}]
                  </span>
                </p>

                <div className="bg-white/[0.02] border border-white/5 p-4 mb-8">
                  <p className="text-[9px] text-gray-600 uppercase tracking-tighter italic">
                    Note: This bypasses standard recovery protocols. Data scrub
                    will be instantaneous.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setSubmissionToPurge(null)}
                    disabled={isProcessing}
                    className="flex-1 py-3 border border-white/10 text-gray-500 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all"
                  >
                    Abort_Mission
                  </button>
                  <button
                    onClick={executePurge}
                    disabled={isProcessing}
                    className="flex-1 py-3 bg-red-900/40 hover:bg-red-600 text-white border border-red-500/50 text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <FiLoader className="animate-spin" />
                    ) : (
                      <>
                        <FiTrash2 /> Confirm_Purge
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Detail Modal (Standard View) */}
      <AnimatePresence>
        {selectedSubmission && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSubmission(null)}
              className="absolute inset-0 bg-[#030712]/95 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-full max-w-6xl bg-[#080a0f] border border-amber-500/20 overflow-hidden shadow-2xl"
            >
              <div className="flex justify-between items-center p-6 border-b border-white/5 bg-amber-500/[0.02]">
                <div className="flex items-center gap-4">
                  <FiCpu className="text-amber-500" />
                  <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">
                    Diagnostics_View //{" "}
                    <span className="text-amber-500">
                      ID_{selectedSubmission.id.slice(-8)}
                    </span>
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-10 max-h-[85vh] overflow-y-auto">
                {/* Metadata Column */}
                <div className="lg:col-span-7 space-y-8">
                  <section>
                    <h4 className="text-[9px] font-black text-amber-500 uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />{" "}
                      Client_Metadata
                    </h4>
                    <div className="grid grid-cols-2 gap-px bg-white/5 border border-white/5">
                      {[
                        {
                          icon: <FiUsers />,
                          label: "Name",
                          val: selectedSubmission.name,
                        },
                        {
                          icon: <FiMail />,
                          label: "Email",
                          val: selectedSubmission.email,
                        },
                        {
                          icon: <FiPhone />,
                          label: "Phone",
                          val: selectedSubmission.phone || "N/A",
                        },
                        {
                          icon: <FiGlobe />,
                          label: "Origin",
                          val:
                            selectedSubmission.language?.toUpperCase() || "EN",
                        },
                      ].map((item, i) => (
                        <div key={i} className="bg-[#080a0f] p-4">
                          <span className="text-[8px] text-gray-600 block uppercase mb-1">
                            {item.label}
                          </span>
                          <span className="text-xs font-bold text-white break-all">
                            {item.val}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h4 className="text-[9px] font-black text-amber-500 uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />{" "}
                      Technical_Brief
                    </h4>
                    <div className="bg-amber-500/[0.03] border border-amber-500/10 p-6">
                      <p className="text-sm text-gray-300 leading-relaxed italic whitespace-pre-wrap">
                        "{selectedSubmission.description}"
                      </p>
                    </div>
                  </section>
                </div>

                {/* Visual Column */}
                <div className="lg:col-span-5 space-y-6">
                  <h4 className="text-[9px] font-black text-amber-500 uppercase tracking-[0.4em]">
                    Visual_Schematics
                  </h4>
                  {selectedSubmission.images?.length ? (
                    <div className="space-y-4">
                      <div className="relative group border border-white/10 p-1 bg-black aspect-square overflow-hidden">
                        <img
                          src={selectedSubmission.images[currentImageIndex]}
                          className="w-full h-full object-contain grayscale hover:grayscale-0 transition-all duration-500 cursor-zoom-in"
                          onClick={() => setIsZoomed(true)}
                        />
                      </div>
                      <button
                        onClick={() =>
                          handleDownload(
                            selectedSubmission.images![currentImageIndex]
                          )
                        }
                        className="w-full py-4 bg-amber-600 text-[9px] font-black uppercase tracking-widest text-black hover:bg-amber-500 transition-all flex items-center justify-center gap-2"
                      >
                        <FiDownload /> Export_Data_Packet
                      </button>
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Zoom Overlay */}
      <AnimatePresence>
        {isZoomed && selectedSubmission?.images && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/98 flex items-center justify-center p-4 lg:p-12"
            onClick={() => setIsZoomed(false)}
          >
            <img
              src={selectedSubmission.images[currentImageIndex]}
              className="max-w-full max-h-full object-contain"
            />
            <button className="absolute top-10 right-10 text-white/50 hover:text-white transition-all">
              <FiX size={40} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
