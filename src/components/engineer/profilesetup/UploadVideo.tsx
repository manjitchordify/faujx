import React, { useState } from 'react';
import { Upload } from 'lucide-react';

interface UploadVideoProps {
  onBack: () => void;
  onVideoUploaded: (videoFile: File) => void;
}

const UploadVideo: React.FC<UploadVideoProps> = ({
  onBack,
  onVideoUploaded,
}) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const videoFile = files.find(file => file.type.startsWith('video/'));

    if (videoFile) {
      onVideoUploaded(videoFile);
      console.log('Video file dropped:', videoFile.name);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      onVideoUploaded(file);
      console.log('Video file selected:', file.name);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12">
        <h2 className="text-3xl font-medium text-gray-900 mb-8 text-center flex items-center justify-center gap-3">
          <Upload className="w-8 h-8 text-teal-700" />
          Upload Your Video
        </h2>

        {/* Drag and Drop Area */}
        <div
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 ${
            dragOver
              ? 'border-teal-500 bg-teal-50'
              : 'border-gray-300 hover:border-teal-400 hover:bg-gray-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center">
                <Upload className="w-10 h-10 text-teal-600" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Drop your video here, or browse
              </h3>
              <p className="text-gray-600 mb-6">
                Supports MP4, MOV, AVI, and other video formats
              </p>

              <label className="inline-block">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <span className="bg-teal-700 hover:bg-teal-800 text-white px-8 py-3 rounded-xl font-medium transition-colors duration-200 cursor-pointer">
                  Browse Files
                </span>
              </label>
            </div>

            <div className="text-sm text-gray-500">
              <p>Maximum file size: 300MB</p>
              <p>Recommended resolution: 1280x720 or higher</p>
            </div>
          </div>
        </div>

        {/* Upload Requirements */}
        <div className="mt-8 bg-gray-50 rounded-xl p-6">
          <h4 className="font-medium text-gray-900 mb-4">
            Video Requirements:
          </h4>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Clear audio with no background noise
            </li>
            <li className="flex items-start">
              <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Well-lit face, centered in frame
            </li>
            <li className="flex items-start">
              <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Duration should be 1-3 minutes
            </li>
            <li className="flex items-start">
              <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Follow the provided script template
            </li>
          </ul>
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={onBack}
          className="bg-gray-500 hover:bg-gray-600 text-white px-12 py-4 rounded-xl text-lg font-medium transition-colors duration-200 shadow-sm"
        >
          Back to Options
        </button>
      </div>
    </div>
  );
};

export default UploadVideo;
