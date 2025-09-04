import React from 'react';

const ExpertDetail: React.FC = () => {
  const expertBenefits = [
    {
      title: 'Guide engineers through code reviews and projects',
      icon: '/images/expert/vector.png',
    },
    {
      title: 'Conduct mock interviews',
      icon: '/images/expert/vector.png',
    },
    {
      title:
        'Offer feedback on AI/ML, DevOps, Frontend, Backend, or Fullstack roles',
      icon: '/images/expert/vector.png',
    },
    {
      title: 'Contribute to a global impact',
      icon: '/images/expert/vector.png',
    },
  ];

  return (
    <section className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-normal text-gray-900 mb-6">
            Why Become a FaujX Expert?
          </h2>
          <p className="text-lg md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
            At FaujX, we dont just assess engineers—we elevate them. As an
            expert, you play a critical role in building a generation of
            disciplined, capable, and deployment-ready tech professionals.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {expertBenefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-2xl hover:shadow-md transition-shadow duration-300 border border-gray-100"
            >
              <div className="flex flex-col items-center justify-between h-48 text-center pt-4">
                {/* Icon */}
                <div className="w-16 h-16 flex items-center justify-center mb-6">
                  <svg
                    width="61"
                    height="61"
                    viewBox="0 0 61 61"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M61 30.4876L30.5124 0L0 30.4876L30.5124 61L61 30.4876ZM30.5124 8.10704L41.7354 19.3468C38.0588 18.3581 34.2772 17.8501 30.4976 17.8501C26.7018 17.8467 22.9225 18.3499 19.2598 19.3465L30.5124 8.10704ZM20.517 42.8565C23.577 41.1667 27.0168 40.2839 30.5124 40.2912C34.0659 40.2912 37.4785 41.1848 40.5076 42.8565L30.5124 52.852L20.517 42.8565ZM44.6761 38.6883C40.4396 35.9895 35.5207 34.5565 30.4976 34.5577C25.4738 34.5549 20.5539 35.988 16.3175 38.6883L8.44969 30.8202C14.8128 26.1456 22.4725 23.6082 30.5238 23.6082C38.5754 23.6082 46.2266 26.1292 52.598 30.8205L44.6761 38.6883Z"
                      fill="#73CC58"
                    />
                  </svg>
                </div>

                {/* Title */}
                <div className="h-52 flex items-center ">
                  <h3 className="text-lg font-medium text-gray-900 leading-tight text-center max-w-full">
                    {benefit.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExpertDetail;
