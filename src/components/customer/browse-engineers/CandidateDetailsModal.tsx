// CandidateDetailsModal.tsx
import { Candidate } from '@/types/customer';
import {
  X,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  FileText,
  Code,
  Layers,
  Wrench,
  Star,
  Users,
  MessageSquare,
  Globe,
  Award,
} from 'lucide-react';
import Image from 'next/image';
import { FC, useEffect, useRef } from 'react';

interface CandidateDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate | null;
  onViewReport?: (candidateId: string) => void;
}

const CandidateDetailsModal: FC<CandidateDetailsModalProps> = ({
  isOpen,
  onClose,
  candidate,
}) => {
  console.log('candidate', candidate);
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

  // Get match percentage from capabilities (use first capability's match percentage)
  const matchPercentage = Math.min(
    candidate.capabilities?.[0]?.matchPercentage || 0,
    100
  );

  const handleViewReport = () => {
    // console.log('Vetting report commented', candidate.user.id);
    if (candidate?.id) {
      window.open(`/summary-report/candidate/${candidate.user.id}`, '_blank');
    }
  };

  // Helper function to render skill badges with consistent green theme
  const renderSkillBadges = (
    skills: string[],
    variant:
      | 'primary'
      | 'secondary'
      | 'accent'
      | 'neutral'
      | 'success'
      | 'info'
      | 'warning'
  ) => {
    const variantClasses = {
      primary:
        'bg-[#416d68]/10 text-[#416d68] border border-[#416d68]/20 hover:bg-[#416d68]/20',
      secondary:
        'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100',
      accent:
        'bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100',
      neutral:
        'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100',
      success:
        'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100',
      info: 'bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100',
      warning:
        'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100',
    };

    return skills?.map((skill, index) => (
      <span
        key={index}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${variantClasses[variant]}`}
      >
        {skill}
      </span>
    ));
  };

  // Get match color based on percentage
  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'text-emerald-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-500';
  };

  const getMatchBgColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-emerald-400';
    if (percentage >= 60) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Enhanced Backdrop */}
      <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/80 to-black/90 backdrop-blur-sm transition-opacity" />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          ref={modalRef}
          className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl max-h-[95vh] overflow-hidden flex flex-col border border-gray-200"
        >
          {/* Enhanced Header Section */}
          <div className="top-0 z-10 bg-gradient-to-br from-[#416d68] via-[#2d5a54] to-[#1F514C] p-8 text-white relative ">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>

            <div className="relative flex items-start gap-6">
              {/* Enhanced Profile Picture */}
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white/20 flex-shrink-0 ring-4 ring-white/30 shadow-xl">
                {candidate.user.profilePic ? (
                  <Image
                    src={candidate.user.profilePic}
                    alt={candidate.user.firstName}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover filter blur-sm"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-white/30 to-white/10 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">
                      {candidate.user.firstName?.[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Enhanced Profile Info */}
              <div className="flex-1 my-auto">
                <h2 className="text-3xl font-bold mb-2 text-white drop-shadow-sm">
                  {candidate.roleTitle}
                </h2>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex items-start gap-4">
                {/* Enhanced Match Score Display */}
                <div className="bg-white/15 backdrop-blur-md rounded-2xl px-6 py-5 border border-white/20 shadow-2xl hover:bg-white/20 transition-all duration-300 group min-w-[140px]">
                  <div className="text-center">
                    <p className="text-sm text-white/80 mb-2 group-hover:text-white/90 transition-colors">
                      Match Percentage
                    </p>
                    <div className="flex items-baseline justify-center gap-1 mb-3">
                      <p
                        className={`text-4xl font-bold ${getMatchColor(matchPercentage)} text-white`}
                      >
                        {matchPercentage}
                      </p>
                      <span className="text-xl text-white/80">%</span>
                    </div>
                    {/* Enhanced Progress bar */}
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className={`${getMatchBgColor(matchPercentage)} h-2 rounded-full transition-all duration-1000 ease-out shadow-sm`}
                        style={{ width: `${matchPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Enhanced View Report Button */}
                <button
                  onClick={handleViewReport}
                  className="bg-white/15 hover:bg-white/25 backdrop-blur-md rounded-2xl px-6 py-5 transition-all duration-300 flex items-center gap-4 border border-white/20 shadow-2xl hover:shadow-3xl hover:scale-105 group"
                  aria-label="View Report"
                >
                  <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-semibold block text-white">
                      View Report
                    </span>
                    <span className="text-xs text-white/70">
                      Detailed Analysis
                    </span>
                  </div>
                </button>

                {/* Enhanced Close Button */}
                <button
                  onClick={onClose}
                  className="p-3 rounded-xl bg-white/20 hover:bg-red-500/80 transition-all duration-200 group"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Scrollable Content Section */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gradient-to-b from-gray-50/50 to-white">
            {/* Enhanced Summary Section */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#416d68]/10 rounded-lg">
                  <FileText className="w-5 h-5 text-[#416d68]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Professional Summary
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed text-base">
                {candidate.summary}
              </p>
            </div>

            {/* Enhanced Key Information Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-500">
                    Experience
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {candidate.experienceYears} years
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-500">
                    Expected Salary
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {candidate.preferredMonthlySalary} {candidate.currencyType}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-500">
                    Location
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {candidate.location}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Briefcase className="w-5 h-5 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-500">
                    Work Mode
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {candidate.workMode && candidate.workMode.length > 0 ? (
                    candidate.workMode.map((mode, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium border border-orange-200 capitalize"
                      >
                        {mode}
                      </span>
                    ))
                  ) : (
                    <span className="px-3 py-1 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium border border-gray-200">
                      Flexible
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Skills Sections */}
            <div className="space-y-6">
              {/* Technical Skills */}
              {candidate.parsedSkills?.technical &&
                candidate.parsedSkills.technical.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-[#416d68]/10 rounded-lg">
                        <Code className="w-5 h-5 text-[#416d68]" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        Technical Skills
                      </h3>
                      <span className="bg-[#416d68]/10 text-[#416d68] text-xs font-medium px-2 py-1 rounded-full">
                        {candidate.parsedSkills.technical.length} skills
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {renderSkillBadges(
                        candidate.parsedSkills.technical,
                        'primary'
                      )}
                    </div>
                  </div>
                )}

              {/* Frameworks */}
              {candidate.parsedSkills?.frameworks &&
                candidate.parsedSkills.frameworks.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <Layers className="w-5 h-5 text-emerald-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        Frameworks & Libraries
                      </h3>
                      <span className="bg-emerald-100 text-emerald-600 text-xs font-medium px-2 py-1 rounded-full">
                        {candidate.parsedSkills.frameworks.length} frameworks
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {renderSkillBadges(
                        candidate.parsedSkills.frameworks,
                        'secondary'
                      )}
                    </div>
                  </div>
                )}

              {/* Tools */}
              {candidate.parsedSkills?.tools &&
                candidate.parsedSkills.tools.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-teal-100 rounded-lg">
                        <Wrench className="w-5 h-5 text-teal-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        Tools & Platforms
                      </h3>
                      <span className="bg-teal-100 text-teal-600 text-xs font-medium px-2 py-1 rounded-full">
                        {candidate.parsedSkills.tools.length} tools
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {renderSkillBadges(
                        candidate.parsedSkills.tools,
                        'accent'
                      )}
                    </div>
                  </div>
                )}

              {/* Specializations */}
              {candidate.parsedSkills?.specializations &&
                candidate.parsedSkills.specializations.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <Star className="w-5 h-5 text-amber-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        Domain Expertise
                      </h3>
                      <span className="bg-amber-100 text-amber-600 text-xs font-medium px-2 py-1 rounded-full">
                        {candidate.parsedSkills.specializations.length} domains
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {renderSkillBadges(
                        candidate.parsedSkills.specializations,
                        'warning'
                      )}
                    </div>
                  </div>
                )}

              {/* Project Management */}
              {candidate.parsedSkills?.project_management &&
                candidate.parsedSkills.project_management.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-sky-100 rounded-lg">
                        <Users className="w-5 h-5 text-sky-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        Project Management
                      </h3>
                      <span className="bg-sky-100 text-sky-600 text-xs font-medium px-2 py-1 rounded-full">
                        {candidate.parsedSkills.project_management.length}{' '}
                        methodologies
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {renderSkillBadges(
                        candidate.parsedSkills.project_management,
                        'info'
                      )}
                    </div>
                  </div>
                )}

              {/* Certifications */}
              {candidate.parsedSkills?.certifications &&
                candidate.parsedSkills.certifications.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Award className="w-5 h-5 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        Certifications
                      </h3>
                      <span className="bg-green-100 text-green-600 text-xs font-medium px-2 py-1 rounded-full">
                        {candidate.parsedSkills.certifications.length}{' '}
                        certifications
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {renderSkillBadges(
                        candidate.parsedSkills.certifications,
                        'success'
                      )}
                    </div>
                  </div>
                )}

              {/* Soft Skills */}
              {candidate.parsedSkills?.soft &&
                candidate.parsedSkills.soft.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <MessageSquare className="w-5 h-5 text-slate-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        Soft Skills
                      </h3>
                      <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2 py-1 rounded-full">
                        {candidate.parsedSkills.soft.length} skills
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {renderSkillBadges(
                        candidate.parsedSkills.soft,
                        'neutral'
                      )}
                    </div>
                  </div>
                )}

              {/* Languages */}
              {candidate.parsedSkills?.languages &&
                candidate.parsedSkills.languages.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-teal-100 rounded-lg">
                        <Globe className="w-5 h-5 text-teal-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        Languages
                      </h3>
                      <span className="bg-teal-100 text-teal-600 text-xs font-medium px-2 py-1 rounded-full">
                        {candidate.parsedSkills.languages.length} languages
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {renderSkillBadges(
                        candidate.parsedSkills.languages,
                        'accent'
                      )}
                    </div>
                  </div>
                )}
            </div>

            {/* Enhanced Preferred Locations */}
            {candidate.preferredLocations &&
              candidate.preferredLocations.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <MapPin className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Preferred Locations
                    </h3>
                    <span className="bg-purple-100 text-purple-600 text-xs font-medium px-2 py-1 rounded-full">
                      {candidate.preferredLocations.length} locations
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {candidate.preferredLocations.map((location, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium border border-purple-200 hover:bg-purple-100 transition-colors duration-200 flex items-center gap-2"
                      >
                        <MapPin className="w-4 h-4" />
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
