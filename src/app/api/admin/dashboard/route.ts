import { NextResponse } from "next/server";

export async function GET() {
  const stats = {
      totalClients: 0,
      totalRevenue: 0,
      activeOrders: 0,
      conversionRate: "0%"
  };

  return NextResponse.json({ 
      success: true, 
      data: {
          stats,
          recentActivity: [],
          recentOrders: []
      } 
  });
}
