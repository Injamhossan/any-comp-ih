"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  Plus,
  Download,
  MoreVertical,
  Edit,
  Trash,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Interface based on what we send to backend
interface Specialist {
  id: string;
  title: string;
  description: string;
  final_price: number;
  duration_days: number;
  is_draft: boolean;
  created_at: string;
  // properties not fully implemented yet but useful for UI
  purchases?: number;
  approval_status?: string;
  media?: { url: string }[];
}

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);

  const tabs = ["All", "Drafts", "Published"];

  useEffect(() => {
    fetchSpecialists();
  }, []);

  const fetchSpecialists = async () => {
    try {
      const res = await fetch('/api/specialists');
      const data = await res.json();
      if (data.success) {
        setSpecialists(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch specialists", error);
    } finally {
      setLoading(false);
    }
  };



  const deleteSpecialist = async (id: string) => {
      if (!confirm("Are you sure you want to delete this specialist?")) return;
      
      try {
          const res = await fetch(`/api/specialists/${id}`, {
              method: 'DELETE'
          });
          const data = await res.json();
          if (data.success) {
              setSpecialists(prev => prev.filter(s => s.id !== id));
          } else {
              alert("Failed to delete: " + data.message);
          }
      } catch (error) {
          console.error("Delete failed", error);
      }
  };

  const toggleActionMenu = (id: string) => {
    if (openActionId === id) {
      setOpenActionId(null);
    } else {
      setOpenActionId(id);
    }
  };

  const filteredSpecialists = specialists.filter((specialist) => {
    // 1. Filter by Tab
    if (activeTab === "Published" && specialist.is_draft) return false;
    if (activeTab === "Drafts" && !specialist.is_draft) return false;

    // 2. Filter by Search Query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return specialist.title.toLowerCase().includes(query);
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
      <div className="overflow-x-auto min-h-[400px]">
        {loading ? (
           <div className="flex items-center justify-center h-full text-gray-500 text-sm">Loading specialists...</div>
        ) : filteredSpecialists.length === 0 ? (
           <div className="flex items-center justify-center h-full text-gray-500 text-sm py-10">No specialists found.</div>
        ) : (
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
                    <div className="h-8 w-8 rounded-full overflow-hidden relative bg-gray-200">
                         {specialist.media?.[0]?.url ? (
                           <Image
                              src={specialist.media[0].url}
                              alt={specialist.title}
                              fill
                              className="object-cover"
                           />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-500">Img</div>
                         )}
                    </div>
                    <div>
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]" title={specialist.title}>{specialist.title}</div>
                        <div className="text-xs text-gray-500">Company Secretary</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-3 text-sm font-semibold text-gray-700 whitespace-nowrap">
                  RM {specialist.final_price?.toLocaleString() ?? "0"}
                </td>
                <td className="py-4 px-3 text-sm text-gray-600 text-center">
                  {specialist.purchases ?? 0}
                </td>
                <td className="py-4 px-3 text-sm text-gray-600 text-center whitespace-nowrap">
                  {specialist.duration_days} Days
                </td>
                <td className="py-4 px-3 text-center">
                  <span
                    className={`
                      inline-flex items-center rounded px-2 py-0.5 text-xs font-medium
                      ${specialist.approval_status === "Approved" ? "bg-green-100 text-green-700" : "bg-cyan-100 text-cyan-700"}
                    `}
                  >
                    {specialist.approval_status ?? "Under-Review"}
                  </span>
                </td>
                <td className="py-4 px-3 text-center">
                  <span
                    className={`
                      inline-flex items-center rounded px-2 py-0.5 text-xs font-medium text-white
                      ${!specialist.is_draft ? "bg-green-500" : "bg-gray-400"}
                    `}
                  >
                     {specialist.is_draft ? "Draft" : "Published"}
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
                      <button 
                        onClick={() => router.push(`/admin/create-specialist?id=${specialist.id}`)}
                        className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                      >
                        <Edit className="h-4 w-4 text-gray-500" />
                        Edit
                      </button>
                      <div className="border-t border-gray-100"></div>
                      <button 
                        onClick={() => deleteSpecialist(specialist.id)}
                        className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                      >
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
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-8 mb-8 text-sm text-gray-600">
         <button className="flex items-center hover:text-gray-900">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
         </button>
         <div className="flex items-center gap-1 mx-4">
             <button className="w-6 h-6 flex items-center justify-center text-gray-900 font-medium">1</button>
             {/* Pagination logic would go here */}
         </div>
         <button className="flex items-center hover:text-gray-900">
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
         </button>
      </div>
    </div>
  );
}
