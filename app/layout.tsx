"use client";

import { useState, useEffect } from "react"; // Added hooks
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Navigation from "@/components/Navigation";
import AdminNav from "@/components/AdminNav"; // Import AdminNav
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("projects"); // Required for AdminNav

  // Check for admin token on mount and route changes
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    // Show AdminNav only if token exists AND we are on an admin route
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
        className={`${inter.className} antialiased selection:bg-blue-100 selection:text-blue-900`}
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

            <AnimatePresence mode="wait">
              <motion.main
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex-grow pt-16"
              >
                {children}
              </motion.main>
            </AnimatePresence>

            {!isAdmin && <Footer />}
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
