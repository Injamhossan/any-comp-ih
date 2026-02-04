"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { Upload, Plus, Loader2, ArrowRight, CheckCircle, Star, X, Trash2, UserPlus, Landmark, FileText, Zap, MapPin, Calendar, Award, Truck, Headphones, ChevronDown, Check, Cloud, ArrowUp } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CreateServicePage() {
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  /* State for custom duration dropdown */
  const [isDurationDropdownOpen, setIsDurationDropdownOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isOfferingDropdownOpen, setIsOfferingDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
      title: "Register a new company | Private Limited - Sdn Bhd",
      description: "",
      basePrice: 0,
      duration: 1,
      offerings: [] as {title: string, price: number}[]
  });
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  const [existingServiceId, setExistingServiceId] = useState<string | null>(null);

  // Check if user already has a service created
  useEffect(() => {
    if (user?.email) {
       // 1. Fetch profile data first
       fetch(`/api/user/profile?email=${encodeURIComponent(user.email)}`)
        .then(res => res.json())
        .then(profileResult => {
             let nameToCheck = user.displayName || "";
             
             if (profileResult.success && profileResult.data) {
                 setProfileData(profileResult.data);
                 // If profile has a name, prefer it as that's what we save
                 if (profileResult.data.name) {
                     nameToCheck = profileResult.data.name;
                 }
             }

             // 2. Fetch existing service using the determined name
             fetch(`/api/specialists?email=${encodeURIComponent(user.email || "")}&name=${encodeURIComponent(nameToCheck)}`)
                 .then(res => res.json())
                 .then(data => {
                    if (data.success && data.data && data.data.length > 0) {
                        const existing = data.data[0];
                        setExistingServiceId(existing.id);
                        setFormData({
                            title: existing.title,
                            description: existing.description.split("[Additional Offerings JSON]:")[0].trim(),
                            basePrice: existing.base_price,
                            duration: existing.duration_days,
                            offerings: existing.additional_offerings || []
                        });
                        
                        if (existing.description.includes("[Additional Offerings JSON]:")) {
                            try {
                                const jsonPart = existing.description.split("[Additional Offerings JSON]:")[1];
                                const parsedOfferings = JSON.parse(jsonPart);
                                setFormData(prev => ({...prev, offerings: parsedOfferings}));
                            } catch (e) { console.error("Error parsing hidden offerings", e); }
                        }

                        if (existing.media && existing.media.length > 0) {
                             setImages(existing.media.map((m: any) => m.url));
                        }
                    } else {
                        // NEW SERVICE - Dynamic Title based on Company Name AND Type
                        const reg = profileResult.data?.registrations?.[0];
                        if (reg) {
                            let parts = [];
                            
                            // 1. Company Name
                            if (reg.companyName) {
                                parts.push(reg.companyName);
                            }

                            // 2. Company Type Description
                            if (reg.companyType) {
                                if (reg.companyType === "Sdn Bhd") parts.push("Private Limited - Sdn Bhd");
                                else if (reg.companyType === "Berhad") parts.push("Public Limited - Berhad");
                                else parts.push(reg.companyType);
                            }

                            if (parts.length > 0) {
                                setFormData(prev => ({
                                    ...prev,
                                    title: parts.join(" | ")
                                }));
                            }
                        }
                    }
                 })
                 .finally(() => setProfileLoading(false));
        })
        .catch(() => setProfileLoading(false));
    } else {
        const timer = setTimeout(() => {
            if (!user) setProfileLoading(false); 
        }, 2000);
        return () => clearTimeout(timer);
    }
  }, [user]);

  const base = Number(formData.basePrice) || 0;
  const processingFee = base * 0.3; 
  const total = base + processingFee;

  const registeredCompany = profileData?.registrations?.[0];
  const displayCompanyName = registeredCompany?.companyName || profileData?.company_name || "Company Name";
  const displayCompanyLogo = registeredCompany?.companyLogoUrl || profileData?.company_logo_url;
  const [activeUploadIndex, setActiveUploadIndex] = useState<number | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const file = files[0];
      const data = new FormData();
      data.append("file", file);

      setUploading(true);
      try {
           const res = await fetch("/api/upload", {
              method: "POST",
              body: data
          });
          const result = await res.json();
          if (result.success) {
               if (activeUploadIndex !== null) {
                   setImages(prev => {
                       const newImages = [...prev];
                       // Fill empty slots if needed
                       while(newImages.length <= activeUploadIndex) newImages.push(""); 
                       newImages[activeUploadIndex] = result.url;
                       return newImages;
                   });
                   setActiveUploadIndex(null);
               } else {
                   // Fallback append
                   setImages(prev => [...prev, result.url]);
               }
          } else {
               alert("Image upload failed");
          }
      } catch(err) {
          console.error(err);
      } finally {
          setUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
      }
  };

  // Helper render function for upload box
  const renderUploadBox = (index: number, isLarge: boolean = false) => {
      const hasImage = images[index];
      return (
          <div 
            key={index}
            className={`relative rounded-xl border-dashed border-2 flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden bg-white group
                ${isLarge ? 'h-[400px] border-black' : 'h-[190px] border-gray-300'}
                ${hasImage ? 'border-solid border-gray-200 p-0' : 'hover:bg-gray-50'}
            `}
            onClick={() => {
                if (!hasImage) {
                    setActiveUploadIndex(index);
                    fileInputRef.current?.click();
                }
            }}
          >
              {hasImage ? (
                  <>
                      <Image src={hasImage} alt={`Upload ${index+1}`} fill className="object-cover" />
                      <button 
                          onClick={(e) => {
                              e.stopPropagation();
                              const newImages = [...images];
                              newImages.splice(index, 1);
                              setImages(newImages);
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-red-50 text-gray-700 hover:text-red-500 rounded-lg backdrop-blur-sm transition-colors z-10"
                      >
                          <Trash2 className="h-5 w-5" />
                      </button>
                  </>
              ) : (
                  <div className={`flex flex-col items-center text-center p-4 ${isLarge ? '' : 'scale-90'}`}>
                      <div className={`mb-3 relative ${isLarge ? 'mb-4' : 'mb-2'}`}>
                          <Cloud className={`${isLarge ? 'h-20 w-20' : 'h-14 w-14'} text-blue-900`} strokeWidth={1.5} />
                          <ArrowUp className={`${isLarge ? 'h-8 w-8' : 'h-5 w-5'} text-blue-900 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`} strokeWidth={3} />
                      </div>
                      <span className={`bg-[#0e2a6d] text-white rounded-full font-bold transition-colors group-hover:bg-[#001f5c] ${isLarge ? 'px-10 py-2.5 text-sm mb-3' : 'px-6 py-1.5 text-xs mb-2'}`}>
                          Browse
                      </span>
                      <span className="text-gray-400 text-xs">or, Drag a file</span>
                  </div>
              )}
          </div>
      );
  };

  const isApproved = registeredCompany && registeredCompany.status === 'APPROVED';
  
  const isNotEligible = !isApproved;

  const handleSubmit = () => {
      if (profileLoading) return;
      
      if (!registeredCompany) {
           alert("You must register a company first before you can post services.");
           router.push("/register-company"); 
           return;
      }

      if (registeredCompany.status !== 'APPROVED') {
           alert("Your company registration is pending approval. You cannot post services until it is approved.");
           return; 
      }
      setIsConfirmOpen(true);
  };

  const handleSubmitConfirmed = async () => {
      setLoading(true);
      try {
         
          const slug = formData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') + '-' + Date.now();

          
          let finalDescription = formData.description || profileData?.description || "";
          if (formData.offerings.length > 0) {
             finalDescription += "\n\n[Additional Offerings JSON]: " + JSON.stringify(formData.offerings);
          }

          const payload = {
            title: formData.title,
            slug: slug,
            description: finalDescription,
            base_price: formData.basePrice,
            duration_days: formData.duration,
            final_price: total,
            platform_fee: processingFee,
            secretary_name: profileData?.name || user?.displayName || "Unknown Specialist",
            secretary_email: user?.email,
            secretary_company: displayCompanyName,  
            avatar_url: profileData?.photo_url || user?.photoURL,
            verification_status: "PENDING",
            is_verified: false,
            total_number_of_ratings: 0,
            average_rating: 0,
            is_draft: false,
            media_urls: images.filter(Boolean)
            
          };

          const url = existingServiceId ? `/api/specialists/${existingServiceId}` : '/api/specialists';
          const method = existingServiceId ? 'PUT' : 'POST';

          const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          const data = await res.json();
          if (data.success) {
            alert(existingServiceId ? "Service updated successfully!" : "Service created successfully!");
          } else {
            console.error("Creation/Update failed:", data);
            alert("Failed to save service: " + (data.message || "Unknown error"));
          }
      } catch (err) {
        console.error(err);
        alert("Error saving service");
      } finally {
        setLoading(false);
      }
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-20 px-4 sm:px-6 lg:px-8 bg-white min-h-screen font-sans">
      
      {/* Header Actions */}
      <div className="flex flex-col py-6 sticky top-0 bg-white z-20 border-b border-gray-50 mb-8 gap-4">
          {!profileLoading && isNotEligible && (
             <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 w-full">
                <div className="flex">
                   <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                   </div>
                   <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                         {registeredCompany ? (
                             <>Your company registration is currently <strong>{registeredCompany.status}</strong>. You cannot publish or update services until your company is approved by an administrator.</>
                         ) : (
                             <>You do not have a registered company under this account. Please <a href="/register-your-company" className="font-bold underline">register your company</a> to publish services.</>
                         )}
                      </p>
                   </div>
                </div>
             </div>
          )}
          
          <div className="flex items-center justify-between w-full">
            <h1 className="text-2xl font-bold text-gray-900 truncate max-w-2xl">{formData.title}</h1>
            <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsEditDrawerOpen(true)}
                  className="px-5 py-2 text-sm font-semibold text-white bg-[#0f172a] rounded-md hover:bg-gray-800 transition-colors">
                    Edit
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={loading || isNotEligible || profileLoading}
                  className={`px-5 py-2 text-sm font-semibold text-white rounded-md flex items-center gap-2 shadow-sm transition-colors ${loading || isNotEligible || profileLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0e3a8d] hover:bg-[#002f70]'}`}
                >
                    {loading && <Loader2 className="h-4 w-4 animate-spin"/>}
                    {existingServiceId ? "Update Service" : "Publish"}
                </button>
            </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content (Left Col) */}
          <div className="lg:col-span-8 space-y-10">
              
              {/* Image Uploader Grid */}
              <div className="w-full space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px]">
                      {/* Left: One Large Box (Index 0) */}
                      {renderUploadBox(0, true)}

                      {/* Right: Two Smaller Boxes Stacked (Index 1, 2) */}
                      <div className="flex flex-col gap-4 h-full">
                          {renderUploadBox(1)}
                          {renderUploadBox(2)}
                      </div>
                  </div>

                  <div className="flex justify-between text-[11px] text-gray-500 font-medium px-1">
                      <span>Accepted formats: JPG, JPEG, PNG or WEBP</span>
                      <span>Maximim file size: 4MB</span>
                  </div>
                  
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageUpload} accept="image/*" />
              </div>

              {/* Description */}
              <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 font-sans">Description</h3>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe your service here"
                    className="w-full min-h-[120px] p-0 border-none bg-transparent text-gray-500 text-sm focus:ring-0 placeholder:text-gray-300 resize-none"
                  />
                  <div className="border-b border-gray-200"></div>
              </div>

              {/* Additional Offerings */}
              <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <h3 className="text-xl font-bold text-gray-900 font-sans">Additional Offerings</h3>
                     <button 
                        onClick={() => setIsEditDrawerOpen(true)}
                        className="text-sm font-semibold text-[#0e3a8d] hover:underline"
                     >
                        + Add Offering
                     </button>
                  </div>
                  <p className="text-xs text-gray-400 pb-2">Enhance your service by adding additional offerings</p>
                  
                  {formData.offerings.length > 0 ? (
                      <div className="grid grid-cols-1 gap-3">
                          {formData.offerings.map((offering, idx) => (
                              <div key={idx} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
                                  <div className="flex items-center gap-3">
                                      <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 flex-shrink-0">
                                          <CheckCircle className="h-5 w-5" />
                                      </div>
                                      <div>
                                          <h4 className="text-sm font-bold text-gray-900">{offering.title}</h4>
                                          <p className="text-xs text-gray-500">Selected offering</p>
                                      </div>
                                  </div>
                                  <div className="font-bold text-gray-900 whitespace-nowrap">
                                      {offering.price > 0 ? `RM ${offering.price}` : 'Free'}
                                  </div>
                              </div>
                          ))}
                      </div>
                  ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                          <p className="text-sm text-gray-500">No additional offerings selected.</p>
                          <button onClick={() => setIsEditDrawerOpen(true)} className="text-[#0e3a8d] font-bold text-sm mt-2 hover:underline">Add Offerings</button>
                      </div>
                  )}

                  <div className="h-[1px] bg-gray-200 w-full mt-4"></div>
              </div>

              {/* Company Secretary Section */}
              <div className="pt-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-8">Company Secretary</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      {/* Secretary Left Info */}
                      <div className="space-y-6">
                          <div className="flex items-center gap-4">
                              <div className="h-16 w-16 rounded-full overflow-hidden relative border border-gray-100">
                                  {profileData?.photo_url || user?.photoURL ? (
                                      <Image src={profileData?.photo_url || user?.photoURL!} alt="User" fill className="object-cover" />
                                  ) : (
                                      <div className="h-full w-full bg-blue-50 flex items-center justify-center text-blue-300">
                                          <div className="font-bold text-xl">{user?.displayName?.[0] || "U"}</div>
                                      </div>
                                  )}
                              </div>
                              <div>
                                  <div className="flex items-center gap-2 mb-1">
                                      <span className="font-bold text-gray-900 text-lg">{profileData?.name || user?.displayName || "Grace Lam"}</span>
                                      <span className="text-green-500 flex items-center gap-0.5 text-[10px] font-bold uppercase">
                                          <CheckCircle className="h-3 w-3 fill-green-500 text-white" /> Verified
                                      </span>
                                  </div>
                                  <div className="text-sm font-medium text-gray-700 mb-0.5">{displayCompanyName}</div>
                                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                                      <span>{profileData?.clients_count ?? 250} Clients</span>
                                      <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-blue-900 text-blue-900" /> 4.9</span>
                                  </div>
                              </div>
                          </div>
                          
                          <p className="text-xs text-gray-500 leading-relaxed font-medium">
                              {profileData?.description || "A company secretarial service founded by Grace, who believes that every company deserves clarity, confidence, and care in their compliance journey. Inspired by the spirit of entrepreneurship, Grace treats every client's business as if it were her own — attentive to detail, committed to deadlines, and focused on growth."}
                          </p>
                      </div>

                      {/* Firm & Certs Right Info */}
                      <div className="space-y-8">
                          <div>
                              <h4 className="text-base font-bold text-gray-900 mb-2">{profileData?.name?.split(' ')[0] || "Grace"} is part of a firm</h4>
                              <p className="text-xs text-gray-500 leading-relaxed">
                                  {profileData?.firm_description || "Company Secretary firms are professional service providers that manage corporate compliance, company registration, and statutory obligations on behalf of businesses."}
                              </p>
                          </div>

                          <div className="space-y-3">
                              <h4 className="text-base font-bold text-gray-900">Firm</h4>
                              <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 bg-blue-50 rounded flex items-center justify-center relative overflow-hidden">
                                      {displayCompanyLogo ? (
                                          <Image src={displayCompanyLogo} alt="Logo" fill className="object-cover" />
                                      ) : (
                                          <span className="text-blue-700 font-bold text-[10px]">{displayCompanyName?.[0] || "C"}</span>
                                      )}
                                  </div>
                                  <div>
                                       <div className="text-sm font-bold text-gray-900">{displayCompanyName}</div>
                                       <div className="text-[10px] text-gray-500">{profileData?.experience_years ?? 2} Years providing Company Secretarial services</div>
                                  </div>
                              </div>
                          </div>

                          <div className="space-y-3">
                              <h4 className="text-base font-bold text-gray-900">Certifications</h4>
                              <div className="flex items-center gap-4">
                                  {profileData?.certifications && profileData.certifications.length > 0 ? (
                                      profileData.certifications.map((cert: string, i: number) => (
                                          <div key={i} className="h-6 min-w-[30px] px-2 bg-gray-100 rounded relative overflow-hidden flex items-center justify-center">
                                              <span className="text-[8px] font-bold text-gray-600">{cert}</span>
                                          </div>
                                      ))
                                  ) : (
                                      <>
                                          <div className="h-6 w-12 bg-gray-100 rounded relative overflow-hidden grayscale opacity-70">
                                              <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-gray-400">SSM</div>
                                          </div>
                                          <div className="h-6 w-12 bg-gray-100 rounded relative overflow-hidden grayscale opacity-70">
                                              <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-gray-400">MAICSA</div>
                                          </div>
                                          <div className="h-8 w-8 rounded-full border border-gray-100 flex items-center justify-center grayscale opacity-70">
                                               <div className="h-4 w-4 bg-blue-900/20 rounded-full"></div>
                                          </div>
                                      </>
                                  )}
                              </div>
                          </div>
                      </div>
                  </div>

          </div>
      </div>
          
          {/* Sidebar (Right Col) */}
          <div className="lg:col-span-4 lg:pl-8">
              <div className="bg-white rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 p-8 lg:sticky lg:top-32">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">Professional Fee</h3>
                  <p className="text-gray-400 text-sm mb-8 font-medium">Set a rate for your service</p>

                  <div className="mb-10">
                       <div className="flex items-baseline border-b-2 border-black pb-1">
                           <span className="text-3xl font-medium text-gray-900 mr-2">RM</span>
                           <input 
                              type="text"
                              value={formData.basePrice.toLocaleString()}
                              onChange={(e) => {
                                  // Simple number parsing
                                  const val = parseInt(e.target.value.replace(/,/g, '')) || 0;
                                  setFormData({...formData, basePrice: val});
                              }}
                              className="w-full text-4xl font-medium text-gray-900 border-none p-0 focus:ring-0 bg-transparent placeholder-gray-300"
                           />
                       </div>
                  </div>

                  <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm font-medium">
                          <span className="text-gray-500">Base price</span>
                          <span className="text-gray-900">RM {formData.basePrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-medium">
                          <span className="text-gray-500 underline decoration-dotted">Service processing fee</span>
                          <span className="text-gray-900">RM {processingFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-bold pt-2">
                          <span className="text-gray-900">Total</span>
                          <span className="text-gray-900">RM {total.toLocaleString()}</span>
                      </div>
                              
                      <div className="h-[1px] bg-gray-200 my-4 w-full"></div>

                      <div className="flex justify-between items-center pt-1">
                          <span className="text-sm font-medium text-gray-500">Your returns</span>
                          <span className="text-lg font-bold text-gray-900">RM {formData.basePrice.toLocaleString()}</span>
                      </div>
                  </div>    
              </div>
          </div>
      </div>



      {/* Edit Drawer Overlay */}
      {isEditDrawerOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setIsEditDrawerOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white z-50 shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-in-out">
             <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                   <h2 className="text-xl font-bold text-gray-900">Edit Service</h2>
                   <button 
                     onClick={() => setIsEditDrawerOpen(false)}
                     className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                   >
                     <X className="h-5 w-5 text-gray-500"/>
                   </button>
                </div>

                <div className="space-y-6">
                   {/* Title Input */}
                   <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Title</label>
                      <input 
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full p-3 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Service Title"
                      />
                   </div>

                   {/* Description Input */}
                   <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Description</label>
                      <textarea 
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full p-3 border border-gray-200 rounded-lg text-sm text-gray-900 min-h-[150px] focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                        placeholder="Service Description"
                      />
                      <div className="text-right text-xs text-gray-400">
                        {formData.description.length} characters
                      </div>
                   </div>
        
                   {/* Duration Input */}
                   <div className="space-y-4">
                       <h3 className="text-xl font-bold text-gray-900">
                           Estimated Completion Time ({formData.duration} Total Days)
                       </h3>
                       <div className="border-2 border-blue-500 p-6 rounded-lg">
                           <div className="space-y-2">
                               <label className="text-sm font-bold text-gray-700">Estimated Completion Time (Days)</label>
                               <div className="relative">
                                   <div 
                                       className="w-full p-3 border border-gray-200 rounded-lg text-sm text-gray-900 flex items-center justify-between cursor-pointer bg-white hover:border-gray-300 transition-all"
                                       onClick={() => setIsDurationDropdownOpen(!isDurationDropdownOpen)}
                                   >
                                       <span>{formData.duration} {formData.duration === 1 ? 'day' : 'days'}</span>
                                       <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isDurationDropdownOpen ? 'rotate-180' : ''}`}/>
                                   </div>

                                   {isDurationDropdownOpen && (
                                       <>
                                         <div 
                                             className="fixed inset-0 z-10" 
                                             onClick={() => setIsDurationDropdownOpen(false)}
                                         ></div>
                                         <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-lg shadow-lg z-20 max-h-[300px] overflow-y-auto">
                                             {[...Array(14)].map((_, i) => {
                                                 const val = i + 1;
                                                 return (
                                                     <div 
                                                         key={val}
                                                         className={`p-3 text-sm cursor-pointer hover:bg-gray-50 ${formData.duration === val ? 'bg-blue-50 font-semibold text-blue-900' : 'text-gray-900'}`}
                                                         onClick={() => {
                                                             setFormData({...formData, duration: val});
                                                             setIsDurationDropdownOpen(false);
                                                         }}
                                                     >
                                                         {val} {val === 1 ? 'day' : 'days'}
                                                     </div>
                                                 );
                                             })}
                                         </div>
                                       </>
                                   )}
                               </div>
                           </div>
                       </div>
                   </div>

                   {/* Price Input */}
                   <div className="space-y-2">
                       <label className="text-sm font-bold text-gray-700">Price</label>
                       <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                             <span className="text-gray-500 text-sm font-medium">RM</span>
                          </div>
                          <input 
                            type="number"
                            min="0"
                            value={formData.basePrice}
                            onChange={(e) => setFormData({...formData, basePrice: parseInt(e.target.value) || 0})}
                            className="w-full pl-10 p-3 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          />
                       </div>
                   </div>

                   {/* Additional Offerings Manager */}
                   <div className="space-y-3 pt-4 border-t border-gray-100">
                       <label className="text-sm font-bold text-gray-700">Additional Offerings</label>
                       
                       {/* Dropdown Selection */}
                       <div className="relative">
                           <div 
                               className="w-full p-3 border border-gray-200 rounded-lg text-sm flex items-center justify-between cursor-pointer bg-white hover:border-gray-300 transition-colors"
                               onClick={() => setIsOfferingDropdownOpen(!isOfferingDropdownOpen)}
                           >
                               <span className="text-gray-500">Select additional offerings...</span>
                               <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOfferingDropdownOpen ? 'rotate-180' : ''}`}/>
                           </div>

                           {isOfferingDropdownOpen && (
                               <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-50 max-h-[400px] overflow-y-auto p-2">
                                   {[
                                       { title: "Company Secretary Subscription", desc: "Enjoy 1 month free Company Secretary Subscription", icon: UserPlus },
                                       { title: "Opening of a Bank Account", desc: "Complimentary Corporate Bank Account Opening", icon: Landmark },
                                       { title: "Access Company Records and SSM Forms", desc: "24/7 Secure Access to Statutory Company Records", icon: FileText },
                                       { title: "Priority Filing", desc: "Documents are prioritized for submission and swift processing - within 24 hours", icon: Zap },
                                       { title: "Registered Office Address Use", desc: "Use of SSM-Compliant Registered Office Address with Optional Mail Forwarding", icon: MapPin },
                                       { title: "Compliance Calendar Setup", desc: "Get automated reminders for all statutory deadlines", icon: Calendar },
                                       { title: "First Share Certificate Issued Free", desc: "Receive your company's first official share certificate at no cost", icon: Award },
                                       { title: "CTC Delivery & Courier Handling", desc: "Have your company documents and certified copies delivered securely to you", icon: Truck },
                                       { title: "Chat Support", desc: "Always-On Chat Support for Compliance, Filing, and General Queries", icon: Headphones },
                                   ].map((item, idx) => {
                                       const isSelected = formData.offerings.some(o => o.title === item.title);
                                       return (
                                           <div 
                                               key={idx} 
                                               className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                                               onClick={() => {
                                                   if (isSelected) {
                                                       setFormData({
                                                           ...formData,
                                                           offerings: formData.offerings.filter(o => o.title !== item.title)
                                                       });
                                                   } else {
                                                       setFormData({
                                                           ...formData,
                                                           offerings: [...formData.offerings, {title: item.title, price: 0}]
                                                       });
                                                   }
                                               }}
                                           >
                                               <div className="mt-1 text-gray-500">
                                                   <item.icon className="h-5 w-5"/>
                                               </div>
                                               <div className="flex-1">
                                                   <h5 className={`text-sm font-semibold ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>{item.title}</h5>
                                                   <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                                               </div>
                                               {isSelected && <Check className="h-4 w-4 text-blue-600 mt-1"/>}
                                           </div>
                                       );
                                   })}
                               </div>
                           )}
                       </div>

                       {/* Selected Chips */}
                       <div className="flex flex-wrap gap-2 pt-2">
                           {formData.offerings.map((offering, idx) => (
                               <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded text-xs font-semibold text-gray-800 self-start">
                                   <span>{offering.title}</span>
                                   <button 
                                      onClick={() => {
                                          const newOfferings = formData.offerings.filter((_, i) => i !== idx);
                                          setFormData({...formData, offerings: newOfferings});
                                      }}
                                      className="text-gray-500 hover:text-red-500 rounded-full p-0.5"
                                   >
                                       <X className="h-3 w-3"/>
                                   </button>
                               </div>
                           ))}
                       </div>
                   </div>
                </div>

                <div className="mt-10 flex items-center gap-3 pt-6 border-t border-gray-100">
                    <button 
                      onClick={() => setIsEditDrawerOpen(false)}
                      className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                      onClick={() => setIsEditDrawerOpen(false)}
                      className="flex-1 px-4 py-2.5 bg-[#0f172a] text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Confirm
                    </button>
                </div>
             </div>
          </div>
        </>
      )}

      {/* Confirmation Modal */}
      {isConfirmOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <div 
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                  onClick={() => setIsConfirmOpen(false)}
              ></div>
              <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                          <div className="flex-shrink-0 p-2 bg-blue-50 rounded-full">
                              <div className="bg-[#0e2a6d] w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold">!</div>
                          </div>
                          <div>
                              <h3 className="text-lg font-bold text-gray-900">Publish changes</h3>
                              <p className="text-sm text-gray-500 mt-1">Do you want to publish these changes? It will appear in the marketplace listing</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-3 pt-2">
                          <button 
                              onClick={() => setIsConfirmOpen(false)}
                              className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors"
                          >
                              Continue Editing
                          </button>
                          <button 
                              onClick={() => {
                                  setIsConfirmOpen(false);
                                  handleSubmitConfirmed();
                              }}
                              className="flex-1 px-4 py-2.5 bg-[#0e2a6d] text-white text-sm font-bold rounded-lg hover:bg-[#002f70] transition-colors"
                          >
                              Save changes
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};