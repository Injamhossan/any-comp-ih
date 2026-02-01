"use client";

import { PenTool, Search } from "lucide-react";
import React from "react";

export default function ESignaturePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">eSignature</h1>
           <p className="text-gray-500 text-sm mt-1">Manage and sign your digital documents.</p>
        </div>
      </div>

      {/* Filters / Search */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
         <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
                type="text" 
                placeholder="Search documents by name or specialist..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
         </div>
         <div className="flex items-center gap-2 w-full sm:w-auto">
            <select className="flex-1 sm:flex-none pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none bg-no-repeat bg-[right_0.5rem_center] bg-[length:1rem_1rem]">
                <option>All Status</option>
                <option>Pending</option>
                <option>Completed</option>
                <option>Expired</option>
            </select>
         </div>
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[460px] flex flex-col items-center justify-center text-center p-12 transition-all hover:shadow-md">
          <div className="relative mb-6">
              <div className="h-24 w-24 bg-blue-50 rounded-full flex items-center justify-center animate-pulse">
                 <PenTool className="h-10 w-10 text-blue-600" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-8 w-8 bg-white rounded-full shadow-sm flex items-center justify-center border border-gray-50">
                  <div className="h-5 w-5 bg-green-500 rounded-full border-2 border-white" />
              </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Digitally Sign</h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
            Your eSignature documents will appear here. We use bank-grade security to ensure your digital signatures are legally binding and secure.
          </p>
          <button className="mt-8 px-6 py-2.5 bg-[#0e2a6d] text-white rounded-full text-sm font-semibold hover:bg-[#002f70] transition-all transform hover:scale-105 shadow-lg shadow-blue-900/10">
              Refresh Documents
          </button>
      </div>
    </div>
  );
}
