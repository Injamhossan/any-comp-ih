
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const [messages, invoices, documents, ordersCount, clientsCount, recentOrders] = await Promise.all([
      prisma.message.findMany({ 
          take: 5, 
          orderBy: { createdAt: 'desc' } 
      }),
      prisma.invoice.findMany({ 
          take: 5, 
          orderBy: { createdAt: 'desc' },
          include: { user: true }
      }),
      prisma.document.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { user: true }
      }),
      prisma.order.count(),
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: true, specialist: true }
      })
    ]);
    
    // Calculate total revenue
    const revenueAggregation = await prisma.invoice.aggregate({
        _sum: { amount: true },
        where: { status: 'PAID' }
    });
    const totalRevenue = revenueAggregation._sum.amount || 0;

    const stats = {
        totalClients: clientsCount,
        totalRevenue: totalRevenue,
        activeOrders: ordersCount,
        conversionRate: "3.2%" // Placeholder logic for now
    };

    return NextResponse.json({ 
        success: true, 
        data: {
            stats,
            recentActivity: messages, // Using messages as activity for now
            recentOrders: recentOrders
        } 
    });
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
