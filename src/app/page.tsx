"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import SpecialistCard from "@/components/cards/SpecialistCard";
import { ChevronRight, Home, ChevronDown } from "lucide-react";

// Interface matching the backend response
interface Specialist {
  id: string;
  title: string;
  description: string;
  final_price: number;
  duration_days: number;
  is_draft: boolean;
  verification_status?: string; // Added field
  secretary_name?: string;
  secretary_company?: string;
  avatar_url?: string;
  media?: { url: string }[];
  created_at?: string;
}

export default function Page() {
    const [specialists, setSpecialists] = useState<Specialist[]>([]);
    const [loading, setLoading] = useState(true);
    const [openFilter, setOpenFilter] = useState<string | null>(null);
    const [sortOption, setSortOption] = useState<string>("recommended");
    const [priceRange, setPriceRange] = useState<[number, number] | null>(null);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = () => setOpenFilter(null);
        if (openFilter) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => document.removeEventListener('click', handleClickOutside);
    }, [openFilter]);

    useEffect(() => {
        const fetchSpecialists = async () => {
        try {
            const res = await fetch('/api/specialists');
            const data = await res.json();
            if (data.success) {
            // Filter out drafts and unverified services for public view
            const published = data.data.filter((s: Specialist) => !s.is_draft && s.verification_status === "VERIFIED");
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

    // Derived state for filtering and sorting
    const processedSpecialists = [...specialists]
        .filter(s => {
             if (!priceRange) return true;
             return s.final_price >= priceRange[0] && s.final_price <= priceRange[1];
        })
        .sort((a, b) => {
             // Basic sort logic
             if (sortOption === "price_asc") return a.final_price - b.final_price;
             if (sortOption === "price_desc") return b.final_price - a.final_price;
             if (sortOption === "newest") return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime(); // Assuming created_at exists, added to interface if needed or fallback
             return 0; // recommended / default
        });
        
    const handleFilterClick = (e: React.MouseEvent, filterName: string) => {
        e.stopPropagation();
        setOpenFilter(openFilter === filterName ? null : filterName);
    }

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
        <div className="flex items-center gap-3 mb-8 relative">
          {/* Price Filter */}
          <div className="relative">
              <button 
                 onClick={(e) => handleFilterClick(e, 'price')}
                 className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors ${priceRange ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-200 text-gray-700 bg-white'}`}
              >
                Price
                <ChevronDown className={`h-3 w-3 transition-transform ${openFilter === 'price' ? 'rotate-180' : ''}`} />
              </button>
              
              {openFilter === 'price' && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-20" onClick={e => e.stopPropagation()}>
                       <h4 className="font-semibold text-sm mb-3 text-gray-900">Price Range</h4>
                       <div className="space-y-2">
                           <button 
                             onClick={() => { setPriceRange(null); setOpenFilter(null); }}
                             className={`w-full text-left px-3 py-2 rounded-lg text-sm ${!priceRange ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-50 text-gray-700'}`}
                           >
                               Any Price
                           </button>
                           <button 
                             onClick={() => { setPriceRange([0, 2000]); setOpenFilter(null); }}
                             className={`w-full text-left px-3 py-2 rounded-lg text-sm ${priceRange?.[1] === 2000 ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-50 text-gray-700'}`}
                           >
                               Under RM 2,000
                           </button>
                           <button 
                             onClick={() => { setPriceRange([2000, 3000]); setOpenFilter(null); }}
                             className={`w-full text-left px-3 py-2 rounded-lg text-sm ${priceRange?.[0] === 2000 && priceRange?.[1] === 3000 ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-50 text-gray-700'}`}
                           >
                               RM 2,000 - RM 3,000
                           </button>
                           <button 
                             onClick={() => { setPriceRange([3000, 10000]); setOpenFilter(null); }}
                             className={`w-full text-left px-3 py-2 rounded-lg text-sm ${priceRange?.[0] === 3000 ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-50 text-gray-700'}`}
                           >
                               Above RM 3,000
                           </button>
                       </div>
                  </div>
              )}
          </div>

          {/* Sort Filter */}
          <div className="relative">
              <button 
                onClick={(e) => handleFilterClick(e, 'sort')}
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Sort by: <span className="text-gray-900 font-semibold">{sortOption === 'recommended' ? 'Recommended' : sortOption === 'price_asc' ? 'Price: Low to High' : sortOption === 'price_desc' ? 'Price: High to Low' : 'Newest'}</span>
                <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform ${openFilter === 'sort' ? 'rotate-180' : ''}`} />
              </button>

              {openFilter === 'sort' && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-20" onClick={e => e.stopPropagation()}>
                       {[
                           {id: 'recommended', label: 'Recommended'},
                           {id: 'newest', label: 'Newest Arrivals'},
                           {id: 'price_asc', label: 'Price: Low to High'},
                           {id: 'price_desc', label: 'Price: High to Low'},
                       ].map(opt => (
                           <button
                             key={opt.id}
                             onClick={() => { setSortOption(opt.id); setOpenFilter(null); }}
                             className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${sortOption === opt.id ? 'text-blue-600 font-semibold bg-blue-50' : 'text-gray-700'}`}
                           >
                               {opt.label}
                           </button>
                       ))}
                  </div>
              )}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
             <div className="col-span-full py-20 text-center text-gray-500">Loading services...</div>
          ) : processedSpecialists.length === 0 ? (
             <div className="col-span-full py-20 text-center text-gray-500">No services found.</div>
          ) : (
            processedSpecialists.map((specialist) => (
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


