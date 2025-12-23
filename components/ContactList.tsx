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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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
              <FiActivity className="text-amber-500 animate-pulse text-sm md:text-base" />
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

      {/* --- DESKTOP TABLE VIEW (Hidden on Mobile) --- */}
      <div className="hidden md:block bg-[#05070a] border border-white/5 overflow-hidden">
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
            {submissions.map((sub) => (
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

      {/* --- MOBILE CARD VIEW (Visible only on Mobile) --- */}
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
                <div className="text-[10px] text-gray-500 truncate max-w-[200px]">
                  {sub.email}
                </div>
              </div>
              <span className="text-[8px] font-black bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-1 uppercase">
                {sub.projectType}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
              <button
                onClick={() => {
                  setSelectedSubmission(sub);
                  setCurrentImageIndex(0);
                }}
                className="flex items-center justify-center gap-2 py-3 border border-white/10 text-[9px] font-black uppercase text-amber-500"
              >
                <FiEye /> View_Data
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

      {/* --- MODALS (PURGE & DETAIL) --- */}
      {/* (Keep your existing AnimatePresence modals here, I have optimized the detail modal below for mobile) */}

      <AnimatePresence>
        {selectedSubmission && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSubmission(null)}
              className="absolute inset-0 bg-[#030712]/98 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-full max-w-6xl bg-[#080a0f] border border-amber-500/20 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-4 md:p-6 border-b border-white/5 bg-amber-500/[0.02]">
                <div className="flex items-center gap-3">
                  <FiCpu className="text-amber-500 shrink-0" />
                  <h3 className="text-[10px] md:text-xs font-black text-white uppercase tracking-[0.2em] truncate">
                    Diag_View //{" "}
                    <span className="text-amber-500">
                      ID_{selectedSubmission.id.slice(-5)}
                    </span>
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-gray-500 hover:text-white p-2"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="p-4 md:p-8 overflow-y-auto space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
                  {/* Info */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5 border border-white/5">
                      {[
                        { label: "Client", val: selectedSubmission.name },
                        { label: "Email", val: selectedSubmission.email },
                        {
                          label: "Phone",
                          val: selectedSubmission.phone || "N/A",
                        },
                        { label: "Type", val: selectedSubmission.projectType },
                      ].map((item, i) => (
                        <div key={i} className="bg-[#080a0f] p-3 md:p-4">
                          <span className="text-[7px] md:text-[8px] text-gray-600 block uppercase mb-1">
                            {item.label}
                          </span>
                          <span className="text-xs font-bold text-white break-all">
                            {item.val}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-amber-500/[0.03] border border-amber-500/10 p-4 md:p-6">
                      <h4 className="text-[8px] font-black text-amber-500 uppercase tracking-widest mb-2">
                        Technical_Brief
                      </h4>
                      <p className="text-xs md:text-sm text-gray-300 leading-relaxed italic">
                        "{selectedSubmission.description}"
                      </p>
                    </div>
                  </div>

                  {/* Images */}
                  <div className="lg:col-span-5">
                    {selectedSubmission.images?.length ? (
                      <div className="space-y-4">
                        <div className="relative border border-white/10 p-1 bg-black aspect-square">
                          <img
                            src={selectedSubmission.images[0]}
                            className="w-full h-full object-contain grayscale"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-square border border-dashed border-white/5 flex flex-col items-center justify-center text-gray-800 italic text-[10px]">
                        NO_VISUAL_DATA
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ... (Keep Purge Modal logic same as before) ... */}
    </div>
  );
}
