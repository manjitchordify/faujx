import Image from 'next/image';
import React from 'react';
import { XCircle } from 'lucide-react';

interface ReportItem {
  text: string;
  isPassed: boolean;
}

interface FeedbackComponentProps {
  userName: string;
  userAvatar?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  reportItems: ReportItem[];
  supportText?: string;
  buttonText?: string;
  buttonLink?: string;
  onButtonClick?: () => void;
  logoSrc?: string;
  type: string | null;
  score: string | number;
}

const FeedbackComponent: React.FC<FeedbackComponentProps> = ({
  userName,
  title = 'Feedback on Your Recent Assessment',
  subtitle = 'Thank you for participating in the recent assessment. Unfortunately, you did not achieve the required cutoff mark this time.',
  description = 'After reviewing your performance, it appears you could benefit from further development in the following React skills:',
  reportItems,
  supportText = 'To support your learning, I recommend exploring Chordify Ed, a platform with resources and exercises specifically tailored to building and improving skills. Engaging with their guided tutorials and real-world projects can help bridge these skill gaps.',
  buttonText = 'Upskill with FaujX LMS',
  buttonLink,
  onButtonClick,
  type,
  score,
}) => {
  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else if (buttonLink) {
      window.open(buttonLink, '_blank');
    }
  };
  console.log(userName);

  return (
    <div className="w-full min-h-[calc(100vh-130px)] flex flex-col justify-start items-center overflow-y-auto">
      {/* MAIN CONTENT */}
      <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 flex flex-col justify-start items-start gap-6 sm:gap-8 lg:gap-10 pt-4 sm:pt-5 pb-8">
        {/* FEEDBACK HEADER SECTION */}
        <div className="w-full h-fit flex flex-col items-center justify-start gap-6 sm:gap-8 lg:gap-10">
          <p className="font-medium text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center leading-tight">
            {title}
          </p>

          {/* FEEDBACK MESSAGES */}
          <div className="flex flex-col gap-3 sm:gap-4 w-full">
            <p className="font-medium text-[#585858] text-sm sm:text-base md:text-lg lg:text-xl text-center">
              {subtitle}
            </p>

            <p className="font-medium text-[#585858] text-sm sm:text-base md:text-lg lg:text-xl text-center">
              {description}
            </p>
          </div>
        </div>

        {/* REPORT BOX AND SUPPORT TEXT */}
        <div className="w-full h-fit flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12">
          {/* REPORT BOX */}
          <div className="w-full lg:w-1/3 h-fit flex flex-col gap-2 p-4 sm:p-6 lg:p-8 bg-white shadow-[0px_4px_65.9px_8px_#00000040] rounded-[20px]">
            {type == 'mcq' ? (
              <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-xl shadow-sm">
                <XCircle className="w-6 h-6" />
                <p>
                  Thank you for participating! Your score is{' '}
                  <strong>{score}</strong> Unfortunately, you are not qualified
                  for the next process.
                </p>
              </div>
            ) : (
              reportItems.map((item, index) => (
                <div
                  key={item?.text || index}
                  className="flex flex-row justify-between items-center gap-2 text-red-700"
                >
                  <p className="text-sm sm:text-base lg:text-lg">
                    {item?.text}
                  </p>
                  <div
                    className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 rounded-full flex justify-center items-center flex-shrink-0 ${
                      item?.isPassed ? 'bg-[#0E0596]' : 'bg-[#960505]'
                    }`}
                  >
                    {item?.isPassed ? (
                      <Image
                        src="/images/charm_tick.svg"
                        alt="tick"
                        height={20}
                        width={20}
                        className="w-3 h-3 sm:w-4 sm:h-4 lg:w-4 lg:h-4 font-bold"
                        priority
                      />
                    ) : (
                      <Image
                        src="/images/basil_cross-outline.svg"
                        alt="close"
                        height={20}
                        width={20}
                        className="w-6 h-6 font-bold"
                        priority
                      />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* SUPPORT TEXT */}
          <div className="w-full lg:w-2/3 h-full flex flex-col justify-between items-start lg:items-end gap-4 sm:gap-6">
            <p className="text-[#585858] text-sm sm:text-base md:text-lg lg:text-xl">
              {supportText}
            </p>
            {buttonText && (buttonLink || onButtonClick) && (
              <button
                onClick={handleButtonClick}
                className="w-full sm:w-auto text-white px-4 py-2 sm:px-6 sm:py-3 bg-[#1F514C] hover:bg-[#1d3130] text-sm sm:text-base lg:text-lg rounded-[18px] cursor-pointer transition-colors duration-200"
              >
                {buttonText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackComponent;
