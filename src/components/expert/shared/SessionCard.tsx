import React, { memo, useMemo, useCallback } from 'react';
import { Calendar, Clock, Star, MessageSquare } from 'lucide-react';
import Image from 'next/image';

export interface Session {
  id: string;
  name: string;
  title: string;
  rating: number;
  query: string;
  date: string;
  time: string;
  duration: string;
  avatar?: string | null;
  status: 'pending' | 'accepted' | 'declined';
  meetingLink?: string;
  interviewType?: string;
  department?: string;
}

export interface SessionCardProps {
  session: Session;
  buttonType?: 'pending' | 'accepted';
  onAccept?: (session: Session) => void;
  onDecline?: (session: Session) => void;
  onJoin?: (session: Session) => void;
}

const SessionCard: React.FC<SessionCardProps> = memo(
  ({ session, buttonType = 'pending', onAccept, onDecline, onJoin }) => {
    // Memoized click handlers to prevent recreating functions on each render
    const handleAccept = useCallback(() => {
      onAccept?.(session);
    }, [onAccept, session]);

    const handleDecline = useCallback(() => {
      onDecline?.(session);
    }, [onDecline, session]);

    const handleJoin = useCallback(() => {
      onJoin?.(session);
    }, [onJoin, session]);

    // Memoized initials calculation
    const initials = useMemo(() => {
      return session.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();
    }, [session.name]);

    // Memoized buttons rendering
    const buttons = useMemo(() => {
      switch (buttonType) {
        case 'pending':
          return (
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleAccept}
                className="flex-1 bg-[#1F514C] text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Accept
              </button>
              <button
                type="button"
                onClick={handleDecline}
                className="flex-1 bg-red-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                Decline
              </button>
            </div>
          );
        case 'accepted':
          return (
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleJoin}
                className="flex-1 bg-[#1F514C] text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Join Session
              </button>
            </div>
          );
        default:
          return null;
      }
    }, [buttonType, handleAccept, handleDecline, handleJoin]);

    // Memoized avatar component
    const avatar = useMemo(
      () => (
        <div className="w-30 h-30 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
          {session.avatar ? (
            <Image
              src={session.avatar || '/default-avatar.png'}
              alt={session.name}
              width={120}
              height={120}
              className="rounded-full object-cover bg-grey-200"
            />
          ) : (
            <span className="text-white font-semibold text-lg">{initials}</span>
          )}
        </div>
      ),
      [session.avatar, session.name, initials]
    );

    // Memoized rating display
    const ratingDisplay = useMemo(
      () => (
        <div className="flex items-center justify-center space-x-1">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm font-medium text-gray-700">
            {session.rating}
          </span>
        </div>
      ),
      [session.rating]
    );

    return (
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg mx-auto">
        <div className="flex items-start space-x-4 mb-4 pl-4">
          {/* Avatar */}
          {avatar}

          {/* Name, Title and Rating */}
          <div className="flex-1 items-center text-center justify-center mt-4">
            <h3 className="font-bold text-2xl text-gray-900 mb-1">
              {session.name}
            </h3>
            <p className="text-blue-600 text-sm font-bold mb-2">
              {session.title}
            </p>
            {ratingDisplay}
          </div>
        </div>

        {/* Query */}
        <div className="mb-4">
          <div className="flex items-start space-x-3">
            <MessageSquare className="w-4 h-4 text-orange-600 mt-1" />
            <div>
              <p className="text-black text-sm font-medium mb-1">Query</p>
              <p className="text-black text-sm leading-relaxed">
                {session.query}
              </p>
            </div>
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center space-x-3 mb-3">
          <Calendar className="w-4 h-4 text-green-600" />
          <span className="text-sm text-gray-700">{session.date}</span>
        </div>

        {/* Time */}
        <div className="flex items-center space-x-3 mb-6">
          <Clock className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-gray-700">
            {session.time} • {session.duration}
          </span>
        </div>

        {/* Dynamic Buttons */}
        {buttons}
      </div>
    );
  }
);

SessionCard.displayName = 'SessionCard';

export default SessionCard;
