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
} from "react-icons/fi";

// Define the type locally
interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  status: string;
  budget?: string | null;
  createdAt: string;
}

interface ContactListProps {
  submissions: Submission[];
  onUpdate: () => void;
}

export default function ContactList({
  submissions = [],
  onUpdate,
}: ContactListProps) {
  console.log("ContactList received submissions:", submissions);
  console.log("Type of submissions:", typeof submissions);
  console.log("Is array?", Array.isArray(submissions));

  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);

  if (!submissions || !Array.isArray(submissions)) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Data Error
            </h3>
            <p className="text-red-600">
              Submissions data is not in the expected format.
            </p>
            <p className="text-sm text-red-500 mt-2">
              Type: {typeof submissions}
              {!Array.isArray(submissions) && " (Not an array)"}
            </p>
          </div>
          <p className="text-gray-600">Please check your API response.</p>
        </div>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-8">
          <FiUsers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Submissions
          </h3>
          <p className="text-gray-600">There are no contact submissions yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-900">
          Contact Submissions
        </h2>
        <p className="text-gray-600 mt-1">
          {submissions.length} submissions found
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {submissions.map((submission) => (
              <tr key={submission.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">
                      {submission.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {submission.email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                    {submission.projectType}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      submission.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : submission.status === "contacted"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {submission.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(submission.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => setSelectedSubmission(submission)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <FiEye className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Submission Details
                </h3>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{selectedSubmission.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedSubmission.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Project Type</p>
                  <p className="font-medium">
                    {selectedSubmission.projectType}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">{selectedSubmission.status}</p>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
