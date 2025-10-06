'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
  Github,
  Linkedin,
  Download,
  User,
  Code,
  GraduationCap,
  Star,
  Clock,
  Building,
  Globe,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import {
  getHiredCandidateDetailsApi,
  HiredCandidateDetailsResponse,
  ApiError,
} from '@/services/hiredService';

// Updated type definitions based on actual API response
interface CandidateProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  hireDate: string;
  interviewFeedback: string | null;
  interviewDate: string;
  userDetails: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string | null;
    phone: string;
    profilePic: string | null;
    profileVideo: string | null;
    location: string | null;
    country: string | null;
    userType: string;
    currentStatus: string;
    isVerified: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  candidateDetails: {
    id: string;
    userId: string;
    preferredMonthlySalary: string;
    currencyType: string;
    workMode: string[];
    experienceYears: number;
    currentDesignation: string;
    currentCompany: string;
    expectedSalary: number;
    preferredLocations: string[];
    skills: string[];
    resumeUrl: string;
    linkedinUrl: string;
    githubUrl: string;
    portfolioUrl: string;
    vettingStatus: string;
    vettingScore: number;
    roleTitle: string;
    joiningPeriod: string;
    location: string;
    summary: string;
    category: string;
    parsedEducation: Array<{
      degree: string;
      year: string;
      field: string | null;
      institution: string | null;
    }>;
    parsedExperience: Array<{
      title: string;
      company: string;
      end_date: string;
      start_date: string;
      description: string;
    }>;
    parsedProjects: Array<{
      title: string;
      description: string;
      technologies: string[];
    }>;
    parsedSkills: {
      technical: string[];
      frameworks: string[];
      tools: string[];
      languages: string[];
      soft: string[];
      specializations: string[];
      project_management: string[];
      certifications: string[];
    };
  };
  interviewId: string;
  meetingLink: string;
  status: string;
}

function CandidateDetailsAccess() {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const captureRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const params = useParams();

  // Extract userId from route parameters
  const userId = params?.id as string;

  useEffect(() => {
    const loadCandidateData = async () => {
      if (!userId) {
        setError('No candidate ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setImageError(false);

        const response: HiredCandidateDetailsResponse =
          await getHiredCandidateDetailsApi(userId);
        setProfile(response.candidate);
      } catch (err: unknown) {
        console.error('Error loading profile:', err);
        const apiError = err as ApiError;
        setError(apiError.message || 'Failed to load candidate profile');
      } finally {
        setLoading(false);
      }
    };

    loadCandidateData();
  }, [userId]);

  // Helper function to format experience duration
  const formatExperienceDuration = (startDate: string, endDate: string) => {
    if (endDate.toLowerCase() === 'present') {
      const start = new Date(startDate);
      return `${start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - Present`;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-6"></div>
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-32 h-32 bg-gray-200 rounded-lg"></div>
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="bg-white border border-red-200 rounded-xl p-8 text-center shadow-lg">
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const formatSalary = () => {
    const amount = profile.candidateDetails.preferredMonthlySalary;
    const currency = profile.candidateDetails.currencyType;
    if (currency === 'INR') {
      return `₹${amount}/month`;
    } else if (currency === 'USD') {
      return `$${amount}K/month`;
    }
    return `${amount} ${currency}/month`;
  };

  const fullName = `${profile.firstName} ${profile.lastName}`.trim();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'skills', label: 'Skills', icon: Code },
  ];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="border-l border-gray-300 h-6"></div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Hired Candidate Profile
          </h1>

          <div className="text-right">
            <div className="text-sm text-gray-500">Vetting Score</div>
            <div className="text-xl font-bold text-green-600 mb-1">
              {profile.candidateDetails.vettingScore}/100
            </div>
            <span
              className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer underline"
              onClick={() => router.push(`/summary-report/candidate/${userId}`)}
            >
              View Summary →
            </span>
          </div>
        </div>

        {/* Main Content - Fixed Width Container */}
        <div className="w-full max-w-5xl mx-auto" ref={captureRef}>
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <div className="relative">
                  {profile.userDetails.profilePic && !imageError ? (
                    <Image
                      src={profile.userDetails.profilePic}
                      alt={fullName}
                      className="w-32 h-32 rounded-lg object-cover border-4 border-green-200"
                      width={128}
                      height={128}
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-32 h-32 flex items-center justify-center bg-green-600 text-white text-3xl font-bold rounded-lg">
                      {profile.firstName.charAt(0).toUpperCase()}
                      {profile.lastName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {profile.userDetails.isVerified && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {fullName}
                </h2>
                <p className="text-lg text-gray-600 mb-2">
                  {profile.candidateDetails.roleTitle}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <Building className="w-4 h-4 text-green-600" />
                  <span className="text-green-600 font-medium">
                    {profile.candidateDetails.currentCompany}
                  </span>
                </div>

                {/* Hire Information */}
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-700 font-medium">
                      Hired on:
                    </span>
                    <span className="text-green-800">
                      {formatDate(profile.hireDate)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-green-700 font-medium">
                      Interview:
                    </span>
                    <span className="text-green-800">
                      {formatDate(profile.interviewDate)}
                    </span>
                  </div>
                  {profile.interviewFeedback && (
                    <div className="mt-2 pt-2 border-t border-green-200">
                      <p className="text-sm text-green-700 italic">
                        &ldquo;{profile.interviewFeedback}&rdquo;
                      </p>
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {profile.candidateDetails.preferredLocations?.join(', ')}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Experience</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {profile.candidateDetails.experienceYears} Years
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Star className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Vetting Score</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {profile.candidateDetails.vettingScore}%
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Availability</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {profile.candidateDetails.joiningPeriod}
                    </p>
                  </div>
                </div>

                {/* Contact Links */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                  >
                    <Mail className="w-4 h-4" /> Email
                  </a>
                  <a
                    href={`tel:${profile.phone}`}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                  >
                    <Phone className="w-4 h-4" /> Phone
                  </a>
                  {profile.candidateDetails.linkedinUrl && (
                    <a
                      href={profile.candidateDetails.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                    >
                      <Linkedin className="w-4 h-4" /> LinkedIn
                    </a>
                  )}
                  {profile.candidateDetails.githubUrl && (
                    <a
                      href={profile.candidateDetails.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                    >
                      <Github className="w-4 h-4" /> GitHub
                    </a>
                  )}
                  {profile.candidateDetails.resumeUrl && (
                    <a
                      href={profile.candidateDetails.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium"
                    >
                      <Download className="w-4 h-4" /> Resume
                    </a>
                  )}
                </div>

                {/* Salary and Status */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 font-semibold text-lg">
                      {formatSalary()}
                    </span>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    {profile.candidateDetails.workMode.join(', ')}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {profile.candidateDetails.roleTitle}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 py-4 px-6 font-medium text-sm transition-colors relative ${
                        isActive
                          ? 'text-green-600 bg-green-50 border-b-2 border-green-600'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content - Fixed Height Container */}
            <div className="min-h-[600px]">
              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    {/* Summary */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-green-600" />
                        Professional Summary
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 leading-relaxed">
                          {profile.candidateDetails.summary}
                        </p>
                      </div>
                    </div>

                    {/* Contact Information and Professional Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Contact Information */}
                      <div className="bg-white border rounded-xl p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">
                          Contact Information
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 text-gray-600">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <span>{profile.email}</span>
                          </div>
                          <div className="flex items-center gap-3 text-gray-600">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <span>{profile.phone}</span>
                          </div>
                          <div className="flex items-center gap-3 text-gray-600">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            <span>{profile.candidateDetails.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Professional Details */}
                      <div className="bg-white border rounded-xl p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">
                          Professional Details
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 text-gray-600">
                            <Briefcase className="w-5 h-5 text-gray-400" />
                            <span>
                              {profile.candidateDetails.experienceYears} years
                              experience
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-gray-600">
                            <DollarSign className="w-5 h-5 text-gray-400" />
                            <span>{formatSalary()}</span>
                          </div>
                          <div className="flex items-center gap-3 text-gray-600">
                            <Globe className="w-5 h-5 text-gray-400" />
                            <span>
                              {profile.candidateDetails.workMode.join(', ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="bg-white border rounded-xl p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-6">
                        Experience
                      </h3>
                      <div className="space-y-6">
                        {profile.candidateDetails.parsedExperience.map(
                          (exp, index) => (
                            <div
                              key={index}
                              className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0"
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <h4 className="font-semibold text-gray-900">
                                        {exp.title}
                                      </h4>
                                      <p className="text-gray-600">
                                        {exp.company}
                                      </p>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                      {formatExperienceDuration(
                                        exp.start_date,
                                        exp.end_date
                                      )}
                                    </span>
                                  </div>
                                  <p className="text-gray-600 text-sm">
                                    {exp.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Education */}
                    <div className="bg-white border rounded-xl p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-6">
                        Education
                      </h3>
                      <div className="space-y-4">
                        {profile.candidateDetails.parsedEducation.map(
                          (edu, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <GraduationCap className="w-5 h-5 text-gray-400 mt-1" />
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  {edu.degree}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Completed: {edu.year}
                                </p>
                                {edu.field && (
                                  <p className="text-sm text-gray-500">
                                    Field: {edu.field}
                                  </p>
                                )}
                                {edu.institution && (
                                  <p className="text-sm text-gray-500">
                                    Institution: {edu.institution}
                                  </p>
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Projects */}
                    <div className="bg-white border rounded-xl p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-6">
                        Notable Projects
                      </h3>
                      <div className="space-y-6">
                        {profile.candidateDetails.parsedProjects.map(
                          (project, index) => (
                            <div
                              key={index}
                              className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0"
                            >
                              <h4 className="font-semibold text-gray-900 mb-2">
                                {project.title}
                              </h4>
                              <p className="text-gray-600 text-sm mb-3">
                                {project.description}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {project.technologies.map((tech, techIndex) => (
                                  <span
                                    key={techIndex}
                                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Skills Tab */}
                {activeTab === 'skills' && (
                  <div className="space-y-6">
                    {/* Main Skills Section - Combine skills array and technical skills */}
                    {(profile.candidateDetails.skills.length > 0 ||
                      profile.candidateDetails.parsedSkills.technical.length >
                        0) && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                          Technical Skills
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex flex-wrap gap-2">
                            {/* First show main skills array */}
                            {profile.candidateDetails.skills.map(
                              (skill, index) => (
                                <span
                                  key={`main-${index}`}
                                  className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800"
                                >
                                  {skill}
                                </span>
                              )
                            )}
                            {/* Then show parsed technical skills that aren't already in main skills */}
                            {profile.candidateDetails.parsedSkills.technical
                              .filter(
                                skill =>
                                  !profile.candidateDetails.skills.includes(
                                    skill
                                  )
                              )
                              .map((skill, index) => (
                                <span
                                  key={`tech-${index}`}
                                  className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800"
                                >
                                  {skill}
                                </span>
                              ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Frameworks */}
                    {profile.candidateDetails.parsedSkills.frameworks.length >
                      0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                          Frameworks & Libraries
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex flex-wrap gap-2">
                            {profile.candidateDetails.parsedSkills.frameworks.map(
                              (skill, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-800"
                                >
                                  {skill}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tools */}
                    {profile.candidateDetails.parsedSkills.tools.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-gray-500"></div>
                          Tools & Technologies
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex flex-wrap gap-2">
                            {profile.candidateDetails.parsedSkills.tools.map(
                              (skill, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800"
                                >
                                  {skill}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Specializations */}
                    {profile.candidateDetails.parsedSkills.specializations
                      .length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-red-500"></div>
                          Specializations
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex flex-wrap gap-2">
                            {profile.candidateDetails.parsedSkills.specializations.map(
                              (skill, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800"
                                >
                                  {skill}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Certifications */}
                    {profile.candidateDetails.parsedSkills.certifications
                      .length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-indigo-500"></div>
                          Certifications
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex flex-wrap gap-2">
                            {profile.candidateDetails.parsedSkills.certifications.map(
                              (skill, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 text-sm font-medium rounded-full bg-indigo-100 text-indigo-800"
                                >
                                  {skill}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Project Management */}
                    {profile.candidateDetails.parsedSkills.project_management
                      .length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                          Project Management
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex flex-wrap gap-2">
                            {profile.candidateDetails.parsedSkills.project_management.map(
                              (skill, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800"
                                >
                                  {skill}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Soft Skills */}
                    {profile.candidateDetails.parsedSkills.soft.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                          Soft Skills
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex flex-wrap gap-2">
                            {profile.candidateDetails.parsedSkills.soft.map(
                              (skill, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 text-sm font-medium rounded-full bg-orange-100 text-orange-800"
                                >
                                  {skill}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Languages */}
                    {profile.candidateDetails.parsedSkills.languages.length >
                      0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-green-500"></div>
                          Languages
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex flex-wrap gap-2">
                            {profile.candidateDetails.parsedSkills.languages.map(
                              (skill, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800"
                                >
                                  {skill}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-6 text-center">
            <button
              onClick={() =>
                router.push('/customer/browse-engineers/dashboard')
              }
              className="px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CandidateDetailsAccess;
