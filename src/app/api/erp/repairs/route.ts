import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { mapRowToTicket, mapTicketToRow } from '@/lib/supabase-sync';
import type { RepairTicket } from '@/lib/store';

export async function GET(req: NextRequest) {
  // ROUTE-LEVEL DEFENSE: Strict session verification for customer repair data
  const token =
    req.cookies.get('accno_erp_token')?.value ||
    req.cookies.get('omnicrm_token')?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Access to customer repair tickets requires an active employee session.' },
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

  const url = new URL(req.url);
  const statusFilter = url.searchParams.get('status');

  if (supabaseAdmin && isSupabaseConfigured()) {
    try {
      let query = supabaseAdmin
        .from('repair_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (!error && Array.isArray(data)) {
        const tickets = data.map(mapRowToTicket);
        return NextResponse.json({
          success: true,
          data: tickets,
          count: tickets.length,
        });
      }
    } catch (e) {
      console.warn('Supabase repair tickets GET exception:', e);
    }
  }

  const sampleTickets = [
    {
      id: 't-1',
      ticket_number: 'ACC-2025-8801',
      barcode_data: 'ACC8801',
      customer_name: 'Rajesh Kumar (Tech Logics)',
      customer_phone: '+919876543210',
      device_type: 'MacBook Pro M2',
      brand: 'Apple',
      model: 'A2442',
      serial_or_imei: 'C02G1234MD6R',
      problem_reported: 'Screen flickering & Liquid Spill on keyboard trackpad',
      status: 'in_progress',
      priority: 'urgent',
      estimated_cost: 18500,
      advance_paid: 5000,
      technician_name: 'Deepak Kumar',
      created_at: '2025-05-10 10:30 AM',
    },
    {
      id: 't-2',
      ticket_number: 'ACC-2025-8802',
      barcode_data: 'ACC8802',
      customer_name: 'Dr. Anita Roy',
      customer_phone: '+919419112233',
      device_type: 'Data Recovery (Seagate 2TB HDD)',
      brand: 'Seagate',
      model: 'ST2000LM015',
      serial_or_imei: 'Z3901XQP',
      problem_reported: 'Clicking sound from drive. Heads stuck. Hospital records recovery.',
      status: 'diagnosing',
      priority: 'urgent',
      estimated_cost: 14000,
      advance_paid: 3000,
      technician_name: 'Rahul Gupta',
      created_at: '2025-05-11 11:15 AM',
    },
  ];

  let filtered = sampleTickets;
  if (statusFilter && statusFilter !== 'all') {
    filtered = filtered.filter((t) => t.status === statusFilter);
  }

  return NextResponse.json({
    success: true,
    data: filtered,
    count: filtered.length,
  });
}

export async function POST(req: NextRequest) {
  // ROUTE-LEVEL DEFENSE: Strict session verification for creating repair tickets
  const token =
    req.cookies.get('accno_erp_token')?.value ||
    req.cookies.get('omnicrm_token')?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Creating repair tickets requires an active employee session.' },
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

  try {
    const body = await req.json();
    const createdTicket: RepairTicket = {
      id: body.id || `t-${Date.now()}`,
      ticket_number: body.ticket_number || `ACC-2025-${Math.floor(8800 + Math.random() * 1000)}`,
      barcode_data: body.barcode_data || body.ticket_number || `ACC${Math.floor(8800 + Math.random() * 1000)}`,
      customer_name: body.customer_name || 'Walk-in Client',
      customer_phone: body.customer_phone || '+91 94191-00000',
      device_type: body.device_type || 'Laptop',
      brand: body.brand || 'Generic OEM',
      model: body.model || 'Standard',
      serial_or_imei: body.serial_or_imei || 'N/A',
      problem_reported: body.problem_reported || 'Diagnostics required',
      status: body.status || 'received',
      priority: body.priority || 'normal',
      estimated_cost: Number(body.estimated_cost) || 0,
      advance_paid: Number(body.advance_paid) || 0,
      technician_name: body.technician_name || session.name || 'Unassigned',
      created_at: new Date().toISOString(),
      customerType: body.customerType || 'RETAIL',
      lineItems: body.lineItems || [],
      outsourceCharges: Number(body.outsourceCharges) || 0,
      freightCharges: Number(body.freightCharges) || 0,
      discountAmount: Number(body.discountAmount) || 0,
      gstTaxRate: Number(body.gstTaxRate) || 18,
      subtotal: Number(body.subtotal) || 0,
      taxableAmount: Number(body.taxableAmount) || 0,
      cgstAmount: Number(body.cgstAmount) || 0,
      sgstAmount: Number(body.sgstAmount) || 0,
      roundOffAdjustment: Number(body.roundOffAdjustment) || 0,
      grandTotal: Number(body.grandTotal) || 0,
      netDueBalance: Number(body.netDueBalance) || 0,
      physicalCondition: body.physicalCondition || '',
      rackLocation: body.rackLocation || 'Shelf A-1',
      paymentMethod: body.paymentMethod || 'CASH',
      paymentStatus: body.paymentStatus || 'UNPAID',
      warrantyStatement: body.warrantyStatement || '30 Days Parts & Labor Warranty',
      deliveryStatus: body.deliveryStatus || 'IN REPAIR LAB',
      deliveredTo: body.deliveredTo || '',
      entryDate: body.entryDate || new Date().toISOString().split('T')[0],
      estimatedDeliveryDate: body.estimatedDeliveryDate || '',
    };

    if (supabaseAdmin && isSupabaseConfigured()) {
      const row = mapTicketToRow(createdTicket);
      await supabaseAdmin.from('repair_tickets').upsert(row, { onConflict: 'ticket_number' });
    }

    return NextResponse.json({
      success: true,
      data: createdTicket,
      message: 'Repair ticket and barcode data generated.',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
