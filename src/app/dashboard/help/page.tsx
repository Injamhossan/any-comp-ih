"use client";

import { HelpCircle, Mail, MessageCircle, Phone, ChevronDown } from "lucide-react";
import React, { useState } from "react";

export default function HelpSupportPage() {
  const faqs = [
    {
        question: "How do I register a new company?",
        answer: "You can register a new company by clicking on the 'Create Service' button in the dashboard or by navigating to the 'Company Registration' service page. Follow the step-by-step form to submit your details."
    },
    {
        question: "What documents are required for incorporation?",
        answer: "Typically, you need identification documents (NRIC/Passport) for all directors and shareholders, proof of address, and signed consent forms. Our platform guides you through uploading these securely."
    },
    {
        question: "How long does the process take?",
        answer: "Once all documents are submitted and signed, the registration usually takes 3-5 business days, subject to SSM approval."
    },
    {
        question: "How can I change my company secretary?",
        answer: "You can request a change of company secretary through the 'Services' menu. Select 'Secretary Transfer' and provide the necessary details."
    }
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <div>
         <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
         <p className="text-gray-500 text-sm mt-1">Get assistance with your account or services.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Email Support</h3>
              <p className="text-sm text-gray-500 mt-2 mb-4">Get a response within 24 hours.</p>
              <a href="mailto:support@anycomp.com" className="text-blue-600 font-medium text-sm hover:underline">support@anycomp.com</a>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Live Chat</h3>
              <p className="text-sm text-gray-500 mt-2 mb-4">Chat with our support team.</p>
              <button className="text-green-600 font-medium text-sm hover:underline">Start Chat</button>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <div className="h-12 w-12 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                  <Phone className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Phone Support</h3>
              <p className="text-sm text-gray-500 mt-2 mb-4">Available Mon-Fri, 9am-6pm.</p>
              <a href="tel:+60123456789" className="text-purple-600 font-medium text-sm hover:underline">+60 12-345 6789</a>
          </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mt-8">
          <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Frequently Asked Questions</h3>
          </div>
          <div className="divide-y divide-gray-100">
              {faqs.map((faq, i) => (
                  <div key={i} className="p-6 bg-white hover:bg-gray-50 transition-colors">
                      <button 
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="flex w-full items-center justify-between text-left text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors focus:outline-none"
                      >
                          <span className="text-base">{faq.question}</span>
                          <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${openFaq === i ? 'rotate-180 text-blue-600' : ''}`} />
                      </button>
                      <div 
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === i ? 'max-h-40 mt-3 opacity-100' : 'max-h-0 opacity-0'}`}
                      >
                          <p className="text-sm text-gray-600 leading-relaxed pl-1 border-l-2 border-blue-100 ml-1">
                              {faq.answer}
                          </p>
                      </div>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
}
