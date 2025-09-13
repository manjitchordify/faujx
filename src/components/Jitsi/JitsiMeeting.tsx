'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Loader from '../ui/Loader';
import Cookies from 'js-cookie';
import { useAppSelector } from '@/store/store';
import { useParams } from 'next/navigation';
import { submitInterviewFeedback } from '@/services/admin-panelist-services/panelistService';
import { FeedbackModal } from './feedbackModal';
import { type Role } from '@/constants/capability';
import { updateProfileStage } from '@/services/engineerService';

interface JitsiMeetExternalAPI {
  dispose: () => void;
  addEventListener: (
    event: string,
    listener: (...args: unknown[]) => void
  ) => void;
  removeEventListener: (
    event: string,
    listener: (...args: unknown[]) => void
  ) => void;
}

// Feedback Modal Component

export default function JitsiMeetingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jitsiContainerRef = useRef<HTMLDivElement | null>(null);
  const apiRef = useRef<JitsiMeetExternalAPI | null>(null);
  const [roomName, setRoomName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const { loggedInUser } = useAppSelector(state => state.user);
  const interviewId = useParams<{ interviewId: string }>().interviewId;

  // Function to handle modal close without submitting
  const handleModalClose = () => {
    setShowFeedbackModal(false);
    // Dispose of Jitsi meeting when modal is closed without submitting
    if (apiRef.current) {
      apiRef.current.dispose();
      apiRef.current = null;
    }
    setTimeout(() => {
      router.push('/panelist/interviews');
    }, 100);
  };

  // Function to handle feedback submission with actual API call
  const handleFeedbackSubmit = async (feedback: {
    rating: number;
    comment: Record<string, number>;
    evaluationStatus: string;
  }) => {
    try {
      console.log('submitted feedback', feedback);
      // Call the actual API with correct parameters
      const response = await submitInterviewFeedback(interviewId, {
        feedback: feedback.comment,
        rating: feedback.rating,
        evaluationStatus: feedback.evaluationStatus,
      });

      console.log('Feedback submitted successfully:', response);

      // Show success toast notification
      setShowSuccessToast(true);

      setShowFeedbackModal(false);

      // IMPORTANT: Dispose of Jitsi meeting before navigation
      if (apiRef.current) {
        apiRef.current.dispose();
        apiRef.current = null;
      }

      // Show toast for 2 seconds, then navigate
      setTimeout(() => {
        setShowSuccessToast(false);
        router.push('/panelist/interviews');
      }, 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);

      // Handle specific error cases
      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error as { status: number; message: string };

        switch (apiError.status) {
          case 401:
            // Unauthorized - redirect to login
            router.push('/login');
            return;
          case 404:
            console.error('Interview not found');
            break;
          case 500:
            console.error('Server error occurred');
            break;
          default:
            console.error('API Error:', apiError.message);
        }
      }

      // You could show an error toast notification here
      // For now, we'll still close the modal and navigate
      setShowFeedbackModal(false);

      // Also dispose on error
      if (apiRef.current) {
        apiRef.current.dispose();
        apiRef.current = null;
      }

      setTimeout(() => {
        router.push('/panelist/interviews');
      }, 100);
    }
  };

  useEffect(() => {
    const room = searchParams.get('room');
    if (!room) {
      router.push('/');
      return;
    }
    try {
      setRoomName(room);
    } catch (err) {
      console.error('Invalid Jitsi URL:', err);
      router.push('/');
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (!roomName) return;

    if (!window.JitsiMeetExternalAPI) {
      const script = document.createElement('script');
      script.src = `https://meet.chordifyed.com/external_api.js`;
      script.async = true;
      script.onload = () => startJitsi();
      document.body.appendChild(script);
    } else {
      startJitsi();
    }

    function startJitsi() {
      if (apiRef.current) {
        apiRef.current.dispose();
      }

      const domain = 'meet.chordifyed.com';
      if (!domain || !jitsiContainerRef.current) {
        console.error('Missing Jitsi domain or container ref');
        return;
      }

      const options: {
        roomName: string | null;
        parentNode: HTMLElement;
        width: string | number;
        height: string | number;
        jwt?: string;
        configOverwrite?: Record<string, unknown>;
        interfaceConfigOverwrite?: Record<string, unknown>;
      } = {
        roomName: roomName,
        parentNode: jitsiContainerRef.current,
        width: '100%',
        height: '100%',
        configOverwrite: {
          prejoinPageEnabled: true,
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          startAudioOnly: false,
          startSilent: false,
          disableSelfView: false,
          disableSelfViewSettings: false,
          SHOW_JITSI_WATERMARK: false,
        },
        jwt: Cookies.get('jwt_token'),
        interfaceConfigOverwrite: {},
      };

      apiRef.current = new window.JitsiMeetExternalAPI(domain, options);
      apiRef.current?.addEventListener('readyToClose', async () => {
        if (loggedInUser?.userType === 'candidate') {
          await updateProfileStage('interview', 'passed');
          router.push(`/engineer/interview/${interviewId}/session-completed`);
        } else if (loggedInUser?.userType === 'expert') {
          router.push(`/expert/interview/${interviewId}/session-completed`);
        } else {
          // Show feedback modal for panelist
          setShowFeedbackModal(true);
        }
      });

      apiRef.current?.addEventListener('videoConferenceJoined', () => {
        console.log('Joined Jitsi meeting1111:', roomName);
      });

      const iframe = jitsiContainerRef.current.querySelector('iframe');
      if (iframe) {
        iframe.onload = () => {
          setLoading(false);
        };
      }
    }

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
        apiRef.current = null;
      }
    };
  }, [loggedInUser?.userType, interviewId, roomName, router]);

  return (
    <>
      <div
        ref={jitsiContainerRef}
        className="w-full h-screen"
        style={{ minHeight: '100vh' }}
      >
        {loading && <Loader text="Loading meeting..." />}
      </div>

      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={handleModalClose}
        onSubmit={handleFeedbackSubmit}
        roleTitle={(Cookies.get('roleTitle') as Role) ?? 'Front-end'}
      />

      {/* Success Toast Notification */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top duration-300">
          <div className="bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 max-w-sm">
            <svg
              className="w-5 h-5 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 12l2 2 4-4" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            <div>
              <p className="font-medium">Success!</p>
              <p className="text-sm text-green-100">
                Feedback submitted successfully
              </p>
            </div>
            <button
              onClick={() => setShowSuccessToast(false)}
              className="ml-2 text-green-200 hover:text-white"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
