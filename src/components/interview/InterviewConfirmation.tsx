'use client';

import React, { useEffect, useState } from 'react';
import { showToast } from '@/utils/toast/Toast';
import {
  getPendingSlots,
  PendingSlotGroup,
  confirmInterviewSlot,
} from '@/services/customer/myinterviewservice';

// Define the interface for customer data (matching API response)
// interface Customer {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   companyName: string;
// }

// Extended interface for UI state management
interface InterviewConfirmationData extends PendingSlotGroup {
  selectedSlotId?: string;
  status: 'pending' | 'confirmed' | 'rejected';
}

const InterviewConfirmation = () => {
  const [confirmations, setConfirmations] = useState<
    InterviewConfirmationData[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<string | null>(null); // Track which confirmation is being submitted

  useEffect(() => {
    fetchConfirmations();
  }, []);

  const fetchConfirmations = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getPendingSlots();

      // Transform API response to match UI state structure
      const transformedData: InterviewConfirmationData[] = data.map(item => ({
        ...item,
        status: 'pending' as const, // All pending slots start as pending
      }));

      setConfirmations(transformedData);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch interview confirmations');
      }
      showToast('Failed to load pending interview slots', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSlotSelect = (slotGroupId: string, slotId: string) => {
    setConfirmations(prev =>
      prev.map(conf =>
        conf.slotGroupId === slotGroupId
          ? { ...conf, selectedSlotId: slotId }
          : conf
      )
    );
  };

  const handleSubmit = async (slotGroupId: string) => {
    const confirmation = confirmations.find(c => c.slotGroupId === slotGroupId);
    if (!confirmation || !confirmation.selectedSlotId) {
      showToast('Please select a time slot', 'error');
      return;
    }

    try {
      setSubmitting(slotGroupId);

      // Call the new confirm slot API
      await confirmInterviewSlot(confirmation.selectedSlotId);

      showToast('Interview slot confirmed successfully', 'success');

      // Update local state
      setConfirmations(prev =>
        prev.map(conf =>
          conf.slotGroupId === slotGroupId
            ? { ...conf, status: 'confirmed' }
            : conf
        )
      );
    } catch (error: unknown) {
      const message =
        (error as Error)?.message || 'Failed to confirm interview slot';
      showToast(message, 'error');
    } finally {
      setSubmitting(null);
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);

    const year = date.getFullYear();
    const month = date.toLocaleString('en-US', {
      month: 'short',
    });
    const day = date.getDate();
    const weekday = date.toLocaleString('en-US', {
      weekday: 'short',
    });

    const time = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    return {
      date: `${weekday}, ${month} ${day}, ${year}`,
      time,
    };
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'rejected':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'pending':
      default:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  //   const getCustomerDisplayName = (customer: Customer) => {
  //     const fullName = `${customer.firstName} ${customer.lastName}`.trim();
  //     return fullName || customer.email;
  //   };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1F514C]"></div>
          <p className="mt-4 text-gray-600">
            Loading pending interview slots...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="mt-4 text-red-600">{error}</p>
          <button
            onClick={fetchConfirmations}
            className="mt-4 px-4 py-2 bg-[#1F514C] text-white rounded-lg hover:bg-[#1F514C]/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Interview Confirmations
        </h2>
        <p className="text-gray-600 mt-1">
          Review and confirm your available interview time slots
        </p>
      </div>

      {/* Confirmations List */}
      {confirmations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="mt-4 text-gray-500">No pending interview slots found</p>
          <p className="text-sm text-gray-400 mt-2">
            Check back later for new interview requests
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {confirmations.map(confirmation => (
            <div
              key={confirmation.slotGroupId}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col gap-4">
                {/* Header Section */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {confirmation.customer.companyName}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Interview Request
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Requested on{' '}
                      {new Date(confirmation.createdAt).toLocaleDateString(
                        'en-US',
                        {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        }
                      )}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(
                      confirmation.status
                    )}`}
                  >
                    {getStatusIcon(confirmation.status)}
                    {confirmation.status.charAt(0).toUpperCase() +
                      confirmation.status.slice(1)}
                  </span>
                </div>

                {/* Customer Info */}
                {/* <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>{getCustomerDisplayName(confirmation.customer)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                    <span>{confirmation.customer.email}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <span>{confirmation.customer.companyName}</span>
                  </div>
                </div> */}

                {/* Available Time Slots */}
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    {confirmation.status === 'pending'
                      ? `Available time slots (${confirmation.slots.length}):`
                      : 'Available time slots:'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {confirmation.slots.map(slot => {
                      const { date, time } = formatDateTime(slot.startTime);
                      const endTime = formatDateTime(slot.endTime).time;
                      const isSelected =
                        confirmation.selectedSlotId === slot.id;

                      return (
                        <button
                          key={slot.id}
                          onClick={() =>
                            confirmation.status === 'pending' &&
                            handleSlotSelect(confirmation.slotGroupId, slot.id)
                          }
                          disabled={confirmation.status !== 'pending'}
                          className={`p-4 rounded-lg border-2 transition-all text-left ${
                            confirmation.status !== 'pending'
                              ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                              : isSelected
                                ? 'border-[#1F514C] bg-[#1F514C]/5'
                                : 'border-gray-200 hover:border-[#1F514C]/50 hover:bg-gray-50'
                          }`}
                        >
                          <div className="text-sm font-medium text-gray-900">
                            {date}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {time} - {endTime}
                          </div>
                          {isSelected && confirmation.status === 'pending' && (
                            <div className="mt-2">
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-[#1F514C] text-white">
                                <svg
                                  className="w-3 h-3"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Selected
                              </span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Slot Display for Confirmed Interviews */}
                {confirmation.status === 'confirmed' &&
                  confirmation.selectedSlotId && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Confirmed time slot:
                      </h4>
                      {(() => {
                        const selectedSlot = confirmation.slots.find(
                          s => s.id === confirmation.selectedSlotId
                        );
                        if (selectedSlot) {
                          const { date, time } = formatDateTime(
                            selectedSlot.startTime
                          );
                          const endTime = formatDateTime(
                            selectedSlot.endTime
                          ).time;
                          return (
                            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                              <div className="text-sm font-medium text-green-900">
                                {date}
                              </div>
                              <div className="text-xs text-green-700 mt-1">
                                {time} - {endTime}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  )}

                {/* Action Buttons */}
                {confirmation.status === 'pending' && (
                  <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleSubmit(confirmation.slotGroupId)}
                      disabled={
                        !confirmation.selectedSlotId ||
                        submitting === confirmation.slotGroupId
                      }
                      className={`flex-1 inline-flex items-center justify-center px-4 py-2 font-medium rounded-lg transition-colors ${
                        confirmation.selectedSlotId &&
                        submitting !== confirmation.slotGroupId
                          ? 'bg-[#1F514C] hover:bg-[#1F514C]/90 text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {submitting === confirmation.slotGroupId ? (
                        <>
                          <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Confirming...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Confirm Interview
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewConfirmation;
