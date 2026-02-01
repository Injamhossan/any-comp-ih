"use client";

import { Receipt, Search, Download } from "lucide-react";
import React from "react";

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Invoices & Receipts</h1>
           <p className="text-gray-500 text-sm mt-1">View and download your billing history.</p>
        </div>
      </div>

      {/* Filters / Search */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
         <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
                type="text" 
                placeholder="Search by invoice number or service..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
         </div>
         <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2">
                <Download className="h-4 w-4 text-gray-400" /> Export All
            </button>
         </div>
      </div>

      {/* Empty State Table Style */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50/50">
                      <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="bg-white">
                      <tr>
                          <td colSpan={5} className="px-6 py-24 text-center">
                              <div className="flex flex-col items-center justify-center">
                                  <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 ring-8 ring-gray-50/50">
                                     <Receipt className="h-8 w-8 text-gray-300" />
                                  </div>
                                  <h3 className="text-lg font-bold text-gray-900 mb-1">No billing history</h3>
                                  <p className="text-gray-500 text-sm max-w-xs mx-auto">
                                    Your transactions and monthly invoices will be automatically generated here.
                                  </p>
                              </div>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  );
}
