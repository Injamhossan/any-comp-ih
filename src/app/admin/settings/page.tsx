"use client";


import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useState, useRef } from "react";
import { Loader2, Camera, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
      name: "",
      email: "",
      phone: "",
      photoUrl: "",
      description: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user?.email) {
        setFormData(prev => ({ 
            ...prev, 
            email: user.email!, 
            name: user.displayName || "",
            photoUrl: user.photoURL || "" 
        }));
        
        fetch(`/api/user/profile?email=${encodeURIComponent(user.email)}`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    setFormData(prev => ({
                        ...prev,
                        name: data.data.name || user.displayName || "",
                        phone: data.data.phone || "",
                        photoUrl: data.data.photo_url || user.photoURL || "",
                        description: data.data.description || "",
                    }));
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }
  }, [user]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
              const newPhotoUrl = result.url;
              setFormData(prev => ({ ...prev, photoUrl: newPhotoUrl }));

              // Immediate Save
              await fetch('/api/user/profile', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                      email: user?.email, 
                      photoUrl: newPhotoUrl,
                      name: formData.name, 
                      phone: formData.phone,
                      description: formData.description,
                  })
              });

              toast.success("Profile photo updated");
              window.location.reload();
          } else {
              toast.error("Upload failed");
          }
      } catch (err) {
          console.error(err);
      } finally {
          setUploading(false);
      }
  };

  const handleSave = async () => {
      setSaving(true);
      try {
          const res = await fetch('/api/user/profile', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  email: formData.email,
                  name: formData.name,
                  phone: formData.phone,
                  photoUrl: formData.photoUrl,
                  description: formData.description,
              })
          });
          const data = await res.json();

          if (data.success) {
              toast.success("Admin profile updated successfully!");
              window.location.reload();
          } else {
              toast.error("Failed to update profile: " + data.message);
          }
      } catch (error) {
          console.error(error);
          toast.error("An error occurred.");
      } finally {
          setSaving(false);
      }
  };


  return (
    <div className="flex-1 bg-white min-h-screen font-sans text-gray-900 px-6 py-8">
      <div className="mb-8">
         <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
         <p className="mt-1 text-sm text-gray-500">Manage your administrative profile.</p>
      </div>

      <div className="space-y-6 max-w-4xl">
         {/* Profile Card */}
         <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-gray-100">
                 <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
             </div>
             
             <div className="p-6 space-y-8">
                {loading ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin text-gray-400"/></div>
                ) : (
                    <>
                        {/* Avatar */}
                        <div className="flex items-center gap-6">
                            <div className="relative group">
                                <div className="h-24 w-24 rounded-full bg-gray-100 overflow-hidden border-2 border-gray-200 relative">
                                    {formData.photoUrl ? (
                                        <Image src={formData.photoUrl} alt="Profile" fill className="object-cover" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-gray-400 bg-gray-50">
                                            <UserIcon className="h-10 w-10" />
                                        </div>
                                    )}
                                    {uploading && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <Loader2 className="h-6 w-6 text-white animate-spin" />
                                        </div>
                                    )}
                                </div>
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-md border border-gray-200 text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                    <Camera className="h-4 w-4" />
                                </button>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleImageUpload} 
                                    className="hidden" 
                                    accept="image/*"
                                />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900">Profile Photo</h4>
                                <p className="text-xs text-gray-500 mt-1">This will be displayed on your admin profile.</p>
                            </div>
                        </div>

                        {/* Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input 
                                    type="text" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full rounded-md border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3 border"
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input 
                                    type="email" 
                                    value={formData.email}
                                    disabled
                                    className="w-full rounded-md border-gray-200 bg-gray-50 text-gray-500 shadow-sm sm:text-sm py-2.5 px-3 border cursor-not-allowed"
                                />
                            </div>
                             <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input 
                                    type="tel" 
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    className="w-full rounded-md border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3 border"
                                />
                            </div>
                             <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bio / Notes</label>
                                <textarea 
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    placeholder="Admin notes or bio..."
                                    className="w-full rounded-md border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3 border resize-none"
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                             <button 
                                onClick={handleSave}
                                disabled={saving || uploading}
                                className="bg-[#0e2a6d] text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-[#002f70] disabled:opacity-50 flex items-center gap-2"
                            >
                                {saving && <Loader2 className="h-4 w-4 animate-spin"/>}
                                Save Changes
                            </button>
                        </div>
                    </>
                )}
             </div>
         </div>

         {/* Account Actions */}
         <div className="bg-white rounded-xl border border-red-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-red-50 bg-red-50/30">
                <h3 className="text-lg font-semibold text-red-700">Account Access</h3>
            </div>
            <div className="p-6">
                <p className="text-sm text-gray-600 mb-4">Securely sign out of your admin session.</p>
                <button 
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="bg-white text-red-700 hover:bg-red-50 border border-red-200 px-6 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
                >
                    Sign Out
                </button>
            </div>
         </div>
      </div>
    </div>
  );
}
