import { NextResponse } from 'next/server';
import { loadJSONFile } from '@/lib/dataLoader';

export async function GET() {
  try {
    const data = loadJSONFile('Customer-Type.json');
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}
