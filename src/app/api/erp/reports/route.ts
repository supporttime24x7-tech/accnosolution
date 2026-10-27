import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  // ROUTE-LEVEL DEFENSE: Strict session verification for sensitive financial reports
  const token =
    req.cookies.get('accno_erp_token')?.value ||
    req.cookies.get('omnicrm_token')?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Access to financial and tax reports requires an active employee session.' },
      { status: 401 }
    );
  }

  const session = await verifyAuthToken(token);
  if (!session || !session.empCode) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Invalid or expired session.' },
      { status: 401 }
    );
  }

  const financialSummary = {
    monthlyRevenue: 622000,
    monthlyExpense: 337500,
    netProfit: 284500,
    gstSummary: {
      totalTaxableSales: 622000,
      cgstLiability: 55980,
      sgstLiability: 55980,
      igstLiability: 0,
      totalGstLiability: 111960,
    },
    technicianProductivity: [
      { name: 'Deepak Kumar (Lead Tech)', completedJobs: 24, revenueGenerated: 198000 },
      { name: 'Rahul Gupta (Hardware Specialist)', completedJobs: 18, revenueGenerated: 142000 },
      { name: 'Priya Sharma (Billing & Operations)', completedJobs: 14, revenueGenerated: 86000 },
    ],
  };

  return NextResponse.json({
    success: true,
    data: financialSummary,
  });
}
