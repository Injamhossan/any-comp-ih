"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Mail,
  ShoppingBag,
  MoreVertical,
  CheckCircle,
  Clock
} from "lucide-react";
import Link from "next/link";

interface DashboardData {
  stats: {
    totalClients: number;
    totalRevenue: number;
    activeOrders: number;
    conversionRate: string;
  };
  recentActivity: Array<{
    id: string;
    senderName: string;
    subject: string;
    createdAt: string;
    isRead: boolean;
  }>;
  recentOrders: Array<{
    id: string;
    customerName: string;
    amount: string;
    status: string;
    createdAt: string;
    specialist?: { title: string };
  }>;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(res => res.json())
      .then(resData => {
        if (resData.success) {
          setData(resData.data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const stats = data?.stats || {
    totalClients: 0,
    totalRevenue: 0,
    activeOrders: 0,
    conversionRate: "0%"
  };

  const statItems = [
    {
      name: "Total Clients",
      value: stats.totalClients.toString(),
      change: "+12.5%",
      changeType: "positive",
      icon: Users,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      changeColor: "text-green-600"
    },
    {
      name: "Total Revenue",
      value: `RM ${Number(stats.totalRevenue).toLocaleString()}`,
      change: "+15.2%",
      changeType: "positive",
      icon: TrendingUp,
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
      changeColor: "text-green-600"
    },
    {
      name: "Active Orders",
      value: stats.activeOrders.toString(),
      change: "-2.4%",
      changeType: "negative",
      icon: ShoppingBag,
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
      changeColor: "text-red-600"
    },
    {
      name: "Conversion Rate",
      value: stats.conversionRate,
      change: "+4.1%",
      changeType: "positive",
      icon: Activity,
      bgColor: "bg-rose-50",
      textColor: "text-rose-600",
      changeColor: "text-green-600"
    },
  ];

  if (loading) {
      return (
          <div className="flex h-screen items-center justify-center bg-gray-50">
              <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
          </div>
      );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back, get an overview of your platform's performance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statItems.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
               <div className={`rounded-xl p-3 ${item.bgColor}`}>
                <item.icon className={`h-6 w-6 ${item.textColor}`} />
               </div>
               <span className={`inline-flex items-center text-xs font-semibold px-2 py-1 rounded-full bg-opacity-10 ${item.changeType === 'positive' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                 {item.changeType === 'positive' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                 {item.change}
               </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{item.name}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{item.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders - Takes up 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
                <Link href="/admin/orders" className="text-sm text-blue-600 font-medium hover:underline">View All</Link>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 text-xs uppercase text-gray-500 font-semibold">
                        <tr>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Service</th>
                            <th className="px-6 py-4 text-right">Amount</th>
                            <th className="px-6 py-4 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {data?.recentOrders && data.recentOrders.length > 0 ? (
                            data.recentOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{order.customerName || "Guest User"}</td>
                                    <td className="px-6 py-4 text-gray-600 truncate max-w-[200px]">{order.specialist?.title || "Unknown Service"}</td>
                                    <td className="px-6 py-4 text-right font-medium text-gray-900">RM {Number(order.amount).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-center">
                                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize 
                                            ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                                              order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                                              order.status === 'PAID' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {order.status.toLowerCase()}
                                         </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No recent orders found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Recent Activity (Messages) - Takes up 1 column */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Recent Messages</h3>
                <Link href="/admin/messages" className="text-sm text-blue-600 font-medium hover:underline">View All</Link>
            </div>
            <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                {data?.recentActivity && data.recentActivity.length > 0 ? (
                    data.recentActivity.map((msg) => (
                        <div key={msg.id} className="p-5 hover:bg-gray-50 transition-colors group cursor-pointer">
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600 font-bold text-sm">
                                    {msg.senderName.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="text-sm font-semibold text-gray-900 truncate">{msg.senderName}</h4>
                                        <span className="text-xs text-gray-400 whitespace-nowrap">{new Date(msg.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm text-gray-800 truncate font-medium">{msg.subject}</p>
                                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 group-hover:text-blue-600">
                                        {msg.isRead ? <CheckCircle className="h-3 w-3 text-green-500" /> : <Clock className="h-3 w-3 text-yellow-500" />}
                                        {msg.isRead ? "Read" : "Unread"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500">No recent messages.</div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
