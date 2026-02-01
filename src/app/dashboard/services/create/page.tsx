"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { Upload, Plus, Loader2, ArrowRight, CheckCircle, Star, X, Trash2, UserPlus, Landmark, FileText, Zap, MapPin, Calendar, Award, Truck, Headphones, ChevronDown, Check } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CreateServicePage() {
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isOfferingDropdownOpen, setIsOfferingDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
      title: "Register a new company | Private Limited - Sdn Bhd",
      description: "",
      basePrice: 1800,
      duration: 1,
      offerings: [] as {title: string, price: number}[]
  });
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const [existingServiceId, setExistingServiceId] = useState<string | null>(null);

  // Check if user already has a service created
  useEffect(() => {
    if (user?.email) {
       // Fetch profile data
       fetch(`/api/user/profile?email=${encodeURIComponent(user.email)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setProfileData(data.data);
          }
        });

       // Fetch existing service
       fetch(`/api/specialists?email=${encodeURIComponent(user.email)}`)
         .then(res => res.json())
         .then(data => {
            if (data.success && data.data && data.data.length > 0) {
                const existing = data.data[0];
                setExistingServiceId(existing.id);
                setFormData({
                    title: existing.title,
                    description: existing.description.split("[Additional Offerings JSON]:")[0].trim(), // Remove appended JSON if present
                    basePrice: existing.base_price,
                    duration: existing.duration_days,
                    offerings: existing.additional_offerings || [] // Use schema field if avail, else parse from desc? Parsing logic needed if we rely on appended JSON
                });
                
                // If we are relying on appended JSON in description (Compatibility Mode)
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
            }
         });
    }
  }, [user]);

  const processingFee = formData.basePrice * 0.3; 
  const total = formData.basePrice + processingFee;

  const registeredCompany = profileData?.registrations?.[0];
  const displayCompanyName = registeredCompany?.companyName || profileData?.company_name || "Company Name";
  const displayCompanyLogo = registeredCompany?.companyLogoUrl || profileData?.company_logo_url;

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
               setImages(prev => [...prev, result.url]);
          } else {
               alert("Image upload failed");
          }
      } catch(err) {
          console.error(err);
      } finally {
          setUploading(false);
      }
  };

  const handleSubmit = async () => {
      setLoading(true);
      try {
          // Generate a slug from title
          const slug = formData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') + '-' + Date.now();

          // Prepare description with additional offerings if needed (temporary storage until schema update applied)
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
            secretary_company: displayCompanyName, // Mapped from secretary_company_name
            avatar_url: profileData?.photo_url || user?.photoURL,
            // optional fields
            verification_status: "PENDING",
            is_verified: false,
            total_number_of_ratings: 0,
            average_rating: 0,
            is_draft: false,
            
            // Note: 'secretary_email' and 'additional_offerings' added to schema but strictly 
            // excluded here until DB migration is confirmed to prevent crashes.
            // If DB is updated, uncomment below:
            // secretary_email: user?.email,
            // additional_offerings: formData.offerings,
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
            // Stay on page or refresh to verify
            // router.push('/dashboard/specialists'); // Don't redirect if we want them to "edit if they want"
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
      <div className="flex items-center justify-between py-6 sticky top-0 bg-white z-20 border-b border-gray-50 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 truncate max-w-2xl">{formData.title}</h1>
          <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsEditDrawerOpen(true)}
                className="px-5 py-2 text-sm font-semibold text-white bg-[#0f172a] rounded-md hover:bg-gray-800 transition-colors">
                  Edit
              </button>
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="px-5 py-2 text-sm font-semibold text-white bg-[#0e3a8d] rounded-md hover:bg-[#002f70] transition-colors flex items-center gap-2 shadow-sm"
              >
                  {loading && <Loader2 className="h-4 w-4 animate-spin"/>}
                  Publish
              </button>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content (Left Col) */}
          <div className="lg:col-span-8 space-y-10">
              
              {/* Image Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px]">
                  {/* Main Large Image */}
                  <div className="relative bg-gray-50 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-all group overflow-hidden border-2 border-dashed border-gray-200"
                       onClick={() => fileInputRef.current?.click()}>
                      {images[0] ? (
                          <Image src={images[0]} alt="Main Service Image" fill className="object-cover" />
                      ) : (
                        <div className="p-8 text-center">
                          <div className="h-12 w-12 border-2 border-gray-300 rounded-lg flex items-center justify-center mx-auto mb-4">
                             <Upload className="h-6 w-6 text-gray-400" />
                          </div>
                          <p className="text-xs text-gray-400 font-medium max-w-[200px] mx-auto leading-relaxed">
                            Upload an image for your service listing in PNG, JPG or JPEG up to 4MB
                          </p>
                          {uploading && <Loader2 className="h-5 w-5 animate-spin mx-auto mt-2 text-gray-400"/>}
                        </div>
                      )}
                      <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageUpload} accept="image/*" />
                  </div>
                  
                  {/* Secondary Column */}
                  <div className="grid grid-rows-2 gap-4">
                      {/* Top Right Image */}
                      <div className="relative bg-gray-100 rounded-lg overflow-hidden group">
                           {images[1] ? (
                               <Image src={images[1]} alt="Sub 1" fill className="object-cover" />
                           ) : (
                               <div className="absolute inset-0 bg-[#eef1f6] flex flex-col items-center justify-center text-center p-6 relative">
                                    <div className="absolute top-4 right-4 bg-white/80 p-1 rounded">
                                        <div className="h-6 w-8 bg-blue-900/10"></div>
                                    </div>
                                    <h4 className="font-bold text-gray-800 text-lg leading-tight mb-2 drop-shadow-sm">10 Best Company Secretarial in Johor Bahru</h4>
                               </div>
                           )}
                           <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 z-10 opacity-0 cursor-pointer w-full h-full"></button>
                      </div>
                      
                      {/* Bottom Right Image/Card */}
                      <div className="relative bg-[#f1f3f6] rounded-lg overflow-hidden flex items-end">
                           {images[2] ? (
                                <Image src={images[2]} alt="Sub 2" fill className="object-cover" />
                           ) : (
                               <div className="w-full h-full p-6 flex flex-col justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                                   <div className="w-1/2 h-full absolute right-0 bottom-0">
                                       {/* Placeholder for person image cutout */}
                                       <div className="h-full w-full bg-gray-200 rounded-tl-[100px] opacity-20"></div>
                                   </div>
                                   <div className="relative z-10 max-w-[70%]">
                                        <h4 className="font-bold text-lg text-gray-800 leading-snug mb-2">A Company Secretary Represents a Key Role in Any Business. This is Why</h4>
                                        <div className="h-1 w-12 bg-red-500 rounded-full"></div>
                                   </div>
                               </div>
                           )}
                           <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 z-10 opacity-0 cursor-pointer w-full h-full"></button>
                      </div>
                  </div>
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
                  <h3 className="text-xl font-bold text-gray-900 font-sans">Additional Offerings</h3>
                  <p className="text-xs text-gray-400 pb-2">Enhance your service by adding additional offerings</p>
                  <div className="h-[1px] bg-gray-200 w-full"></div>
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
                                      <span>250 Clients</span>
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
                                  Company Secretary firms are professional service providers that manage corporate compliance, company registration, and statutory obligations on behalf of businesses.
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
                                       <div className="text-[10px] text-gray-500">2 Years providing Company Secretarial services</div>
                                  </div>
                              </div>
                          </div>

                          <div className="space-y-3">
                              <h4 className="text-base font-bold text-gray-900">Certifications</h4>
                              <div className="flex items-center gap-4">
                                  {/* Placeholder Cert Logos */}
                                  <div className="h-6 w-12 bg-gray-100 rounded relative overflow-hidden grayscale opacity-70">
                                      <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-gray-400">SSM</div>
                                  </div>
                                  <div className="h-6 w-12 bg-gray-100 rounded relative overflow-hidden grayscale opacity-70">
                                      <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-gray-400">MAICSA</div>
                                  </div>
                                  <div className="h-8 w-8 rounded-full border border-gray-100 flex items-center justify-center grayscale opacity-70">
                                       <div className="h-4 w-4 bg-blue-900/20 rounded-full"></div>
                                  </div>
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
                   <div className="space-y-2">
                       <label className="text-sm font-bold text-gray-700">Estimated Completion Time (Days)</label>
                       <input 
                         type="number"
                         min="1"
                         value={formData.duration}
                         onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value) || 1})}
                         className="w-full p-3 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                       />
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

    </div>
  );
};
