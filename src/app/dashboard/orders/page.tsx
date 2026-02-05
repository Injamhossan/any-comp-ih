
"use client";

import { ClipboardList, Search, Loader2, ArrowRight, Store, ShoppingBag } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";

export default function OrdersPage() {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [isSpecialist, setIsSpecialist] = useState(false);
  const [activeTab, setActiveTab] = useState<'purchases' | 'sales'>('purchases');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
        if (!user?.email) return;

        try {
            setLoading(true);

            // 1. Get User Profile for Purchases
            const profileRes = await fetch(`/api/user/profile?email=${encodeURIComponent(user.email)}`);
            const profileData = await profileRes.json();
            
            if (profileData.success && profileData.data) {
                // Fetch Purchases
                const pRes = await fetch(`/api/orders?userId=${profileData.data.id}`);
                const pData = await pRes.json();
                if (pData.success) setPurchases(pData.data);
            }

            // 2. Get Specialist Profile for Sales
            const specRes = await fetch(`/api/specialists?email=${encodeURIComponent(user.email)}`);
            const specData = await specRes.json();

            if (specData.success && specData.data.length > 0) {
                const specialist = specData.data[0];
                setIsSpecialist(true);
                
                // Fetch Sales
                const sRes = await fetch(`/api/orders?specialistId=${specialist.id}`);
                const sData = await sRes.json();
                if (sData.success) setSales(sData.data);
            }

        } catch (e) {
            console.error("Failed to load orders", e);
        } finally {
            setLoading(false);
        }
    }

    fetchData();
  }, [user]);

  if (loading) {
      return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-blue-900 h-8 w-8"/></div>;
  }

  const ordersToDisplay = activeTab === 'purchases' ? purchases : sales;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
           <p className="text-gray-500 text-sm mt-1">Track your purchases and client orders.</p>
        </div>
      </div>

      {isSpecialist && (
        <div className="flex p-1 bg-gray-100 rounded-xl w-fit">
            <button
                onClick={() => setActiveTab('purchases')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'purchases' ? 'bg-white text-blue-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <ShoppingBag className="h-4 w-4" />
                My Purchases
                <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full text-[10px] ml-1">{purchases.length}</span>
            </button>
            <button
                onClick={() => setActiveTab('sales')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'sales' ? 'bg-white text-blue-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <Store className="h-4 w-4" />
                Client Orders
                <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full text-[10px] ml-1">{sales.length}</span>
            </button>
        </div>
      )}

      {/* Filters / Search */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
         <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
                type="text" 
                placeholder="Search orders..." 
                className="w-full pl-10 h-10 rounded-md border-gray-200 text-sm focus:border-blue-500 focus:ring-0 text-black placeholder:text-gray-500"
            />
         </div>
      </div>

      {ordersToDisplay.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px] flex flex-col items-center justify-center text-center p-8">
              <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                 <ClipboardList className="h-8 w-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No Orders Found</h3>
              <p className="text-gray-500 text-sm max-w-sm mt-2">
                {activeTab === 'purchases' 
                    ? "You haven't placed any orders yet." 
                    : "You haven't received any orders yet."}
              </p>
          </div>
      ) : (
          <div className="grid grid-cols-1 gap-4">
              {ordersToDisplay.map((order) => (
                  <div key={order.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center hover:shadow-md transition-shadow">
                      {/* Avatar depends on view: If purchase, show specialist. If sales, show buyer (if logged in user) or generic */}
                      <div className="h-16 w-16 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden relative border border-gray-200">
                           {activeTab === 'purchases' ? (
                               order.specialist?.avatar_url ? (
                                   <Image src={order.specialist.avatar_url} alt="S" fill className="object-cover" />
                               ) : (
                                   <div className="flex items-center justify-center h-full text-gray-400 text-xs font-bold">PRO</div>
                               )
                           ) : (
                               <div className="flex items-center justify-center h-full bg-blue-50 text-blue-600 text-xs font-bold">User</div>
                           )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-gray-400">• {new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                          
                          {/* Status Dropdown for Sales, Badge for Purchases */}
                          {activeTab === 'sales' ? (
                             <div className="relative inline-block text-left mt-1">
                                <select
                                   value={order.status}
                                   onChange={async (e) => {
                                       const newStatus = e.target.value;
                                       try {
                                           const res = await fetch(`/api/orders/${order.id}`, {
                                               method: 'PATCH',
                                               headers: { 'Content-Type': 'application/json' },
                                               body: JSON.stringify({ status: newStatus })
                                           });
                                           if (res.ok) {
                                               // Optimistic update locally
                                               setSales(prev => prev.map(o => o.id === order.id ? { ...o, status: newStatus } : o));
                                           } else {
                                               alert("Failed to update status");
                                           }
                                       } catch (error) {
                                           console.error("Failed to update status", error);
                                           alert("Error updating status");
                                       }
                                   }}
                                    className={`
                                      appearance-none border-0 text-[10px] font-bold uppercase tracking-wider py-1 pl-2 pr-6 rounded cursor-pointer focus:ring-0 focus:outline-none
                                      ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 
                                        order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
                                        order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 
                                        'bg-gray-100 text-gray-700'}
                                    `}
                                    style={{ backgroundImage: 'none' }} // Hide default arrow to use custom one if needed, or just let browser handle it for simplicity
                                >
                                    <option value="PENDING">PENDING</option>
                                    <option value="PAID">PAID</option>
                                    <option value="COMPLETED">COMPLETED</option>
                                    <option value="CANCELLED">CANCELLED</option>
                                </select>
                                {/* Hacky pointer events none arrow if we wanted custom style, but native select is fine for now */}
                             </div>
                          ) : (
                             /* Static Badge for Purchases */
                             <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider w-fit inline-block ${
                                  order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 
                                  order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
                                  order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                  'bg-gray-100 text-gray-700'
                              }`}>
                                  {order.status}
                              </span>
                          )}

                          
                          {activeTab === 'purchases' ? (
                              <>
                                <h3 className="text-base font-bold text-gray-900 truncate">{order.specialist?.title || "Service Request"}</h3>
                                <p className="text-sm text-gray-500">{order.specialist?.secretary_company}</p>
                              </>
                          ) : (
                             <>
                                <h3 className="text-base font-bold text-gray-900 truncate">
                                    {order.customerName || order.user?.name || "Guest User"}
                                </h3>
                                <div className="text-sm text-gray-500 flex flex-col gap-0.5">
                                    {order.customerEmail || order.user?.email ? (
                                        <span>📧 {order.customerEmail || order.user?.email}</span>
                                    ) : null}
                                    {order.customerPhone ? (
                                        <span>📞 {order.customerPhone}</span>
                                    ) : null}
                                </div>
                                {order.requirements && (
                                    <div className="mt-2 text-xs bg-gray-50 p-2 rounded border border-gray-100 text-gray-600">
                                        Note: {order.requirements}
                                    </div>
                                )}
                             </>
                          )}

                      </div>

                      <div className="text-right flex flex-col items-end">
                          <p className="text-lg font-bold text-gray-900">RM {Number(order.amount).toLocaleString()}</p>
                           {/* Only show 'View Service' if it's a purchase. For sales, maybe 'View Details' in future */}
                           {activeTab === 'purchases' && order.specialist?.slug && (
                              <Link href={`/services/${order.specialist.slug}`} className="text-sm font-semibold text-[#0e3a8d] flex items-center justify-end gap-1 mt-1 hover:underline">
                                  View Service <ArrowRight className="h-3 w-3"/>
                              </Link>
                          )}
                      </div>
                  </div>
              ))}
          </div>
      )}
    </div>
  );
}

