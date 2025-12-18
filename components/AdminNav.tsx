"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiGrid,
  FiMessageSquare,
  FiBarChart2,
  FiLogOut,
  FiMenu,
  FiX,
  FiHome,
  FiBell,
  FiUser,
  FiSettings,
  FiChevronDown,
} from "react-icons/fi";

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
  const router = useRouter();

  const navItems = [
    { id: "projects", label: "Projects", icon: <FiGrid />, color: "blue" },
    {
      id: "submissions",
      label: "Submissions",
      icon: <FiMessageSquare />,
      color: "green",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: <FiBarChart2 />,
      color: "purple",
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
      {/* Fixed Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-blue-900 text-white shadow-xl z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Link
                  href="/admin/dashboard"
                  className="flex items-center space-x-3"
                >
                  <div className="bg-white p-2 rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded"></div>
                  </div>
                  <span className="text-xl font-bold">
                    CNC<span className="text-blue-300">Admin</span>
                  </span>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:ml-10 md:flex md:items-center md:space-x-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      // Scroll to top when changing tabs
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`flex items-center space-x-2 px-5 py-3 rounded-lg transition-all duration-200 relative ${
                      activeTab === item.id
                        ? `bg-white text-blue-900 font-semibold shadow-lg`
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                    {activeTab === item.id && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rotate-45"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* View Site Button */}
              <Link
                href="/"
                target="_blank"
                className="hidden md:flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <FiHome className="h-5 w-5" />
                <span className="font-medium">View Site</span>
              </Link>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowProfileMenu(false);
                  }}
                  className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors relative"
                >
                  <FiBell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl z-50 border border-gray-200">
                    <div className="p-4 border-b">
                      <h3 className="font-semibold text-gray-900">
                        Notifications
                      </h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="p-4 hover:bg-gray-50 border-b">
                        <p className="text-sm text-gray-900">
                          Welcome to CNC Admin Panel
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Just now</p>
                      </div>
                    </div>
                    <div className="p-3 border-t">
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-sm text-blue-600 hover:text-blue-800 text-center block w-full"
                      >
                        Mark all as read
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowProfileMenu(!showProfileMenu);
                    setShowNotifications(false);
                  }}
                  className="hidden md:flex items-center space-x-3 px-3 py-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <div className="text-right">
                    <p className="text-sm font-medium">Admin User</p>
                    <p className="text-xs text-gray-300">Administrator</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                    <FiUser className="h-5 w-5 text-white" />
                  </div>
                  <FiChevronDown
                    className={`h-4 w-4 text-gray-300 transition-transform ${
                      showProfileMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl z-50 border border-gray-200">
                    <div className="p-3 border-b">
                      <p className="text-sm font-medium text-gray-900">
                        Admin User
                      </p>
                      <p className="text-xs text-gray-500">
                        admin@cncdesign.com
                      </p>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          // Navigate to profile settings
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                      >
                        <FiSettings className="h-4 w-4" />
                        <span className="text-sm">Settings</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg mt-1"
                      >
                        <FiLogOut className="h-4 w-4" />
                        <span className="text-sm">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-gray-300 hover:text-white p-2"
                >
                  {isMobileMenuOpen ? (
                    <FiX className="h-6 w-6" />
                  ) : (
                    <FiMenu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-16 bg-gray-900/95 backdrop-blur-sm z-40 md:hidden">
          <div className="px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`w-full flex items-center space-x-3 px-4 py-4 rounded-xl ${
                  activeTab === item.id
                    ? "bg-white text-blue-900 font-semibold"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.icon}
                <span className="font-medium text-lg">{item.label}</span>
              </button>
            ))}

            <div className="border-t border-gray-700 pt-4 mt-4">
              <Link
                href="/"
                target="_blank"
                className="w-full flex items-center space-x-3 px-4 py-4 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FiHome className="h-5 w-5" />
                <span className="font-medium">View Site</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-4 text-red-300 hover:text-red-200 hover:bg-red-900/20 rounded-xl mt-2"
              >
                <FiLogOut className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div className="h-16"></div>
    </>
  );
}
