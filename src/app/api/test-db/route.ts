import { NextResponse } from 'next/server';
import { getDataSource } from '@/lib/data-source';
import { Specialist } from '@/entities/Specialist';

export async function GET() {
  try {
    const dataSource = await getDataSource();
    const result: any = await dataSource.query('SELECT NOW()');
    
    const count = await dataSource.getRepository(Specialist).count();
    
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
      message: error.message
    }, { status: 500 });
  }
}
