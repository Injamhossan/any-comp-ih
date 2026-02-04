"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Loader2, ChevronLeft, CheckCircle, Upload, Camera } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function RegisterYourCompanyPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
      companyName: "",
      companyType: "Private Limited (Sdn. Bhd.)", 
      email: "",
      companyLogoUrl: ""
  });
  const [error, setError] = useState("");

  const handleNext = () => {
      if (!formData.companyName) {
          setError("Please enter a company name.");
          return;
      }
      setError("");
      setStep(2);
  };

  useEffect(() => {
      // Check if user already has a company
      if (user?.email) {
          fetch(`/api/user/companies?email=${encodeURIComponent(user.email)}`)
              .then(res => res.json())
              .then(data => {
                  if (data.success && data.data && data.data.length > 0) {
                       // User already has a company, redirect
                       router.replace('/dashboard/companies');
                  }
              })
              .catch(err => console.error(err));
      }
  }, [user, router]);

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
              setError("Logo upload failed: " + (result.error || "Unknown error"));
          }
      } catch (err) {
          console.error(err);
          setError("Error uploading logo");
      } finally {
          setUploading(false);
      }
  };

  const handleSubmit = async () => {
      setSubmitting(true);
      setError("");
      
      try {
          const payload = {
              email: user?.email,
              companyName: formData.companyName,
              companyType: formData.companyType,
              companyLogoUrl: formData.companyLogoUrl
          };

          const res = await fetch('/api/user/companies', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });

          const data = await res.json();

          if (res.ok && data.success) {
               router.push('/dashboard/companies');
          } else {
               setError(data.message || "Registration failed. Please try again.");
          }

      } catch (err) {
          setError("An unexpected error occurred.");
          console.error(err);
      } finally {
          setSubmitting(false);
      }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-gray-400"/></div>;

  if (!user) {
      return (
          <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
              <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center space-y-4">
                  <h2 className="text-xl font-bold">Sign In Required</h2>
                  <p className="text-gray-500">You need to be logged in to register a company.</p>
                  <Link href="/login" className="inline-block bg-[#0e2a6d] text-white px-6 py-2 rounded-md font-medium hover:bg-[#002f70]">
                      Go to Login
                  </Link>
                  <div className="pt-2">
                       <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">Back to Home</Link>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
      <Navbar />

      <div className="max-w-2xl mx-auto mt-12 px-6">
          {/* Progress Header */}
          <div className="mb-8">
               <div className="flex items-center justify-between text-sm font-medium text-gray-400 mb-2">
                   <span className={step >= 1 ? "text-[#0e2a6d]" : ""}>1. Company Details</span>
                   <span className={step >= 2 ? "text-[#0e2a6d]" : ""}>2. Review</span>
                   <span className={step >= 3 ? "text-[#0e2a6d]" : ""}>3. Complete</span>
               </div>
               <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                   <div 
                        className="h-full bg-[#0e2a6d] transition-all duration-300 ease-in-out" 
                        style={{ width: `${step === 1 ? '33%' : step === 2 ? '66%' : '100%'}` }} 
                   />
               </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-8">
                 {step === 1 && (
                     <div className="space-y-6">
                         <div>
                             <h1 className="text-2xl font-bold text-gray-900">Let's start</h1>
                             <p className="text-gray-500 text-sm mt-1">Enter your proposed company name and structure.</p>
                         </div>

                         <div className="space-y-6">
                             {/* Logo Upload Section */}
                             <div>
                                 <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo (Optional)</label>
                                 <div className="flex items-center gap-4">
                                     <div className="h-20 w-20 rounded-lg bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden group">
                                         {formData.companyLogoUrl ? (
                                             <Image src={formData.companyLogoUrl} alt="Preview" fill className="object-contain p-2" />
                                         ) : (
                                             <Upload className="h-6 w-6 text-gray-400" />
                                         )}
                                          {uploading && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                <Loader2 className="h-5 w-5 text-white animate-spin" />
                                            </div>
                                        )}
                                     </div>
                                     <div>
                                         <button 
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={uploading}
                                            className="text-sm text-blue-600 font-medium hover:text-blue-700 border border-blue-200 bg-blue-50 px-3 py-1.5 rounded-md transition-colors"
                                         >
                                             {uploading ? "Uploading..." : "Upload Logo"}
                                         </button>
                                         <p className="text-xs text-gray-400 mt-1">Recommended size: 400x400px</p>
                                     </div>
                                     <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        onChange={handleLogoUpload} 
                                        className="hidden" 
                                        accept="image/*"
                                     />
                                 </div>
                             </div>

                             <div>
                                 <label className="block text-sm font-medium text-gray-700 mb-1">Proposed Company Name</label>
                                 <input 
                                    type="text" 
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#0e2a6d] focus:ring-[#0e2a6d] sm:text-sm py-2.5 px-3 border"
                                    placeholder="e.g. My Tech Ventures"
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                                 />
                                 <p className="text-xs text-gray-400 mt-1">Must be unique and not resemble existing trademarks.</p>
                             </div>

                             <div>
                                 <label className="block text-sm font-medium text-gray-700 mb-1">Company Type</label>
                                 <select 
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#0e2a6d] focus:ring-[#0e2a6d] sm:text-sm py-2.5 px-3 border bg-white"
                                    value={formData.companyType}
                                    onChange={(e) => setFormData({...formData, companyType: e.target.value})}
                                 >
                                     <option value="Private Limited (Sdn. Bhd.)">Private Limited (Sdn. Bhd.)</option>
                                     <option value="Sole Proprietorship">Sole Proprietorship</option>
                                     <option value="Limited Liability Partnership (PLT)">Limited Liability Partnership (PLT)</option>
                                 </select>
                             </div>
                         </div>

                         {error && (
                             <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md flex items-center gap-2">
                                 <span>!</span> {error}
                             </div>
                         )}

                         <div className="pt-4 flex justify-end">
                             <button 
                                onClick={handleNext}
                                className="bg-[#0e2a6d] text-white px-6 py-2.5 rounded-md font-medium hover:bg-[#002f70] transition-colors flex items-center gap-2"
                             >
                                 Next Step
                             </button>
                         </div>
                     </div>
                 )}

                 {step === 2 && (
                     <div className="space-y-6">
                         <div>
                             <h1 className="text-2xl font-bold text-gray-900">Review & Submit</h1>
                             <p className="text-gray-500 text-sm mt-1">Please confirm your details before submitting.</p>
                         </div>

                         <div className="bg-gray-50 rounded-lg p-6 space-y-4 border border-gray-100">
                             <div className="flex items-center gap-4 border-b border-gray-200 pb-4 mb-4">
                                 <div className="h-16 w-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center relative overflow-hidden">
                                    {formData.companyLogoUrl ? (
                                        <Image src={formData.companyLogoUrl} alt="Logo" fill className="object-contain p-1" />
                                    ) : (
                                        <span className="text-xs text-gray-400">No Logo</span>
                                    )}
                                 </div>
                                 <div className="font-semibold text-gray-900">{formData.companyName}</div>
                             </div>

                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                 <div className="text-sm text-gray-500">Company Name</div>
                                 <div className="sm:col-span-2 text-sm font-semibold text-gray-900">{formData.companyName}</div>
                             </div>
                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                 <div className="text-sm text-gray-500">Structure</div>
                                 <div className="sm:col-span-2 text-sm font-semibold text-gray-900">{formData.companyType}</div>
                             </div>
                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                 <div className="text-sm text-gray-500">Applicant</div>
                                 <div className="sm:col-span-2 text-sm font-semibold text-gray-900">{user.email}</div>
                             </div>
                         </div>
                         
                         <div className="bg-blue-50 p-4 rounded-lg flex gap-3 items-start">
                             <CheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                             <p className="text-sm text-blue-800">
                                 By clicking Submit, you agree to our Terms of Service. An specialist will review your application and contact you for the next steps.
                             </p>
                         </div>

                         {error && (
                             <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md">
                                 {error}
                             </div>
                         )}

                         <div className="pt-4 flex items-center justify-between">
                             <button 
                                onClick={() => setStep(1)}
                                className="text-gray-500 hover:text-gray-700 font-medium text-sm flex items-center gap-1"
                             >
                                 <ChevronLeft className="h-4 w-4" /> Back
                             </button>

                             <button 
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="bg-[#0e2a6d] text-white px-8 py-2.5 rounded-md font-medium hover:bg-[#002f70] transition-colors flex items-center gap-2 disabled:opacity-50"
                             >
                                 {submitting && <Loader2 className="h-4 w-4 animate-spin"/>}
                                 {submitting ? "Submitting..." : "Submit Application"}
                             </button>
                         </div>
                     </div>
                 )}
              </div>
          </div>
      </div>
    </div>
  );
}
