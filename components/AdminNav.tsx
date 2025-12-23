"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiGrid,
  FiMessageSquare,
  FiBarChart2,
  FiLogOut,
  FiMenu,
  FiX,
  FiCpu,
  FiExternalLink,
  FiTerminal,
  FiChevronDown,
  FiSettings,
  FiShield,
  FiActivity,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface AdminNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout?: () => void;
}

export default function AdminNav({
  activeTab,
  setActiveTab,
  onLogout,
}: AdminNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null); // Ref for click-outside
  const router = useRouter();

  // Close profile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { id: "projects", label: "Catalog_Module", icon: <FiGrid />, code: "01" },
    {
      id: "submissions",
      label: "Intake_Feed",
      icon: <FiMessageSquare />,
      code: "02",
    },
    {
      id: "analytics",
      label: "Diagnostics",
      icon: <FiBarChart2 />,
      code: "03",
    },
  ];

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("admin_token");
      document.cookie =
        "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      router.push("/admin/login");
    }
    setShowProfileMenu(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-[#030712]/95 backdrop-blur-xl border-b border-white/5 z-[70]">
        <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-4 lg:gap-12">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-3 bg-white/5 border border-white/10 text-blue-500 hover:bg-blue-500/10 transition-all"
              >
                {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>

              <Link
                href="/admin/dashboard"
                className="flex items-center gap-3 group"
              >
                <div className="relative w-8 h-8 lg:w-10 lg:h-10 border border-blue-500/30 flex items-center justify-center group-hover:border-blue-500 transition-colors">
                  <FiCpu className="h-4 w-4 lg:h-5 lg:w-5 text-blue-500 group-hover:rotate-180 transition-transform duration-700" />
                  <div className="absolute top-0 right-0 w-1 h-1 bg-blue-500" />
                  <div className="absolute bottom-0 left-0 w-1 h-1 bg-blue-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm lg:text-lg font-black tracking-tighter uppercase italic text-white leading-none">
                    CNC<span className="text-blue-500 not-italic">_CORE</span>
                  </span>
                  <span className="hidden xs:block text-[7px] font-mono text-gray-500 uppercase tracking-[0.3em] mt-1">
                    KRNL_v4.0.1
                  </span>
                </div>
              </Link>

              <div className="hidden lg:flex items-center space-x-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`relative px-6 py-3 flex items-center gap-3 transition-all group ${
                      activeTab === item.id
                        ? "text-white"
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    <span className="font-mono text-[8px] opacity-40 group-hover:opacity-100">
                      {item.code}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                      {item.label}
                    </span>
                    {activeTab === item.id && (
                      <>
                        <motion.div
                          layoutId="activeHighlight"
                          className="absolute inset-0 bg-blue-600/5 border-x border-blue-500/20"
                        />
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-blue-600 shadow-[0_0_15px_#3b82f6]"
                        />
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-4">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-3 border hidden xs:block transition-all ${
                  showNotifications
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-white/5 border-white/5 text-gray-500"
                }`}
              >
                <FiTerminal className="h-4 w-4" />
              </button>

              {/* ROOT BUTTON MODULE (STABILIZED) */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProfileMenu(!showProfileMenu);
                  }}
                  className={`flex items-center gap-3 p-1.5 lg:pr-4 bg-white/5 border transition-all ${
                    showProfileMenu
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-white/5 hover:border-blue-500/30"
                  }`}
                >
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-600 flex items-center justify-center">
                    <FiShield className="text-white" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-[9px] font-black uppercase tracking-widest text-white leading-none">
                      Root
                    </p>
                    <p className="text-[7px] font-mono text-blue-500 mt-1 uppercase">
                      Lv_01
                    </p>
                  </div>
                  <FiChevronDown
                    className={`h-3 w-3 text-gray-600 transition-transform duration-300 ${
                      showProfileMenu ? "rotate-180 text-blue-500" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-48 bg-[#0a0a0b] border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-[80] overflow-hidden"
                    >
                      <div className="p-1 space-y-1">
                        <Link
                          href="/"
                          target="_blank"
                          className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <FiExternalLink size={12} className="text-blue-500" />
                          <span className="text-[9px] font-black uppercase tracking-widest">
                            Public_View
                          </span>
                        </Link>
                        <div className="h-[1px] bg-white/5 mx-2" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 transition-all"
                        >
                          <FiLogOut size={12} />
                          <span className="text-[9px] font-black uppercase tracking-widest">
                            Terminate
                          </span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY (SYNCED WITH ROOT ACTIONS) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[55] lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[80%] max-w-xs bg-[#030712] border-r border-white/10 z-[60] lg:hidden p-6 pt-24"
            >
              <div className="space-y-3">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-4 border transition-all ${
                      activeTab === item.id
                        ? "bg-blue-600/10 border-blue-600 text-white"
                        : "border-white/5 text-gray-500 hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-black uppercase tracking-[0.2em] text-[10px]">
                        {item.label}
                      </span>
                    </div>
                    <span className="font-mono text-[9px] opacity-30">
                      {item.code}
                    </span>
                  </button>
                ))}

                <div className="pt-8 mt-8 border-t border-white/5 space-y-3">
                  <Link
                    href="/"
                    target="_blank"
                    className="w-full flex items-center gap-4 p-4 text-gray-400 border border-white/5 hover:bg-white/5 transition-all"
                  >
                    <FiExternalLink />
                    <span className="font-black uppercase tracking-widest text-[10px]">
                      Public_Interface
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 p-4 text-red-500 border border-red-500/10 hover:bg-red-500/5 transition-all"
                  >
                    <FiLogOut />
                    <span className="font-black uppercase tracking-widest text-[10px]">
                      System_Exit
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="h-20" />
    </>
  );
}
