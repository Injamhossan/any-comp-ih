"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { FileSpreadsheet, Building2, Scale, Calculator, ArrowRight } from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      title: "Company Incorporation",
      description: "End-to-end registration of your Sdn Bhd, LLP or Sole Proprietorship.",
      icon: <Building2 className="h-6 w-6 text-white" />,
      color: "bg-blue-600"
    },
    {
      title: "Secretarial Services",
      description: "Ongoing compliance, resolution drafting, and annual return filing.",
      icon: <FileSpreadsheet className="h-6 w-6 text-white" />,
      color: "bg-purple-600"
    },
    {
      title: "Accounting & Tax",
      description: "Bookkeeping, financial statement preparation, and corporate tax filing.",
      icon: <Calculator className="h-6 w-6 text-white" />,
      color: "bg-green-600"
    },
    {
      title: "Legal Advisory",
      description: "Consultation on agreement drafting, employment laws, and compliance.",
      icon: <Scale className="h-6 w-6 text-white" />,
      color: "bg-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />

      <main className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
         <div className="text-center max-w-2xl mx-auto mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">Our Services</h1>
            <p className="text-lg text-gray-500">
               We offer a comprehensive suite of corporate services to help you manage and grow your business in Malaysia.
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {services.map((service, index) => (
               <div key={index} className="group relative bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
                  <div className={`inline-flex items-center justify-center p-3 rounded-xl ${service.color} mb-6`}>
                     {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                     {service.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                     {service.description}
                  </p>
                  <Link href="/" className="inline-flex items-center text-sm font-semibold text-gray-900 hover:text-indigo-600">
                     Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
               </div>
            ))}
         </div>
         
         <div className="mt-20 bg-gray-900 rounded-3xl p-10 md:p-16 text-center text-white max-w-5xl mx-auto">
             <h2 className="text-3xl font-bold mb-4">Looking for something else?</h2>
             <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                 We also support audit coordination, trademark registration, and visa applications.
             </p>
             <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition">
                 Contact Support
             </button>
         </div>
      </main>
    </div>
  );
}
