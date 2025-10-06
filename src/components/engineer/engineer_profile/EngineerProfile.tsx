import React, { useState, useEffect } from 'react';
import { Activity, Code, Play, FileText, ExternalLink } from 'lucide-react';
import Image from 'next/image';

import ProfileTab from './ProfileTab';
import SkillsTab from './SkillsTab';
import VideoModal from './VideoModal';
import {
  getProfileApi,
  ProfileGetResponse,
} from '@/services/profileSettingsService';
import Loader from '@/components/ui/Loader';

const EngineerProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [showVideo, setShowVideo] = useState(false);
  const [profile, setProfile] = useState<ProfileGetResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const data = await getProfileApi();
        setProfile(data);
      } catch (err: unknown) {
        if (typeof err === 'object' && err !== null && 'message' in err) {
          setError(
            (err as { message?: string }).message || 'Failed to load profile'
          );
        } else {
          setError('Failed to load profile');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="p-6 h-full  flex justify-center items-center">
        <Loader text="Profile Loading" />
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  if (!profile) {
    return <div className="p-6">No profile data found</div>;
  }

  // Extract profile data
  const profileData = {
    id: profile.data.id,
    name:
      profile.data.fullName ||
      `${profile.data.firstName} ${profile?.data?.lastName || ''}`,
    role: `${profile.data.candidate?.currentDesignation || ''} - ${
      profile.data.candidate?.roleTitle || ''
    }`,
    imageUrl: profile.data.profilePic,
    videoUrl: profile.data.profileVideo,
    initials: profile.data.firstName
      ? profile.data.firstName.charAt(0).toUpperCase()
      : 'U',
  };

  const aboutText = profile.data.candidate?.summary || 'No summary available';

  const tabs = [
    { id: 'Profile', label: 'Profile', icon: Activity, component: ProfileTab },
    { id: 'skills', label: 'Skills', icon: Code, component: SkillsTab },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  const handleViewVettingReport = () => {
    window.open(`/vetting-report/candidate/${profileData.id}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Profile Header */}
      <div className="flex flex-col lg:flex-row items-start gap-6 mb-8 pb-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row items-start gap-6 flex-1">
          <div className="flex items-center gap-6">
            {profileData.imageUrl ? (
              <Image
                src={profileData.imageUrl}
                alt={profileData.name}
                width={96}
                height={96}
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1F514C] to-[#1F514C] flex items-center justify-center text-white text-3xl font-semibold shadow-lg">
                {profileData.initials}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {profileData.name}
              </h1>
              <p className="text-xl text-gray-600 mt-1">{profileData.role}</p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 mt-4">
                {/* Watch Introduction Video Button */}
                {profileData.videoUrl && (
                  <button
                    onClick={() => setShowVideo(true)}
                    className="inline-flex items-center gap-2 cursor-pointer px-4 py-2 bg-[#1F514C] hover:bg-[#376f69] text-white rounded-lg transition-colors duration-200 shadow-sm"
                  >
                    <Play size={16} />
                    <span>Watch Introduction</span>
                  </button>
                )}

                {/* Vetting Report Button */}
                <button
                  onClick={handleViewVettingReport}
                  className="inline-flex items-center cursor-pointer gap-2 px-4 py-2 bg-[#1F514C] hover:bg-[#376f69]  text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                  title="View Vetting Report"
                >
                  <FileText size={16} />
                  <span>Vetting Report</span>
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">About</h1>
        <p className="text-gray-700 text-lg leading-relaxed">{aboutText}</p>
      </div>

      {/* Tabs Section */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-4 font-medium text-base
                  transition-all duration-200 relative border-2 rounded-t-lg -mb-[2px]
                  ${
                    isActive
                      ? 'text-[#317b74] border-[#317b74] bg-white'
                      : 'text-gray-600 hover:text-gray-800 border-transparent'
                  }
                `}
              >
                <Icon
                  size={20}
                  className={isActive ? 'text-[#317b74]' : 'text-gray-500'}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-8 p-6 bg-white rounded-lg">
        {ActiveComponent && <ActiveComponent profile={profile} />}
      </div>

      {/* Video Modal */}
      {profileData.videoUrl && (
        <VideoModal
          isOpen={showVideo}
          onClose={() => setShowVideo(false)}
          videoUrl={profileData.videoUrl}
          title="Introduction Video"
          subtitle={profileData.name}
        />
      )}
    </div>
  );
};

export default EngineerProfile;
