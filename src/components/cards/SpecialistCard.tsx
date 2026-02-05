"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface SpecialistCardProps {
  imageSrc?: string;
  avatarSrc?: string;
  companyLogoSrc?: string; // New prop for company logo
  name: string;
  role: string;
  companyName?: string; // New prop for company name
  title?: string;
  description: string;
  price: string;
}

export default function SpecialistCard({
  imageSrc,
  avatarSrc,
  companyLogoSrc,
  name,
  role,
  companyName,
  description,
  price,
}: SpecialistCardProps) {
  const sanitizeUrl = (url?: string) => {
      if (!url) return "/placeholder-avatar.svg";
      if (url.startsWith("http") || url.startsWith("data:")) return url;
      // Fix backslashes for windows paths stored in DB accidentally
      let clean = url.replace(/\\/g, '/');
      // Ensure leading slash for local paths if missing
      if (!clean.startsWith('/')) clean = '/' + clean;
      return clean;
  };

  const [currentAvatar, setCurrentAvatar] = useState(sanitizeUrl(avatarSrc));
  const [currentLogo, setCurrentLogo] = useState(sanitizeUrl(companyLogoSrc) === "/placeholder-avatar.svg" ? undefined : sanitizeUrl(companyLogoSrc));

  useEffect(() => {
      setCurrentAvatar(sanitizeUrl(avatarSrc));
  }, [avatarSrc]);

  useEffect(() => {
      const logo = sanitizeUrl(companyLogoSrc);
      setCurrentLogo(logo === "/placeholder-avatar.svg" ? undefined : logo);
  }, [companyLogoSrc]);

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl bg-transparent">
      {/* Main Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100">
        {imageSrc ? (
            <div className="w-full h-full relative">
                 <Image 
                    src={imageSrc}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
            </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-4 flex flex-col gap-2">
        {/* User Info & Company Info */}
        <div className="flex items-start gap-3">
            <div className="flex items-center -space-x-2 overflow-hidden py-1 pl-1">
                {/* Avatar */}
                <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-gray-200 relative shrink-0">
                    <Image 
                        src={currentAvatar} 
                        alt={name} 
                        fill 
                        className="object-cover"
                        onError={() => setCurrentAvatar("/placeholder-avatar.svg")}
                    />
                </div>
                {/* Company Logo */}
                {currentLogo && (
                    <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-gray-100 relative shrink-0 z-10">
                        <Image 
                            src={currentLogo} 
                            alt="Company" 
                            fill 
                            className="object-cover" 
                            onError={() => setCurrentLogo(undefined)} // Hide if broken
                        />
                    </div>
                )}
            </div>
            
            <div className="flex flex-col">
                <span className="font-bold text-gray-900 text-sm">{name}</span>
                <span className="text-gray-500 text-xs">
                    {role} {companyName ? `| ${companyName}` : ""}
                </span>
            </div>
        </div>

        {/* Description */}
        <p className="text-sm leading-snug text-gray-600 line-clamp-2 mt-1">
          {description}
        </p>

        {/* Price */}
        <div className="mt-1 text-base font-bold text-gray-900">
          {price}
        </div>
      </div>
    </div>
  );
}
