import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  // ROUTE-LEVEL DEFENSE: Strict session verification for inventory & wholesale purchase prices
  const token =
    req.cookies.get('accno_erp_token')?.value ||
    req.cookies.get('omnicrm_token')?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Access to inventory and wholesale pricing requires an active employee session.' },
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

  const inventoryItems = [
    { id: 'inv-1', sku: 'ACC-MB-KB02', name: 'MacBook Pro M2 Keyboard Trackpad Module', category: 'Service Part', stock: 12, minAlert: 5, buyPrice: 4200, sellPrice: 6500, hsn: '8471', gst: 18 },
    { id: 'inv-2', sku: 'ACC-SSD-1TB', name: 'Seagate 1TB NVMe M.2 SSD 3500MB/s', category: 'Retail Product', stock: 28, minAlert: 10, buyPrice: 3200, sellPrice: 4800, hsn: '8471', gst: 18 },
    { id: 'inv-3', sku: 'ACC-BAT-XPS15', name: 'Dell XPS 15 Original 86Wh Battery', category: 'Service Part', stock: 3, minAlert: 5, buyPrice: 2800, sellPrice: 4200, hsn: '8507', gst: 18 },
    { id: 'inv-4', sku: 'ACC-CCTV-4K', name: 'Hikvision 4K 5MP IP Camera Dome', category: 'Retail Product', stock: 18, minAlert: 5, buyPrice: 1900, sellPrice: 2800, hsn: '8525', gst: 18 },
    { id: 'inv-5', sku: 'ACC-RAM-16GB', name: 'Corsair Vengeance DDR5 16GB Laptop RAM', category: 'Retail Product', stock: 4, minAlert: 6, buyPrice: 2600, sellPrice: 3800, hsn: '8473', gst: 18 },
  ];

  const lowStockAlerts = inventoryItems.filter((i) => i.stock <= i.minAlert);

  return NextResponse.json({
    success: true,
    data: inventoryItems,
    summary: {
      totalSKUs: inventoryItems.length,
      lowStockCount: lowStockAlerts.length,
      totalInventoryValue: inventoryItems.reduce((acc, i) => acc + i.stock * i.buyPrice, 0),
    },
  });
}
