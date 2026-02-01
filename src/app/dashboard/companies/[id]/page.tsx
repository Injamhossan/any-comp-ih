"use client";

import { useAuth } from "@/context/AuthContext";
import { Building2, Loader2, Save, ArrowLeft, Trash2, Camera, Upload } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export default function EditCompanyPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
      companyName: "",
      companyType: "",
      companyLogoUrl: "",
      status: ""
  });

  useEffect(() => {
    if (id) {
        fetch(`/api/companies/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setFormData({
                        companyName: data.data.companyName,
                        companyType: data.data.companyType || "Private Limited",
                        companyLogoUrl: data.data.companyLogoUrl || "",
                        status: data.data.status
                    });
                } else {
                    alert("Company not found");
                    router.push("/dashboard/companies");
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }
  }, [id, router]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);
      const data = new FormData();
      data.append("file", file);

      try {
          const res = await fetch("/api/upload", {
              method: "POST",
              body: data
          });
          const result = await res.json();
          
          if (result.success) {
              setFormData(prev => ({ ...prev, companyLogoUrl: result.url }));
          } else {
              alert("Upload failed: " + (result.error || "Unknown error"));
          }
      } catch (err) {
          console.error(err);
          alert("Error uploading logo");
      } finally {
          setUploading(false);
      }
  };

  const handleSave = async () => {
      setSaving(true);
      try {
          const res = await fetch(`/api/companies/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  companyName: formData.companyName,
                  companyType: formData.companyType,
                  companyLogoUrl: formData.companyLogoUrl
              })
          });
          const data = await res.json();

          if (data.success) {
              alert("Company updated successfully!");
              router.push("/dashboard/companies");
              router.refresh();
          } else {
              alert("Failed to update: " + data.message);
          }
      } catch (error) {
          console.error(error);
          alert("An error occurred.");
      } finally {
          setSaving(false);
      }
  };

  if (loading) {
      return (
          <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
          </div>
      );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
       <div className="flex items-center gap-4">
           <Link href="/dashboard/companies" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
               <ArrowLeft className="h-5 w-5 text-gray-500" />
           </Link>
           <div>
               <h1 className="text-2xl font-bold text-black">Edit Company</h1>
               <p className="text-gray-500 text-sm mt-1">Update registration details for {formData.companyName}</p>
           </div>
       </div>

       <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
           <div className="p-6 border-b border-gray-100 flex justify-between items-center">
               <h3 className="text-lg font-semibold text-black">Company Information</h3>
               <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                   formData.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                   formData.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                   'bg-yellow-100 text-yellow-700'
               }`}>
                   {formData.status}
               </span>
           </div>
           
           <div className="p-6 space-y-8">
                {/* Logo Section */}
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <div className="h-28 w-28 rounded-xl bg-gray-50 overflow-hidden border-2 border-dashed border-gray-300 relative flex items-center justify-center">
                            {formData.companyLogoUrl ? (
                                <Image src={formData.companyLogoUrl} alt="Logo" fill className="object-contain p-2" />
                            ) : (
                                <div className="text-center p-2">
                                     <Building2 className="h-8 w-8 text-gray-300 mx-auto mb-1" />
                                     <span className="text-[10px] text-gray-400">No Logo</span>
                                </div>
                            )}
                            {uploading && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                                </div>
                            )}
                        </div>
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute -bottom-2 -right-2 p-2 bg-white rounded-full shadow-md border border-gray-200 text-gray-600 hover:text-blue-600 transition-colors z-10"
                        >
                            <Camera className="h-4 w-4" />
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleLogoUpload} 
                            className="hidden" 
                            accept="image/*"
                        />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-black">Company Logo</h4>
                        <p className="text-xs text-gray-500 mt-1 max-w-[200px]">Upload your company logo. Appears on invoices and documents.</p>
                        <button 
                           onClick={() => fileInputRef.current?.click()}
                           className="mt-3 text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                            <Upload className="h-3 w-3" /> Upload New
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-black mb-1">Company Name</label>
                        <input 
                            type="text" 
                            value={formData.companyName}
                            onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                            className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm text-black font-medium px-4 py-2.5"
                            placeholder="Enter company name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-black mb-1">Company Type</label>
                        <select 
                            value={formData.companyType}
                            onChange={(e) => setFormData({...formData, companyType: e.target.value})}
                            className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm text-black font-medium px-4 py-2.5"
                        >
                            <option value="Private Limited">Private Limited (Sdn. Bhd.)</option>
                            <option value="Sole Proprietorship">Sole Proprietorship</option>
                            <option value="Limited Liability Partnership">Limited Liability Partnership (PLT)</option>
                        </select>
                    </div>
                </div>
           </div>
           
           <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
               <button className="text-red-500 text-sm font-medium flex items-center gap-2 hover:text-red-700 transition-colors px-3 py-2 rounded-lg hover:bg-red-50">
                   <Trash2 className="h-4 w-4" /> Delete Registration
               </button>
               
               <button 
                  onClick={handleSave}
                  disabled={saving || uploading}
                  className="bg-[#0e2a6d] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#002f70] disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-blue-900/10 transition-all active:scale-95"
               >
                   {saving && <Loader2 className="h-4 w-4 animate-spin"/>}
                   Save Changes
               </button>
           </div>
       </div>
    </div>
  );
}
