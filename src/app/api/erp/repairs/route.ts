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

  return NextResponse.json({
    success: true,
    data: [],
    count: 0,
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
      ...body,
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
      created_at: body.created_at || new Date().toISOString(),
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
      hwChecklist: body.hwChecklist || {},
      conditionChecklist: body.conditionChecklist || {},
      accessoriesChecklist: body.accessoriesChecklist || {},
      chassisColor: body.chassisColor || body.deviceColor || '',
      customerCompanyName: body.customerCompanyName || '',
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

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const ticketNumber = url.searchParams.get('ticketNumber');

    if (!id && !ticketNumber) {
      return NextResponse.json({ success: false, error: 'Ticket ID or Ticket Number required' }, { status: 400 });
    }

    if (supabaseAdmin && isSupabaseConfigured()) {
      let query = supabaseAdmin.from('repair_tickets').delete();
      if (ticketNumber && id) {
        query = query.or(`id.eq.${id},ticket_number.eq.${ticketNumber}`);
      } else if (ticketNumber) {
        query = query.eq('ticket_number', ticketNumber);
      } else {
        query = query.eq('id', id);
      }
      const { error } = await query;
      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, id });
    }

    return NextResponse.json({ success: false, error: 'Supabase admin not configured' }, { status: 503 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
