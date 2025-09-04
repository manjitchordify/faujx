'use client';

import React, { useState, useEffect } from 'react';
import {
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiUsers,
  FiRefreshCw,
  FiTrendingUp,
} from 'react-icons/fi';

// Types for the dashboard data
interface DashboardStats {
  totalInterviews: number;
  upcomingInterviews: number;
  completedInterviews: number;
}

function PanelistDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);

  // Load dummy data
  const loadDashboardData = () => {
    setLoading(true);

    // Simulate loading delay
    setTimeout(() => {
      const dummyStats: DashboardStats = {
        totalInterviews: 24,
        upcomingInterviews: 5,
        completedInterviews: 19,
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Interviews */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-600 mb-1">
                  Total Interviews
                </p>
                <p className="text-3xl font-bold text-slate-900 mb-2">
                  {dashboardData?.totalInterviews || 0}
                </p>
                <div className="flex items-center gap-1 text-sm">
                  <FiTrendingUp className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 font-medium">+8%</span>
                  <span className="text-slate-500">this month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiUsers className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Upcoming Interviews */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-600 mb-1">
                  Upcoming Interviews
                </p>
                <p className="text-3xl font-bold text-slate-900 mb-2">
                  {dashboardData?.upcomingInterviews || 0}
                </p>
                <p className="text-sm text-slate-500">Next 7 days</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiClock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Completed Interviews */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-600 mb-1">
                  Completed Interviews
                </p>
                <p className="text-3xl font-bold text-slate-900 mb-2">
                  {dashboardData?.completedInterviews || 0}
                </p>
                <div className="flex items-center gap-1 text-sm">
                  <FiCheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 font-medium">79%</span>
                  <span className="text-slate-500">completion rate</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiCheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
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
