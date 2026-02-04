"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { CheckCircle, ArrowRight, ShieldCheck, Clock, FileText, Monitor, PenTool, Building } from "lucide-react";

export default function RegisterCompanyInfoPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />

      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="lg:max-w-lg">
                <p className="text-base font-semibold leading-7 text-indigo-600">
                  Digital Incorporation
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Register your Sdn Bhd Company in Malaysia Online
                </h1>
                <p className="mt-6 text-xl leading-8 text-gray-700">
                  Experience a seamless, 100% digital company registration process. 
                  No paperwork, no hidden fees, and fully compliant with SSM verification.
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  <Link
                    href="/register-your-company"
                    className="rounded-md bg-[#0e2a6d] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#002f70] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Start Registration Now
                  </Link>
                  <Link href="/how-it-works" className="text-sm font-semibold leading-6 text-gray-900 flex items-center gap-1">
                    Learn more <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="-ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
             {/* Abstract visual/placeholder */}
            <div className="bg-gray-100 rounded-xl p-8 aspect-square flex flex-col items-center justify-center border border-gray-200 text-center">
               <Monitor className="h-16 w-16 text-indigo-200 mb-4" />
               <span className="text-gray-500 font-medium">Digital Dashboard Preview</span>
               <span className="text-xs text-gray-400 mt-2">Manage your company entirely online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Simple Process</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              How to Register Your Company
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
                We have simplified the complex incorporation process into 4 easy steps.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
              
              <div className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-gray-900 flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <CheckCircle className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Step 1: Name Check
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">Proposed your verified company name. We check availability with SSM instantly.</p>
                </dd>
              </div>

              <div className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-gray-900 flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <FileText className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Step 2: Details
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">Fill in director and shareholder details. Upload IC/Passport copies securely.</p>
                </dd>
              </div>

              <div className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-gray-900 flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <PenTool className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Step 3: e-Sign
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">Sign all statutory documents digitally. No need to visit any office.</p>
                </dd>
              </div>

              <div className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-gray-900 flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <Building className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Step 4: Approval
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">Receive your Certificate of Incorporation (Form 9) via email within 3-5 days.</p>
                </dd>
              </div>

            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
