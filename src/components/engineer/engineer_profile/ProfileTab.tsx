import React from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
  Monitor,
  Award,
  Github,
  Linkedin,
} from 'lucide-react';
import { ProfileGetResponse } from '@/services/profileSettingsService';

interface ProfileTabProps {
  profile: ProfileGetResponse;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ profile }) => {
  console.log('data', profile);

  // Extract data from the JSON structure with proper typing
  const user = profile?.data;
  const candidate = user?.candidate;

  // Early return if no user data
  if (!user) {
    return (
      <div className="p-6 text-center text-gray-500">
        No user data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section - Simplified without profile image and personal details */}
      <div className="bg-[#f4f7f7]  p-6 rounded-lg">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Candidate Profile
            </h2>
            {/* <p className="text-gray-600">
              {candidate?.category || 'Software Development'}
            </p> */}
          </div>
          <div className="flex flex-col items-end space-y-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                candidate?.vettingStatus === 'passed'
                  ? 'bg-green-100 text-green-800'
                  : candidate?.vettingStatus === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
              }`}
            >
              Vetting: {candidate?.vettingStatus || 'N/A'}
            </span>
            <span className="text-sm text-gray-600">
              Score: {candidate?.vettingScore || 0}/100
            </span>
          </div>
        </div>
      </div>

      {/* Contact & Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Contact Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">{user.email || 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">
                {candidate?.phone || user.phone || 'N/A'}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">
                {candidate?.location || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Professional Details
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Briefcase className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">
                {candidate?.experienceYears || 0} years experience
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">
                Available in: {candidate?.joiningPeriod || 'N/A'}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <DollarSign className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">
                {candidate?.preferredMonthlySalary || 'N/A'}{' '}
                {candidate?.currencyType || ''}
                /month
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Monitor className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600 capitalize">
                {candidate?.workMode && candidate.workMode.length > 0
                  ? candidate.workMode.join(', ')
                  : 'Not specified'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Education Section */}
      {candidate?.parsedEducation && candidate.parsedEducation.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Education
          </h3>
          <div className="space-y-3">
            {candidate.parsedEducation.map((edu, index) => (
              <div key={index} className="flex items-start space-x-3">
                <Award className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium text-gray-700">
                    {edu.degree || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Completed: {edu.year || 'N/A'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Links Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Professional Links
        </h3>
        <div className="flex flex-wrap gap-4">
          {candidate?.linkedinUrl && (
            <a
              href={candidate.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <Linkedin className="w-5 h-5" />
              <span>LinkedIn Profile</span>
            </a>
          )}
          {candidate?.githubUrl && (
            <a
              href={candidate.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
            >
              <Github className="w-5 h-5" />
              <span>GitHub Profile</span>
            </a>
          )}
          {candidate?.resumeUrl && (
            <a
              href={candidate.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-green-600 hover:text-green-700"
            >
              <Briefcase className="w-5 h-5" />
              <span>Download Resume</span>
            </a>
          )}
          {!candidate?.linkedinUrl &&
            !candidate?.githubUrl &&
            !candidate?.resumeUrl && (
              <p className="text-gray-500">No professional links available</p>
            )}
        </div>
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-sm text-gray-500">Profile Status</p>
          <p className="text-lg font-semibold text-gray-800">
            {user.currentStatus || 'N/A'}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-sm text-gray-500">Published</p>
          <p className="text-lg font-semibold text-gray-800">
            {candidate?.isPublished ? '✓ Yes' : '✗ No'}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-sm text-gray-500">Hired Status</p>
          <p className="text-lg font-semibold text-gray-800">
            {candidate?.isHired ? '✓ Hired' : 'Available'}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-sm text-gray-500">Verified</p>
          <p className="text-lg font-semibold text-gray-800">
            {user.isVerified ? '✓ Verified' : 'Pending'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
