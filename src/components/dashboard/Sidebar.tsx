"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Building2, 
  ClipboardList, 
  Settings,
  HelpCircle,
  User,
  PenTool,
  MessageSquare,
  Receipt
} from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

const navigation = [
  { name: "Services", href: "/dashboard/services/create", icon: LayoutDashboard },
  { name: "My Companies", href: "/dashboard/companies", icon: Building2 },
  { name: "Register Company", href: "/register-your-company", icon: Building2 }, // Distinct Route
  { name: "Service Orders", href: "/dashboard/orders", icon: ClipboardList },
  { name: "eSignature", href: "/dashboard/esignature", icon: PenTool },
  { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { name: "Invoices & Receipts", href: "/dashboard/invoices", icon: Receipt },
];

// Map "Specialists" to Overview for now or keep as is?
// The user asked for "airokom" (like this). The image has "Specialists". 
// A client user probably searches for specialists. 

const secondaryNavigation = [
  { name: "Help", href: "/dashboard/help", icon: HelpCircle },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function UserSidebar() {
  const pathname = usePathname();
   const { user } = useAuth();
  const [profileData, setProfileData] = useState<{name?: string, image?: string, company_name?: string, company_logo_url?: string}>({});
  const [companyName, setCompanyName] = useState<string>("Loading...");
  const [hasCompany, setHasCompany] = useState(false);

  useEffect(() => {
      if (user?.email) {
          fetch(`/api/user/profile?email=${encodeURIComponent(user.email)}`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    const profile = data.data;
                    setProfileData(profile);
                    
                    const name = profile.company_name || 
                               (profile.registrations && profile.registrations[0]?.companyName) || 
                               "No Company Registered";
                    setCompanyName(name);
                    setHasCompany(!!(profile.company_name || (profile.registrations && profile.registrations.length > 0)));
                } else {
                    setCompanyName("No Company Registered");
                }
            })
            .catch(() => {
                setCompanyName("No Company Registered");
            });
      }
  }, [user]);

  // Filter navigation: Hide "Register Company" if user already has a company
  const filteredNavigation = navigation.filter(item => {
      if (item.name === "Register Company" && hasCompany) return false;
      return true;
  });

  // Use profile data if available, fallback to user session
  const displayName = profileData.name || user?.name || "User";
  const displayImage = profileData.image || profileData.company_logo_url || user?.image;

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 py-6">
      
      {/* Profile Section */}
      <div className="flex flex-col gap-4 mb-4">
          <h2 className="text-xl font-bold text-gray-900">Profile</h2>
          <Link 
            href="/dashboard/settings" 
            className="flex items-center gap-3 hover:bg-gray-50 p-2 -mx-2 rounded-lg transition-colors cursor-pointer group"
            title="Edit Profile"
          >
              <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden relative border border-gray-100 group-hover:border-blue-200 transition-colors">
                  {displayImage ? (
                      <Image src={displayImage} alt="Profile" fill className="object-cover" />
                  ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400">
                          <User className="h-6 w-6" />
                      </div>
                  )}
              </div>
              <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors">
                      {user?.name || "User"}
                  </span>
                  <span className="text-xs text-blue-600 truncate font-medium">
                      {companyName}
                  </span>
              </div>
          </Link>
      </div>

      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <div className="text-xs font-medium leading-6 text-gray-400 mb-2">Dashboard</div>
            <ul role="list" className="-mx-2 space-y-1">
              {filteredNavigation.map((item) => {
                 const isActive = pathname === item.href;
                 return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={classNames(
                      isActive
                        ? "bg-[#0e2a6d] text-white"
                        : "text-gray-600 hover:bg-gray-50 hover:text-[#0e2a6d]",
                      "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-colors"
                    )}
                  >
                    <item.icon
                      className={classNames(
                        isActive ? "text-white" : "text-gray-400 group-hover:text-[#0e2a6d]",
                        "h-5 w-5 shrink-0 transition-colors"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                </li>
              )})}
            </ul>
          </li>
          
          <li className="mt-auto">
            <ul role="list" className="-mx-2 space-y-1">
              {secondaryNavigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={classNames(
                        isActive
                        ? "bg-gray-50 text-[#0e2a6d]"
                        : "text-gray-600 hover:bg-gray-50 hover:text-[#0e2a6d]",
                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-colors"
                    )}
                  >
                    <item.icon
                      className={classNames(
                        isActive ? "text-[#0e2a6d]" : "text-gray-400 group-hover:text-[#0e2a6d]",
                        "h-5 w-5 shrink-0 transition-colors"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                </li>
              )})}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}
