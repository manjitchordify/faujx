import React, { useState, useCallback, useEffect } from 'react';
import {
  FiX,
  FiUsers,
  FiSearch,
  FiUser,
  FiCheck,
  FiRefreshCw,
  FiMail,
  FiUserPlus,
  FiCalendar,
  FiMessageCircle,
  FiBriefcase,
} from 'react-icons/fi';
import {
  getAvailablePanelists,
  inviteToInterview,
  type AvailablePanelist,
} from '@/services/admin-panelist-services/interviewPanelService';
import { showToast } from '@/utils/toast/Toast';

interface InviteInterviewersModalProps {
  isOpen: boolean;
  onClose: () => void;
  interviewId: string;
  candidateName: string;
  candidateRole?: string;
  scheduledDate: string;
  scheduledTime: string;
  onInviteSuccess: () => void;
}

const InviteInterviewersModal: React.FC<InviteInterviewersModalProps> = ({
  isOpen,
  onClose,
  interviewId,
  candidateName,
  candidateRole,
  scheduledDate,
  scheduledTime,
  onInviteSuccess,
}) => {
  const [availablePanelists, setAvailablePanelists] = useState<
    AvailablePanelist[]
  >([]);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [selectedPanelists, setSelectedPanelists] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [invitationMessage, setInvitationMessage] = useState('');

  // Fetch available panelists
  const fetchAvailablePanelists = useCallback(async () => {
    try {
      setInviteLoading(true);
      const response = await getAvailablePanelists();
      setAvailablePanelists(response);
    } catch (error) {
      console.error('Error fetching available panelists:', error);
      showToast('Failed to load available panelists', 'error');
    } finally {
      setInviteLoading(false);
    }
  }, []);

  // Load panelists when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchAvailablePanelists();
      // Set default invitation message
      setInvitationMessage(
        `You're invited to join the technical interview for ${candidateName}${
          candidateRole ? ` (${candidateRole} Developer)` : ''
        } scheduled on ${scheduledDate} at ${scheduledTime}. Your expertise would be valuable for this assessment.`
      );
    }
  }, [
    isOpen,
    fetchAvailablePanelists,
    candidateName,
    candidateRole,
    scheduledDate,
    scheduledTime,
  ]);

  // Handle panelist selection (multiple selection)
  const togglePanelistSelection = (panelistId: string) => {
    setSelectedPanelists(prev => {
      if (prev.includes(panelistId)) {
        return prev.filter(id => id !== panelistId);
      } else {
        return [...prev, panelistId];
      }
    });
  };

  // Handle send invitations
  const handleSendInvitations = async () => {
    if (selectedPanelists.length === 0) {
      showToast('Please select at least one panelist to invite', 'warning');
      return;
    }

    if (!invitationMessage.trim()) {
      showToast('Please enter an invitation message', 'warning');
      return;
    }

    try {
      setInviteLoading(true);

      // Send invitations to all selected panelists
      const invitationPromises = selectedPanelists.map(panelistId =>
        inviteToInterview(interviewId, panelistId, invitationMessage.trim())
      );

      const results = await Promise.allSettled(invitationPromises);

      // Count successful and failed invitations
      const successful = results.filter(
        result => result.status === 'fulfilled'
      ).length;
      const failed = results.filter(
        result => result.status === 'rejected'
      ).length;

      // Get names of selected panelists for success message
      const selectedPanelistNames = selectedPanelists
        .map(id => {
          const panelist = availablePanelists.find(p => p.id === id);
          return panelist
            ? `${panelist.user.firstName} ${panelist.user.lastName}`.trim()
            : '';
        })
        .filter(name => name);

      // Reset form and close modal
      handleClose();

      // Show appropriate success/error messages
      if (successful === selectedPanelists.length) {
        // All invitations sent successfully
        const message =
          selectedPanelists.length === 1
            ? `Invitation sent to ${selectedPanelistNames[0]}!`
            : `All ${selectedPanelists.length} invitations sent successfully!`;
        showToast(message, 'success');
      } else if (successful > 0) {
        // Partial success
        showToast(
          `${successful} invitation(s) sent successfully, ${failed} failed.`,
          'warning'
        );
      } else {
        // All failed
        showToast('All invitations failed to send. Please try again.', 'error');
      }

      // Notify parent component
      onInviteSuccess();
    } catch (error: unknown) {
      const message =
        (error as { message?: string })?.message ||
        'Failed to send invitations';
      showToast(`Invitation failed: ${message}`, 'error');
    } finally {
      setInviteLoading(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    setSelectedPanelists([]);
    setSearchQuery('');
    setInvitationMessage('');
    onClose();
  };

  // Filter panelists based on search query
  const filteredPanelists = availablePanelists.filter(panelist => {
    const fullName =
      `${panelist.user.firstName} ${panelist.user.lastName}`.toLowerCase();
    const email = panelist.user.email.toLowerCase();
    const role = panelist.designation.toLowerCase();
    const department = panelist.department.toLowerCase();
    const query = searchQuery.toLowerCase();

    return (
      fullName.includes(query) ||
      email.includes(query) ||
      role.includes(query) ||
      department.includes(query)
    );
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Modal Header - Fixed */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-green-100">
              <FiUsers className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg leading-6 font-semibold text-gray-900">
                Invite Interviewers/Panelists
              </h3>
              <p className="text-sm text-gray-500">
                Select panelists to invite to this interview
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors rounded-lg p-2 hover:bg-gray-100"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Interview Info - Compact */}
        <div className="px-4 py-3 bg-green-50 border-b border-green-200 flex-shrink-0">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-green-700 font-medium flex items-center">
                <FiUser className="w-4 h-4 mr-1" />
                {candidateName}
                {candidateRole && (
                  <span className="ml-1 text-green-600">
                    ({candidateRole} Dev)
                  </span>
                )}
              </span>
              <span className="text-green-700 font-medium flex items-center">
                <FiCalendar className="w-4 h-4 mr-1" />
                {scheduledDate} at {scheduledTime}
              </span>
            </div>
            <span className="text-green-700 font-medium flex items-center">
              <FiUserPlus className="w-4 h-4 mr-1" />
              {selectedPanelists.length} selected
            </span>
          </div>
        </div>

        {/* Search Input - Compact */}
        <div className="px-4 py-3 border-b border-gray-200 flex-shrink-0">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all"
              placeholder="Search panelists by name, email, role, or department..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Panelists List - Scrollable with Compact Cards */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {inviteLoading && filteredPanelists.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                  <FiRefreshCw className="w-6 h-6 animate-spin text-green-600" />
                </div>
                <h4 className="text-base font-medium text-gray-900 mb-1">
                  Loading Panelists
                </h4>
                <p className="text-sm text-gray-500">
                  Please wait while we fetch available panelists...
                </p>
              </div>
            </div>
          ) : filteredPanelists.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
                  <FiUsers className="w-6 h-6 text-gray-400" />
                </div>
                <h4 className="text-base font-medium text-gray-900 mb-1">
                  {availablePanelists.length === 0
                    ? 'No Panelists Available'
                    : 'No Results Found'}
                </h4>
                <p className="text-sm text-gray-500">
                  {availablePanelists.length === 0
                    ? 'There are currently no available panelists to invite.'
                    : 'Try adjusting your search criteria to find panelists.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto px-4 py-3">
              <div className="space-y-2">
                {filteredPanelists.map(panelist => {
                  const fullName =
                    `${panelist.user.firstName} ${panelist.user.lastName}`.trim();
                  const isSelected = selectedPanelists.includes(panelist.id);

                  return (
                    <div
                      key={panelist.id}
                      className={`border-2 rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'border-green-500 bg-green-50 ring-1 ring-green-200 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => togglePanelistSelection(panelist.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              isSelected ? 'bg-green-600' : 'bg-blue-600'
                            }`}
                          >
                            {isSelected ? (
                              <FiCheck className="w-4 h-4 text-white" />
                            ) : (
                              <FiUser className="w-4 h-4 text-white" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-gray-900 truncate">
                              {fullName}
                            </h4>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-gray-600 truncate flex items-center">
                              <FiMail className="w-3 h-3 mr-1 flex-shrink-0" />
                              {panelist.user.email}
                            </p>
                            <div className="flex items-center text-xs text-gray-500 ml-2">
                              <FiBriefcase className="w-3 h-3 mr-1 flex-shrink-0" />
                              <span className="font-medium truncate">
                                {panelist.designation}
                              </span>
                            </div>
                          </div>
                          {panelist.skills && panelist.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {panelist.skills
                                .slice(0, 2)
                                .map((skill, index) => (
                                  <span
                                    key={index}
                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                      isSelected
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-blue-100 text-blue-800'
                                    }`}
                                  >
                                    {skill}
                                  </span>
                                ))}
                              {panelist.skills.length > 2 && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                  +{panelist.skills.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Invitation Message - Compact */}
        <div className="px-4 py-3 border-t border-gray-200 flex-shrink-0">
          <label
            htmlFor="invitation-message"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            <FiMessageCircle className="w-4 h-4 inline mr-1" />
            Invitation Message
          </label>
          <textarea
            id="invitation-message"
            rows={3}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm resize-none"
            placeholder="Enter a personalized message for the invitation..."
            value={invitationMessage}
            onChange={e => setInvitationMessage(e.target.value)}
          />
        </div>

        {/* Modal Footer - Compact */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex gap-3 flex-shrink-0">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            disabled={inviteLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSendInvitations}
            disabled={
              selectedPanelists.length === 0 ||
              inviteLoading ||
              !invitationMessage.trim()
            }
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center"
          >
            {inviteLoading ? (
              <>
                <FiRefreshCw className="w-4 h-4 animate-spin mr-2" />
                Sending...
              </>
            ) : (
              <>
                <FiUserPlus className="w-4 h-4 mr-2" />
                Send{' '}
                {selectedPanelists.length > 0 && `${selectedPanelists.length} `}
                Invitation{selectedPanelists.length !== 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteInterviewersModal;
