"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Search, Building2, User, MoreHorizontal, CheckCircle, XCircle, Clock } from "lucide-react";
import Image from "next/image";

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch('/api/admin/clients')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setClients(data.data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
      // Optimistic update
      setClients(clients.map(c => c.id === id ? { ...c, status: newStatus } : c));

      try {
          const res = await fetch('/api/admin/clients', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id, status: newStatus })
          });
          const data = await res.json();
          if (!data.success) {
              // Revert if failed
              alert("Failed to update status");
              // Ideally re-fetch or revert state here
          }
      } catch (err) {
          console.error(err);
      }
  };

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'APPROVED': return "bg-green-100 text-green-800";
          case 'REJECTED': return "bg-red-100 text-red-800";
          case 'IN_PROGRESS': return "bg-blue-100 text-blue-800";
          case 'ACTION_REQUIRED': return "bg-orange-100 text-orange-800";
          default: return "bg-yellow-100 text-yellow-800";
      }
  };

  const filteredClients = clients.filter(c => 
      c.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 bg-white min-h-screen font-sans text-gray-900 px-6 py-8">
      {/* ... Header ... */}
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
           <p className="mt-1 text-sm text-gray-500">Manage your Company Registrations.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-2">
           <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
               <input 
                  type="text" 
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:border-indigo-500 focus:ring-indigo-500"
               />
           </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {loading ? (
             <div className="flex justify-center p-12"><Loader2 className="animate-spin text-gray-400 h-8 w-8"/></div>
        ) : filteredClients.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center overflow-hidden relative">
                        {client.companyLogoUrl ? (
                           <Image src={client.companyLogoUrl} alt={client.companyName} fill className="object-cover" />
                        ) : (
                           <Building2 className="h-5 w-5 text-indigo-600" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{client.companyName}</div>
                        <div className="text-xs text-gray-500">ID: {client.id.slice(0,8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden relative">
                           {client.user?.photo_url ? (
                               <Image src={client.user.photo_url} alt="" fill className="object-cover"/>
                           ) : (
                               <User className="h-4 w-4 text-gray-500"/>
                           )}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm text-gray-900">{client.user?.name || "Unknown"}</div>
                        <div className="text-xs text-gray-500">{client.user?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{client.companyType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select 
                        value={client.status}
                        onChange={(e) => handleStatusUpdate(client.id, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded-full border-none focus:ring-2 focus:ring-indigo-500 cursor-pointer ${getStatusColor(client.status)}`}
                    >
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="ACTION_REQUIRED">Action Required</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(client.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900">
                        <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-gray-500 text-sm">
             No clients found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
