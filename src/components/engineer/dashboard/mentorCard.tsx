// components/common/UnifiedCard.tsx
'use client';
import React from 'react';
import {
  Star,
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
} from 'lucide-react';
import Image from 'next/image';

// Base interface for common properties
interface BaseCardData {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  rating?: number;
}

// Mentor-specific properties
interface MentorData extends BaseCardData {
  type: 'mentor';
  skills: string[];
  experience: string;
  price: number;
  isAvailable?: boolean;
}

// Booking-specific properties - matches your API response
interface BookingData {
  type: 'booking';
  id: string;
  candidate_id: string;
  expert_id: string;
  booking_date: string;
  duration_minutes: number;
  hourly_rate: string;
  total_amount: string;
  currency: string;
  status: string;
  notes: string;
  meeting_link?: string;
  meeting_id?: string; // Add this missing property
  created_at: string;
  updated_at: string;
  // Default display properties
  name: string;
  role: string;
  avatar?: string;
  payments?: Record<string, unknown>[];
}

type CardData = MentorData | BookingData;

interface UnifiedCardProps {
  data: CardData;
  onAction: () => void;
  actionLabel?: string;
}

const UnifiedCard: React.FC<UnifiedCardProps> = ({
  data,
  onAction,
  actionLabel,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderMentorContent = (mentorData: MentorData) => (
    <>
      {/* Skills Section */}
      <div className="mb-3 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <h4 className="text-sm sm:text-base text-gray-900 font-medium flex-shrink-0">
            Skills:
          </h4>
          <div className="flex flex-wrap gap-1">
            {mentorData.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="bg-[#6E6CFF] text-white px-2 py-1 rounded-full text-xs font-medium"
              >
                {skill}
              </span>
            ))}
            {mentorData.skills.length > 3 && (
              <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                +{mentorData.skills.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Experience Section */}
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <h4 className="text-sm sm:text-base text-gray-900 font-medium flex-shrink-0">
            Experience:
          </h4>
          <span className="bg-[#6E6CFF] text-white px-2 py-1 rounded-full text-xs font-medium w-fit">
            {mentorData.experience}
          </span>
        </div>
      </div>

      {/* Price Section */}
      <div className="text-center mb-4">
        <div className="text-xl sm:text-2xl font-bold text-[#585858]">
          <span className="text-xl sm:text-2xl">$</span>
          {mentorData.price}
        </div>
      </div>
    </>
  );

  const renderBookingContent = (bookingData: BookingData) => (
    <>
      {/* Booking Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-start sm:items-center gap-3 flex-wrap">
          <CalendarIcon className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5 sm:mt-0" />
          <span className="text-gray-700 text-sm sm:text-base break-words">
            {formatDate(bookingData.booking_date)}
          </span>
        </div>
        <div className="flex items-start sm:items-center gap-3 flex-wrap">
          <Clock className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5 sm:mt-0" />
          <span className="text-gray-700 text-sm sm:text-base">
            {formatTime(bookingData.booking_date)} (
            {bookingData.duration_minutes} min)
          </span>
        </div>
        <div className="flex items-start sm:items-center gap-3 flex-wrap">
          <DollarSign className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5 sm:mt-0" />
          <span className="text-gray-700 font-medium text-sm sm:text-base">
            ${bookingData.total_amount} {bookingData.currency}
          </span>
        </div>
      </div>

      {/* Notes Section */}
      {bookingData.notes && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Notes:</h4>
          <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg break-words">
            {bookingData.notes}
          </p>
        </div>
      )}

      {/* Booking Date Info */}
      <div className="text-xs text-gray-500 text-right mb-4">
        Booked on {formatDate(bookingData.created_at)}
      </div>
    </>
  );

  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 shadow-xl hover:shadow-2xl transition-all duration-300 w-full h-full flex flex-col">
      {/* Header Section - Common for both types */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between mb-4 gap-3 sm:gap-0">
        <div className="flex items-center gap-3 sm:gap-4 flex-1">
          <div className="w-16 h-16 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full overflow-hidden relative flex items-center justify-center flex-shrink-0">
            {data.avatar ? (
              <Image
                src={data.avatar}
                alt={data.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 64px, (max-width: 768px) 64px, 80px"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-400 flex items-center justify-center">
                <span className="text-white text-lg sm:text-xl font-bold">
                  {data.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold capitalize text-black mb-1 break-words">
              {data.name}
            </h3>
            <p className="text-[#2563EB] font-bold text-xs sm:text-sm mb-2 break-words">
              {data.role}
            </p>
            {/* Rating - only for mentors */}
            {data.type === 'mentor' && data.rating && (
              <div className="flex items-center justify-center sm:justify-start">
                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                <span className="text-base sm:text-lg font-bold text-[#696969]">
                  {data.rating}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Status badge - only for bookings */}
        {data.type === 'booking' && (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
              data.status
            )} whitespace-nowrap flex-shrink-0`}
          >
            {data.status}
          </span>
        )}
      </div>

      {/* Dynamic Content Based on Type - flex-grow to fill available space */}
      <div className="flex-grow">
        {data.type === 'mentor'
          ? renderMentorContent(data)
          : renderBookingContent(data)}
      </div>

      {/* Action Button - Different for mentors and bookings */}
      <div className="flex justify-center mt-auto">
        {data.type === 'mentor' ? (
          <button
            onClick={onAction}
            className="cursor-pointer bg-[#54A044] hover:bg-[#4a8c3d] text-white font-bold py-2 px-4 sm:px-6 rounded-lg transition-colors duration-200 text-sm sm:text-base w-full sm:w-auto"
          >
            {actionLabel || 'Book Mentor'}
          </button>
        ) : // Booking buttons based on status
        data.status.toLowerCase() === 'confirmed' ? (
          <button
            onClick={onAction}
            className="cursor-pointer bg-[#54A044] hover:bg-[#4a8c3d] text-white font-bold py-2 px-4 sm:px-6 rounded-lg transition-colors duration-200 text-sm sm:text-base w-full sm:w-auto"
          >
            Join session
          </button>
        ) : data.status.toLowerCase() === 'cancelled' ? (
          <button
            onClick={onAction}
            disabled={true} // Add this to actually disable the button
            className="bg-gray-400 text-gray-200 font-bold py-2 px-4 sm:px-6 rounded-lg text-sm sm:text-base w-full sm:w-auto cursor-not-allowed opacity-60"
          >
            Cancelled
          </button>
        ) : (
          <div className="text-center w-full">
            <span className="inline-block bg-[#54A044] text-white px-4 py-2 rounded-lg text-sm font-bold">
              Awaiting Confirmation from Mentor
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedCard;
export type { CardData, MentorData, BookingData, UnifiedCardProps };
