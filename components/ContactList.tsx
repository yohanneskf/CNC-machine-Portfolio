"use client";

import { useState } from "react";
import {
  FiMail,
  FiPhone,
  FiClock,
  FiCheck,
  FiX,
  FiEye,
  FiUsers,
  FiEdit,
  FiTrash2,
  FiMessageCircle,
  FiExternalLink,
  FiDownload,
  FiImage,
  FiCalendar,
  FiDollarSign,
  FiClock as FiTimelineIcon,
  FiGlobe,
  FiFileText,
  FiChevronRight,
  FiChevronLeft,
} from "react-icons/fi";

interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  description: string;
  budget?: string;
  timeline?: string;
  files?: string[];
  images?: string[]; // Added images field
  status: string;
  language: string;
  createdAt: string;
  updatedAt?: string;
}

interface ContactListProps {
  submissions: Submission[];
  onUpdate: () => void;
}

export default function ContactList({
  submissions = [],
  onUpdate,
}: ContactListProps) {
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );
  const [actionMessage, setActionMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      setUpdatingId(id);
      setActionMessage(null);

      const token = localStorage.getItem("admin_token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log("Updating submission:", id, "to status:", newStatus);

      const response = await fetch(`/api/admin/submissions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || `Failed to update status: ${response.status}`
        );
      }

      // Show success message
      setActionMessage({
        type: "success",
        text: `Status updated to ${newStatus} successfully!`,
      });

      // Refresh data after 2 seconds
      setTimeout(() => {
        onUpdate();
        setActionMessage(null);
      }, 2000);
    } catch (error) {
      console.error("Error updating status:", error);
      setActionMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Failed to update status",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteSubmission = async (id: string) => {
    try {
      setUpdatingId(id);
      setActionMessage(null);

      const token = localStorage.getItem("admin_token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`/api/admin/submissions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete submission: ${response.status}`);
      }

      // Show success message
      setActionMessage({
        type: "success",
        text: "Submission deleted successfully!",
      });

      // Hide delete confirmation
      setShowDeleteConfirm(null);

      // Refresh data after 2 seconds
      setTimeout(() => {
        onUpdate();
        setActionMessage(null);
      }, 2000);
    } catch (error) {
      console.error("Error deleting submission:", error);
      setActionMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Failed to delete submission",
      });
      setShowDeleteConfirm(null);
    } finally {
      setUpdatingId(null);
    }
  };

  const sendEmail = (email: string) => {
    window.location.href = `mailto:${email}?subject=Regarding your CNC Design Inquiry`;
  };

  const makePhoneCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const downloadFile = (url: string, filename?: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.download = filename || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const nextImage = () => {
    if (selectedSubmission?.images && selectedSubmission.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === selectedSubmission.images!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedSubmission?.images && selectedSubmission.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedSubmission.images!.length - 1 : prev - 1
      );
    }
  };

  // Filter submissions based on status
  const filteredSubmissions =
    statusFilter === "all"
      ? submissions
      : submissions.filter((sub) => sub.status === statusFilter);

  const statusOptions = [
    { value: "all", label: "All Submissions", color: "gray" },
    { value: "pending", label: "Pending", color: "yellow" },
    { value: "contacted", label: "Contacted", color: "blue" },
    { value: "quoted", label: "Quoted", color: "purple" },
    { value: "completed", label: "Completed", color: "green" },
    { value: "cancelled", label: "Cancelled", color: "red" },
  ];

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    contacted: "bg-blue-100 text-blue-800 border-blue-200",
    quoted: "bg-purple-100 text-purple-800 border-purple-200",
    completed: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  };

  const statusActions: Record<
    string,
    {
      label: string;
      nextStatus: string;
      color: string;
      icon: React.ReactNode;
    }[]
  > = {
    pending: [
      {
        label: "Mark as Contacted",
        nextStatus: "contacted",
        color: "blue",
        icon: <FiMessageCircle className="h-3 w-3" />,
      },
      {
        label: "Send Quote",
        nextStatus: "quoted",
        color: "purple",
        icon: <FiDollarSign className="h-3 w-3" />,
      },
      {
        label: "Cancel",
        nextStatus: "cancelled",
        color: "red",
        icon: <FiX className="h-3 w-3" />,
      },
    ],
    contacted: [
      {
        label: "Send Quote",
        nextStatus: "quoted",
        color: "purple",
        icon: <FiDollarSign className="h-3 w-3" />,
      },
      {
        label: "Mark Complete",
        nextStatus: "completed",
        color: "green",
        icon: <FiCheck className="h-3 w-3" />,
      },
    ],
    quoted: [
      {
        label: "Mark Complete",
        nextStatus: "completed",
        color: "green",
        icon: <FiCheck className="h-3 w-3" />,
      },
    ],
    completed: [
      {
        label: "Re-open",
        nextStatus: "pending",
        color: "yellow",
        icon: <FiEdit className="h-3 w-3" />,
      },
    ],
    cancelled: [
      {
        label: "Re-open",
        nextStatus: "pending",
        color: "yellow",
        icon: <FiEdit className="h-3 w-3" />,
      },
    ],
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Message */}
      {actionMessage && (
        <div
          className={`rounded-xl p-4 ${
            actionMessage.type === "success"
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {actionMessage.type === "success" ? (
                <FiCheck className="h-5 w-5 text-green-600 mr-2" />
              ) : (
                <FiX className="h-5 w-5 text-red-600 mr-2" />
              )}
              <span
                className={`font-medium ${
                  actionMessage.type === "success"
                    ? "text-green-800"
                    : "text-red-800"
                }`}
              >
                {actionMessage.text}
              </span>
            </div>
            <button
              onClick={() => setActionMessage(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Filters and Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Submission Filters
            </h3>
            <p className="text-sm text-gray-600">
              Filter submissions by status
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setStatusFilter(option.value)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      statusFilter === option.value
                        ? `${
                            option.value === "all"
                              ? "bg-gray-800 text-white"
                              : statusColors[option.value]
                          }`
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Submissions</p>
            <p className="text-2xl font-bold text-gray-900">
              {submissions.length}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Filtered</p>
            <p className="text-2xl font-bold text-gray-900">
              {filteredSubmissions.length}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Pending Reviews</p>
            <p className="text-2xl font-bold text-gray-900">
              {submissions.filter((s) => s.status === "pending").length}
            </p>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      {filteredSubmissions.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <FiUsers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No submissions found
          </h3>
          <p className="text-gray-600">
            {statusFilter === "all"
              ? "No submissions in the database yet."
              : `No submissions with status "${statusFilter}" found.`}
          </p>
          {statusFilter !== "all" && (
            <button
              onClick={() => setStatusFilter("all")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Show All Submissions
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quick Actions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Manage
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSubmissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {submission.name}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center mt-1">
                          <FiMail className="h-3 w-3 mr-1" />
                          <a
                            href={`mailto:${submission.email}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {submission.email}
                          </a>
                        </div>
                        <div className="text-sm text-gray-600 flex items-center mt-1">
                          <FiPhone className="h-3 w-3 mr-1" />
                          <a
                            href={`tel:${submission.phone}`}
                            className="text-gray-700 hover:text-gray-900"
                          >
                            {submission.phone}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mb-2">
                          {submission.projectType}
                        </span>
                        <div className="text-sm text-gray-600">
                          {submission.budget && (
                            <div className="mt-1">
                              <span className="font-medium">Budget:</span>{" "}
                              {submission.budget}
                            </div>
                          )}
                          {submission.timeline && (
                            <div className="mt-1">
                              <span className="font-medium">Timeline:</span>{" "}
                              {submission.timeline}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          statusColors[submission.status] ||
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {submission.status.charAt(0).toUpperCase() +
                          submission.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <FiClock className="h-3 w-3 mr-1" />
                        {formatDate(submission.createdAt)}
                      </div>
                      {submission.updatedAt &&
                        submission.updatedAt !== submission.createdAt && (
                          <div className="text-xs text-gray-500 mt-1">
                            Updated: {formatDate(submission.updatedAt)}
                          </div>
                        )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => sendEmail(submission.email)}
                          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                          title="Send Email"
                        >
                          <FiMail className="h-4 w-4" />
                          <span>Email</span>
                        </button>
                        <button
                          onClick={() => makePhoneCall(submission.phone)}
                          className="flex items-center gap-1 text-sm text-green-600 hover:text-green-800"
                          title="Make Call"
                        >
                          <FiPhone className="h-4 w-4" />
                          <span>Call</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setCurrentImageIndex(0);
                          }}
                          className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800"
                          title="View Details"
                        >
                          <FiEye className="h-4 w-4" />
                          <span>Details</span>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        {/* Status Actions */}
                        {statusActions[submission.status]?.map(
                          (action, idx) => (
                            <button
                              key={idx}
                              onClick={() =>
                                updateStatus(submission.id, action.nextStatus)
                              }
                              disabled={updatingId === submission.id}
                              className={`flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                action.color === "blue"
                                  ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                  : action.color === "red"
                                  ? "bg-red-100 text-red-800 hover:bg-red-200"
                                  : action.color === "purple"
                                  ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
                                  : action.color === "green"
                                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                                  : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {updatingId === submission.id ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                              ) : (
                                action.icon
                              )}
                              <span>{action.label}</span>
                            </button>
                          )
                        )}

                        {/* Delete Button */}
                        <button
                          onClick={() => setShowDeleteConfirm(submission.id)}
                          className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                          title="Delete Submission"
                        >
                          <FiTrash2 className="h-3 w-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Submission Details
                  </h3>
                  <p className="text-gray-600">ID: {selectedSubmission.id}</p>
                </div>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-8">
                {/* Client Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Client Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <FiUsers className="h-4 w-4" />
                        Full Name
                      </p>
                      <p className="font-medium text-lg mt-2">
                        {selectedSubmission.name}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <FiMail className="h-4 w-4" />
                        Email Address
                      </p>
                      <p className="font-medium text-lg mt-2">
                        {selectedSubmission.email}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <FiPhone className="h-4 w-4" />
                        Phone Number
                      </p>
                      <p className="font-medium text-lg mt-2">
                        {selectedSubmission.phone}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <FiGlobe className="h-4 w-4" />
                        Language
                      </p>
                      <p className="font-medium text-lg mt-2 uppercase">
                        {selectedSubmission.language}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Project Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-500 flex items-center gap-2">
                        <FiFileText className="h-4 w-4" />
                        Project Type
                      </p>
                      <p className="font-medium text-lg mt-2">
                        {selectedSubmission.projectType}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-500 flex items-center gap-2">
                        <FiDollarSign className="h-4 w-4" />
                        Budget
                      </p>
                      <p className="font-medium text-lg mt-2">
                        {selectedSubmission.budget || "Not specified"}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-500 flex items-center gap-2">
                        <FiTimelineIcon className="h-4 w-4" />
                        Timeline
                      </p>
                      <p className="font-medium text-lg mt-2">
                        {selectedSubmission.timeline || "Not specified"}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-500 flex items-center gap-2">
                        <FiCalendar className="h-4 w-4" />
                        Current Status
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            statusColors[selectedSubmission.status]
                          }`}
                        >
                          {selectedSubmission.status.charAt(0).toUpperCase() +
                            selectedSubmission.status.slice(1)}
                        </span>
                        <button
                          onClick={() => {
                            const newStatus =
                              selectedSubmission.status === "pending"
                                ? "contacted"
                                : "pending";
                            updateStatus(selectedSubmission.id, newStatus);
                            setSelectedSubmission({
                              ...selectedSubmission,
                              status: newStatus,
                            });
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Images Section - NEW */}
                {selectedSubmission.images &&
                  selectedSubmission.images.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">
                          Project Images ({selectedSubmission.images.length})
                        </h4>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={prevImage}
                            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                            title="Previous image"
                          >
                            <FiChevronLeft className="h-4 w-4" />
                          </button>
                          <span className="text-sm text-gray-600">
                            {currentImageIndex + 1} /{" "}
                            {selectedSubmission.images.length}
                          </span>
                          <button
                            onClick={nextImage}
                            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                            title="Next image"
                          >
                            <FiChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="relative">
                        {/* Main Image Display */}
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                          {selectedSubmission.images[currentImageIndex] ? (
                            <img
                              src={selectedSubmission.images[currentImageIndex]}
                              alt={`Project image ${currentImageIndex + 1}`}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FiImage className="h-16 w-16 text-gray-400" />
                            </div>
                          )}

                          {/* Navigation Arrows */}
                          <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
                            title="Previous image"
                          >
                            <FiChevronLeft className="h-5 w-5 text-gray-700" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
                            title="Next image"
                          >
                            <FiChevronRight className="h-5 w-5 text-gray-700" />
                          </button>

                          {/* Fullscreen Button */}
                          <button
                            onClick={() =>
                              window.open(
                                selectedSubmission.images![currentImageIndex],
                                "_blank"
                              )
                            }
                            className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white"
                            title="View full size"
                          >
                            <FiExternalLink className="h-5 w-5 text-gray-700" />
                          </button>
                        </div>

                        {/* Image Thumbnails */}
                        {selectedSubmission.images.length > 1 && (
                          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                            {selectedSubmission.images.map((image, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                                  index === currentImageIndex
                                    ? "border-blue-500 ring-2 ring-blue-200"
                                    : "border-gray-200"
                                }`}
                              >
                                <img
                                  src={image}
                                  alt={`Thumbnail ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                {/* Project Description */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Project Description
                  </h4>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {selectedSubmission.description ||
                        "No description provided"}
                    </p>
                  </div>
                </div>

                {/* Attached Files */}
                {selectedSubmission.files &&
                  selectedSubmission.files.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Attached Files ({selectedSubmission.files.length})
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedSubmission.files.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FiDownload className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  File {index + 1}
                                </p>
                                <p className="text-sm text-gray-500 truncate max-w-xs">
                                  {file.substring(file.lastIndexOf("/") + 1) ||
                                    `Attachment ${index + 1}`}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  downloadFile(file, `attachment-${index + 1}`)
                                }
                                className="p-2 text-blue-600 hover:text-blue-800"
                                title="Download"
                              >
                                <FiDownload className="h-4 w-4" />
                              </button>
                              <a
                                href={file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-gray-600 hover:text-gray-800"
                                title="Open in new tab"
                              >
                                <FiExternalLink className="h-4 w-4" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Timeline */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Timeline
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">Submitted</span>
                      </div>
                      <span className="font-medium text-gray-900">
                        {formatDate(selectedSubmission.createdAt)}
                      </span>
                    </div>
                    {selectedSubmission.updatedAt &&
                      selectedSubmission.updatedAt !==
                        selectedSubmission.createdAt && (
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FiEdit className="h-4 w-4 text-blue-500" />
                            <span className="text-blue-700">Last Updated</span>
                          </div>
                          <span className="font-medium text-blue-900">
                            {formatDate(selectedSubmission.updatedAt)}
                          </span>
                        </div>
                      )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t">
                  <button
                    onClick={() => setSelectedSubmission(null)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => sendEmail(selectedSubmission.email)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <FiMessageCircle className="h-5 w-5" />
                    Contact Client
                  </button>
                  <button
                    onClick={() => {
                      const newStatus =
                        selectedSubmission.status === "pending"
                          ? "contacted"
                          : "completed";
                      updateStatus(selectedSubmission.id, newStatus);
                      setSelectedSubmission({
                        ...selectedSubmission,
                        status: newStatus,
                      });
                    }}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <FiCheck className="h-5 w-5" />
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this submission? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const submissionToDelete = submissions.find(
                    (s) => s.id === showDeleteConfirm
                  );
                  if (submissionToDelete) {
                    deleteSubmission(submissionToDelete.id);
                  }
                }}
                disabled={updatingId === showDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {updatingId === showDeleteConfirm ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
