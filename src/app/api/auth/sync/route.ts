import { NextRequest, NextResponse } from 'next/server';
import { syncServerEmployees } from '@/lib/employee-registry';
import { verifyAuthToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const token =
      req.cookies.get('accno_erp_token')?.value ||
      req.cookies.get('omnicrm_token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userPayload = await verifyAuthToken(token);
    if (!userPayload) {
      return NextResponse.json(
        { success: false, error: 'Invalid session' },
        { status: 401 }
      );
    }

    const body = await req.json();
    if (Array.isArray(body.employees) && body.employees.length > 0) {
      syncServerEmployees(body.employees);
    }

    return NextResponse.json({
      success: true,
      message: 'Employee security credentials synchronized successfully.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Sync failed.' },
      { status: 500 }
    );
  }
}
