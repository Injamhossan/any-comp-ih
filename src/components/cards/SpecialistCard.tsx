"use client";

import React from "react";
import Image from "next/image";

interface SpecialistCardProps {
  imageSrc?: string;
  avatarSrc?: string;
  name: string;
  role: string;
  title?: string; // Optional if we want a title overlay like "Brand Strategy"
  description: string;
  price: string;
}

export default function SpecialistCard({
  imageSrc,
  avatarSrc,
  name,
  role,
  description,
  price,
}: SpecialistCardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl bg-transparent">
      {/* Main Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100">
        {imageSrc ? (
            <div className="w-full h-full relative">
                 <Image // Using next/image requires width/height or fill. Using fill for responsive.
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
        {/* User Info */}
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 overflow-hidden rounded-full bg-gray-200 relative">
            {avatarSrc && <Image src={avatarSrc} alt={name} fill className="object-cover" />}
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span className="font-bold text-gray-900">{name}</span>
            <span className="text-gray-500">- {role}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm leading-snug text-gray-600 line-clamp-2">
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
