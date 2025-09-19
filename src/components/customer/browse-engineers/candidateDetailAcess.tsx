'use client';
import React, { useState, useEffect } from 'react';
import {
  Mail,
  Phone,
  Briefcase,
  Calendar,
  DollarSign,
  ExternalLink,
  Github,
  Linkedin,
} from 'lucide-react';
import {
  getShortlistedCandidateProfile,
  ShortlistedCandidateProfile,
} from '@/services/customer/shortlistedProfileService';
import Image from 'next/image';

interface CandidateDetailsAccessProps {
  candidateId: string;
}

function CandidateDetailsAccess({ candidateId }: CandidateDetailsAccessProps) {
  const [profile, setProfile] = useState<ShortlistedCandidateProfile | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!candidateId) {
        setError('No candidate ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setImageError(false);
        const profileData = await getShortlistedCandidateProfile(candidateId);
        setProfile(profileData);
      } catch (err: unknown) {
        console.error('Error fetching profile:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to load candidate profile');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [candidateId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="max-w-4xl w-full">
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-6"></div>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-48 h-48 bg-gray-200 rounded-xl"></div>
                <div className="flex-1 space-y-4">
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="max-w-4xl w-full">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <p className="text-red-600 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const formatSalary = () => {
    const amount = profile.preferredMonthlySalary;
    const currency = profile.currencyType;
    if (currency === 'INR') {
      return `₹${amount}L/month`;
    } else if (currency === 'USD') {
      return `$${amount}K/month`;
    }
    return `${amount} ${currency}/month`;
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Main Heading */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black text-center mb-12 leading-tight">
          You Now Have Full Access to Candidate Details
        </h1>

        {/* Candidate Card */}
        <div className="bg-white rounded-2xl p-6 shadow-2xl flex flex-col lg:flex-row gap-8">
          {/* Left Side - Profile Card */}
          <div className="flex-shrink-0 w-full lg:w-64 bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex flex-col items-center lg:items-start">
              <div className="relative mb-4">
                {profile.user.profilePic && !imageError ? (
                  <Image
                    src={profile.user.profilePic}
                    alt={profile.user.firstName}
                    className="w-36 h-36 rounded-full object-cover ring-4 ring-blue-200"
                    width={150}
                    height={150}
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-36 h-36 flex items-center justify-center bg-blue-600 text-white text-4xl font-bold rounded-full">
                    {profile.user.firstName.charAt(0).toUpperCase()}
                  </div>
                )}
                {profile.vettingStatus === 'approved' && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <div className="text-center lg:text-left mb-4">
                <h3 className="text-lg font-semibold">
                  {profile.user.firstName} {profile.user.lastName}
                </h3>
                <p className="text-sm text-gray-500">
                  {profile.currentDesignation} at {profile.currentCompany}
                </p>
                <p className="text-sm text-gray-400">{profile.location}</p>
              </div>

              <div className="flex flex-col gap-2 w-full mb-4">
                <a
                  href={`mailto:${profile.user.email}`}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  <Mail className="w-4 h-4" /> {profile.user.email}
                </a>
                <a
                  href={`tel:${profile.user.phone}`}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                >
                  <Phone className="w-4 h-4" /> {profile.user.phone}
                </a>
              </div>

              <div className="flex gap-3 pt-2">
                {profile.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-blue-600" />
                  </a>
                )}
                {profile.githubUrl && (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Github className="w-4 h-4 text-gray-700" />
                  </a>
                )}
                {profile.portfolioUrl && (
                  <a
                    href={profile.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-green-600" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {profile.user.firstName} {profile.user.lastName}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  <span>
                    {profile.currentDesignation} at {profile.currentCompany}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{profile.experienceYears} years experience</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="text-green-600 font-semibold text-lg">
                  {formatSalary()}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                  {profile.workMode.join(', ')}
                </span>
              </div>
            </div>

            {/* Top Skills */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Top Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.slice(0, 12).map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                  >
                    {skill}
                  </span>
                ))}
                {profile.skills.length > 12 && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                    +{profile.skills.length - 12} more
                  </span>
                )}
              </div>
            </div>

            {/* Capabilities Analysis */}
            {profile.capabilities.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Capability Analysis
                </h3>
                {profile.capabilities.map(capability => (
                  <div
                    key={capability.id}
                    className="border rounded-lg p-4 mb-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Match Score</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                          {capability.matchPercentage}%
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        Score: {capability.score}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      {capability.explanation}
                    </p>

                    {capability.matchedCapabilities.length > 0 && (
                      <div className="mb-2">
                        <span className="text-xs font-medium text-green-700">
                          Matched:{' '}
                        </span>
                        <span className="text-xs text-gray-600">
                          {capability.matchedCapabilities.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Action Button */}
            <button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-xl transition-colors">
              Congratulations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CandidateDetailsAccess;
