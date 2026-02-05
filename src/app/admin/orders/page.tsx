"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Search, ShoppingBag, Eye, DollarSign, Calendar, User } from "lucide-react";

interface Order {
  id: string;
  status: string;
  amount: number;
  createdAt: string;
  customerName?: string;
  customerEmail?: string;
  user?: {
    name: string;
    email: string;
  };
  specialist: {
    title: string;
  };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch('/api/admin/orders')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrders(data.data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
        case 'PAID': return "bg-green-100 text-green-800";
        case 'PENDING': return "bg-yellow-100 text-yellow-800";
        case 'CANCELLED': return "bg-red-100 text-red-800";
        case 'COMPLETED': return "bg-blue-100 text-blue-800";
        default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.customerName && o.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (o.user?.name && o.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex-1 bg-white min-h-screen font-sans text-gray-900 px-6 py-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
           <p className="mt-1 text-sm text-gray-500">Manage customer orders and payments.</p>
        </div>
        <div className="mt-4 sm:mt-0 relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
             <input 
                type="text" 
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:border-indigo-500 focus:ring-indigo-500"
             />
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {loading ? (
             <div className="flex justify-center p-12"><Loader2 className="animate-spin text-gray-400 h-8 w-8"/></div>
        ) : filteredOrders.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center">
                            <User className="h-4 w-4 text-indigo-600"/>
                        </div>
                        <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                                {order.customerName || order.user?.name || "Guest"}
                            </div>
                            <div className="text-xs text-gray-500">
                                {order.customerEmail || order.user?.email || "No email"}
                            </div>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                     <span className="flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4 text-gray-400" />
                        {order.specialist.title}
                     </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    RM {Number(order.amount).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-2 rounded-full">
                        <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-gray-500 text-sm">
             No orders found.
          </div>
        )}
      </div>
    </div>
  );
}
