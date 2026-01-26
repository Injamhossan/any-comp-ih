"use client";

import React from "react";
import Image from "next/image";
import { Upload, ChevronRight, Check } from "lucide-react";

export default function CreateSpecialistPage() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto px-6 py-8">
        {/* Breadcrumb - Optional but good for UX */}
        <div className="mb-6 flex items-center text-xs text-gray-500 gap-1">
            <span>Specialists</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-900 font-medium">Create New</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left Column) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Title Section */}
            <div>
                 <h1 className="text-2xl font-semibold text-gray-900">
                    Register a new company | Private Limited - Sdn Bhd
                </h1>
            </div>

            {/* Image Grid Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-96">
                {/* Main Large Upload Area */}
                <div className="md:col-span-1 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-300 hover:border-blue-500 cursor-pointer transition-colors relative h-full">
                     <div className="h-12 w-12 text-gray-400 mb-3">
                        <Upload className="h-full w-full" />
                     </div>
                     <p className="text-xs text-gray-500">
                        Upload an image for your service listing in PNG, JPG or JPEG up to 4MB
                     </p>
                </div>

                {/* Right Side Stacked Images (Static Mocks based on screenshot) */}
                <div className="md:col-span-1 grid grid-rows-2 gap-4 h-full">
                    <div className="relative rounded-lg overflow-hidden bg-gray-200">
                         <Image 
                            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600"
                            alt="Secretary"
                            fill
                            className="object-cover"
                         />
                         <div className="absolute top-4 right-4 text-white text-right font-bold text-shadow">
                             <div className="text-2xl">10 Best Company</div>
                             <div className="text-xl">Secretarial in</div>
                             <div className="text-xl">Johor Bahru</div>
                         </div>
                    </div>
                     <div className="relative rounded-lg overflow-hidden bg-gray-200">
                         <div className="absolute inset-0 flex items-center p-6 bg-gradient-to-r from-gray-100 to-transparent z-10">
                            <div>
                                <h3 className="font-bold text-gray-900">A Company Secretary</h3>
                                <p className="text-xs text-gray-600">Represents a Key Role<br/> In Any Business.<br/> This is Why</p>
                            </div>
                         </div>
                         <Image 
                            src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600"
                            alt="Business Professional"
                            fill
                            className="object-cover"
                         />
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-lg border border-gray-100">
                <h3 className="font-semibold text-lg mb-4 text-gray-900">Description</h3>
                <textarea 
                    className="w-full text-sm text-gray-500 placeholder:text-gray-400 border-none resize-none focus:ring-0" 
                    placeholder="Describe your service here"
                    rows={4}
                ></textarea>
            </div>

            {/* Additional Offerings */}
             <div className="bg-white p-6 rounded-lg border border-gray-100">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Additional Offerings</h3>
                <p className="text-xs text-gray-500 mb-4">Enhance your service by adding additional offerings</p>
                {/* Placeholder for offerings input */}
                <div className="h-10 border-b border-gray-200"></div>
            </div>

            {/* Company Secretary Profile */}
            <div className="bg-white p-6 rounded-lg border border-gray-100">
                <h3 className="font-semibold text-lg mb-6 text-gray-900">Company Secretary</h3>
                
                <div className="flex flex-col md:flex-row gap-8">
                     {/* Left: Profile Info */}
                    <div className="flex items-start gap-4">
                        <div className="relative h-14 w-14 rounded-full overflow-hidden">
                             <Image 
                                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"
                                alt="Grace Lam"
                                fill
                                className="object-cover"
                             />
                        </div>
                        <div>
                             <div className="flex items-center gap-2">
                                 <h4 className="font-bold text-gray-900">Grace Lam</h4>
                                 <Check className="h-3 w-3 text-green-500" />
                                 <span className="text-[10px] bg-green-100 text-green-700 px-1 rounded">Verified</span>
                             </div>
                             <p className="text-[10px] text-gray-500">Corsec Services Sdn Bhd</p>
                             <button className="mt-2 bg-[#0F172A] text-white text-[10px] px-3 py-1 rounded">
                                View Profile
                             </button>
                        </div>
                    </div>

                    {/* Middle: Logos */}
                    <div className="flex-1">
                        <h5 className="text-[10px] font-semibold text-gray-900 mb-2">Certified Company Secretary</h5>
                         <div className="flex items-center gap-3 opacity-70">
                              {/* Using placeholders for specific logos */}
                               <div className="h-6 w-12 bg-gray-200 rounded"></div>
                               <div className="h-6 w-12 bg-gray-200 rounded"></div>
                               <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                         </div>
                    </div>
                </div>

                <div className="mt-6 text-xs text-gray-600 leading-relaxed text-justify">
                    A company secretarial service founded by Grace, who believes that every company deserves clarity, confidence, and care in their compliance journey. Inspired by the spirit of entrepreneurship, Grace treats every client's business as if it were her own — attentive to detail, committed to deadlines and focused on growth. Step into a partnership built on trust, transparency, and professional excellence. Whether you're just starting out or managing a growing company, Grace is here with her corporate governance smooth, secure, and stress-free. Your company's peace of mind starts here.
                </div>
            </div>

          </div>

          {/* Right Sidebar (Sticky) */}
          <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                   {/* Action Buttons */}
                   <div className="flex items-center gap-3 justify-end">
                       <button className="bg-[#0F172A] text-white px-6 py-2 rounded text-xs font-medium hover:bg-gray-800">
                           Edit
                       </button>
                        <button className="bg-[#0e2a6d] text-white px-6 py-2 rounded text-xs font-medium hover:bg-blue-900">
                           Publish
                       </button>
                   </div>

                   {/* Price Card */}
                   <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
                        <h3 className="text-xl font-bold text-gray-900">Professional Fee</h3>
                        <p className="text-xs text-gray-500 mt-1 mb-8">Set a rate for your service</p>

                        <div className="text-center mb-10">
                            <span className="text-4xl font-bold text-gray-900 border-b-2 border-gray-900 pb-1">
                                RM 1,800
                            </span>
                        </div>

                        <div className="space-y-4 text-xs">
                             <div className="flex justify-between text-gray-600">
                                 <span>Base price</span>
                                 <span className="font-medium text-gray-900">RM 1,800</span>
                             </div>
                             <div className="flex justify-between text-gray-600 border-b border-gray-100 pb-4">
                                 <span className="underline decoration-dotted cursor-help">Service processing fee</span>
                                 <span className="font-medium text-gray-900">RM 540</span>
                             </div>
                             <div className="flex justify-between text-gray-600 font-medium pt-1">
                                 <span>Total</span>
                                 <span>RM 2340</span>
                             </div>
                             
                             <div className="pt-6 mt-6 border-t border-gray-100 flex justify-between items-center">
                                 <span className="font-semibold text-gray-900">Your returns</span>
                                 <span className="font-bold text-lg text-gray-900">RM 1,800</span>
                             </div>
                        </div>
                   </div>
              </div>
          </div>

        </div>
      </div>
    </div>
  );
}
