"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/context/AuthContext";
import { Loader2, CheckCircle, ArrowRight, User } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";


export default function ServiceDetailsPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  
  // Guest Checkout State
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [guestDetails, setGuestDetails] = useState({
      name: "",
      email: "",
      phone: "",
      requirements: ""
  });

  useEffect(() => {
    if (slug) {
        const slugStr = Array.isArray(slug) ? slug[0] : slug;
        
        fetch(`/api/specialists?slug=${encodeURIComponent(slugStr)}`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data.length > 0) {
                    setService(data.data[0]);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }
  }, [slug]);

  const handleGuestInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setGuestDetails(prev => ({ ...prev, [name]: value }));
  };

  const handlePurchase = async () => {
      if (!service) return;

      // Validation for Guest
      if (!user && showGuestForm) {
          if (!guestDetails.name || !guestDetails.email || !guestDetails.phone) {
              toast.error("Please fill in all required fields (Name, Email, Phone).");
              return;
          }
      }

      setPurchasing(true);
      try {
          let payload: any = {
              specialistId: service.id,
              amount: service.final_price || service.base_price,
          };

          if (user) {
               // 1. Get User ID from DB
               const profileRes = await fetch(`/api/user/profile?email=${encodeURIComponent(user.email || "")}`);
               const profileData = await profileRes.json();
               
               if (!profileData.success || !profileData.data) {
                   toast.error("User profile not found. Please ensure you are registered.");
                   setPurchasing(false);
                   return;
               }
               payload.userId = profileData.data.id;
          } else {
               // 2. Guest Details
               payload.customerName = guestDetails.name;
               payload.customerEmail = guestDetails.email;
               payload.customerPhone = guestDetails.phone;
               payload.requirements = guestDetails.requirements;
          }

          // 3. Create Order
          const res = await fetch("/api/orders", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
          });
          
          const result = await res.json();
          if (result.success) {
              toast.success("Order placed successfully! We will contact you shortly.");
              if (user) {
                  // Optional: Redirect registered users to dashboard
                  // router.push("/dashboard"); 
              } else {
                  // Reset form for guests
                  setShowGuestForm(false);
                  setGuestDetails({ name: "", email: "", phone: "", requirements: "" });
              }
          } else {
              toast.error("Failed to place order: " + (result.message || "Unknown error"));
          }
      } catch (err) {
          console.error(err);
          toast.error("Error processing request");
      } finally {
          setPurchasing(false);
      }
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-white"><Loader2 className="animate-spin text-blue-900" /></div>;
  
  if (!service) {
      return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="flex flex-col h-[80vh] items-center justify-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Not Found</h2>
                <p className="text-gray-500 mb-6">The service you are looking for does not exist or has been removed.</p>
                <button onClick={() => router.push('/services')} className="px-6 py-2 bg-blue-900 text-white rounded-lg font-bold">Back to Services</button>
            </div>
        </div>
      );
  }

  return (
      <div className="min-h-screen bg-white font-sans">
          <Navbar />
          <div className="container mx-auto px-4 py-12">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                 {/* Left Content */}
                 <div className="lg:col-span-8 space-y-8">
                     
                     {/* Media Section */}
                     <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm">
                         {service.media && service.media.length > 0 ? (
                             <Image 
                                src={service.media[0].url} 
                                alt={service.title} 
                                fill 
                                className="object-cover"
                                priority
                             />
                         ) : (
                             <div className="flex items-center justify-center h-full text-gray-400 bg-gray-50">
                                 <span className="text-sm font-medium">No Image Available</span>
                             </div>
                         )}
                     </div>

                     {/* Title & Description */}
                     <div>
                         <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">{service.title}</h1>
                         
                         <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
                              <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                                     {service.avatar_url ? (
                                         <Image src={service.avatar_url} alt="Pro" width={40} height={40} className="object-cover h-full w-full"/>
                                     ) : (
                                         <User className="h-5 w-5 text-blue-700"/>
                                     )}
                                  </div>
                                  <div>
                                      <div className="text-sm font-bold text-gray-900">{service.secretary_name || "Specialist"}</div>
                                      <div className="text-xs text-gray-500">{service.secretary_company || "Company Secretary"}</div>
                                  </div>
                              </div>
                         </div>

                         <div className="prose max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
                             {service.description}
                         </div>
                     </div>
                 </div>
                 
                 {/* Right Sidebar (Purchase Card) */}
                 <div className="lg:col-span-4">
                     <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                         <div className="flex flex-col gap-1 mb-6">
                             <span className="text-sm font-semibold text-gray-500">Total Price</span>
                             <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-gray-900">RM {Number(service.final_price || service.base_price).toLocaleString()}</span>
                             </div>
                         </div>
                         
                         <div className="space-y-4 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
                             <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                                 <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                                 <span>{service.duration_days} Days Delivery Time</span>
                             </div>
                             <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                                 <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                                 <span>Verified Specialist</span>
                             </div>
                              <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                                 <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                                 <span>Secure Transaction</span>
                             </div>
                         </div>

                         {!user && showGuestForm ? (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-gray-900">Guest Checkout</h3>
                                    <input 
                                        type="text" name="name" placeholder="Your Name *" required
                                        value={guestDetails.name} onChange={handleGuestInputChange}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-sm text-black placeholder:text-black"
                                    />
                                    <input 
                                        type="email" name="email" placeholder="Email Address *" required
                                        value={guestDetails.email} onChange={handleGuestInputChange}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-sm text-black placeholder:text-black"
                                    />
                                    <input 
                                        type="tel" name="phone" placeholder="Phone Number *" required
                                        value={guestDetails.phone} onChange={handleGuestInputChange}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-sm text-black placeholder:text-black"
                                    />
                                    <textarea 
                                        name="requirements" placeholder="Special Requirements (Optional)" rows={3}
                                        value={guestDetails.requirements} onChange={handleGuestInputChange}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-sm resize-none text-black placeholder:text-black"
                                    />
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button 
                                        onClick={() => setShowGuestForm(false)}
                                        className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handlePurchase}
                                        disabled={purchasing}
                                        className="flex-[2] py-3 bg-[#0e3a8d] hover:bg-[#002f70] text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center"
                                    >
                                        {purchasing ? <Loader2 className="animate-spin h-4 w-4"/> : "Confirm Order"}
                                    </button>
                                </div>
                            </div>
                         ) : (
                            <button 
                                onClick={() => user ? handlePurchase() : setShowGuestForm(true)}
                                disabled={purchasing}
                                className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl ${purchasing ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0e3a8d] hover:bg-[#002f70]'}`}
                            >
                                {purchasing ? <Loader2 className="animate-spin h-5 w-5"/> : (user ? "Purchase Service" : "Purchase as Guest")} 
                                {!purchasing && <ArrowRight className="h-5 w-5" />}
                            </button>
                         )}
                         
                         <p className="text-xs text-center text-gray-400 mt-4 leading-relaxed">
                             By clicking Purchase, you agree to our Terms of Service. Your order will be processed immediately.
                         </p>
                     </div>
                 </div>
             </div>
          </div>
      </div>
  );
}

