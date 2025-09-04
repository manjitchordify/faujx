// components/users/Filters.tsx
import React from 'react';

const Filters = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <select className="border p-2 rounded">
        <option>Select Role</option>
        <option>Farmer</option>
        <option>Buyer</option>
        <option>Transporter</option>
      </select>

      <input type="date" className="border p-2 rounded" />

      <select className="border p-2 rounded">
        <option>Status</option>
        <option>Approved</option>
        <option>Pending</option>
      </select>
    </div>
  );
};

export default Filters;
