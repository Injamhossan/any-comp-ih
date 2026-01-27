"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import { Upload, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import uploadIcon from "@/app/assets/image/upload.png";

function CreateSpecialistContent() {
  interface UploadedImage {
    url: string;
    file_name: string;
    mime_type: string;
    file_size: number;
  }

  const router = useRouter();
  // Safe to use useSearchParams here because this component is wrapped in Suspense
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');

  const [basePrice, setBasePrice] = useState<number | string>("");
  const processingFee = typeof basePrice === 'number' ? basePrice * 0.3 : 0;
  const total = typeof basePrice === 'number' ? basePrice + processingFee : 0;
  const [images, setImages] = useState<(UploadedImage | null)[]>([null, null, null]); 
  const [uploading, setUploading] = useState<boolean[]>([false, false, false]);
  const [dragActive, setDragActive] = useState<number | null>(null);

  const handleFile = async (index: number, file: File) => {
      // Set uploading state for this index
      const newUploading = [...uploading];
      newUploading[index] = true;
      setUploading(newUploading);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        
        if (data.success) {
            const newImages = [...images];
            newImages[index] = {
                url: data.url,
                file_name: data.filename,
                mime_type: data.mimeType,
                file_size: data.size
            };
            setImages(newImages);
        } else {
            console.error("Upload failed", data.error);
            alert(`Upload failed: ${data.error}`);
        }
      } catch (err: any) {
          console.error("Upload failed", err);
          alert(`Upload failed: ${err.message}`);
      } finally {
          // Clear uploading state
          setUploading(prev => {
              const u = [...prev];
              u[index] = false;
              return u;
          });
      }
  };

  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(index, file);
  };

  const handleDrag = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(index);
    } else if (e.type === "dragleave") {
      setDragActive(null);
    }
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(index, e.dataTransfer.files[0]);
    }
  };

  const commonUploadClasses = (index: number) => `
    relative rounded-lg overflow-hidden border-2 border-dashed transition-colors flex flex-col items-center justify-center group cursor-pointer
    ${dragActive === index ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50 hover:bg-white hover:border-blue-500"}
  `;
  
  const browseBtnClasses = "bg-[#0e2a6d] text-white px-6 py-2 rounded-full text-sm hover:bg-[rgba(0,47,112,1)] transition-colors";

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load data for edit
  React.useEffect(() => {
    if (editId) {
        fetch(`/api/specialists/${editId}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const s = data.data;
                    setTitle(s.title);
                    setDescription(s.description);
                    setBasePrice(Number(s.base_price));
                    
                    // Map existing media
                    if (s.media && s.media.length > 0) {
                        const existingImages = [null, null, null] as (UploadedImage | null)[];
                        s.media.forEach((m: any) => {
                             if (m.display_order < 3) {
                                 existingImages[m.display_order] = {
                                     url: m.url,
                                     file_name: m.file_name,
                                     mime_type: m.mime_type || "image/jpeg",
                                     file_size: m.file_size || 0
                                 };
                             }
                        });
                        setImages(existingImages);
                    }
                }
            })
            .catch(err => console.error("Failed to fetch specialist", err));
    }
  }, [editId]);

  // Helper to construct payload
  const getPayload = (isDraft: boolean) => {
    // Map mime types to Prisma Enum
    const getMimeTypeEnum = (mime: string) => {
        if (mime === 'image/jpeg' || mime === 'image/jpg') return 'IMAGE_JPEG';
        if (mime === 'image/png') return 'IMAGE_PNG';
        if (mime === 'image/webp') return 'IMAGE_WEBP';
        return 'IMAGE_JPEG'; // Default/Fallback
    };

    const mediaData = images
        .filter((img): img is UploadedImage => img !== null)
        .map((img, index) => ({
            file_name: img.file_name,
            file_size: img.file_size,
            mime_type: getMimeTypeEnum(img.mime_type),
            media_type: 'IMAGE',
            url: img.url,
            display_order: index
        }));

    const payload: any = {
        title,
        description,
        base_price: typeof basePrice === 'number' ? basePrice : 0,
        platform_fee: processingFee,
        final_price: total,
        is_draft: isDraft,
        duration_days: 7, 
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
        // Simple media creation strategy
         media: {
            create: mediaData
        }
    };

    if (editId) {
        // If editing, we delete old media and create new ones for simplicity
        payload.media = {
             deleteMany: {},
             create: mediaData
        };
    }

    return payload;
  };

  const submitToBackend = async (isDraft: boolean) => {
    setIsSubmitting(true);
    try {
      const payload = getPayload(isDraft);
      
      const url = editId ? `/api/specialists/${editId}` : '/api/specialists';
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to save');
      }

      await res.json();
      router.push('/admin'); 
      router.refresh(); 
    } catch (error: any) {
      console.error(error);
      alert(`Error saving specialist: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setShowPublishModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 relative">
      {/* Publish Confirmation Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 animate-in fade-in zoom-in duration-200">
             <div className="flex items-start gap-4 mb-6">
                <div className="text-[#0e2a6d]">
                   <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                   </svg>
                </div>
                <div>
                   <h2 className="text-xl font-bold text-gray-900 mb-2">Publish changes</h2>
                   <p className="text-gray-600 text-sm leading-relaxed">
                      Do you want to publish these changes? It will appear in the marketplace listing
                   </p>
                </div>
             </div>
             
             <div className="flex items-center justify-end gap-3">
                 <button 
                    onClick={() => setShowPublishModal(false)}
                    className="px-6 py-2 rounded border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50"
                 >
                    Continue Editing
                 </button>
                 <button 
                    onClick={() => submitToBackend(false)}
                    disabled={isSubmitting || uploading.some(u => u)}
                    className="px-6 py-2 rounded bg-[#0e2a6d] text-white font-medium text-sm hover:bg-[#002f70] disabled:opacity-50"
                 >
                    {isSubmitting ? "Saving..." : uploading.some(u => u) ? "Uploading images..." : "Save changes"}
                 </button>
             </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center text-xs text-gray-500 gap-1">
            <span>Specialists</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-900 font-medium">{editId ? 'Edit Specialist' : 'Create New'}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left Column) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Title Section */}
            <div>
                 <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter Service Title (e.g. Register a new company | Private Limited - Sdn Bhd)"
                    className="w-full text-2xl font-semibold text-gray-900 bg-transparent border-0 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:ring-0 px-0 placeholder:text-gray-300 transition-colors"
                 />
            </div>

            {/* Image Upload Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-96">
                
                {/* Main Large Upload Area (Index 0) */}
                <div 
                    onClick={() => document.getElementById('file-upload-0')?.click()}
                    onDragEnter={(e) => handleDrag(e, 0)}
                    onDragLeave={(e) => handleDrag(e, 0)}
                    onDragOver={(e) => handleDrag(e, 0)}
                    onDrop={(e) => handleDrop(e, 0)}
                    className={`md:col-span-1 p-8 h-full ${commonUploadClasses(0)}`}
                >
                     <input 
                        type="file" 
                        id="file-upload-0" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => handleImageUpload(0, e)}
                     />
                     {uploading[0] && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80">
                            <span className="text-sm text-blue-600 font-medium">Uploading...</span>
                        </div>
                     )}
                     
                     {images[0] ? (
                        <Image src={images[0].url} alt="Main Preview" fill className="object-cover" />
                     ) : (
                        <>
                            <div className="h-16 w-16 mb-4 relative opacity-50 group-hover:opacity-100 transition-opacity">
                                <Image src={uploadIcon} alt="Upload" fill className="object-contain" />
                            </div>
                            <div className="flex flex-col items-center gap-2 mb-3 z-10">
                                <span className={browseBtnClasses}>
                                    Browse
                                </span>
                                <span className="text-gray-400 text-sm">or</span>
                                <span className="text-gray-400 text-sm">Drag a file to upload</span>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-2">
                                PNG, JPG or JPEG up to 4MB
                            </p>
                        </>
                     )}
                </div>

                {/* Right Side Stacked Images (Indices 1 & 2) */}
                <div className="md:col-span-1 grid grid-rows-2 gap-4 h-full">
                    
                    {/* Top Image Slot (Index 1) */}
                    <div 
                        onClick={() => document.getElementById('file-upload-1')?.click()}
                        onDragEnter={(e) => handleDrag(e, 1)}
                        onDragLeave={(e) => handleDrag(e, 1)}
                        onDragOver={(e) => handleDrag(e, 1)}
                        onDrop={(e) => handleDrop(e, 1)}
                        className={commonUploadClasses(1)}
                    >
                         <input 
                            type="file" 
                            id="file-upload-1" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => handleImageUpload(1, e)}
                         />
                         
                         {uploading[1] && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80">
                                <span className="text-xs text-blue-600 font-medium">Uploading...</span>
                            </div>
                         )}

                         {images[1] ? (
                            <Image src={images[1].url} alt="Secondary Preview" fill className="object-cover" />
                         ) : (
                             <>
                                <div className="h-8 w-8 mb-2 relative opacity-50 group-hover:opacity-100 transition-opacity">
                                    <Image src={uploadIcon} alt="Upload" fill className="object-contain" />
                                </div>
                                <div className="flex flex-col items-center gap-1 z-10">
                                    <span className="bg-[#0e2a6d] text-white px-3 py-1 rounded-full text-[10px] hover:bg-[rgba(0,47,112,1)] transition-colors">
                                        Browse
                                    </span>
                                    <span className="text-[10px] text-gray-400">or Drag a file</span>
                                </div>
                             </>
                         )}
                    </div>

                    {/* Bottom Image Slot (Index 2) */}
                     <div 
                        onClick={() => document.getElementById('file-upload-2')?.click()}
                        onDragEnter={(e) => handleDrag(e, 2)}
                        onDragLeave={(e) => handleDrag(e, 2)}
                        onDragOver={(e) => handleDrag(e, 2)}
                        onDrop={(e) => handleDrop(e, 2)}
                        className={commonUploadClasses(2)}
                    >
                         <input 
                            type="file" 
                            id="file-upload-2" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => handleImageUpload(2, e)}
                         />
                         
                         {uploading[2] && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80">
                                <span className="text-xs text-blue-600 font-medium">Uploading...</span>
                            </div>
                         )}

                         {images[2] ? (
                            <Image src={images[2].url} alt="Tertiary Preview" fill className="object-cover" />
                         ) : (
                             <>
                                <div className="h-8 w-8 mb-2 relative opacity-50 group-hover:opacity-100 transition-opacity">
                                    <Image src={uploadIcon} alt="Upload" fill className="object-contain" />
                                </div>
                                <div className="flex flex-col items-center gap-1 z-10">
                                    <span className="bg-[#0e2a6d] text-white px-3 py-1 rounded-full text-[10px] hover:bg-[rgba(0,47,112,1)] transition-colors">
                                        Browse
                                    </span>
                                    <span className="text-[10px] text-gray-400">or Drag a file</span>
                                </div>
                             </>
                         )}
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-lg mb-4 text-gray-900">Description</h3>
                <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full text-sm text-gray-700 placeholder:text-gray-400 border-gray-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                    placeholder="Describe your service in detail..."
                    rows={6}
                ></textarea>
            </div>

            {/* Additional Offerings */}
             <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Additional Offerings</h3>
                <p className="text-xs text-gray-500 mb-4">Enhance your service by adding additional offerings (optional)</p>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        placeholder="Offering Title" 
                        className="flex-1 text-sm border-gray-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <input 
                        type="number" 
                        placeholder="Price (RM)" 
                        className="w-32 text-sm border-gray-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md text-sm hover:bg-gray-200 font-medium">Add</button>
                </div>
            </div>

            {/* Company Secretary Profile (Now editable) */}
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-lg mb-6 text-gray-900">Company Secretary Profile</h3>
                
                <div className="flex flex-col md:flex-row gap-8">
                     {/* Left: Profile Info */}
                    <div className="flex items-start gap-4">
                        <div className="relative h-14 w-14 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-300">
                             <Upload className="h-6 w-6" />
                        </div>
                        <div className="space-y-2">
                             <input 
                                type="text" 
                                placeholder="Secretary Name" 
                                className="block w-full text-sm font-bold text-gray-900 border-none p-0 focus:ring-0 placeholder:text-gray-300" 
                             />
                             <input 
                                type="text" 
                                placeholder="Company Name (e.g. Corsec Services)" 
                                className="block w-full text-[10px] text-gray-500 border-none p-0 focus:ring-0 placeholder:text-gray-300" 
                             />
                        </div>
                    </div>

                    {/* Middle: Certifications */}
                    <div className="flex-1">
                        <h5 className="text-[10px] font-semibold text-gray-900 mb-2">Qualifications / Certifications</h5>
                         <div className="flex flex-wrap gap-2">
                               <input type="checkbox" id="c1" className="rounded text-blue-600 focus:ring-blue-500 border-gray-300" />
                               <label htmlFor="c1" className="text-xs text-gray-600">MAICSA</label>

                               <input type="checkbox" id="c2" className="rounded text-blue-600 focus:ring-blue-500 border-gray-300 ml-4" />
                               <label htmlFor="c2" className="text-xs text-gray-600">SSM Practicing Cert</label>
                         </div>
                    </div>
                </div>

                <div className="mt-6">
                    <textarea 
                        className="w-full text-xs text-gray-600 border-gray-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        rows={3}
                        placeholder="Enter specific profile description or bio..."
                    ></textarea>
                </div>
            </div>

          </div>

          {/* Right Sidebar (Sticky) */}
          <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                   {/* Action Buttons */}
                   <div className="flex items-center gap-3 justify-end">
                       <button 
                          onClick={() => submitToBackend(true)}
                          disabled={isSubmitting || uploading.some(u => u)}
                          className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded text-xs font-medium hover:bg-gray-50 disabled:opacity-50"
                       >
                           {isSubmitting ? "Saving..." : "Save Draft"}
                       </button>
                        <button 
                          onClick={() => setShowPublishModal(true)}
                          disabled={isSubmitting || uploading.some(u => u)}
                          className="bg-[#0e2a6d] text-white px-6 py-2 rounded text-xs font-medium hover:bg-blue-900 disabled:opacity-50"
                        >
                           Publish
                       </button>
                   </div>

                   {/* Price Card */}
                   <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
                        <h3 className="text-xl font-bold text-gray-900">Professional Fee</h3>
                        <p className="text-xs text-gray-500 mt-1 mb-8">Set a rate for your service</p>

                        <div className="text-center mb-10">
                            <div className="flex items-center justify-center gap-1 border-b-2 border-gray-900 pb-1 w-full">
                                <span className="text-2xl font-bold text-gray-900">RM</span>
                                <input 
                                    type="number" 
                                    placeholder="0.00"
                                    value={basePrice}
                                    onChange={(e) => setBasePrice(e.target.value === "" ? "" : parseFloat(e.target.value))}
                                    className="text-4xl font-bold text-gray-900 border-none focus:ring-0 p-0 w-32 text-center placeholder:text-gray-200"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 text-xs">
                             <div className="flex justify-between text-gray-600">
                                 <span>Base price</span>
                                 <span className="font-medium text-gray-900">RM {typeof basePrice === 'number' ? basePrice.toFixed(2) : '0.00'}</span>
                             </div>
                             <div className="flex justify-between text-gray-600 border-b border-gray-100 pb-4">
                                 <span className="cursor-help">Service processing fee (30%)</span>
                                 <span className="font-medium text-gray-900">RM {processingFee.toFixed(2)}</span>
                             </div>
                             <div className="flex justify-between text-gray-600 font-medium pt-1">
                                 <span>Total Client Pays</span>
                                 <span>RM {total.toFixed(2)}</span>
                             </div>
                             
                             <div className="pt-6 mt-6 border-t border-gray-100 flex justify-between items-center">
                                 <span className="font-semibold text-gray-900">Your returns</span>
                                 <span className="font-bold text-lg text-gray-900">RM {typeof basePrice === 'number' ? basePrice.toFixed(2) : '0.00'}</span>
                             </div>
                        </div>
                   </div>
              </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function CreateSpecialistPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CreateSpecialistContent />
        </Suspense>
    );
}
