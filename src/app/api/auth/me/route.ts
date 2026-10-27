import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token =
    req.cookies.get('accno_erp_token')?.value ||
    req.cookies.get('omnicrm_token')?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: No active session found.' },
      { status: 401 }
    );
  }

  const payload = await verifyAuthToken(token);
  if (!payload) {
    return NextResponse.json(
      { success: false, error: 'Invalid or expired session token. Please log in again.' },
      { status: 401 }
    );
  }

  // Never return password or sensitive hashes
  return NextResponse.json({
    success: true,
    user: {
      id: payload.userId,
      empCode: payload.empCode,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      department: payload.department,
      designation: payload.designation,
    },
  });
}
