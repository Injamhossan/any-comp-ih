"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Mail, Bell, User, ChevronDown, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import { app } from "@/firebase/firebase.config";

const auth = getAuth(app);

export default function Navbar() {
  const { user, loading } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    setIsProfileOpen(false);
  };

  return (
    <nav className="border-b border-gray-100 bg-white py-4">
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-01.png"
              alt="Anycomp"
              width={140}
              height={40}
              className="h-8 w-auto object-contain"
              priority
              unoptimized
            />
          </Link>

          {/* Nav Links */}
          <div className="hidden items-center gap-6 xl:flex">
            <Link
              href="/register-company"
              className="text-sm font-medium text-gray-600 hover:text-black"
            >
              Start Incorporation
            </Link>
            <Link
              href="/appoint-secretary"
              className="text-sm font-medium text-gray-600 hover:text-black"
            >
              Appoint a Company Secretary
            </Link>
            <Link
               href="/services"
               className="flex items-center gap-1 cursor-pointer group text-sm font-medium text-gray-600 hover:text-black"
            >
              <span className="group-hover:text-black">
                Company Secretarial Services
              </span>
              <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-black" />
            </Link>
            <Link
              href="/how-it-works"
              className="text-sm font-medium text-gray-600 hover:text-black"
            >
              How Anycomp Works
            </Link>
          </div>
        </div>

        {/* Right Side: Search & Icons */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative hidden lg:block">
            <input
              type="text"
              placeholder="Search for any services"
              className="h-9 w-64 rounded bg-gray-50 border border-gray-200 px-3 pr-10 text-sm text-gray-700 focus:border-gray-300 focus:outline-none placeholder:text-gray-400"
            />
            <button className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-r bg-[#1e2b4d] text-white">
              <Search className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-4 border-l border-gray-200 pl-4">
            {!loading ? (
              user ? (
                <>
                  <button className="text-gray-500 hover:text-black">
                    <Mail className="h-5 w-5" />
                  </button>
                  <button className="text-gray-500 hover:text-black">
                    <Bell className="h-5 w-5" />
                  </button>
                  <div className="relative">
                    <button 
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="h-8 w-8 overflow-hidden rounded-full border border-gray-200"
                    >
                      {user.photoURL ? (
                        <Image 
                           src={user.photoURL} 
                           alt={user.displayName || "User"} 
                           width={32} 
                           height={32} 
                           className="object-cover h-full w-full"
                        />
                      ) : (
                         <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-500">
                           <User className="h-5 w-5" />
                         </div>
                      )}
                    </button>
                    
                    {/* Dropdown Menu */}
                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                        <div className="px-4 py-2 border-b">
                            <p className="text-sm font-medium truncate">{user.displayName || "User"}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        {user.email === "admin@anycomp.com" ? (
                          <Link
                            href="/admin"
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <LayoutDashboard className="h-4 w-4" />
                            Admin Dashboard
                          </Link>
                        ) : (
                          <Link
                            href="/dashboard"
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <Link
                    href="/login"
                    className="text-sm font-medium text-gray-700 hover:text-black"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/80"
                  >
                    Sign Up
                  </Link>
                </div>
              )
            ) : (
              // Loading skeleton or null
              <div className="h-8 w-20 bg-gray-100 animate-pulse rounded"></div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
