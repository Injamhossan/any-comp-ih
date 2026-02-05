import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    // Test the database connection
    const result: any = await prisma.$queryRaw`SELECT NOW()`;
    
      
    const count = await prisma.specialist.count();
    
    return NextResponse.json({ 
      status: 'success', 
      time: result[0].now,
      tables_exist: true,
      specialists_count: count
    });
  } catch (error: any) {
    console.error('Database connection error:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
