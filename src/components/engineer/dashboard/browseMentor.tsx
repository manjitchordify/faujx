'use client';
import React, { useEffect, useState } from 'react';
import { Search, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import TimePickerModal from '../modals/TimePickerModal';
import Image from 'next/image';

export interface ExpertResponse {
  message: string;
  data: Expert[];
  total: number;
  page: number;
  limit: number;
}

export interface Expert {
  id: string;
  userId: string;
  role: string;
  rating: number;
  skills: string[];
  experience: string;
  price: string;
  profilePic: string;
  availableSlots: string[];
  isAvailable: boolean;
  user: User;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string | null;
  phone: string;
  profilePic: string | null;
  dateOfBirth: string;
  location: string;
  userType: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  isSubscribed: boolean;
  isPremium: boolean;
}

interface Mentor {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  skills: string[];
  experience: string;
  price: number;
}

const MentorCard: React.FC<{ mentor: Mentor; onBook: () => void }> = ({
  mentor,
  onBook,
}) => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-xl hover:shadow-2xl transition-all duration-300 w-full max-w-sm mx-auto">
      <div className="flex items-start justify-between mb-4">
        <div className="mr-2 sm:mr-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden relative flex items-center justify-center">
            {mentor.avatar ? (
              <Image
                src={mentor.avatar}
                alt={mentor.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 96px"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-400 flex items-center justify-center">
                <span className="text-white text-xl md:text-2xl font-bold">
                  {mentor.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 text-center">
          <h3 className="text-2xl font-bold capitalize truncate text-black mb-1">
            {mentor.name}
          </h3>
          <p className="text-[#2563EB] font-bold text-sm mb-2">{mentor.role}</p>
          <div className="flex items-center justify-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
            <span className="text-lg font-bold text-[#696969]">
              {mentor.rating}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-3 pl-4">
        <div className="flex items-center gap-2 mb-2">
          <h4 className="text-base text-gray-900">Skills</h4>
          {mentor.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-[#6E6CFF] text-white px-2 py-1 rounded-full text-xs font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4 pl-4">
        <div className="flex items-center gap-2 mb-2">
          <h4 className="text-base text-gray-900">Experience</h4>
          <span className="bg-[#6E6CFF] text-white px-2 py-1 rounded-full text-xs font-medium">
            {mentor.experience}
          </span>
        </div>
      </div>

      <div className="text-center mb-4">
        <div className="text-2xl font-bold text-[#585858]">
          <span className="text-2xl">$</span>
          {mentor.price}
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onBook}
          className="cursor-pointer bg-[#54A044] hover:bg-[#4a8c3d] text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200 text-md"
        >
          Book Mentor
        </button>
      </div>
    </div>
  );
};

const Spinner = () => (
  <div className="flex justify-center items-center p-10">
    <div className="animate-spin rounded-full h-8 w-8 border-2 border-b-transparent border-gray-900"></div>
  </div>
);

const BrowseMentor: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMentor] = useState<Mentor | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 6;
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    const fetchMentors = async () => {
      setIsLoading(true);

      try {
        const res = await fetch(
          `https://devapi.faujx.com/api/experts/getexperts?page=${page}&limit=${limit}`
        );
        if (!res.ok) throw new Error('Failed to fetch experts');
        const data: ExpertResponse = await res.json();

        const transformedMentors: Mentor[] = data.data.map(
          (expert: Expert) => ({
            id: expert.id,
            name: `${expert.user.firstName} ${expert.user.lastName}`,
            role: expert.role.trim(),
            // avatar: expert.profilePic
            //   ? `/uploads/${expert.profilePic}` // or full URL if hosted elsewhere
            //   : '/default-avatar.png',
            avatar: expert.profilePic, // Placeholder avatar
            rating: expert.rating,
            skills: expert.skills,
            experience: expert.experience,
            price: parseFloat(expert.price),
          })
        );

        setMentors(transformedMentors);
        setTotal(data.total);
      } catch (err) {
        console.error('Error fetching mentors:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentors();
  }, [page]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const filteredMentors = mentors.filter(
    mentor =>
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.skills.some(skill =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8 pt-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="relative w-full md:w-auto md:flex-1 md:max-w-lg">
            <input
              type="text"
              placeholder="Search for Mentors"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3 text-base border-2 text-gray-700 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-start">
            <button
              className="cursor-pointer px-6 py-3 rounded-lg font-medium text-sm transition-colors bg-white text-black border border-green-200"
              onClick={() => router.push('/engineer/dashboard')}
            >
              Engineer Dashboard
            </button>
            <button className="cursor-pointer px-6 py-3 rounded-lg font-medium text-sm transition-colors text-gray-700 hover:text-gray-900 border border-green-200 bg-white">
              My Bookings
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {filteredMentors.map(mentor => (
              <MentorCard
                key={mentor.id}
                mentor={mentor}
                onBook={() => {
                  // setSelectedMentor(mentor);
                  // setIsModalOpen(true);
                  router.push('/expert');
                }}
              />
            ))}
          </div>

          {filteredMentors.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-xl mb-4">No mentors found</div>
              <p className="text-gray-600">Try adjusting your search terms</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="cursor-pointer px-3 py-1 text-sm border text-gray-700 border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`cursor-pointer px-3 py-1 text-sm border rounded-md ${
                      page === p
                        ? 'bg-green-600 text-white border-green-600'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setPage(prev => Math.min(prev + 1, totalPages))
                  }
                  disabled={page === totalPages}
                  className="cursor-pointer px-3 py-1 text-sm border text-gray-700 border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {isModalOpen && selectedMentor && (
        <TimePickerModal
          onTimeSelect={() => {
            setIsModalOpen(false);
          }}
          onClose={() => setIsModalOpen(false)}
          selectedDate={new Date()}
        />
      )}
    </div>
  );
};

export default BrowseMentor;
