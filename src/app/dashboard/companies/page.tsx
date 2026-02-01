"use client";

import { useAuth } from "@/context/AuthContext";
import { Building2, Plus, Loader2, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function MyCompaniesPage() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
        fetch(`/api/user/companies?email=${encodeURIComponent(user.email)}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setCompanies(data.data);
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }
  }, [user]);

  const getStatusBadge = (status: string) => {
      switch(status) {
          case 'APPROVED': return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3"/> Approved</span>;
          case 'REJECTED': return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3"/> Rejected</span>;
          case 'IN_PROGRESS': return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><Loader2 className="w-3 h-3 animate-spin"/> In Progress</span>;
          default: return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3"/> Pending</span>;
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">My Companies</h1>
           <p className="text-gray-500 text-sm mt-1">Manage your registered entities.</p>
        </div>
        <Link 
            href="/register-your-company"
            className="inline-flex items-center justify-center gap-2 bg-[#0e2a6d] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#002f70] transition-colors"
        >
            <Plus className="h-4 w-4" />
            Register New Company
        </Link>
      </div>

      {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
          </div>
      ) : companies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((comp) => (
                  <Link key={comp.id} href={`/dashboard/companies/${comp.id}`} className="block bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer group">
                      <div className="flex items-start justify-between mb-4">
                          <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors overflow-hidden relative border border-blue-100">
                               {comp.companyLogoUrl ? (
                                   <Image src={comp.companyLogoUrl} alt={comp.companyName} fill className="object-contain p-1" />
                               ) : (
                                   <Building2 className="h-6 w-6 text-blue-600" />
                               )}
                          </div>
                          {getStatusBadge(comp.status)}
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg truncate group-hover:text-blue-700 transition-colors" title={comp.companyName}>{comp.companyName}</h3>
                      <p className="text-gray-500 text-sm mt-1">{comp.companyType || "Private Limited"}</p>
                      
                      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                          <span>Applied on:</span>
                          <span>{new Date(comp.createdAt).toLocaleDateString()}</span>
                      </div>
                  </Link>
              ))}
          </div>
      ) : (
          /* Empty State */
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px] flex flex-col items-center justify-center text-center p-8">
              <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                 <Building2 className="h-8 w-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No Companies Found</h3>
              <p className="text-gray-500 text-sm max-w-sm mt-2 mb-6">
                You haven't registered any companies yet. Start your journey by registering your first company with us.
              </p>
              <Link 
                href="/register-your-company"
                className="text-blue-600 font-medium text-sm hover:underline"
              >
                Start Registration &rarr;
              </Link>
          </div>
      )}
    </div>
  );
}
