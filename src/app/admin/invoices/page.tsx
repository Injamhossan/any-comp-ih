"use client";

import React, { useEffect, useState } from "react";
import { Search, Download, Plus, Filter, MoreHorizontal, FileText, Loader2 } from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: string;
  issuedDate: string;
  dueDate: string;
  user: {
      name: string;
  };
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/invoices')
      .then(res => res.json())
      .then(data => {
         if (data.success) {
            setInvoices(data.data);
         }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusStyle = (status: string) => {
      switch(status) {
          case 'PAID': return "bg-green-100 text-green-700 border-green-200";
          case 'PENDING': return "bg-yellow-100 text-yellow-700 border-yellow-200";
          case 'OVERDUE': return "bg-red-100 text-red-700 border-red-200";
          default: return "bg-gray-100 text-gray-700 border-gray-200";
      }
  };

  const filteredInvoices = invoices.filter(inv => 
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (inv.user && inv.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex-1 bg-white min-h-screen font-sans text-gray-900 px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Invoices & Receipts</h1>
           <p className="mt-1 text-sm text-gray-500">Track payments and manage billing.</p>
        </div>
        <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                 <Filter className="h-4 w-4" /> Filter
             </button>
             <button className="flex items-center gap-2 px-4 py-2 bg-[#0e2a6d] text-white rounded-lg text-sm font-medium hover:bg-[#001f52]">
                 <Plus className="h-4 w-4" /> Create Invoice
             </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
             <div className="relative max-w-sm w-full">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                 <input 
                    type="text" 
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                 />
             </div>
             <div className="text-sm text-gray-500">
                 Showing <span className="font-semibold text-gray-900">{filteredInvoices.length}</span> results
             </div>
          </div>
          
          {loading ? (
              <div className="flex justify-center p-12"><Loader2 className="animate-spin text-gray-400 h-8 w-8"/></div>
          ) : (
          <table className="min-w-full divide-y divide-gray-200">
             <thead className="bg-gray-50">
                 <tr>
                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Details</th>
                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Issued</th>
                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                     <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                 </tr>
             </thead>
             <tbody className="bg-white divide-y divide-gray-200">
                 {filteredInvoices.length > 0 ? (
                    filteredInvoices.map((inv) => (
                     <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                         <td className="px-6 py-4 whitespace-nowrap">
                             <div className="flex items-center gap-3">
                                 <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                     <FileText className="h-5 w-5" />
                                 </div>
                                 <div>
                                     <div className="text-sm font-bold text-gray-900">{inv.invoiceNumber}</div>
                                     <div className="text-xs text-gray-500">Service Fee</div>
                                 </div>
                             </div>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap">
                             <div className="text-sm font-medium text-gray-900">{inv.user?.name || "Unknown"}</div>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap">
                             <div className="text-sm text-gray-900">{new Date(inv.issuedDate).toLocaleDateString()}</div>
                             {inv.dueDate && (
                                <div className="text-xs text-gray-500">Due: {new Date(inv.dueDate).toLocaleDateString()}</div>
                             )}
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap">
                             <div className="text-sm font-bold text-gray-900">RM {Number(inv.amount).toLocaleString()}</div>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap">
                             <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusStyle(inv.status)}`}>
                                 {inv.status}
                             </span>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-right">
                             <div className="flex items-center justify-end gap-2">
                                 <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Download">
                                     <Download className="h-4 w-4" />
                                 </button>
                                 <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                     <MoreHorizontal className="h-4 w-4" />
                                 </button>
                             </div>
                         </td>
                     </tr>
                    ))
                 ) : (
                     <tr>
                         <td colSpan={6} className="p-12 text-center text-gray-500">No invoices found.</td>
                     </tr>
                 )}
             </tbody>
          </table>
          )}
      </div>
    </div>
  );
}
