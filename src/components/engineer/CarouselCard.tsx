import React from 'react';

interface CarouselCardProps {
  data: {
    name: string;
    company: string;
    testimonial: string;
  };
  dataIndex: number;
}

export default function CarouselCard({ data }: CarouselCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mx-2 max-w-md">
      <div className="text-center">
        <h3 className="font-bold text-lg mb-2">{data.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{data.company}</p>
        <p className="text-gray-700">&quot;{data.testimonial}&quot;</p>
      </div>
    </div>
  );
}
