"use client";

import { MessageSquare, Search } from "lucide-react";
import React from "react";

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
           <p className="text-gray-500 text-sm mt-1">Communicate with your company specialists.</p>
        </div>
      </div>

      {/* Main Messages Area */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden flex h-[calc(100vh-220px)] min-h-[500px]">
          {/* Sidebar - Contacts */}
          <div className="w-80 border-r border-gray-100 flex flex-col bg-gray-50/30">
              <div className="p-6 border-b border-gray-100 bg-white">
                  <h3 className="font-bold text-gray-900 mb-4">Conversations</h3>
                  <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input 
                          type="text" 
                          placeholder="Search chats..." 
                          className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                      />
                  </div>
              </div>
              <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-8 text-center space-y-3">
                   <div className="h-12 w-12 bg-white rounded-full shadow-sm flex items-center justify-center border border-gray-50">
                       <MessageSquare className="h-5 w-5 text-gray-300" />
                   </div>
                   <p className="text-gray-400 text-xs font-medium">No active conversations found.</p>
              </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col bg-white">
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                  <div className="relative mb-8">
                    <div className="h-24 w-24 bg-blue-50 rounded-full flex items-center justify-center">
                       <MessageSquare className="h-10 w-10 text-blue-600 animate-bounce" />
                    </div>
                    <div className="absolute top-0 right-0 h-4 w-4 bg-blue-500 rounded-full border-4 border-white shadow-sm" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Secure Messaging</h3>
                  <p className="text-gray-500 text-base max-w-md mx-auto leading-relaxed">
                    Connect directly with your assigned company secretary or specialist. Get real-time updates and expert guidance.
                  </p>
                  <button className="mt-8 px-8 py-3 bg-[#0e2a6d] text-white rounded-full text-sm font-bold hover:bg-[#002f70] transition-all transform hover:translate-y-[-2px] shadow-lg shadow-blue-900/10">
                    Find a Specialist
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
}
