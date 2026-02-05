"use client";

import { useAuth } from "@/context/AuthContext";
import { Building2, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetch(`/api/specialists?email=${encodeURIComponent(user.email)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data && data.data.length > 0) {
            setService(data.data[0]);
          }
        })
        .finally(() => setLoading(false));
    } else {
        setLoading(false);
    }
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.displayName?.split(" ")[0] || "User"}!
        </h1>
        <p className="text-gray-500 text-sm mt-1">Here is an overview of your account.</p>
      </div>

      {/* Quick Actions / Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Render Service Card or "Register Company" CTA */}
        {loading ? (
           <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm animate-pulse h-[200px]"></div>
        ) : service ? (
           <Link href="/dashboard/services/create" className="col-span-1 md:col-span-2 lg:col-span-1 block group">
               <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden h-full flex flex-col">
                   <div className="relative h-40 bg-gray-100 w-full overflow-hidden">
                       {service.media?.[0]?.url ? (
                           <img src={service.media[0].url} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                       ) : (
                           <div className="flex h-full w-full items-center justify-center text-gray-300">
                               <span className="text-xl font-medium">No Image</span>
                           </div>
                       )}
                   </div>
                   <div className="p-5 flex flex-col flex-1">
                       <div className="flex items-center gap-2 mb-2">
                          <div className="h-6 w-6 rounded-full bg-gray-100 overflow-hidden relative">
                             {service.avatar_url ? (
                                 <img src={service.avatar_url} className="object-cover h-full w-full" />
                             ) : (
                                 <div className="bg-blue-100 h-full w-full"></div>
                             )}
                          </div>
                          <span className="text-xs font-semibold text-gray-600 truncate">{service.secretary_name || "Specialist"}</span>
                       </div>
                       <h3 className="font-bold text-gray-900 line-clamp-2 min-h-[48px] mb-2 group-hover:text-blue-700 transition-colors">
                           {service.title}
                       </h3>
                       <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                           <div className="flex flex-col">
                               <span className="text-lg font-bold text-gray-900">RM {service.base_price.toLocaleString()}</span>
                               <span className="text-xs text-gray-500 font-medium mt-0.5">{service.purchase_count || 0} Sales</span>
                           </div>
                           <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 group-hover:bg-[#0e2a6d] group-hover:text-white transition-colors h-fit">Edit</span>
                       </div>
                   </div>
               </div>
           </Link>
        ) : (
            /* Card 1: Register Company (Only if no service) or maybe keep both? */
            /* Actually, user said their service should show here. */
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
               <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center mb-4">
               <Plus className="h-5 w-5 text-blue-600" />
               </div>
               <h3 className="text-lg font-semibold text-gray-900">Create Service</h3>
               <p className="text-sm text-gray-500 mt-2 mb-4">List your company secretarial services.</p>
               <Link href="/dashboard/services/create" className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
               Get Started <ArrowRight className="h-4 w-4" />
               </Link>
            </div>
        )}

        {/* Card 2: My Companies */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
           <div className="h-10 w-10 bg-purple-50 rounded-full flex items-center justify-center mb-4">
              <Building2 className="h-5 w-5 text-purple-600" />
           </div>
           <h3 className="text-lg font-semibold text-gray-900">My Companies</h3>
           <p className="text-sm text-gray-500 mt-2 mb-4">View and manage your registered companies.</p>
           <Link href="/dashboard/companies" className="text-purple-600 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View All <ArrowRight className="h-4 w-4" />
           </Link>
        </div>
      </div>

      {/* Recent Activity (Placeholder) */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-8 text-center text-gray-500 text-sm">
             <div className="inline-block p-4 rounded-full bg-gray-50 mb-3">
                 <Building2 className="h-8 w-8 text-gray-300" />
             </div>
             <p>No recent activity found.</p>
          </div>
      </div>
    </div>
  );
}
