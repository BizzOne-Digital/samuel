'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQ {
  _id: string;
  question: string;
  answer: string;
}

export default function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={faq._id}
          className="border-2 border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:border-emerald-600"
        >
          <button
            onClick={() => toggleFAQ(index)}
            className="w-full px-6 py-4 flex items-center justify-between text-left bg-white hover:bg-gray-50 transition-colors"
          >
            <span className="text-lg font-semibold text-gray-900 pr-4">
              {faq.question}
            </span>
            <ChevronDown
              className={`w-6 h-6 text-emerald-700 transition-transform duration-300 flex-shrink-0 ${
                openIndex === index ? 'transform rotate-180' : ''
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              openIndex === index ? 'max-h-96' : 'max-h-0'
            }`}
          >
            <div className="px-6 py-4 bg-gray-50 border-t-2 border-gray-200">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {faq.answer}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
