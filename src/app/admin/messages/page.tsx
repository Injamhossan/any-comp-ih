"use client";

import React, { useEffect, useState } from "react";
import { Search, Mail, Star, Trash2, Archive, Reply, MoreVertical, Send, Loader2 } from "lucide-react";

interface Message {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/messages')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMessages(data.data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const activeMessage = messages.find(m => m.id === activeMessageId);

  return (
    <div className="flex bg-white h-[calc(100vh-64px)] overflow-hidden">
      {/* Sidebar / Message List */}
      <div className="w-full md:w-80 lg:w-96 border-r border-gray-200 flex flex-col bg-white">
        <div className="p-4 border-b border-gray-200">
           <h1 className="text-xl font-bold text-gray-900 mb-4">Messages</h1>
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
             <input type="text" placeholder="Search messages" className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
            {loading ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin text-gray-400 h-6 w-6"/></div>
            ) : messages.length === 0 ? (
                <div className="text-center p-8 text-gray-500 text-sm">No messages found.</div>
            ) : (
                messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        onClick={() => setActiveMessageId(msg.id)}
                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${activeMessageId === msg.id ? "bg-indigo-50 border-l-4 border-l-indigo-600" : "border-l-4 border-l-transparent"} ${!msg.isRead ? "bg-blue-50/30" : ""}`}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className={`text-sm font-semibold text-gray-900 ${!msg.isRead ? "font-bold" : ""}`}>{msg.senderName}</span>
                            <span className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className={`text-sm text-gray-800 mb-1 ${!msg.isRead ? "font-semibold" : ""}`}>{msg.subject}</div>
                        <div className="text-xs text-gray-500 line-clamp-2">{msg.content}</div>
                    </div>
                ))
            )}
        </div>
      </div>

      {/* Main Content / Message Detail */}
      <div className="hidden md:flex flex-1 flex-col bg-gray-50">
         {activeMessage ? (
             <>
                {/* Message Header */}
                <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6">
                    <div className="flex items-center gap-3">
                        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><Archive className="h-5 w-5"/></button>
                        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><Trash2 className="h-5 w-5"/></button>
                        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><Star className="h-5 w-5"/></button>
                    </div>
                </div>

                {/* Message Body */}
                <div className="flex-1 overflow-y-auto p-8">
                     <div className="flex items-center gap-4 mb-8">
                         <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                             {activeMessage.senderName.charAt(0)}
                         </div>
                         <div>
                             <h2 className="text-lg font-bold text-gray-900">{activeMessage.subject}</h2>
                             <div className="flex items-center gap-2 text-sm text-gray-500">
                                 <span>{activeMessage.senderName}</span>
                                 <span>&lt;{activeMessage.senderEmail}&gt;</span>
                             </div>
                         </div>
                     </div>
                     
                     <div className="prose max-w-none text-gray-800 text-sm leading-relaxed whitespace-pre-line bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                        {activeMessage.content}
                     </div>
                </div>

                {/* Reply Area */}
                <div className="p-6 bg-white border-t border-gray-200">
                    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                        <textarea className="w-full p-4 text-sm focus:outline-none resize-none" rows={3} placeholder="Type your reply..."></textarea>
                        <div className="bg-gray-50 p-2 flex justify-between items-center border-t border-gray-100">
                            <div className="flex gap-2"></div>
                            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-indigo-700">
                                <Send className="h-4 w-4" /> Send
                            </button>
                        </div>
                    </div>
                </div>
             </>
         ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                 <Mail className="h-16 w-16 mb-4 opacity-50" />
                 <p className="text-lg font-medium">Select a message to view</p>
             </div>
         )}
      </div>
    </div>
  );
}
