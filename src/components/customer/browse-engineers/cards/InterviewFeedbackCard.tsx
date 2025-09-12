import React, { FC, useState } from 'react';
import { Star, Calendar, Clock } from 'lucide-react';
import { InterviewCandidate } from '@/types/customer';
import Image from 'next/image';

interface InterviewFeedbackCardProps {
  candidate: InterviewCandidate;
}

const InterviewFeedbackCard: FC<InterviewFeedbackCardProps> = ({
  candidate,
}) => {
  const [rating, setRating] = useState(0);
  const [isHire, setIsHire] = useState('');
  const [feedback, setFeedback] = useState('');

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 w-full max-w-sm ">
      {/* Top Card Section */}
      <div className="flex p-4 gap-4">
        {/* Left Side - Profile Image */}
        <div className="w-24 flex-shrink-0">
          <div className="w-24 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-orange-200 via-yellow-200 to-blue-200">
            <Image
              width={'100'}
              height={'100'}
              src={candidate.profileImage}
              alt={`${candidate.role} profile`}
              className="w-full h-full object-cover"
              onError={e => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="flex-1">
          {/* Header with Role and Star */}
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-sm font-semibold text-green-600">
              {candidate.role}
            </h3>
            <div className="bg-gray-500 rounded-full p-1.5">
              <Star className="w-3 h-3 text-white fill-current" />
            </div>
          </div>

          {/* Date and Time Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4 text-green-500" />
              <span className="text-xs">{candidate.date}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-xs">{candidate.duration}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button className="w-full py-2 px-3 bg-green-500 text-white rounded-lg text-xs font-semibold hover:bg-green-600 transition-colors">
              Proceed to Hire
            </button>
            <button className="w-full py-2 px-3 bg-red-500 text-white rounded-lg text-xs font-semibold hover:bg-red-600 transition-colors">
              Reject
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Feedback Section */}
      <div className="border-t border-gray-200 p-4 space-y-4 sm:space-y-5">
        {/* Rating Question */}
        <div>
          <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-3">
            How would you rate this candidate on a scale of 1 to 10
          </h4>
          <input
            type="number"
            min="1"
            max="10"
            value={rating || ''}
            onChange={e => setRating(Number(e.target.value))}
            placeholder="Enter rating (1-10)"
            className="w-full sm:w-32 p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          />
        </div>

        {/* Hire Question */}
        <div>
          <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-3">
            Is this someone you see as a potential hire?
          </h4>
          <div className="flex gap-3 justify-center sm:justify-start">
            <button
              onClick={() => setIsHire('yes')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                isHire === 'yes'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-green-100'
              }`}
            >
              Yes
            </button>
            <button
              onClick={() => setIsHire('no')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                isHire === 'no'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-red-100'
              }`}
            >
              No
            </button>
          </div>
        </div>

        {/* Feedback Textarea */}
        <div>
          <textarea
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            placeholder="Please take a moment to rate your experience and provide feedback."
            className="w-full h-20 sm:h-24 p-3 border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-700 placeholder-gray-400 resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default InterviewFeedbackCard;
