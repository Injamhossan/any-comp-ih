"use client";

import { useAuth } from "@/context/AuthContext";
import { Building2, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();

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
        {/* Card 1: Register Company */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
           <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-5 w-5 text-blue-600" />
           </div>
           <h3 className="text-lg font-semibold text-gray-900">Register New Company</h3>
           <p className="text-sm text-gray-500 mt-2 mb-4">Start a new company registration application today.</p>
           <Link href="/register-your-company" className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
              Get Started <ArrowRight className="h-4 w-4" />
           </Link>
        </div>

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
