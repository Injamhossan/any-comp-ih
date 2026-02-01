"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Upload, Plus, Trash2, Info, Loader2, Star, CheckCircle, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CreateServicePage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [formData, setFormData] = useState({
      title: "Register a new company | Private Limited - Sdn Bhd",
      description: "",
      basePrice: 1800,
      offerings: [] as {title: string, price: number}[]
  });
  const [images, setImages] = useState<string[]>([]);

  // Fetch user profile for the secretary section
  useEffect(() => {
    if (user?.email) {
      fetch(`/api/user/profile?email=${encodeURIComponent(user.email)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setProfileData(data.data);
          }
        });
    }
  }, [user]);

  // Derived calculations
  const processingFee = formData.basePrice * 0.3; // 30% fee example
  const total = formData.basePrice + processingFee;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const url = URL.createObjectURL(e.target.files[0]);
          setImages([...images, url]);
      }
  };

  const handleSubmit = async () => {
      setLoading(true);
      try {
          const payload = {
            ...formData,
            final_price: total,
            platform_fee: processingFee,
            secretary_name: profileData?.name || user?.displayName || "Unknown Specialist",
            secretary_email: user?.email,
            avatar_url: profileData?.photo_url || user?.photoURL,
            description: formData.description || profileData?.description
          };

          const res = await fetch('/api/specialists', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          const data = await res.json();
          if (data.success) {
            router.push('/dashboard/specialists');
          } else {
            alert("Failed to create service: " + data.message);
          }
      } catch (err) {
        console.error(err);
        alert("Error creating service");
      } finally {
        setLoading(false);
      }
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4 sm:px-6 lg:px-8 bg-white min-h-screen">
      
      {/* Header Actions */}
      <div className="flex items-center justify-end gap-3 py-6 sticky top-0 bg-white z-10 border-b border-gray-50 mb-8">
          <button className="px-6 py-2 text-sm font-bold text-[#0e2a6d] bg-[#f0f4ff] rounded-md hover:bg-blue-100 transition-all active:scale-95">
              Edit
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 text-sm font-bold text-white bg-[#0e2a6d] rounded-md hover:bg-[#002f70] transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-blue-900/10"
          >
              {loading && <Loader2 className="h-4 w-4 animate-spin"/>}
              Publish
          </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content (Left Col) */}
          <div className="lg:col-span-8 space-y-12">
              
              {/* Title Section */}
              <div className="border-b border-gray-100 pb-4">
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full text-4xl font-extrabold text-gray-900 border-none p-0 focus:ring-0 placeholder:text-gray-200 tracking-tight"
                    placeholder="Enter service title..."
                  />
              </div>

              {/* Image Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 aspect-[16/7]">
                  {/* Main Large Image */}
                  <div className="relative bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-all group overflow-hidden shadow-inner">
                      {images[0] ? (
                          <Image src={images[0]} alt="Main" fill className="object-cover" />
                      ) : (
                        <div className="p-8 text-center">
                          <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 border border-gray-100 group-hover:scale-110 transition-transform">
                             <Upload className="h-8 w-8 text-gray-400" />
                          </div>
                          <p className="text-xs text-gray-400 font-medium px-4 leading-relaxed">
                            Upload an image for your service listing<br/>PNG, JPG or JPEG up to 4MB
                          </p>
                          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
                        </div>
                      )}
                  </div>
                  
                  {/* Secondary Column */}
                  <div className="grid grid-rows-2 gap-4">
                      <div className="relative bg-gray-100 rounded-2xl overflow-hidden group">
                           {images[1] ? (
                               <Image src={images[1]} alt="Sub" fill className="object-cover" />
                           ) : (
                               <div className="absolute inset-0 bg-[#f8f9fc] flex flex-col items-center justify-center">
                                   <div className="text-center p-6 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                                       <h4 className="font-bold text-gray-800 text-lg leading-tight mb-2">10 Best Company Secretarial in Johor Bahru</h4>
                                       <div className="inline-block px-2 py-1 bg-[#0e2a6d] text-white text-[10px] font-bold rounded">TOP RATED</div>
                                   </div>
                               </div>
                           )}
                           <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
                      </div>
                      
                      {/* Blue Text Card */}
                      <div className="relative bg-[#0e2a6d] rounded-2xl overflow-hidden flex items-center p-8 text-white transition-transform hover:scale-[1.02] duration-300 shadow-xl shadow-blue-900/20">
                           <div className="space-y-4">
                               <div className="h-1 w-12 bg-white/30 rounded" />
                               <h4 className="font-bold text-xl leading-snug">A Company Secretary Represents a Key Role in Any Business. This is Why</h4>
                               <p className="text-xs text-blue-100/70 font-medium flex items-center gap-2">
                                  LEARN MORE <ArrowRight className="h-3 w-3" />
                                </p>
                           </div>
                           <div className="absolute -bottom-6 -right-6 h-24 w-24 bg-white/10 rounded-full blur-2xl" />
                      </div>
                  </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest text-sm">Description</h3>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe your service here..."
                    className="w-full min-h-[160px] p-6 rounded-2xl border-gray-100 bg-gray-50/50 text-gray-600 text-sm focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none leading-relaxed"
                  />
              </div>

              {/* Additional Offerings */}
              <div className="space-y-4">
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest text-sm text-gray-400">Additional Offerings</h3>
                  <div className="p-6 rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center space-y-3 bg-white hover:bg-gray-50/50 transition-colors">
                      <p className="text-sm text-gray-400 font-medium">Enhance your service by adding additional offerings</p>
                      <button className="flex items-center gap-2 text-blue-600 text-sm font-bold hover:text-blue-700 transition-all hover:gap-3">
                          <Plus className="h-4 w-4" /> Add Offering
                      </button>
                  </div>
              </div>

              {/* Company Secretary Profile (Bottom) */}
              <div className="pt-12 border-t border-gray-100">
                  <h3 className="text-2xl font-extrabold text-gray-900 mb-8">Company Secretary</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      {/* Secretary Left Info */}
                      <div className="space-y-6">
                          <div className="flex items-center gap-4">
                              <div className="h-20 w-20 rounded-full border-4 border-white shadow-lg overflow-hidden relative ring-1 ring-gray-100">
                                  {profileData?.photo_url || user?.photoURL ? (
                                      <Image src={profileData?.photo_url || user?.photoURL!} alt="User" fill className="object-cover" />
                                  ) : (
                                      <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-300">
                                          <Plus className="h-8 w-8" />
                                      </div>
                                  )}
                              </div>
                              <div>
                                  <div className="flex items-center gap-2 mb-1">
                                      <span className="font-bold text-gray-900 text-lg">{profileData?.name || user?.displayName || "Grace Lam"}</span>
                                      <span className="bg-green-50 text-green-600 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border border-green-100">
                                          <CheckCircle className="h-3 w-3" /> Verified
                                      </span>
                                  </div>
                                  <div className="flex items-center gap-4 text-xs font-semibold text-gray-400">
                                      <span>Corpse Services Sdn Bhd</span>
                                      <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> 4.9 (250 Clients)</span>
                                  </div>
                              </div>
                          </div>
                          
                          <p className="text-sm text-gray-500 leading-relaxed font-medium bg-gray-50 p-6 rounded-2xl border border-gray-100/50">
                              {profileData?.description || "A company secretarial service founded by Grace, who believes that every company deserves clarity, confidence, and care in their compliance journey. Inspired by the spirit of entrepreneurship..."}
                          </p>
                      </div>

                      {/* Firm & Certs Right Info */}
                      <div className="space-y-8">
                          <div>
                              <h4 className="text-sm font-bold text-gray-900 mb-4">{profileData?.name?.split(' ')[0] || "Grace"} is part of a firm</h4>
                              <p className="text-xs text-gray-400 leading-relaxed font-medium">
                                  Company Secretary firms are professional service providers that manage corporate compliance, company registration, and statutory obligations on behalf of businesses.
                              </p>
                          </div>

                          <div className="space-y-4">
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Firm</h4>
                              <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
                                  <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center font-bold text-blue-600 text-xs">CS</div>
                                  <div>
                                       <div className="text-sm font-bold text-gray-900">Corpse Services Sdn Bhd</div>
                                       <div className="text-[10px] text-gray-400 font-medium">2 Years providing Company Secretarial services</div>
                                  </div>
                              </div>
                          </div>

                          <div className="space-y-4">
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Certifications</h4>
                              <div className="flex flex-wrap gap-4">
                                  {(profileData?.certifications || ["ICSA", "MIA", "COSEC"]).map((cert: string, idx: number) => (
                                      <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                                          <div className="h-6 w-6 bg-blue-900 rounded-sm flex items-center justify-center text-[8px] text-white font-bold">{cert[0]}</div>
                                          <span className="text-xs font-bold text-gray-700">{cert}</span>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

          </div>

          {/* Sidebar (Right Col) */}
          <div className="lg:col-span-4 lg:pl-4">
              <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200 border border-gray-100 p-10 lg:sticky lg:top-32 transition-all hover:translate-y-[-4px]">
                  <h3 className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 mb-2">Professional Fee</h3>
                  <p className="text-xs font-bold text-gray-700 mb-8">Set a rate for your service</p>

                  <div className="relative mb-10 group">
                       <span className="absolute left-0 top-1/2 -translate-y-1/2 text-xl font-black text-gray-300 group-focus-within:text-blue-600 transition-colors">RM</span>
                       <input 
                          type="number"
                          value={formData.basePrice}
                          onChange={(e) => setFormData({...formData, basePrice: parseInt(e.target.value) || 0})}
                          className="w-full text-right text-5xl font-black text-gray-900 border-none border-b-4 border-gray-100 focus:ring-0 focus:border-blue-600 p-0 pl-12 pb-2 transition-all"
                       />
                  </div>

                  <div className="space-y-4 py-8 border-t border-gray-100">
                      <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Base price</span>
                          <span className="font-black text-gray-900">RM {formData.basePrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] underline decoration-dotted decoration-gray-200 cursor-help" title="Platform processing fee">Service processing fee</span>
                          <span className="font-black text-gray-900">RM {processingFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                          <span className="text-gray-900 font-black text-lg">Total</span>
                          <span className="font-black text-3xl text-[#0e2a6d]">RM {total.toLocaleString()}</span>
                      </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#0e2a6d]">Your returns</span>
                      <span className="text-2xl font-black text-gray-900">RM {formData.basePrice.toLocaleString()}</span>
                  </div>
              </div>
          </div>

      </div>
    </div>
  );
}
