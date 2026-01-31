"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import SpecialistCard from "@/components/SpecialistCard";
import { ChevronRight, Home, ChevronDown } from "lucide-react";

// Interface matching the backend response
interface Specialist {
  id: string;
  title: string;
  description: string;
  final_price: number;
  duration_days: number;
  is_draft: boolean;
  secretary_name?: string;
  secretary_company?: string;
  avatar_url?: string;
  media?: { url: string }[];
}

export default function Page() {
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecialists = async () => {
      try {
        const res = await fetch('/api/specialists');
        const data = await res.json();
        if (data.success) {
          // Filter out drafts for public view
          const published = data.data.filter((s: Specialist) => !s.is_draft);
          setSpecialists(published);
        }
      } catch (error) {
        console.error("Failed to fetch specialists", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialists();
  }, []);

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
          {loading ? (
             <div className="col-span-full py-20 text-center text-gray-500">Loading services...</div>
          ) : specialists.length === 0 ? (
             <div className="col-span-full py-20 text-center text-gray-500">No services found.</div>
          ) : (
            specialists.map((specialist) => (
              <SpecialistCard
                key={specialist.id}
                imageSrc={specialist.media?.[0]?.url} 
                avatarSrc={specialist.avatar_url || "/placeholder-avatar.png"}
                name={specialist.secretary_name || "Company Secretary"}
                role="Company Secretary"
                description={specialist.title} // Displaying the Title as the main description text on card
                price={`RM ${Number(specialist.final_price).toLocaleString()}`}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}


