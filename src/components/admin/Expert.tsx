'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  FiSearch,
  FiEye,
  FiUser,
  FiChevronLeft,
  FiChevronRight,
  FiUsers,
  FiX,
  FiCheckCircle,
  FiXCircle,
  FiGlobe,
  FiFileText,
  FiLoader,
  FiChevronsLeft,
  FiChevronsRight,
  FiAlertCircle,
  FiCheck,
  FiMapPin,
  FiStar,
  FiBriefcase,
  FiMail,
  FiPhone,
  FiLinkedin,
  FiGithub,
} from 'react-icons/fi';

// Expert interface
interface Expert {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profilePic?: string;
  expertise: string[];
  experienceYears: number;
  currentRole: string;
  currentCompany: string;
  location: string;
  hourlyRate: number;
  currency: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  rating?: number;
  completedProjects?: number;
  bio?: string;
  availability: 'available' | 'busy' | 'unavailable';
  createdAt: string;
  updatedAt: string;
}

// Dummy expert data - all set to pending by default
const DUMMY_EXPERTS: Expert[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1-234-567-8901',
    expertise: ['React', 'Node.js', 'TypeScript', 'AWS'],
    experienceYears: 8,
    currentRole: 'Senior Full Stack Developer',
    currentCompany: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    hourlyRate: 120,
    currency: 'USD',
    linkedinUrl: 'https://linkedin.com/in/sarah-johnson',
    githubUrl: 'https://github.com/sarah-johnson',
    status: 'pending',
    rating: 4.8,
    completedProjects: 15,
    bio: 'Experienced full-stack developer with expertise in modern web technologies. Passionate about creating scalable applications.',
    availability: 'available',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@email.com',
    phone: '+1-234-567-8902',
    expertise: ['Python', 'Django', 'PostgreSQL', 'Docker'],
    experienceYears: 6,
    currentRole: 'Backend Developer',
    currentCompany: 'DataSoft Solutions',
    location: 'Seattle, WA',
    hourlyRate: 95,
    currency: 'USD',
    linkedinUrl: 'https://linkedin.com/in/michael-chen',
    githubUrl: 'https://github.com/michael-chen',
    status: 'pending',
    rating: 4.9,
    completedProjects: 22,
    bio: 'Backend specialist with strong expertise in Python and database optimization. Love solving complex technical challenges.',
    availability: 'busy',
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-16T09:15:00Z',
  },
  {
    id: '3',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'emily.rodriguez@email.com',
    phone: '+1-234-567-8903',
    expertise: ['UI/UX Design', 'Figma', 'React', 'CSS'],
    experienceYears: 5,
    currentRole: 'Senior UI/UX Designer',
    currentCompany: 'Creative Studio',
    location: 'Austin, TX',
    hourlyRate: 85,
    currency: 'USD',
    linkedinUrl: 'https://linkedin.com/in/emily-rodriguez',
    portfolioUrl: 'https://emily-design.com',
    status: 'pending',
    rating: 4.7,
    completedProjects: 18,
    bio: 'Creative UI/UX designer with a passion for user-centered design. Experienced in both design and frontend development.',
    availability: 'available',
    createdAt: '2024-01-08T11:20:00Z',
    updatedAt: '2024-01-14T16:45:00Z',
  },
  {
    id: '4',
    firstName: 'David',
    lastName: 'Kim',
    email: 'david.kim@email.com',
    phone: '+1-234-567-8904',
    expertise: ['Java', 'Spring Boot', 'Microservices', 'Kubernetes'],
    experienceYears: 10,
    currentRole: 'Lead Java Developer',
    currentCompany: 'Enterprise Solutions',
    location: 'New York, NY',
    hourlyRate: 140,
    currency: 'USD',
    linkedinUrl: 'https://linkedin.com/in/david-kim',
    githubUrl: 'https://github.com/david-kim',
    status: 'pending',
    rating: 4.5,
    completedProjects: 25,
    bio: 'Senior Java developer with extensive experience in enterprise applications and microservices architecture.',
    availability: 'unavailable',
    createdAt: '2024-01-12T08:45:00Z',
    updatedAt: '2024-01-17T12:30:00Z',
  },
  {
    id: '5',
    firstName: 'Lisa',
    lastName: 'Thompson',
    email: 'lisa.thompson@email.com',
    phone: '+1-234-567-8905',
    expertise: ['Flutter', 'Dart', 'iOS', 'Android'],
    experienceYears: 4,
    currentRole: 'Mobile App Developer',
    currentCompany: 'MobileFirst Inc.',
    location: 'Los Angeles, CA',
    hourlyRate: 100,
    currency: 'USD',
    linkedinUrl: 'https://linkedin.com/in/lisa-thompson',
    githubUrl: 'https://github.com/lisa-thompson',
    portfolioUrl: 'https://lisa-apps.com',
    status: 'pending',
    rating: 4.6,
    completedProjects: 12,
    bio: 'Mobile app developer specializing in cross-platform development with Flutter. Published several apps on both app stores.',
    availability: 'available',
    createdAt: '2024-01-14T13:15:00Z',
    updatedAt: '2024-01-14T13:15:00Z',
  },
  {
    id: '6',
    firstName: 'Robert',
    lastName: 'Brown',
    email: 'robert.brown@email.com',
    phone: '+1-234-567-8906',
    expertise: ['DevOps', 'AWS', 'Terraform', 'Jenkins'],
    experienceYears: 7,
    currentRole: 'DevOps Engineer',
    currentCompany: 'CloudOps Pro',
    location: 'Chicago, IL',
    hourlyRate: 110,
    currency: 'USD',
    linkedinUrl: 'https://linkedin.com/in/robert-brown',
    githubUrl: 'https://github.com/robert-brown',
    status: 'pending',
    rating: 4.8,
    completedProjects: 20,
    bio: 'DevOps expert with strong cloud infrastructure experience. Specializes in CI/CD pipelines and infrastructure automation.',
    availability: 'available',
    createdAt: '2024-01-09T15:40:00Z',
    updatedAt: '2024-01-15T10:20:00Z',
  },
  {
    id: '7',
    firstName: 'Anna',
    lastName: 'Wilson',
    email: 'anna.wilson@email.com',
    phone: '+1-234-567-8907',
    expertise: ['Data Science', 'Python', 'Machine Learning', 'SQL'],
    experienceYears: 6,
    currentRole: 'Data Scientist',
    currentCompany: 'AI Analytics',
    location: 'Boston, MA',
    hourlyRate: 125,
    currency: 'USD',
    linkedinUrl: 'https://linkedin.com/in/anna-wilson',
    githubUrl: 'https://github.com/anna-wilson',
    status: 'pending',
    rating: 4.9,
    completedProjects: 16,
    bio: 'Data scientist with expertise in machine learning and statistical analysis. Experience in building predictive models.',
    availability: 'busy',
    createdAt: '2024-01-11T09:25:00Z',
    updatedAt: '2024-01-16T14:10:00Z',
  },
  {
    id: '8',
    firstName: 'James',
    lastName: 'Davis',
    email: 'james.davis@email.com',
    phone: '+1-234-567-8908',
    expertise: ['Blockchain', 'Solidity', 'Web3', 'Ethereum'],
    experienceYears: 3,
    currentRole: 'Blockchain Developer',
    currentCompany: 'CryptoTech',
    location: 'Miami, FL',
    hourlyRate: 130,
    currency: 'USD',
    linkedinUrl: 'https://linkedin.com/in/james-davis',
    githubUrl: 'https://github.com/james-davis',
    status: 'pending',
    rating: 4.4,
    completedProjects: 8,
    bio: 'Blockchain developer with focus on DeFi applications and smart contract development. Early adopter of Web3 technologies.',
    availability: 'available',
    createdAt: '2024-01-13T12:50:00Z',
    updatedAt: '2024-01-13T12:50:00Z',
  },
];

// Confirmation Modal Component
function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  expertName,
  action,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  expertName: string;
  action: 'approve' | 'reject';
  isLoading: boolean;
}) {
  if (!isOpen) return null;

  const isApprove = action === 'approve';

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isApprove ? 'bg-green-100' : 'bg-red-100'
              }`}
            >
              {isApprove ? (
                <FiCheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <FiXCircle className="w-5 h-5 text-red-600" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Confirm {isApprove ? 'Approval' : 'Rejection'}
            </h3>
          </div>

          <p className="text-gray-600 mb-6">
            Are you sure you want to {action}{' '}
            <span className="font-medium">{expertName}</span> as an expert on
            the platform?{' '}
            {isApprove
              ? 'They will be able to take on expert consultation projects.'
              : 'They will not be able to participate as an expert.'}
          </p>

          <div className="flex items-center gap-3 justify-end">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 ${
                isApprove
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isLoading ? (
                <>
                  <FiLoader className="w-4 h-4 animate-spin" />
                  {isApprove ? 'Approving...' : 'Rejecting...'}
                </>
              ) : (
                <>
                  {isApprove ? (
                    <FiCheck className="w-4 h-4" />
                  ) : (
                    <FiX className="w-4 h-4" />
                  )}
                  Confirm {isApprove ? 'Approve' : 'Reject'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// View Expert Details Modal
function ViewExpertModal({
  expert,
  onClose,
  onApprove,
  onReject,
}: {
  expert: Expert;
  onClose: () => void;
  onApprove: (expert: Expert) => void;
  onReject: (expert: Expert) => void;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-orange-100 text-orange-800';
      case 'unavailable':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {expert.firstName} {expert.lastName} - Expert Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Header with Profile Picture */}
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
              {expert.profilePic ? (
                <Image
                  src={expert.profilePic}
                  alt={`${expert.firstName} ${expert.lastName}`}
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <FiUser className="w-12 h-12 text-gray-600" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {expert.firstName} {expert.lastName}
              </h3>
              <p className="text-lg text-gray-700 mb-2">
                {expert.currentRole} at {expert.currentCompany}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <FiMapPin className="w-4 h-4" />
                  {expert.location}
                </div>
                <div className="flex items-center gap-1">
                  <FiBriefcase className="w-4 h-4" />
                  {expert.experienceYears} years experience
                </div>
                {expert.rating && (
                  <div className="flex items-center gap-1">
                    <FiStar className="w-4 h-4 text-yellow-500" />
                    {expert.rating}/5.0
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(expert.status)}`}
                >
                  {expert.status.toUpperCase()}
                </span>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getAvailabilityColor(expert.availability)}`}
                >
                  {expert.availability.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Bio */}
          {expert.bio && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Bio</h4>
              <p className="text-gray-700 leading-relaxed">{expert.bio}</p>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Contact Information
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FiMail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">{expert.email}</span>
                </div>
                {expert.phone && (
                  <div className="flex items-center gap-3">
                    <FiPhone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{expert.phone}</span>
                  </div>
                )}
                {expert.linkedinUrl && (
                  <div className="flex items-center gap-3">
                    <FiLinkedin className="w-4 h-4 text-gray-400" />
                    <a
                      href={expert.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      LinkedIn Profile
                    </a>
                  </div>
                )}
                {expert.githubUrl && (
                  <div className="flex items-center gap-3">
                    <FiGithub className="w-4 h-4 text-gray-400" />
                    <a
                      href={expert.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      GitHub Profile
                    </a>
                  </div>
                )}
                {expert.portfolioUrl && (
                  <div className="flex items-center gap-3">
                    <FiGlobe className="w-4 h-4 text-gray-400" />
                    <a
                      href={expert.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Portfolio Website
                    </a>
                  </div>
                )}
                {expert.resumeUrl && (
                  <div className="flex items-center gap-3">
                    <FiFileText className="w-4 h-4 text-gray-400" />
                    <a
                      href={expert.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Resume
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Professional Details */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Professional Details
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hourly Rate
                  </label>
                  <p className="text-gray-900 font-semibold">
                    {expert.currency} {expert.hourlyRate}/hour
                  </p>
                </div>
                {expert.completedProjects && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Completed Projects
                    </label>
                    <p className="text-gray-900">{expert.completedProjects}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Created Date
                  </label>
                  <p className="text-gray-900">
                    {new Date(expert.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Updated
                  </label>
                  <p className="text-gray-900">
                    {new Date(expert.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-3">
              Technical Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {expert.expertise.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-center gap-4">
              {expert.status === 'pending' ? (
                <>
                  <button
                    onClick={() => onReject(expert)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm hover:shadow-md"
                  >
                    <FiX className="w-5 h-5" />
                    Reject Expert
                  </button>
                  <button
                    onClick={() => onApprove(expert)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm hover:shadow-md"
                  >
                    <FiCheck className="w-5 h-5" />
                    Approve Expert
                  </button>
                </>
              ) : (
                <div
                  className={`inline-flex items-center gap-2 px-6 py-3 font-medium rounded-lg ${
                    expert.status === 'approved'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {expert.status === 'approved' ? (
                    <FiCheckCircle className="w-5 h-5" />
                  ) : (
                    <FiXCircle className="w-5 h-5" />
                  )}
                  Already {expert.status}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExpertListing() {
  const [experts, setExperts] = useState<Expert[]>(DUMMY_EXPERTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Confirmation modal state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [expertToAction, setExpertToAction] = useState<Expert | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [isProcessing, setIsProcessing] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter experts locally
  const filteredExperts = useMemo(() => {
    return experts.filter(expert => {
      const matchesSearch =
        expert.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expert.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expert.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expert.expertise.some(skill =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesStatus =
        statusFilter === 'all' || expert.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [experts, searchTerm, statusFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredExperts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExperts = filteredExperts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: experts.length,
      pending: experts.filter(e => e.status === 'pending').length,
      approved: experts.filter(e => e.status === 'approved').length,
      rejected: experts.filter(e => e.status === 'rejected').length,
    };
  }, [experts]);

  // Handle view expert
  const handleViewExpert = (expert: Expert) => {
    setSelectedExpert(expert);
    setIsViewModalOpen(true);
  };

  // Handle approve/reject clicks
  const handleApproveClick = (expert: Expert) => {
    setExpertToAction(expert);
    setActionType('approve');
    setShowConfirmation(true);
  };

  const handleRejectClick = (expert: Expert) => {
    setExpertToAction(expert);
    setActionType('reject');
    setShowConfirmation(true);
  };

  // Handle confirmed action
  const handleConfirmedAction = async () => {
    if (!expertToAction) return;

    try {
      setIsProcessing(true);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update expert status
      setExperts(prev =>
        prev.map(expert =>
          expert.id === expertToAction.id
            ? {
                ...expert,
                status: actionType as 'approved' | 'rejected',
                updatedAt: new Date().toISOString(),
              }
            : expert
        )
      );

      // Close modals
      setShowConfirmation(false);
      setIsViewModalOpen(false);
      setExpertToAction(null);
      setSelectedExpert(null);

      // Show success toast
      showToast(
        `Expert ${actionType === 'approve' ? 'approved' : 'rejected'} successfully!`,
        'success'
      );
    } catch (error) {
      console.error('Error updating expert status:', error);
      showToast(`Failed to ${actionType} expert. Please try again.`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Toast notification system
  const showToast = (
    message: string,
    type: 'success' | 'error' | 'info' = 'info'
  ) => {
    const toast = document.createElement('div');
    const toastId = `toast-${Date.now()}`;
    toast.id = toastId;

    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'fixed top-4 right-4 z-50 space-y-2';
      document.body.appendChild(toastContainer);
    }

    const bgColor = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      info: 'bg-blue-500',
    }[type];

    toast.className = `${bgColor} text-white px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out translate-x-full opacity-0 max-w-sm`;
    toast.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="flex-1">
          <p class="text-sm font-medium">${message}</p>
        </div>
        <button 
          onclick="document.getElementById('${toastId}').remove()" 
          class="text-white/70 hover:text-white transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove('translate-x-full', 'opacity-0');
      toast.classList.add('translate-x-0', 'opacity-100');
    }, 100);

    setTimeout(() => {
      toast.classList.add('translate-x-full', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  };

  // Get status color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Expert Management
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage expert applications and approvals
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Experts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FiUsers className="w-8 h-8 text-gray-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </p>
            </div>
            <FiAlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.approved}
              </p>
            </div>
            <FiCheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.rejected}
              </p>
            </div>
            <FiXCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg p-4 shadow mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, email, or skills..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pending">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Experts Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expert
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Skills
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedExperts.length > 0 ? (
                paginatedExperts.map(expert => (
                  <tr
                    key={expert.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          {expert.profilePic ? (
                            <Image
                              src={expert.profilePic}
                              alt={`${expert.firstName} ${expert.lastName}`}
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <FiUser className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {expert.firstName} {expert.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {expert.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {expert.expertise.slice(0, 2).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                          >
                            {skill}
                          </span>
                        ))}
                        {expert.expertise.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{expert.expertise.length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {expert.experienceYears} years
                      </div>
                      <div className="text-sm text-gray-500">
                        {expert.currentRole}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(expert.status)}`}
                      >
                        {expert.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleViewExpert(expert)}
                          className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors min-w-[60px]"
                          title="View Details"
                        >
                          <FiEye className="w-3 h-3" />
                          <span className="hidden sm:inline">View</span>
                        </button>

                        {expert.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApproveClick(expert)}
                              className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors min-w-[70px]"
                              title="Approve Expert"
                            >
                              <FiCheck className="w-3 h-3" />
                              <span className="hidden sm:inline">Approve</span>
                            </button>
                            <button
                              onClick={() => handleRejectClick(expert)}
                              className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition-colors min-w-[60px]"
                              title="Reject Expert"
                            >
                              <FiX className="w-3 h-3" />
                              <span className="hidden sm:inline">Reject</span>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <FiUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No experts found
                    </h3>
                    <p className="text-gray-600">
                      {searchTerm || statusFilter !== 'all'
                        ? 'Try adjusting your search or filter criteria'
                        : 'No expert applications available at this time'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredExperts.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1}-
              {Math.min(startIndex + itemsPerPage, filteredExperts.length)} of{' '}
              {filteredExperts.length} experts
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Rows per page:</span>
              <select
                value={itemsPerPage}
                onChange={e => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 border border-gray-300 rounded text-sm bg-white"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronsLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-3 py-1 text-sm text-gray-600 font-medium">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Expert Modal */}
      {isViewModalOpen && selectedExpert && (
        <ViewExpertModal
          expert={selectedExpert}
          onClose={() => setIsViewModalOpen(false)}
          onApprove={handleApproveClick}
          onReject={handleRejectClick}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => {
          if (!isProcessing) {
            setShowConfirmation(false);
            setExpertToAction(null);
          }
        }}
        onConfirm={handleConfirmedAction}
        expertName={
          expertToAction
            ? `${expertToAction.firstName} ${expertToAction.lastName}`
            : ''
        }
        action={actionType}
        isLoading={isProcessing}
      />
    </div>
  );
}

export default ExpertListing;
