import React, { useState, useCallback, useEffect } from 'react';
import {
  FiX,
  FiRepeat,
  FiSearch,
  FiUsers,
  FiUser,
  FiCheck,
  FiRefreshCw,
} from 'react-icons/fi';
import {
  getAvailablePanelists,
  transferInterview,
  type AvailablePanelist,
} from '@/services/admin-panelist-services/interviewPanelService';
import { showToast } from '@/utils/toast/Toast';

interface TransferInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  interviewId: string;
  candidateName: string;
  scheduledDate: string;
  scheduledTime: string;
  onTransferSuccess: () => void;
}

const TransferInterviewModal: React.FC<TransferInterviewModalProps> = ({
  isOpen,
  onClose,
  interviewId,
  candidateName,
  scheduledDate,
  scheduledTime,
  onTransferSuccess,
}) => {
  const [availablePanelists, setAvailablePanelists] = useState<
    AvailablePanelist[]
  >([]);
  const [transferLoading, setTransferLoading] = useState(false);
  const [selectedPanelist, setSelectedPanelist] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch available panelists
  const fetchAvailablePanelists = useCallback(async () => {
    try {
      setTransferLoading(true);
      const response = await getAvailablePanelists();
      setAvailablePanelists(response);
    } catch (error) {
      console.error('Error fetching available panelists:', error);
      showToast('Failed to load available panelists', 'error');
    } finally {
      setTransferLoading(false);
    }
  }, []);

  // Load panelists when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchAvailablePanelists();
    }
  }, [isOpen, fetchAvailablePanelists]);

  // Handle transfer interview
  const handleTransferInterview = async () => {
    if (!selectedPanelist || !interviewId) return;

    const selectedPanelistData = availablePanelists.find(
      p => p.id === selectedPanelist
    );
    if (!selectedPanelistData) return;

    const panelistName =
      `${selectedPanelistData.user.firstName} ${selectedPanelistData.user.lastName}`.trim();

    try {
      setTransferLoading(true);
      await transferInterview(interviewId, selectedPanelist);

      // Reset form and close modal
      handleClose();

      // Show success toast
      showToast(
        `Interview successfully transferred to ${panelistName}!`,
        'success'
      );

      // Notify parent component
      onTransferSuccess();
    } catch (error: unknown) {
      const message =
        (error as { message?: string })?.message ||
        'Failed to transfer interview';
      showToast(`Transfer failed: ${message}`, 'error');
    } finally {
      setTransferLoading(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    setSelectedPanelist('');
    setSearchQuery('');
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
      <div className="relative bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-2xl h-[700px] flex flex-col">
        {/* Modal Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-orange-100">
              <FiRepeat className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg leading-6 font-semibold text-gray-900">
                Transfer Interview
              </h3>
              <p className="text-sm text-gray-500">
                Select a panelist to transfer this interview to
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

        {/* Interview Info - Fixed */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex-shrink-0">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">Candidate:</span>
              <span className="font-semibold text-gray-900 truncate ml-2">
                {candidateName}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">Scheduled:</span>
              <span className="font-semibold text-gray-900 truncate ml-2">
                {scheduledDate} at {scheduledTime}
              </span>
            </div>
          </div>
        </div>

        {/* Search Input - Fixed */}
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
              placeholder="Search panelists by name, email, or role..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Panelists List - Scrollable with Fixed Height */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {transferLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <FiRefreshCw className="w-8 h-8 animate-spin text-blue-600" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Loading Panelists
                </h4>
                <p className="text-gray-500">
                  Please wait while we fetch available panelists...
                </p>
              </div>
            </div>
          ) : filteredPanelists.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <FiUsers className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  {availablePanelists.length === 0
                    ? 'No Panelists Available'
                    : 'No Results Found'}
                </h4>
                <p className="text-gray-500">
                  {availablePanelists.length === 0
                    ? 'There are currently no available panelists for transfer.'
                    : 'Try adjusting your search criteria to find panelists.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-3">
                {filteredPanelists.map(panelist => {
                  const fullName =
                    `${panelist.user.firstName} ${panelist.user.lastName}`.trim();
                  return (
                    <div
                      key={panelist.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        selectedPanelist === panelist.id
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm'
                      }`}
                      onClick={() => setSelectedPanelist(panelist.id)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              selectedPanelist === panelist.id
                                ? 'bg-blue-600 ring-2 ring-blue-300'
                                : 'bg-blue-600'
                            }`}
                          >
                            <FiUser className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-base font-semibold text-gray-900 truncate">
                              {fullName}
                            </h4>
                            {selectedPanelist === panelist.id && (
                              <div className="flex-shrink-0 ml-2">
                                <FiCheck className="w-5 h-5 text-blue-600" />
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-1 truncate">
                            {panelist.user.email}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 mb-2">
                            <span className="font-medium">
                              {panelist.designation}
                            </span>
                            {panelist.department && (
                              <>
                                <span className="mx-1">•</span>
                                <span>{panelist.department}</span>
                              </>
                            )}
                          </div>
                          {panelist.skills && panelist.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {panelist.skills
                                .slice(0, 3)
                                .map((skill, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              {panelist.skills.length > 3 && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                  +{panelist.skills.length - 3} more
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

        {/* Selected Panelist Confirmation */}
        {selectedPanelist &&
          availablePanelists.find(p => p.id === selectedPanelist) && (
            <div className="px-6 py-4 bg-orange-50 border-t border-orange-200 flex-shrink-0">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <FiRepeat className="w-4 h-4 text-orange-600" />
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <h4 className="text-sm font-medium text-orange-900 mb-2">
                    Transfer Confirmation
                  </h4>
                  <div className="text-sm text-orange-700 space-y-1">
                    <div>
                      <strong>Transfer to:</strong>{' '}
                      {`${availablePanelists.find(p => p.id === selectedPanelist)?.user.firstName} ${availablePanelists.find(p => p.id === selectedPanelist)?.user.lastName}`.trim()}
                    </div>
                    <div>
                      <strong>Email:</strong>{' '}
                      {
                        availablePanelists.find(p => p.id === selectedPanelist)
                          ?.user.email
                      }
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-orange-100 border border-orange-200 rounded-lg">
                    <div className="flex items-center">
                      <FiX className="w-4 h-4 text-orange-600 mr-2 flex-shrink-0" />
                      <span className="text-xs text-orange-800 font-medium">
                        This action cannot be undone. You will no longer be a
                        panelist for this interview.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3 flex-shrink-0">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            disabled={transferLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleTransferInterview}
            disabled={!selectedPanelist || transferLoading}
            className="flex-1 px-4 py-3 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center"
          >
            {transferLoading ? (
              <>
                <FiRefreshCw className="w-4 h-4 animate-spin mr-2" />
                Transferring...
              </>
            ) : (
              <>
                <FiRepeat className="w-4 h-4 mr-2" />
                Transfer Interview
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferInterviewModal;
