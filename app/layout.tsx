"use client";

import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Navigation from "@/components/Navigation";
import AdminNav from "@/components/AdminNav";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { EdgeStoreProvider } from "../lib/edgestore";
import { FiPhone, FiMail, FiMessageSquare } from "react-icons/fi";
import { FaTelegramPlane } from "react-icons/fa";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("projects");

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    setIsAdmin(!!token && pathname.startsWith("/admin"));
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    document.cookie =
      "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setIsAdmin(false);
    window.location.href = "/admin/login";
  };

  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.className} antialiased selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden`}
      >
        <LanguageProvider>
          <div className="min-h-screen flex flex-col bg-[#fcfcfc]">
            {isAdmin ? (
              <AdminNav
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onLogout={handleLogout}
              />
            ) : (
              <Navigation />
            )}

            {/* --- GLOBAL CONTACT PROTOCOLS (DESKTOP SIDEBAR) --- */}
            {!isAdmin && (
              <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4">
                <ContactLink
                  href="tel:+251910699610"
                  icon={<FiPhone />}
                  label="VOICE"
                  color="hover:bg-blue-600"
                />
                <ContactLink
                  href="https://t.me/Aberham_Tekebay"
                  icon={<FaTelegramPlane />}
                  label="TELEGRAM"
                  color="hover:bg-sky-500"
                />
                <ContactLink
                  href="mailto:abtekebay@gmail.com"
                  icon={<FiMail />}
                  label="EMAIL"
                  color="hover:bg-amber-600"
                />
                <div className="h-20 w-[1px] bg-gray-300 mx-auto mt-2" />
                <span className="[writing-mode:vertical-lr] text-[10px] font-black tracking-[0.3em] text-gray-400 uppercase">
                  Comm_Links
                </span>
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.main
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex-grow pt-16"
              >
                <EdgeStoreProvider>{children}</EdgeStoreProvider>
              </motion.main>
            </AnimatePresence>

            {/* --- MOBILE ACTION PROTOCOL (BOTTOM BAR) --- */}
            {!isAdmin && (
              <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm">
                <div className="bg-black/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-full p-2 flex justify-between items-center px-6">
                  <MobileAction href="tel:+251910699610" icon={<FiPhone />} />
                  <div className="w-[1px] h-6 bg-white/10" />
                  <MobileAction
                    href="https://t.me/Aberham_Tekebay"
                    icon={<FaTelegramPlane />}
                  />
                  <div className="w-[1px] h-6 bg-white/10" />
                  <MobileAction
                    href="mailto:abtekebay@gmail.com"
                    icon={<FiMail />}
                  />
                </div>
              </div>
            )}

            {!isAdmin && <Footer />}
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}

// --- SUB-COMPONENTS FOR CLEANER ARCHITECTURE ---

function ContactLink({
  href,
  icon,
  label,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  color: string;
}) {
  return (
    <motion.a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      whileHover={{ x: -5 }}
      className={`group relative flex items-center justify-center w-12 h-12 bg-white border border-gray-200 shadow-sm transition-all duration-300 ${color} hover:text-white`}
    >
      <div className="text-lg">{icon}</div>
      <span className="absolute right-14 px-3 py-1 bg-black text-white text-[9px] font-black tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        {label}
      </span>
    </motion.a>
  );
}

function MobileAction({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      className="text-white/70 hover:text-amber-500 p-3 transition-colors text-xl"
    >
      {icon}
    </a>
  );
}
