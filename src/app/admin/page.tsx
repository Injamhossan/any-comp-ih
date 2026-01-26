"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Search, 
  Plus, 
  Download, 
  MoreVertical, 
  Edit, 
  Trash, 
  ChevronLeft, 
  ChevronRight,
  Filter
} from "lucide-react";
import Link from "next/link";

const SPECIALISTS = [
  {
    id: 1,
    name: "Adam Low",
    role: "Company Secretary",
    price: "RM 1,600",
    purchases: 20,
    duration: "3 Days",
    approvalStatus: "Approved",
    publishStatus: "Published",
    imageSrc: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100",
  },
  {
    id: 2,
    name: "Jessica Law",
    role: "Company Secretary",
    price: "RM 1,600",
    purchases: 0,
    duration: "1 Day",
    approvalStatus: "Under-Review",
    publishStatus: "Published",
    imageSrc: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100",
  },
  {
    id: 3,
    name: "Stacey Lim",
    role: "Company Secretary",
    price: "RM 2,000",
    purchases: 431,
    duration: "14 Days",
    approvalStatus: "Approved",
    publishStatus: "Published",
    imageSrc: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100",
  },
  {
    id: 4,
    name: "Stacey Lim",
    role: "Company Secretary",
    price: "RM 2,000",
    purchases: 0,
    duration: "7 Days",
    approvalStatus: "Under-Review",
    publishStatus: "Published",
    imageSrc: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=100",
  },
  {
    id: 5,
    name: "Sarah Wong",
    role: "Company Secretary",
    price: "RM 2,000",
    purchases: 1283,
    duration: "4 Days",
    approvalStatus: "Rejected",
    publishStatus: "Not Published",
    imageSrc: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=100",
  },
  {
    id: 6,
    name: "Siddesh A/L",
    role: "Company Secretary",
    price: "RM 2,000",
    purchases: 9180,
    duration: "5 Days",
    approvalStatus: "Rejected",
    publishStatus: "Not Published",
    imageSrc: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=100",
  },
   {
    id: 7,
    name: "Siti Hisham",
    role: "Company Secretary",
    price: "RM 1,600",
    purchases: 24,
    duration: "2 Days",
    approvalStatus: "Approved",
    publishStatus: "Published",
    imageSrc: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=100",
  },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openActionId, setOpenActionId] = useState<number | null>(null);

  const tabs = ["All", "Drafts", "Published"];

  const toggleActionMenu = (id: number) => {
    if (openActionId === id) {
      setOpenActionId(null);
    } else {
      setOpenActionId(id);
    }
  };

  const filteredSpecialists = SPECIALISTS.filter((specialist) => {
    // 1. Filter by Tab
    if (activeTab === "Published" && specialist.publishStatus !== "Published") {
      return false;
    }
    if (activeTab === "Drafts" && specialist.publishStatus === "Published") {
      return false; // Assuming "Drafts" means anything not published
    }

    // 2. Filter by Search Query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        specialist.name.toLowerCase().includes(query) ||
        specialist.role.toLowerCase().includes(query)
      );
    }

    return true;
  });

  return (
    <div className="flex-1 bg-white min-h-screen font-sans text-gray-900 px-6 py-8">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Specialists</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create and publish your services for Client&apos;s & Companies
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab 
                  ? "border-blue-600 text-blue-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}
              `}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search Specialists"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-3 pr-10 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
           <Link href="/admin/create-specialist">
             <button className="w-full flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#0e2a6d] text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-900">
               <Plus className="h-4 w-4" />
               Create
             </button>
           </Link>
           <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#0F172A] text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-800">
             <Download className="h-4 w-4" />
             Export
           </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="py-4 pl-4 pr-3 w-10">
                 <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              </th>
              <th className="py-4 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
              <th className="py-4 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
              <th className="py-4 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Purchases</th>
              <th className="py-4 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Duration</th>
              <th className="py-4 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Approval Status</th>
              <th className="py-4 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Publish Status</th>
              <th className="py-4 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredSpecialists.map((specialist) => (
              <tr key={specialist.id} className="hover:bg-gray-50/50">
                <td className="py-4 pl-4 pr-3">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                </td>
                <td className="py-4 px-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full overflow-hidden relative">
                         <Image 
                            src={specialist.imageSrc} 
                            alt={specialist.name}
                            fill
                            className="object-cover"
                         />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-gray-900">{specialist.name}</div>
                        <div className="text-xs text-gray-500">{specialist.role}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-3 text-sm font-semibold text-gray-700 whitespace-nowrap">
                  {specialist.price}
                </td>
                <td className="py-4 px-3 text-sm text-gray-600 text-center">
                  {specialist.purchases}
                </td>
                <td className="py-4 px-3 text-sm text-gray-600 text-center whitespace-nowrap">
                  {specialist.duration}
                </td>
                <td className="py-4 px-3 text-center">
                  <span
                    className={`
                      inline-flex items-center rounded px-2 py-0.5 text-xs font-medium
                      ${specialist.approvalStatus === "Approved" ? "bg-green-100 text-green-700" : ""}
                      ${specialist.approvalStatus === "Under-Review" ? "bg-cyan-100 text-cyan-700" : ""}
                      ${specialist.approvalStatus === "Rejected" ? "bg-red-100 text-red-700" : ""}
                    `}
                  >
                    {specialist.approvalStatus}
                  </span>
                </td>
                <td className="py-4 px-3 text-center">
                  <span
                    className={`
                      inline-flex items-center rounded px-2 py-0.5 text-xs font-medium text-white
                      ${specialist.publishStatus === "Published" ? "bg-green-500" : "bg-red-600"}
                    `}
                  >
                     {specialist.publishStatus}
                  </span>
                </td>
                <td className="py-4 px-3 text-center relative">
                  <button 
                    onClick={() => toggleActionMenu(specialist.id)}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <MoreVertical className="h-4 w-4 text-gray-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {openActionId === specialist.id && (
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 w-40 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
                      <button className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                        <Edit className="h-4 w-4 text-gray-500" />
                        Edit
                      </button>
                      <div className="border-t border-gray-100"></div>
                      <button className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                        <Trash className="h-4 w-4 text-gray-500" />
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-8 mb-8 text-sm text-gray-600">
         <button className="flex items-center hover:text-gray-900">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
         </button>
         <div className="flex items-center gap-1 mx-4">
             <button className="w-6 h-6 flex items-center justify-center text-gray-900 font-medium">1</button>
             <button className="w-6 h-6 flex items-center justify-center bg-[#0e2a6d] text-white rounded-full text-xs">2</button>
             <button className="w-6 h-6 flex items-center justify-center hover:text-gray-900">3</button>
             <button className="w-6 h-6 flex items-center justify-center hover:text-gray-900">4</button>
             <button className="w-6 h-6 flex items-center justify-center hover:text-gray-900">5</button>
             <span className="text-gray-400">...</span>
             <button className="w-6 h-6 flex items-center justify-center hover:text-gray-900">10</button>
         </div>
         <button className="flex items-center hover:text-gray-900">
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
         </button>
      </div>
    </div>
  );
}
