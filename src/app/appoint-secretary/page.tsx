"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { UserCheck, Award, Briefcase, ArrowRight } from "lucide-react";

export default function AppointSecretaryPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />

      <main>
        {/* Header */}
        <div className="bg-white px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Appoint a Company Secretary</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Ensure your company remains compliant with Malaysian law. Appoint a qualified, licensed company secretary today.
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                  <h3 className="text-2xl font-bold mb-4">Why is a Company Secretary Mandatory?</h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    Under the Companies Act 2016, every Sdn Bhd company in Malaysia must appoint at least one qualified Company Secretary within 30 days of incorporation. The secretary acts as the official liaison between your company and the Companies Commission of Malaysia (SSM).
                  </p>
                  
                  <h3 className="text-2xl font-bold mb-4">Roles & Responsibilities</h3>
                  <ul className="space-y-4 mb-8">
                     <li className="flex items-start gap-3">
                        <div className="mt-1 bg-green-100 p-1 rounded-full">
                           <UserCheck className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-gray-600">Advising the Board on statutory requirements.</span>
                     </li>
                     <li className="flex items-start gap-3">
                        <div className="mt-1 bg-green-100 p-1 rounded-full">
                           <Award className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-gray-600">Maintain statutory books and registers.</span>
                     </li>
                     <li className="flex items-start gap-3">
                        <div className="mt-1 bg-green-100 p-1 rounded-full">
                           <Briefcase className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-gray-600">Filing annual returns and financial statements to SSM.</span>
                     </li>
                  </ul>
                  
                  <div className="flex gap-4">
                     <Link href="/" className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition">
                        Find a Secretary
                     </Link>
                  </div>
              </div>
              
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                  <h4 className="text-xl font-bold mb-6">Switch to Anycomp</h4>
                  <p className="text-gray-600 mb-8">
                      Already have a company but unhappy with your current secretary? Switching is easy.
                  </p>
                  
                  <div className="space-y-6">
                      <div className="flex gap-4">
                          <span className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm flex-none">1</span>
                          <div>
                              <h5 className="font-bold">Register an Account</h5>
                              <p className="text-sm text-gray-500">Sign up on Anycomp platform.</p>
                          </div>
                      </div>
                      <div className="flex gap-4">
                          <span className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm flex-none">2</span>
                          <div>
                              <h5 className="font-bold">Select 'Appoint Secretary'</h5>
                              <p className="text-sm text-gray-500">Choose a new localized specialist.</p>
                          </div>
                      </div>
                      <div className="flex gap-4">
                          <span className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm flex-none">3</span>
                          <div>
                              <h5 className="font-bold">We Handle the Transfer</h5>
                              <p className="text-sm text-gray-500">Wait for the resolution to be passed. Done!</p>
                          </div>
                      </div>
                  </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
