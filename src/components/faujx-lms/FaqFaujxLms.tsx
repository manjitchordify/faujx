'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

const FaqFaujxLms: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqs: FAQ[] = [
    {
      id: 1,
      question: 'What programming languages and technologies do you teach?',
      answer:
        'We offer comprehensive courses in modern programming languages including JavaScript, Python, Java, React, Node.js, and more. Our curriculum covers both frontend and backend technologies, databases, cloud platforms, and emerging technologies like AI/ML. We regularly update our content to match current industry demands.',
    },
    {
      id: 2,
      question: 'What if I already have some programming experience?',
      answer:
        "That's great! Our platform offers courses for all skill levels. You can take our skill assessment to find the right starting point, skip beginner modules, or jump directly into advanced topics. We also offer specialized tracks for experienced developers looking to learn new technologies or frameworks.",
    },
    {
      id: 3,
      question: 'How long does it take to complete a course?',
      answer:
        'Course duration varies depending on the topic and your pace. Most individual courses take 4-8 weeks to complete with 10-15 hours of study per week. Full-stack bootcamps typically run 12-24 weeks. You can learn at your own pace with lifetime access to course materials and progress tracking.',
    },
    {
      id: 4,
      question: 'Do you provide mentorship and career support?',
      answer:
        'Absolutely! Every student gets access to experienced mentors who provide code reviews, career guidance, and technical support. We also offer resume building, interview preparation, portfolio reviews, and job placement assistance. Our career services team helps connect you with hiring partners.',
    },
  ];

  const toggleItem = (id: number) => {
    setOpenItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const isOpen = (id: number) => openItems.includes(id);

  return (
    <section id="faq-faujxlms" className="py-10 px-6 bg-[#FCF8FD]">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-medium text-gray-800 mb-6">
            Frequently asked questions
          </h2>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
            Here are the top questions our clients ask before getting started.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden "
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
              >
                <h3 className="text-lg md:text-xl  text-gray-800 pr-8">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: isOpen(faq.id) ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <div className="w-8 h-8 rounded-full bg-[#BC90F4] flex items-center justify-center">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                </motion.div>
              </button>

              <AnimatePresence>
                {isOpen(faq.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-6">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqFaujxLms;
