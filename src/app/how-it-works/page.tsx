"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Image from "next/image";
import Link from "next/link";
import { Search, UserPlus, CreditCard, Rocket } from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      id: 1,
      title: "Search & Select",
      description: "Browse our curated list of Company Secretaries. Filter by price, rating, or location to find your perfect match.",
      icon: <Search className="h-8 w-8 text-indigo-600" />
    },
    {
      id: 2,
      title: "Create Account",
      description: "Sign up and complete your e-KYC verification. Our secure platform ensures your data stays safe.",
      icon: <UserPlus className="h-8 w-8 text-indigo-600" />
    },
    {
      id: 3,
      title: "Make Payment",
      description: "Pay the service fee securely online. We hold your payment in escrow until the job is confirmed.",
      icon: <CreditCard className="h-8 w-8 text-indigo-600" />
    },
    {
      id: 4,
      title: "Company Registered!",
      description: "Your specialist processes the documents with SSM. Receive your registration certificate digitally.",
      icon: <Rocket className="h-8 w-8 text-indigo-600" />
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />

      <main>
        {/* Header */}
        <div className="bg-white pt-24 pb-12 sm:pt-32 text-center px-6">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
            How Anycomp Works
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From finding a specialist to getting your company registered, we've simplified the entire corporate secretarial process.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-32">
           <div className="relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden lg:block absolute top-[60px] left-[10%] right-[10%] h-0.5 bg-gray-200 -z-10"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                 {steps.map((step) => (
                    <div key={step.id} className="flex flex-col items-center text-center bg-white">
                        <div className="h-32 w-32 rounded-full bg-indigo-50 flex items-center justify-center mb-6 border-4 border-white shadow-sm">
                           {step.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                        <p className="text-gray-500 leading-relaxed text-sm">
                           {step.description}
                        </p>
                    </div>
                 ))}
              </div>
           </div>

           <div className="mt-24 text-center">
              <Link href="/" className="rounded-full bg-black px-10 py-4 text-base font-bold text-white shadow-lg hover:bg-gray-800 transition transform hover:-translate-y-1">
                  Start Now
              </Link>
           </div>
        </div>
      </main>
    </div>
  );
}
