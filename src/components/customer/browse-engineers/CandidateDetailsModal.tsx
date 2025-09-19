// CandidateDetailsModal.tsx
import { Candidate } from '@/types/customer';
import {
  X,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  FileText,
} from 'lucide-react';
import Image from 'next/image';
import { FC, useEffect, useRef } from 'react';

interface CandidateDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate | null;
  onViewReport?: (candidateId: string) => void; // Add this prop for handling report view
}

const CandidateDetailsModal: FC<CandidateDetailsModalProps> = ({
  isOpen,
  onClose,
  candidate,
  onViewReport,
}) => {
  //   console.log('candidate', candidate);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !candidate) return null;

  // Calculate average match percentage
  const avgMatchPercentage = candidate.capabilities?.length
    ? Math.round(
        candidate.capabilities.reduce(
          (acc, cap) => acc + cap.matchPercentage,
          0
        ) / candidate.capabilities.length
      )
    : 0;

  const handleViewReport = () => {
    if (onViewReport && candidate.id) {
      onViewReport(candidate.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80  transition-opacity" />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          ref={modalRef}
          className="relative w-full max-w-5xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header Section */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-[#416d68] to-[#1F514C] p-6 text-white">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-white/20 flex-shrink-0">
                {candidate.user.profilePic ? (
                  <Image
                    src={candidate.user.profilePic}
                    alt={candidate.user.firstName}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {candidate.user.firstName?.[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">
                  {candidate.user.firstName}
                </h2>
                <p className="text-xl opacity-90">{candidate.roleTitle}</p>
                <p className="text-sm opacity-80 mt-1">
                  {candidate.currentDesignation}
                </p>
              </div>

              <div className="flex items-start gap-3">
                {/* View Report Button */}
                <button
                  onClick={handleViewReport}
                  className="bg-white/20 hover:bg-white/30 rounded-lg px-4 py-2 transition-colors flex items-center gap-2"
                  aria-label="View Report"
                >
                  <FileText className="w-5 h-5 text-white" />
                  <span className="text-sm font-medium">View Report</span>
                </button>

                {/* Match Score */}
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <p className="text-sm opacity-80">Match Score</p>
                  <p className="text-2xl font-bold">{avgMatchPercentage}%</p>
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Scrollable Content Section */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Professional Summary
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {candidate.summary}
              </p>
            </div>

            {/* Key Information Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Experience</span>
                </div>
                <p className="text-xl font-semibold text-gray-800">
                  {candidate.experienceYears} years
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm">Expected Salary</span>
                </div>
                <p className="text-xl font-semibold text-gray-800">
                  {candidate.expectedSalary} {candidate.currencyType}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Location</span>
                </div>
                <p className="text-xl font-semibold text-gray-800">
                  {candidate.location}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-sm">Work Mode</span>
                </div>
                <p className="text-xl font-semibold text-gray-800 capitalize">
                  {candidate.workMode?.[0] || 'Flexible'}
                </p>
              </div>
            </div>

            {/* Skills Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Technical Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Preferred Locations */}
            {candidate.preferredLocations &&
              candidate.preferredLocations.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Preferred Locations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {candidate.preferredLocations.map((location, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                      >
                        <MapPin className="w-3 h-3 inline mr-1" />
                        {location}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetailsModal;
