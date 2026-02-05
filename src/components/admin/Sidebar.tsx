"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard,
  Tag, 
  Users, 
  ClipboardList, 
  PenTool, 
  Mail, 
  Receipt, 
  HelpCircle, 
  Settings 
} from "lucide-react";
import Image from "next/image";
import STCLogo from "@/assets/image/STC.png";
  
const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Specialists", href: "/admin/specialists", icon: Tag },
  { name: "Clients", href: "/admin/clients", icon: Users },
  { name: "Orders", href: "/admin/orders", icon: ClipboardList },
  { name: "E-Signatures", href: "/admin/esignature", icon: PenTool },
  { name: "Messages", href: "/admin/messages", icon: Mail },
  { name: "Finance", href: "/admin/invoices", icon: Receipt },
];

const secondaryNavigation = [
  { name: "Help", href: "/admin/help", icon: HelpCircle },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
      <div className="flex h-16 shrink-0 items-center gap-2 mt-4">
         <div className="h-8 w-auto relative">
             <Image
              src={STCLogo}
              alt="STC Logo"
              width={32}
              height={32}
              className="h-8 w-auto object-contain"
             />
         </div>
          <div className="flex flex-col">
              <span className="font-semibold text-gray-900 text-sm">Consistant CoSec Services</span>
              <span className="text-xs text-blue-600 cursor-pointer">Company Secretary - Store</span>
          </div>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <div className="text-xs font-semibold leading-6 text-gray-400">Dashboard</div>
            <ul role="list" className="-mx-2 space-y-1 mt-2">
              {navigation.map((item) => {
                 const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                 return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={classNames(
                      isActive
                        ? "bg-[#0e2a6d] text-white"
                        : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                      "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                    )}
                  >
                    <item.icon
                      className={classNames(
                        isActive ? "text-white" : "text-gray-400 group-hover:text-indigo-600",
                        "h-6 w-6 shrink-0"
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
              {secondaryNavigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                  >
                    <item.icon
                      className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}
