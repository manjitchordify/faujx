import React, { useState, useEffect } from 'react';
import countriesData from '@/constants/countries-cities.json';
import ProfileVideoModal from './ProfileVideoModal';
import ProfilePictureModal from './ProfilePictureModal';
import ProfilePictureUploadModal from './ProfilePictureUploadModal';
import ResumeUploadModal from './ResumeUploadModal';
import SettingsVideoUploadModal from './SettingsVideoUploadModal';
import CustomerServiceModal from './CustomerServiceModal';
import {
  getProfileApi,
  type ProfileGetResponse,
} from '@/services/profileSettingsService';
import { ProfilePicUploadResponse } from '@/services/profileSetupService';
import { ResumeUploadResponse } from '@/types/resume.types';
import {
  updateEngineerProfileApi,
  type UpdateEngineerProfileParams,
} from '@/services/engineerService';
import Loader from '@/components/ui/Loader';

interface FormData {
  salary: string;
  currencyType: string;
  country: string;
  city: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
}

type FormField = keyof FormData;

interface Country {
  code: string;
  name: string;
  cities: string[];
}

interface CountryCityData {
  countries: Country[];
}

interface VideoUploadResponse {
  data?: {
    videoUrl: string;
  };
}

const Settings: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    salary: '',
    currencyType: '',
    country: '',
    city: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
  });

  const [updateStatus, setUpdateStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [updatingFields, setUpdatingFields] = useState<
    Partial<Record<FormField, boolean>>
  >({});

  // Modal states
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [isPictureModalOpen, setIsPictureModalOpen] = useState<boolean>(false);
  const [isPictureUploadModalOpen, setIsPictureUploadModalOpen] =
    useState<boolean>(false);
  const [isResumeUploadModalOpen, setIsResumeUploadModalOpen] =
    useState<boolean>(false);
  const [isVideoUploadModalOpen, setIsVideoUploadModalOpen] =
    useState<boolean>(false);
  const [isCustomerServiceModalOpen, setIsCustomerServiceModalOpen] =
    useState<boolean>(false);

  // Media URLs from API
  const [profileVideoUrl, setProfileVideoUrl] = useState<string | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(
    null
  );
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  // Get countries from the imported data
  const countriesJson = countriesData as CountryCityData;
  const countries = countriesJson.countries;

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response: ProfileGetResponse = await getProfileApi();

        if (response.data) {
          const { data } = response;

          // Parse location correctly from array
          const preferredLocations = data.candidate?.preferredLocations || [];
          const city = preferredLocations[0] || '';
          const country = preferredLocations[1] || '';

          setFormData({
            salary: data.candidate?.expectedSalary?.toString() || '',
            currencyType: data.candidate?.currencyType || '',
            country,
            city,
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            phoneNumber: data.phone || '',
            linkedinUrl: data.candidate?.linkedinUrl || '',
            githubUrl: data.candidate?.githubUrl || '',
            portfolioUrl: data.candidate?.portfolioUrl || '',
          });

          // Set media URLs - handle null values properly
          setProfileVideoUrl(data.profileVideo ?? null);
          setProfilePictureUrl(data.profilePic ?? null);

          // Resume URL is in the candidate object
          setResumeUrl(data.candidate?.resumeUrl ?? null);

          // Populate available cities if country exists
          if (country) {
            const selectedCountry = countries.find(c => c.name === country);
            if (selectedCountry) {
              setAvailableCities(selectedCountry.cities);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [countries]);

  // Handle country change
  const handleCountryChange = (countryName: string): void => {
    setFormData(prev => ({
      ...prev,
      country: countryName,
      city: '', // Reset city when country changes
    }));

    // Update available cities
    const selectedCountry = countries.find(c => c.name === countryName);
    if (selectedCountry) {
      setAvailableCities(selectedCountry.cities);
    } else {
      setAvailableCities([]);
    }
  };

  const handleInputChange = (field: FormField, value: string): void => {
    if (field === 'country') {
      handleCountryChange(value);
    } else {
      setFormData((prev: FormData) => ({ ...prev, [field]: value }));
    }
  };

  const handleUpdate = async (field: FormField): Promise<void> => {
    if (updatingFields[field]) return;

    setUpdatingFields(prev => ({ ...prev, [field]: true }));
    setError('');

    try {
      if (field === 'country' || field === 'city') {
        if (!formData.city || !formData.country) {
          setError('Please select both city and country');
          return;
        }

        const preferredLocations = [formData.city, formData.country];
        await updateEngineerProfileApi('', {
          preferredLocations,
        } as UpdateEngineerProfileParams);
        setUpdateStatus('Location updated successfully!');
      } else if (field === 'salary') {
        const expectedSalary = parseFloat(formData.salary);
        if (isNaN(expectedSalary) || expectedSalary <= 0) {
          setError('Please enter a valid salary amount');
          return;
        }

        await updateEngineerProfileApi('', {
          expectedSalary,
        } as UpdateEngineerProfileParams);
        setUpdateStatus('Salary updated successfully!');
      } else if (field === 'linkedinUrl') {
        await updateEngineerProfileApi('', {
          linkedinUrl: formData.linkedinUrl,
        } as UpdateEngineerProfileParams);
        setUpdateStatus('LinkedIn URL updated successfully!');
      } else if (field === 'githubUrl') {
        await updateEngineerProfileApi('', {
          githubUrl: formData.githubUrl,
        } as UpdateEngineerProfileParams);
        setUpdateStatus('GitHub URL updated successfully!');
      } else if (field === 'portfolioUrl') {
        await updateEngineerProfileApi('', {
          portfolioUrl: formData.portfolioUrl,
        } as UpdateEngineerProfileParams);
        setUpdateStatus('Portfolio URL updated successfully!');
      } else {
        setIsCustomerServiceModalOpen(true);
      }

      setTimeout(() => setUpdateStatus(''), 3000);
    } catch (err: unknown) {
      console.error(`Error updating ${String(field)}:`, err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : `Failed to update ${String(field)}`;
      setError(errorMessage);
    } finally {
      setUpdatingFields(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleCaptureVideo = (): void => {
    console.log('Opening video capture modal...');
    setIsVideoUploadModalOpen(true);
  };

  const handleViewVideo = (): void => {
    console.log('Viewing video...');
    setIsVideoModalOpen(true);
  };

  const handleViewPicture = (): void => {
    console.log('Viewing picture...');
    setIsPictureModalOpen(true);
  };

  // Handle video upload success
  const handleVideoUploadSuccess = (response: VideoUploadResponse): void => {
    console.log('Video uploaded successfully:', response);

    // Update the video URL from the API response
    if (response.data?.videoUrl) {
      setProfileVideoUrl(response.data.videoUrl);
    }

    // Show success message
    setUpdateStatus('Video uploaded successfully!');
    setTimeout(() => setUpdateStatus(''), 3000);
  };

  // Handle profile picture upload success - properly typed with API response
  const handleProfilePictureUploadSuccess = (
    response: ProfilePicUploadResponse
  ): void => {
    console.log('Profile picture uploaded successfully:', response);

    // Update the profile picture URL from the API response
    if (response.data?.profilePicUrl) {
      setProfilePictureUrl(response.data.profilePicUrl);
    }

    // Show success message
    setUpdateStatus('Profile picture uploaded successfully!');
    setTimeout(() => setUpdateStatus(''), 3000);
  };

  // Handle resume upload success - properly typed
  const handleResumeUploadSuccess = (response: ResumeUploadResponse): void => {
    console.log('Resume uploaded successfully:', response);

    // Update the resume URL from the API response
    if (response.data?.resumeUrl) {
      setResumeUrl(response.data.resumeUrl);
    }

    // Show success message
    setUpdateStatus('Resume uploaded successfully!');
    setTimeout(() => setUpdateStatus(''), 3000);
  };

  // Get user's full name for modal
  const getUserFullName = (): string => {
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    return fullName || 'User';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center  py-8">
        <Loader text="Settings Loading" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">
            Manage your profile information and preferences
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Status Message */}
        {updateStatus && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg text-green-700">
            {updateStatus}
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Salary Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Salary Expectation{' '}
                    {formData.currencyType ? `(${formData.currencyType})` : ''}
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={formData.salary}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange('salary', e.target.value)
                      }
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black"
                      placeholder="Expected Salary"
                    />
                    <button
                      onClick={() => handleUpdate('salary')}
                      disabled={
                        !formData.salary.trim() || updatingFields.salary
                      }
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 
             disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      {updatingFields.salary ? 'Updating...' : 'Update'}
                    </button>
                  </div>
                </div>

                {/* Location Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Preferred Location
                  </label>

                  {/* Country Dropdown */}
                  <div className="mb-3">
                    <select
                      value={formData.country}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        handleInputChange('country', e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black bg-white"
                    >
                      <option value="">Select Country</option>
                      {countries.map(country => (
                        <option key={country.code} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* City Dropdown */}
                  <div className="mb-3">
                    <select
                      value={formData.city}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        handleInputChange('city', e.target.value)
                      }
                      disabled={
                        !formData.country || availableCities.length === 0
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">Select City</option>
                      {availableCities.map(city => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Update Button for Location */}
                  <button
                    onClick={() => handleUpdate('country')}
                    disabled={
                      !formData.country ||
                      !formData.city ||
                      updatingFields.country
                    }
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 
             disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {updatingFields.country ? 'Updating...' : 'Update Location'}
                  </button>
                </div>

                {/* Video Capture Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Video Introduction
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={handleCaptureVideo}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex-1 sm:flex-none"
                    >
                      {profileVideoUrl ? 'Update Video' : 'Capture Video'}
                    </button>
                    <button
                      onClick={handleViewVideo}
                      disabled={!profileVideoUrl}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex-1 sm:flex-none"
                    >
                      View
                    </button>
                  </div>

                  {/* Video Status Indicator - Only show for recent uploads */}
                  {profileVideoUrl &&
                    updateStatus === 'Video uploaded successfully!' && (
                      <div className="mt-2 flex items-center text-sm text-green-600">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Recently uploaded
                      </div>
                    )}
                </div>

                {/* Profile Picture Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Profile Picture
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsPictureUploadModalOpen(true)}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex-1 sm:flex-none"
                    >
                      {profilePictureUrl ? 'Update Picture' : 'Upload Picture'}
                    </button>
                    <button
                      onClick={handleViewPicture}
                      disabled={!profilePictureUrl}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex-1 sm:flex-none"
                    >
                      View
                    </button>
                  </div>

                  {/* Profile Picture Status Indicator - Only show for recent uploads */}
                  {profilePictureUrl &&
                    updateStatus ===
                      'Profile picture uploaded successfully!' && (
                      <div className="mt-2 flex items-center text-sm text-green-600">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Recently uploaded
                      </div>
                    )}
                </div>

                {/* Upload Resume Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Resume
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsResumeUploadModalOpen(true)}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex-1 sm:flex-none"
                    >
                      {resumeUrl ? 'Update Resume' : 'Upload Resume'}
                    </button>
                    {resumeUrl && (
                      <a
                        href={resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex-1 sm:flex-none text-center"
                      >
                        View Resume
                      </a>
                    )}
                  </div>

                  {/* Resume Status Indicator - Only show for recent uploads */}
                  {resumeUrl &&
                    updateStatus === 'Resume uploaded successfully!' && (
                      <div className="mt-2 flex items-center text-sm text-green-600">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Recently uploaded
                      </div>
                    )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* First Name Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    First Name
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={formData.firstName}
                      disabled
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                      placeholder="First Name"
                    />
                    <button
                      onClick={() => setIsCustomerServiceModalOpen(true)}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Update
                    </button>
                  </div>
                </div>

                {/* Last Name Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Last Name
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={formData.lastName}
                      disabled
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                      placeholder="Last Name"
                    />
                    <button
                      onClick={() => setIsCustomerServiceModalOpen(true)}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Update
                    </button>
                  </div>
                </div>

                {/* Email Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Email Address
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                      placeholder="Email"
                    />
                    <button
                      onClick={() => setIsCustomerServiceModalOpen(true)}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Update
                    </button>
                  </div>
                </div>

                {/* Phone Number Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Phone Number
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      disabled
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                      placeholder="Phone Number"
                    />
                    <button
                      onClick={() => setIsCustomerServiceModalOpen(true)}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Update
                    </button>
                  </div>
                </div>

                {/* LinkedIn URL Section - Now Editable */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    LinkedIn URL
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange('linkedinUrl', e.target.value)
                      }
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                    <button
                      onClick={() => handleUpdate('linkedinUrl')}
                      disabled={updatingFields.linkedinUrl}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 
             disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      {updatingFields.linkedinUrl ? 'Updating...' : 'Update'}
                    </button>
                  </div>
                </div>

                {/* GitHub URL Section - Now Editable */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    GitHub URL
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange('githubUrl', e.target.value)
                      }
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black"
                      placeholder="https://github.com/yourusername"
                    />
                    <button
                      onClick={() => handleUpdate('githubUrl')}
                      disabled={updatingFields.githubUrl}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 
             disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      {updatingFields.githubUrl ? 'Updating...' : 'Update'}
                    </button>
                  </div>
                </div>

                {/* Portfolio URL Section - Now Editable */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Portfolio URL
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="url"
                      value={formData.portfolioUrl}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange('portfolioUrl', e.target.value)
                      }
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black"
                      placeholder="https://yourportfolio.com"
                    />
                    <button
                      onClick={() => handleUpdate('portfolioUrl')}
                      disabled={updatingFields.portfolioUrl}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 
             disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      {updatingFields.portfolioUrl ? 'Updating...' : 'Update'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ProfileVideoModal
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
          videoUrl={profileVideoUrl}
        />

        <ProfilePictureModal
          isOpen={isPictureModalOpen}
          onClose={() => setIsPictureModalOpen(false)}
          imageUrl={profilePictureUrl}
          userName={getUserFullName()}
        />

        <ProfilePictureUploadModal
          isOpen={isPictureUploadModalOpen}
          onClose={() => setIsPictureUploadModalOpen(false)}
          onUploadSuccess={handleProfilePictureUploadSuccess}
        />

        <ResumeUploadModal
          isOpen={isResumeUploadModalOpen}
          onClose={() => setIsResumeUploadModalOpen(false)}
          onUploadSuccess={handleResumeUploadSuccess}
          currentResumeUrl={resumeUrl}
        />

        <SettingsVideoUploadModal
          isOpen={isVideoUploadModalOpen}
          onClose={() => setIsVideoUploadModalOpen(false)}
          onUploadSuccess={handleVideoUploadSuccess}
        />

        <CustomerServiceModal
          isOpen={isCustomerServiceModalOpen}
          onClose={() => setIsCustomerServiceModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default Settings;
