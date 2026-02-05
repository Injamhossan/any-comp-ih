"use client";

import React, { useEffect, useState } from "react";
import { Search, FileSignature, Clock, CheckCircle, AlertCircle, Upload, MoreVertical, Eye, Loader2 } from "lucide-react";

interface ESignatureDocument {
  id: string;
  title: string;
  sentDate: string;
  status: string;
  signatoriesCount: number;
  signedCount: number;
  user: {
      name: string;
  };
}

export default function ESignaturePage() {
  const [documents, setDocuments] = useState<ESignatureDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/documents')
      .then(res => res.json())
      .then(data => {
         if (data.success) {
            setDocuments(data.data);
         }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status: string) => {
      switch(status) {
          case 'COMPLETED': return (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                  <CheckCircle className="h-3 w-3" /> Completed
              </span>
          );
          case 'PENDING': return (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                  <Clock className="h-3 w-3" /> Pending
              </span>
          );
          case 'EXPIRED': return (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                  <AlertCircle className="h-3 w-3" /> Expired
              </span>
          );
          default: return null;
      }
  };

  const pendingCount = documents.filter(d => d.status === 'PENDING').length;
  const completedCount = documents.filter(d => d.status === 'COMPLETED').length;

  return (
    <div className="flex-1 bg-white min-h-screen font-sans text-gray-900 px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">E-Signatures</h1>
           <p className="mt-1 text-sm text-gray-500">Manage digital document signing.</p>
        </div>
        <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-4 py-2 bg-[#0e2a6d] text-white rounded-lg text-sm font-medium hover:bg-[#001f52]">
                 <Upload className="h-4 w-4" /> Upload Document
             </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                      <Clock className="h-6 w-6" />
                  </div>
                  <div>
                      <div className="text-2xl font-bold text-gray-900">{pendingCount}</div>
                      <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Pending Signature</div>
                  </div>
              </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                      <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                      <div className="text-2xl font-bold text-gray-900">{completedCount}</div>
                      <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Completed</div>
                  </div>
              </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
             <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                      <FileSignature className="h-6 w-6" />
                  </div>
                  <div>
                      <div className="text-2xl font-bold text-gray-900">{documents.length}</div>
                      <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Documents</div>
                  </div>
              </div>
          </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50/50">
             <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                 <input 
                    type="text" 
                    placeholder="Search documents..."
                    className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                 />
             </div>
          </div>
          
          {loading ? (
             <div className="flex justify-center p-12"><Loader2 className="animate-spin text-gray-400 h-8 w-8"/></div>
          ) : (
          <table className="min-w-full divide-y divide-gray-200">
             <thead className="bg-gray-50">
                 <tr>
                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Name</th>
                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Sent</th>
                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Signatories</th>
                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                     <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                 </tr>
             </thead>
             <tbody className="bg-white divide-y divide-gray-200">
                 {documents.length > 0 ? (
                    documents.map((doc) => (
                     <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                         <td className="px-6 py-4 whitespace-nowrap">
                             <div className="flex items-center gap-3">
                                 <FileSignature className="h-5 w-5 text-gray-400" />
                                 <span className="text-sm font-bold text-gray-900">{doc.title}</span>
                             </div>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap">
                             <span className="text-sm text-gray-600">{doc.user?.name || "Unknown"}</span>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                             {new Date(doc.sentDate).toLocaleDateString()}
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                             {doc.signedCount}/{doc.signatoriesCount}
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap">
                             {getStatusBadge(doc.status)}
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-right">
                             <div className="flex items-center justify-end gap-2">
                                 <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                     <Eye className="h-4 w-4" />
                                 </button>
                                 <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                     <MoreVertical className="h-4 w-4" />
                                 </button>
                             </div>
                         </td>
                     </tr>
                    ))
                 ) : (
                     <tr>
                         <td colSpan={6} className="p-12 text-center text-gray-500">No documents found.</td>
                     </tr>
                 )}
             </tbody>
          </table>
          )}
      </div>
    </div>
  );
}
