'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  FiUsers,
  FiUserCheck,
  FiCalendar,
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiActivity,
  FiCode,
  FiMoreVertical,
  FiRefreshCw,
  FiDownload,
  FiChevronDown,
  FiFileText,
  FiFile,
} from 'react-icons/fi';
import {
  getAdminDashboard,
  DashboardApiData,
} from '@/services/admin-panelist-services/adminService';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardApiData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [signupViewType, setSignupViewType] = useState('weekly');
  const [revenueViewType, setRevenueViewType] = useState('tier');
  const [isExporting, setIsExporting] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowExportDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch dashboard data from API
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getAdminDashboard();
      setDashboardData(data);
    } catch (err: unknown) {
      console.error('Error fetching dashboard data:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to load dashboard data'
      );
    } finally {
      setLoading(false);
    }
  };

  // Export dashboard data as CSV
  const exportToCSV = () => {
    if (!dashboardData) return;

    setIsExporting(true);
    setShowExportDropdown(false);

    try {
      // Create CSV content
      let csvContent = '';

      // Header
      csvContent += 'Dashboard Report\n';
      csvContent += `Generated on: ${new Date().toLocaleString()}\n\n`;

      // Key Metrics Section
      csvContent += 'KEY METRICS\n';
      csvContent += 'Metric,Value\n';
      csvContent += `Total Active Customers,${dashboardData.keyMetrics.totalActiveCustomers}\n`;
      csvContent += `Active Candidates,${dashboardData.keyMetrics.activeCandidates}\n`;
      csvContent += `Active Experts,${dashboardData.keyMetrics.activeExperts}\n`;
      csvContent += `Interviews Scheduled (Weekly),${dashboardData.keyMetrics.interviewsScheduled.weekly}\n`;
      csvContent += `Candidate to FTE Conversion Rate,${dashboardData.keyMetrics.candidateToFTEConversionRate}%\n`;
      csvContent += `Churn Rate,${dashboardData.keyMetrics.churnRate}%\n`;
      csvContent += `Subscription Revenue,${dashboardData.keyMetrics.revenue.subscription.toLocaleString()}\n`;
      csvContent += `Placement Fees Revenue,${dashboardData.keyMetrics.revenue.placementFees.toLocaleString()}\n`;
      csvContent += `Total Revenue,${(dashboardData.keyMetrics.revenue.subscription + dashboardData.keyMetrics.revenue.placementFees).toLocaleString()}\n\n`;

      // Candidate Status Section
      csvContent += 'CANDIDATE STATUS\n';
      csvContent += 'Status,Count\n';
      csvContent += `Active,${dashboardData.graphData.activeVsInactiveCandidates.active}\n`;
      csvContent += `Inactive,${dashboardData.graphData.activeVsInactiveCandidates.inactive}\n\n`;

      // Top Skills Section
      csvContent += 'TOP PERFORMING SKILLS\n';
      csvContent += 'Skill,Candidate Count\n';
      dashboardData.graphData.topPerformingSkills.forEach(skill => {
        csvContent += `${skill.skill},${skill.count}\n`;
      });
      csvContent += '\n';

      // Revenue Breakdown by Tier
      csvContent += 'REVENUE BREAKDOWN BY TIER\n';
      csvContent += 'Tier,Revenue\n';
      Object.entries(dashboardData.graphData.revenueBreakdown.byTier).forEach(
        ([tier, revenue]) => {
          csvContent += `${tier},${revenue.toLocaleString()}\n`;
        }
      );
      csvContent += '\n';

      // Revenue Breakdown by Geography
      csvContent += 'REVENUE BREAKDOWN BY GEOGRAPHY\n';
      csvContent += 'Region,Revenue\n';
      Object.entries(
        dashboardData.graphData.revenueBreakdown.byGeography
      ).forEach(([region, revenue]) => {
        csvContent += `${region},${revenue.toLocaleString()}\n`;
      });
      csvContent += '\n';

      // Weekly Signup Trend
      csvContent += 'WEEKLY SIGNUP TREND\n';
      csvContent += 'Week,Customers,Candidates\n';
      dashboardData.graphData.weeklySignupTrend.customers.forEach(
        (customers, index) => {
          const candidates =
            dashboardData.graphData.weeklySignupTrend.candidates[index];
          csvContent += `Week ${index + 1},${customers},${candidates}\n`;
        }
      );

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute(
          'download',
          `dashboard-report-${new Date().toISOString().split('T')[0]}.csv`
        );
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Error exporting CSV:', err);
      alert('Failed to export CSV. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Export dashboard data as Excel (XLSX format)
  const exportToExcel = () => {
    if (!dashboardData) return;

    setIsExporting(true);
    setShowExportDropdown(false);

    try {
      // Key Metrics Sheet
      const keyMetricsData = [
        ['Dashboard Report'],
        [`Generated on: ${new Date().toLocaleString()}`],
        [''],
        ['KEY METRICS'],
        ['Metric', 'Value'],
        [
          'Total Active Customers',
          dashboardData.keyMetrics.totalActiveCustomers,
        ],
        ['Active Candidates', dashboardData.keyMetrics.activeCandidates],
        ['Active Experts', dashboardData.keyMetrics.activeExperts],
        [
          'Interviews Scheduled (Weekly)',
          dashboardData.keyMetrics.interviewsScheduled.weekly,
        ],
        [
          'Candidate to FTE Conversion Rate',
          `${dashboardData.keyMetrics.candidateToFTEConversionRate}%`,
        ],
        ['Churn Rate', `${dashboardData.keyMetrics.churnRate}%`],
        [
          'Subscription Revenue',
          `${dashboardData.keyMetrics.revenue.subscription.toLocaleString()}`,
        ],
        [
          'Placement Fees Revenue',
          `${dashboardData.keyMetrics.revenue.placementFees.toLocaleString()}`,
        ],
        [
          'Total Revenue',
          `${(dashboardData.keyMetrics.revenue.subscription + dashboardData.keyMetrics.revenue.placementFees).toLocaleString()}`,
        ],
        [''],
        ['CANDIDATE STATUS'],
        ['Status', 'Count'],
        ['Active', dashboardData.graphData.activeVsInactiveCandidates.active],
        [
          'Inactive',
          dashboardData.graphData.activeVsInactiveCandidates.inactive,
        ],
        [''],
        ['TOP PERFORMING SKILLS'],
        ['Skill', 'Candidate Count'],
        ...dashboardData.graphData.topPerformingSkills.map(skill => [
          skill.skill,
          skill.count,
        ]),
        [''],
        ['REVENUE BREAKDOWN BY TIER'],
        ['Tier', 'Revenue'],
        ...Object.entries(dashboardData.graphData.revenueBreakdown.byTier).map(
          ([tier, revenue]) => [tier, `${revenue.toLocaleString()}`]
        ),
        [''],
        ['REVENUE BREAKDOWN BY GEOGRAPHY'],
        ['Region', 'Revenue'],
        ...Object.entries(
          dashboardData.graphData.revenueBreakdown.byGeography
        ).map(([region, revenue]) => [region, `${revenue.toLocaleString()}`]),
        [''],
        ['WEEKLY SIGNUP TREND'],
        ['Week', 'Customers', 'Candidates'],
        ...dashboardData.graphData.weeklySignupTrend.customers.map(
          (customers, index) => [
            `Week ${index + 1}`,
            customers,
            dashboardData.graphData.weeklySignupTrend.candidates[index],
          ]
        ),
      ];

      // Convert to CSV format for Excel compatibility
      const csvContent = keyMetricsData
        .map(row =>
          row
            .map(cell =>
              typeof cell === 'string' && cell.includes(',')
                ? `"${cell}"`
                : cell
            )
            .join(',')
        )
        .join('\n');

      // Create Excel-compatible CSV with UTF-8 BOM
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], {
        type: 'text/csv;charset=utf-8;',
      });
      const link = document.createElement('a');

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute(
          'download',
          `dashboard-report-${new Date().toISOString().split('T')[0]}.xlsx`
        );
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Error exporting Excel:', err);
      alert('Failed to export Excel. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Export dashboard data as PDF
  const exportToPDF = () => {
    if (!dashboardData) return;

    setIsExporting(true);
    setShowExportDropdown(false);

    try {
      // Create HTML content for PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Dashboard Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
            .header { text-align: center; margin-bottom: 30px; }
            .title { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .date { font-size: 14px; color: #666; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 20px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #333; padding-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .metric-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .metric-card { border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
            .metric-value { font-size: 24px; font-weight: bold; color: #2563eb; }
            .metric-label { font-size: 14px; color: #666; margin-bottom: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">Dashboard Report</div>
            <div class="date">Generated on: ${new Date().toLocaleString()}</div>
          </div>

          <div class="section">
            <div class="section-title">Key Metrics Overview</div>
            <div class="metric-grid">
              <div class="metric-card">
                <div class="metric-label">Total Active Customers</div>
                <div class="metric-value">${dashboardData.keyMetrics.totalActiveCustomers.toLocaleString()}</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">Active Candidates</div>
                <div class="metric-value">${dashboardData.keyMetrics.activeCandidates.toLocaleString()}</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">Active Experts</div>
                <div class="metric-value">${dashboardData.keyMetrics.activeExperts.toLocaleString()}</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">Interviews Scheduled (Weekly)</div>
                <div class="metric-value">${dashboardData.keyMetrics.interviewsScheduled.weekly}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Performance Metrics</div>
            <table>
              <tr><th>Metric</th><th>Value</th></tr>
              <tr><td>Candidate to FTE Conversion Rate</td><td>${dashboardData.keyMetrics.candidateToFTEConversionRate}%</td></tr>
              <tr><td>Churn Rate</td><td>${dashboardData.keyMetrics.churnRate}%</td></tr>
              <tr><td>Subscription Revenue</td><td>${dashboardData.keyMetrics.revenue.subscription.toLocaleString()}</td></tr>
              <tr><td>Placement Fees Revenue</td><td>${dashboardData.keyMetrics.revenue.placementFees.toLocaleString()}</td></tr>
              <tr><td>Total Revenue</td><td>${(dashboardData.keyMetrics.revenue.subscription + dashboardData.keyMetrics.revenue.placementFees).toLocaleString()}</td></tr>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Candidate Status</div>
            <table>
              <tr><th>Status</th><th>Count</th></tr>
              <tr><td>Active Candidates</td><td>${dashboardData.graphData.activeVsInactiveCandidates.active}</td></tr>
              <tr><td>Inactive Candidates</td><td>${dashboardData.graphData.activeVsInactiveCandidates.inactive}</td></tr>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Top Performing Skills</div>
            <table>
              <tr><th>Skill</th><th>Candidate Count</th></tr>
              ${dashboardData.graphData.topPerformingSkills
                .map(
                  skill =>
                    `<tr><td>${skill.skill}</td><td>${skill.count}</td></tr>`
                )
                .join('')}
            </table>
          </div>

          <div class="section">
            <div class="section-title">Revenue Breakdown by Tier</div>
            <table>
              <tr><th>Tier</th><th>Revenue</th></tr>
              ${Object.entries(dashboardData.graphData.revenueBreakdown.byTier)
                .map(
                  ([tier, revenue]) =>
                    `<tr><td>${tier}</td><td>${revenue.toLocaleString()}</td></tr>`
                )
                .join('')}
            </table>
          </div>

          <div class="section">
            <div class="section-title">Revenue Breakdown by Geography</div>
            <table>
              <tr><th>Region</th><th>Revenue</th></tr>
              ${Object.entries(
                dashboardData.graphData.revenueBreakdown.byGeography
              )
                .map(
                  ([region, revenue]) =>
                    `<tr><td>${region}</td><td>${revenue.toLocaleString()}</td></tr>`
                )
                .join('')}
            </table>
          </div>

          <div class="section">
            <div class="section-title">Weekly Signup Trend</div>
            <table>
              <tr><th>Week</th><th>Customers</th><th>Candidates</th></tr>
              ${dashboardData.graphData.weeklySignupTrend.customers
                .map((customers, index) => {
                  const candidates =
                    dashboardData.graphData.weeklySignupTrend.candidates[index];
                  return `<tr><td>Week ${index + 1}</td><td>${customers}</td><td>${candidates}</td></tr>`;
                })
                .join('')}
            </table>
          </div>
        </body>
        </html>
      `;

      // Create blob and download
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const link = document.createElement('a');

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute(
          'download',
          `dashboard-report-${new Date().toISOString().split('T')[0]}.html`
        );
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // Show instruction to user
        setTimeout(() => {
          alert(
            'HTML file downloaded! You can open it in your browser and use "Print to PDF" to create a PDF file.'
          );
        }, 100);
      }
    } catch (err) {
      console.error('Error exporting PDF:', err);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
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

  // Error state
  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'No data available'}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Process data for display
  const metricsData = {
    totalActiveCustomers: dashboardData.keyMetrics.totalActiveCustomers,
    activeEngineers: dashboardData.keyMetrics.activeCandidates,
    totalExperts: dashboardData.keyMetrics.activeExperts,
    interviewsScheduled: dashboardData.keyMetrics.interviewsScheduled.weekly,
    conversionRate: parseFloat(
      dashboardData.keyMetrics.candidateToFTEConversionRate
    ),
    churnRate: parseFloat(dashboardData.keyMetrics.churnRate),
    revenue:
      dashboardData.keyMetrics.revenue.subscription +
      dashboardData.keyMetrics.revenue.placementFees,
  };

  // Engineer status data
  const engineerStatusData = {
    active: dashboardData.graphData.activeVsInactiveCandidates.active,
    inactive: dashboardData.graphData.activeVsInactiveCandidates.inactive,
    total:
      dashboardData.graphData.activeVsInactiveCandidates.active +
      dashboardData.graphData.activeVsInactiveCandidates.inactive,
  };

  // Skills data with calculated demand percentages
  const maxSkillCount = Math.max(
    ...dashboardData.graphData.topPerformingSkills.map(s => s.count)
  );
  const skillsData = dashboardData.graphData.topPerformingSkills.map(skill => ({
    skill: skill.skill,
    engineers: skill.count,
    demand: Math.round((skill.count / maxSkillCount) * 100),
  }));

  // Function to get signup data based on current view
  const getSignupData = () => {
    const isWeekly = signupViewType === 'weekly';
    const sourceData = isWeekly
      ? dashboardData.graphData.weeklySignupTrend
      : dashboardData.graphData.monthlySignupTrend ||
        dashboardData.graphData.weeklySignupTrend;

    const labels = isWeekly
      ? sourceData.customers.map((_, index) => `Week ${index + 1}`)
      : [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ];

    return sourceData.customers.map((customers, index) => ({
      period: labels[index],
      customers: customers,
      candidates: sourceData.candidates[index],
    }));
  };

  const currentSignupData = getSignupData();

  // Function to get revenue data based on current view
  const getRevenueData = () => {
    const isByTier = revenueViewType === 'tier';
    const sourceData = isByTier
      ? dashboardData.graphData.revenueBreakdown.byTier
      : dashboardData.graphData.revenueBreakdown.byGeography;

    const totalRevenue = Object.values(sourceData).reduce(
      (sum, val) => sum + val,
      0
    );

    return Object.entries(sourceData).map(([key, revenue]) => ({
      category: key,
      revenue: revenue,
      percentage: Math.round((revenue / totalRevenue) * 100),
    }));
  };

  const currentRevenueData = getRevenueData();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                Dashboard
              </h1>
              <p className="text-slate-600 mt-1">
                Monitor your platform&apos;s key metrics and performance
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchDashboardData}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiRefreshCw
                  className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                />
                Refresh
              </button>

              {/* Export Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowExportDropdown(!showExportDropdown)}
                  disabled={isExporting || !dashboardData}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiDownload
                    className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`}
                  />
                  {isExporting ? 'Exporting...' : 'Export Report'}
                  <FiChevronDown
                    className={`w-4 h-4 transition-transform ${showExportDropdown ? 'rotate-180' : ''}`}
                  />
                </button>

                {showExportDropdown && !isExporting && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-slate-200 z-50">
                    <div className="py-1">
                      <button
                        onClick={exportToCSV}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200"
                      >
                        <FiFileText className="w-4 h-4 text-green-600" />
                        <div className="text-left">
                          <div className="font-medium">Export as CSV</div>
                          <div className="text-xs text-slate-500">
                            Spreadsheet format
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={exportToExcel}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200"
                      >
                        <FiFile className="w-4 h-4 text-green-700" />
                        <div className="text-left">
                          <div className="font-medium">Export as Excel</div>
                          <div className="text-xs text-slate-500">
                            XLSX compatible
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={exportToPDF}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200"
                      >
                        <FiFileText className="w-4 h-4 text-red-600" />
                        <div className="text-left">
                          <div className="font-medium">Export as PDF</div>
                          <div className="text-xs text-slate-500">
                            Print-ready format
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="mb-8">
          {/* First Row - Main Counts */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
            {/* Total Active Customers */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Total Active Customers
                  </p>
                  <p className="text-3xl font-bold text-slate-900 mb-2">
                    {metricsData.totalActiveCustomers.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 text-sm">
                    <FiTrendingUp className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-600 font-medium">+12%</span>
                    <span className="text-slate-500">this month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiUsers className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Active Engineers */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Active Candidates
                  </p>
                  <p className="text-3xl font-bold text-slate-900 mb-2">
                    {metricsData.activeEngineers.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 text-sm">
                    <FiTrendingUp className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-600 font-medium">+8%</span>
                    <span className="text-slate-500">this month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiUserCheck className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>

            {/* Total Experts */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Active Experts
                  </p>
                  <p className="text-3xl font-bold text-slate-900 mb-2">
                    {metricsData.totalExperts.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 text-sm">
                    <FiTrendingUp className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-600 font-medium">+6%</span>
                    <span className="text-slate-500">this month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiActivity className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Second Row - Performance Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Interviews Scheduled */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Interviews Scheduled
                  </p>
                  <p className="text-3xl font-bold text-slate-900 mb-2">
                    {metricsData.interviewsScheduled}
                  </p>
                  <p className="text-sm text-slate-500">This week</p>
                </div>
                <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiCalendar className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </div>

            {/* Conversion Rate */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Candidate → FTE Rate
                  </p>
                  <p className="text-3xl font-bold text-slate-900 mb-2">
                    {metricsData.conversionRate}%
                  </p>
                  <div className="flex items-center gap-1 text-sm">
                    <FiTrendingUp className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-600 font-medium">+5.2%</span>
                    <span className="text-slate-500">vs last month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiTrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Churn Rate */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Churn Rate
                  </p>
                  <p className="text-3xl font-bold text-slate-900 mb-2">
                    {metricsData.churnRate}%
                  </p>
                  <div className="flex items-center gap-1 text-sm">
                    <FiTrendingDown className="w-4 h-4 text-red-500" />
                    <span className="text-red-600 font-medium">+2.1%</span>
                    <span className="text-slate-500">vs last month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiTrendingDown className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            {/* Revenue */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Revenue
                  </p>
                  <p className="text-3xl font-bold text-slate-900 mb-2">
                    ${(metricsData.revenue / 1000).toFixed(0)}K
                  </p>
                  <div className="flex items-center gap-1 text-sm">
                    <FiTrendingUp className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-600 font-medium">+15%</span>
                    <span className="text-slate-500">this month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiDollarSign className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly/Monthly Signup Trend */}
          <div className="bg-white rounded-xl border border-slate-200 p-8 relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {signupViewType === 'weekly' ? 'Weekly' : 'Monthly'} Signup
                  Trend
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Customer and candidate registrations
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                    signupViewType === 'weekly'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  onClick={() => setSignupViewType('weekly')}
                >
                  Weekly
                </button>
                <button
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                    signupViewType === 'monthly'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  onClick={() => setSignupViewType('monthly')}
                >
                  Monthly
                </button>
              </div>
            </div>
            <div className="h-80 overflow-visible relative">
              <div className="flex items-end justify-between h-64 gap-2 relative">
                {currentSignupData.map((data, index) => {
                  const maxValue = Math.max(
                    Math.max(...currentSignupData.map(d => d.customers)),
                    Math.max(...currentSignupData.map(d => d.candidates))
                  );
                  const customerHeight = Math.max(
                    (data.customers / maxValue) * 200,
                    8
                  );
                  const candidateHeight = Math.max(
                    (data.candidates / maxValue) * 200,
                    8
                  );

                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center flex-1 relative"
                    >
                      <div className="flex items-end gap-1 w-full h-52 justify-center">
                        <div className="flex flex-col items-center">
                          <div
                            className="w-4 bg-blue-500 rounded-t-sm transition-all duration-300 hover:bg-blue-600 relative group"
                            style={{ height: `${customerHeight}px` }}
                          >
                            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-3 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg">
                              {data.customers} customers
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div
                            className="w-4 bg-emerald-500 rounded-t-sm transition-all duration-300 hover:bg-emerald-600 relative group"
                            style={{ height: `${candidateHeight}px` }}
                          >
                            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-3 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg">
                              {data.candidates} candidates
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-slate-600 mt-3 font-medium">
                        {data.period}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                  <span className="text-sm text-slate-700 font-medium">
                    Customers
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
                  <span className="text-sm text-slate-700 font-medium">
                    Candidates
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Active vs Inactive Engineers */}
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Candidate Status
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Active vs inactive candidates
                </p>
              </div>
              <button className="text-slate-400 hover:text-slate-600 transition-colors duration-200">
                <FiMoreVertical className="w-5 h-5" />
              </button>
            </div>
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="relative w-56 h-56 mb-6">
                  <svg className="w-56 h-56">
                    <path
                      d={`M 112 112 L 112 32 A 80 80 0 1 1 ${112 + 80 * Math.cos(2 * Math.PI * (engineerStatusData.active / engineerStatusData.total) - Math.PI / 2)} ${112 + 80 * Math.sin(2 * Math.PI * (engineerStatusData.active / engineerStatusData.total) - Math.PI / 2)} Z`}
                      fill="currentColor"
                      className="text-emerald-500 hover:text-emerald-600 transition-colors duration-200 cursor-pointer"
                    />
                    <path
                      d={`M 112 112 L ${112 + 80 * Math.cos(2 * Math.PI * (engineerStatusData.active / engineerStatusData.total) - Math.PI / 2)} ${112 + 80 * Math.sin(2 * Math.PI * (engineerStatusData.active / engineerStatusData.total) - Math.PI / 2)} A 80 80 0 0 1 112 32 Z`}
                      fill="currentColor"
                      className="text-slate-300 hover:text-slate-400 transition-colors duration-200 cursor-pointer"
                    />
                  </svg>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <span className="text-sm text-slate-700 font-medium">
                        Active Candidates
                      </span>
                    </div>
                    <span className="text-lg font-bold text-emerald-600">
                      {engineerStatusData.active}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
                      <span className="text-sm text-slate-700 font-medium">
                        Inactive Candidates
                      </span>
                    </div>
                    <span className="text-lg font-bold text-slate-600">
                      {engineerStatusData.inactive}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue and Skills Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Revenue Breakdown
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Revenue by{' '}
                  {revenueViewType === 'tier'
                    ? 'subscription tier'
                    : 'geography'}
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                    revenueViewType === 'tier'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  onClick={() => setRevenueViewType('tier')}
                >
                  Tier
                </button>
                <button
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                    revenueViewType === 'geography'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  onClick={() => setRevenueViewType('geography')}
                >
                  Geography
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {currentRevenueData.map((item, index) => {
                const getColorClass = () => {
                  if (revenueViewType === 'tier') {
                    return index === 0
                      ? 'bg-blue-500'
                      : index === 1
                        ? 'bg-emerald-500'
                        : 'bg-purple-500';
                  } else {
                    return index === 0
                      ? 'bg-orange-500'
                      : index === 1
                        ? 'bg-indigo-500'
                        : 'bg-rose-500';
                  }
                };

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-3 h-3 rounded-full ${getColorClass()}`}
                      ></div>
                      <div>
                        <h4 className="font-semibold text-slate-900">
                          {item.category}
                        </h4>
                        <p className="text-sm text-slate-600">
                          ${item.revenue.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-slate-900">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Performing Skills */}
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Top Performing Skills
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Skills with highest demand
                </p>
              </div>
              <button className="text-slate-400 hover:text-slate-600 transition-colors duration-200">
                <FiCode className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {skillsData.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <FiCode className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {skill.skill}
                      </h4>
                      <p className="text-sm text-slate-600">
                        {skill.engineers} candidates
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-slate-900">
                      {skill.demand}%
                    </span>
                    <p className="text-xs text-slate-500 font-medium">Demand</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
