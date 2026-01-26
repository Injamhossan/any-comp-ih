import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import SpecialistCard from "@/components/SpecialistCard";
import { ChevronRight, Home, SlidersHorizontal, ChevronDown } from "lucide-react";

// Mock data to match the screenshot
const SPECIALISTS = [
  {
    id: 1,
    name: "Adam Low",
    role: "Company Secretary",
    description: "Register your Company with the best Company Secretary in KL",
    price: "RM 1,600",
    imageSrc: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800", // Business man
    avatarSrc: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100",
  },
  {
    id: 2,
    name: "Jessica Law",
    role: "Company Secretary",
    description: "Register your Company with the best Company Secretary in KL",
    price: "RM 1,600",
    imageSrc: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800", // Business woman
    avatarSrc: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100",
  },
  {
    id: 3,
    name: "Stacey Lim",
    role: "Company Secretary",
    description: "Register your Company with the best Company Secretary in KL",
    price: "RM 1,600",
    imageSrc: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800", // Another woman
    avatarSrc: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100",
  },
  {
    id: 4,
    name: "Stacey Lim",
    role: "Company Secretary",
    description: "Register your Company with the best Company Secretary in KL",
    price: "RM 1,600",
    imageSrc: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=800", // Woman professional
    avatarSrc: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=100",
  },
  {
    id: 5,
    name: "Sarah Wong",
    role: "Company Secretary",
    description: "Register your Company with the best Company Secretary in KL",
    price: "RM 1,600",
    imageSrc: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=800", // Woman glasses
    avatarSrc: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=100",
  },
  {
    id: 6,
    name: "Siddesh A/L",
    role: "Company Secretary",
    description: "Register your Company with the best Company Secretary in KL",
    price: "RM 1,600",
    imageSrc: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800", // Man yellow bg
    avatarSrc: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=100",
  },
  {
    id: 7,
    name: "Siti Hisham",
    role: "Company Secretary",
    description: "Register your Company with the best Company Secretary in KL",
    price: "RM 1,600",
    imageSrc: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800", // Hijab
    avatarSrc: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=100",
  },
  {
    id: 8,
    name: "Alia Marissa",
    role: "Company Secretary",
    description: "Register your Company with the best Company Secretary in KL",
    price: "RM 1,600",
    imageSrc: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800", // Team working
    avatarSrc: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=100",
  },
  {
    id: 9,
    name: "Sarah Wong",
    role: "Company Secretary",
    description: "Register your Company with the best Company Secretary in KL",
    price: "RM 1,600",
    imageSrc: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800", // Handshake
    avatarSrc: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=100",
  },
  {
    id: 10,
    name: "John Doe",
    role: "Company Secretary",
    description: "Register your Company with the best Company Secretary in KL",
    price: "RM 1,600",
    imageSrc: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=800", // Man glasses
    avatarSrc: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=100",
  },
  {
    id: 11,
    name: "Jane Smith",
    role: "Company Secretary",
    description: "Register your Company with the best Company Secretary in KL",
    price: "RM 1,600",
    imageSrc: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800", // Meeting
    avatarSrc: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=100",
  },
  {
    id: 12,
    name: "Devid Kumar",
    role: "Company Secretary",
    description: "Register your Company with the best Company Secretary in KL",
    price: "RM 1,600",
    imageSrc: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800", // Man suit
    avatarSrc: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100",
  }
];

export default function Page() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Navbar />

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-black">
             <Home className="h-3 w-3" />
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="#" className="hover:text-black">Specialists</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-900 font-medium">Register a New Company</span>
        </nav>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Register a New Company
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            Get Your Company Registered with a Trusted Specialists
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-8">
          <button className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50">
            Price
            <ChevronDown className="h-3 w-3 text-gray-400" />
          </button>
          <button className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50">
            Sort by
            <ChevronDown className="h-3 w-3 text-gray-400" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {SPECIALISTS.map((specialist) => (
            <SpecialistCard
              key={specialist.id}
              imageSrc={specialist.imageSrc}
              avatarSrc={specialist.avatarSrc}
              name={specialist.name}
              role={specialist.role}
              description={specialist.description}
              price={specialist.price}
            />
          ))}
        </div>
      </main>
    </div>
  );
}


