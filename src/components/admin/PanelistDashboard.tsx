'use client';

import React, { useState, useEffect } from 'react';
import {
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiUsers,
  FiRefreshCw,
  FiArrowRight,
} from 'react-icons/fi';

// Types for the dashboard data
interface DashboardStats {
  totalInterviews: number;
  pendingInterviews: number;
  confirmedInterviews: number;
  completedInterviews: number;
  transferredInterviews: number;
}

function PanelistDashboard(): React.JSX.Element {
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);

  // Load dummy data
  const loadDashboardData = (): void => {
    setLoading(true);

    // Simulate loading delay
    setTimeout(() => {
      const dummyStats: DashboardStats = {
        totalInterviews: 45,
        pendingInterviews: 8,
        confirmedInterviews: 12,
        completedInterviews: 20,
        transferredInterviews: 5,
      };

      setDashboardData(dummyStats);
      setLoading(false);
    }, 800);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <FiRefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                Panelist Dashboard
              </h1>
              <p className="text-slate-600 mt-1">
                Manage your interviews and view your statistics
              </p>
            </div>
            <button
              onClick={loadDashboardData}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiRefreshCw
                className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Dashboard Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Total Interviews */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-blue-300 transition-colors duration-200">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mb-3">
                <FiUsers className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Total Interviews
              </p>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {dashboardData?.totalInterviews || 0}
              </p>
              <p className="text-xs text-gray-500">This month</p>
            </div>
          </div>

          {/* Pending Interviews */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-orange-300 transition-colors duration-200">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full mb-3">
                <FiClock className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Pending Interviews
              </p>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {dashboardData?.pendingInterviews || 0}
              </p>
              <p className="text-xs text-gray-500">Awaiting confirmation</p>
            </div>
          </div>

          {/* Confirmed Interviews */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-blue-300 transition-colors duration-200">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mb-3">
                <FiCalendar className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Confirmed Interviews
              </p>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {dashboardData?.confirmedInterviews || 0}
              </p>
              <p className="text-xs text-gray-500">Ready to conduct</p>
            </div>
          </div>

          {/* Completed Interviews */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-green-300 transition-colors duration-200">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mb-3">
                <FiCheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Completed Interviews
              </p>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {dashboardData?.completedInterviews || 0}
              </p>
              <p className="text-xs text-gray-500">Successfully finished</p>
            </div>
          </div>

          {/* Transferred Interviews */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-purple-300 transition-colors duration-200">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full mb-3">
                <FiArrowRight className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Transferred Interviews
              </p>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {dashboardData?.transferredInterviews || 0}
              </p>
              <p className="text-xs text-gray-500">Moved to other panelists</p>
            </div>
          </div>
        </div>

        {/* Empty State for Future Content */}
        <div className="mt-8 bg-white rounded-xl border border-slate-200 p-8">
          <div className="text-center py-12">
            <FiCalendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              More features coming soon
            </h3>
            <p className="text-slate-600">
              Additional dashboard features will be available here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PanelistDashboard;
