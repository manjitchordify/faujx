import { ChevronDown } from 'lucide-react';
import React from 'react';

interface InterviewFilterProps {
  selectedRole: string;
  setSelectedRole: (role: string) => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  onClearFilters: () => void;
}

const InterviewFilter: React.FC<InterviewFilterProps> = ({
  selectedRole,
  setSelectedRole,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  onClearFilters,
}) => {
  // Generate years (current year and previous 2 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 3 }, (_, i) => currentYear - i);

  // Months array
  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  return (
    <div className="space-y-4">
      {/* Role Filter */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Role
        </label>
        <select
          value={selectedRole}
          onChange={e => setSelectedRole(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-gray-600"
        >
          <option value="">All Roles</option>
          <option value="Front-end">Frontend</option>
          <option value="Back-end">Backend</option>
          <option value="Full-Stack">Full Stack</option>
          <option value="AI/ML">AIML</option>
          <option value="Devops">Devops</option>
        </select>
        <ChevronDown className="absolute right-3 top-9 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>

      {/* Year Filter */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Year
        </label>
        <select
          value={selectedYear}
          onChange={e => setSelectedYear(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-gray-600"
        >
          <option value="">All Years</option>
          {years.map(year => (
            <option key={year} value={year.toString()}>
              {year}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-9 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>

      {/* Month Filter */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Month
        </label>
        <select
          value={selectedMonth}
          onChange={e => setSelectedMonth(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-gray-600"
        >
          <option value="">All Months</option>
          {months.map(month => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-9 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>

      {/* Clear Filters Button */}
      <button
        onClick={onClearFilters}
        className="w-full mt-4 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default InterviewFilter;
