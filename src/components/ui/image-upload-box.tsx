
import React, { useRef, useState } from 'react';
import { Cloud, ArrowUp, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

interface ImageUploadBoxProps {
  image?: string;
  onUpload: (url: string) => void;
  onDelete?: () => void;
  isLoading?: boolean;
  label?: string;
  className?: string;
  height?: string; 
}

export function ImageUploadBox({ 
    image, 
    onUpload, 
    onDelete, 
    isLoading = false,
    label = "Upload Image",
    className = "",
    height = "h-[190px]"
}: ImageUploadBoxProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
              onUpload(result.url);
              toast.success("Image uploaded successfully");
          } else {
              toast.error("Upload failed: " + (result.error || "Unknown error"));
          }
      } catch (err) {
          console.error(err);
          toast.error("Error uploading image");
      } finally {
          setUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
      }
  };

  const isBusy = isLoading || uploading;

  return (
    <div className={`relative ${className}`}>
        <div 
            className={`relative rounded-xl border-dashed border-2 flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden bg-white group
                ${height} ${isBusy ? 'opacity-70 pointer-events-none' : ''}
                ${image ? 'border-solid border-gray-200 p-0' : 'border-gray-300 hover:bg-gray-50'}
            `}
            onClick={() => {
                if (!image && !isBusy) {
                    fileInputRef.current?.click();
                }
            }}
        >
            {isBusy && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/50">
                    <Loader2 className="h-8 w-8 text-[#0e2a6d] animate-spin" />
                </div>
            )}

            {image ? (
                <>
                    <Image src={image} alt="Uploaded content" fill className="object-cover" />
                    {onDelete && (
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                            }}
                            className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-red-50 text-gray-700 hover:text-red-500 rounded-lg backdrop-blur-sm transition-colors z-10"
                        >
                            <Trash2 className="h-5 w-5" />
                        </button>
                    )}
                    {/* Add an Edit/Replace button overlay on hover */}
                     <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
                         <button
                            onClick={(e) => {
                                e.stopPropagation();
                                fileInputRef.current?.click();
                            }}
                            className="text-white text-xs font-medium hover:underline"
                         >
                            Click to Replace
                         </button>
                     </div>
                </>
            ) : (
                <div className="flex flex-col items-center text-center p-4">
                    <div className="mb-3 relative">
                        <Cloud className="h-10 w-10 text-blue-900/80" strokeWidth={1.5} />
                        <ArrowUp className="h-4 w-4 text-blue-900 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" strokeWidth={3} />
                    </div>
                    <span className="bg-[#0e2a6d] text-white rounded-full font-bold px-5 py-1.5 text-xs mb-2 transition-colors group-hover:bg-[#001f5c]">
                        {label}
                    </span>
                    <span className="text-gray-400 text-[10px] uppercase tracking-wider">Drag & Drop or Click</span>
                </div>
            )}
        
        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*"
        />
        </div>
    </div>
  );
}
