import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { mapRowToOutsource } from '@/lib/supabase-sync';

// GET: Fetch outsource vouchers from Supabase
export async function GET(req: NextRequest) {
  try {
    if (supabaseAdmin && isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from('outsource_vouchers')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        const vouchers = data.map(mapRowToOutsource);
        return NextResponse.json({
          success: true,
          data: vouchers,
          count: vouchers.length,
        });
      }
    }

    return NextResponse.json({ success: true, data: [], count: 0 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: Add or update outsource voucher in Supabase
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (supabaseAdmin && isSupabaseConfigured()) {
      const vendorCost = Number(body.vendorCostPrice) || 0;
      const outgoingFreight = Number(body.outgoingFreightCost) || 0;
      const incomingFreight = Number(body.incomingFreightCost) || 0;
      const totalFreight = outgoingFreight + incomingFreight;
      const sellingPrice = Number(body.customerSellingPrice) || 0;
      const profit = sellingPrice - (vendorCost + totalFreight);

      const payload = {
        id: body.id || `out-${Date.now()}`,
        voucher_number: body.voucherNumber || `OUT-${Date.now().toString().slice(-4)}`,
        voucher_date: body.voucherDate || new Date().toISOString().split('T')[0],
        linked_ticket_id: body.linkedTicketId || null,
        linked_ticket_number: body.linkedTicketNumber || null,
        vendor_job_id: body.vendorJobId || null,
        vendor_id: body.vendorId || `v-${Date.now()}`,
        vendor_name: body.vendorName || 'Outsource Vendor',
        vendor_phone: body.vendorPhone || '+91 99999-00000',
        vendor_city: body.vendorCity || 'Jodhpur',
        vendor_address: body.vendorAddress || null,
        vendor_gstin: body.vendorGstin || null,
        service_type: body.serviceType || 'Motherboard Repair',
        outgoing_courier: body.outgoingCourier || 'DTDC Courier',
        outgoing_docket: body.outgoingDocket || '',
        outgoing_dispatch_date: body.outgoingDispatchDate || new Date().toISOString().split('T')[0],
        outgoing_freight_cost: outgoingFreight,
        incoming_courier: body.incomingCourier || null,
        incoming_docket: body.incomingDocket || null,
        incoming_dispatch_date: body.incomingDispatchDate || null,
        incoming_freight_cost: incomingFreight,
        expected_return_date: body.expectedReturnDate || null,
        received_date: body.receivedDate || null,
        vendor_cost_price: vendorCost,
        freight_charges: totalFreight,
        customer_selling_price: sellingPrice,
        profit_margin: profit,
        dispatch_status: body.dispatchStatus || 'SHIPPED',
        technical_instructions: body.technicalInstructions || null,
        testing_notes: body.testingNotes || null,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabaseAdmin
        .from('outsource_vouchers')
        .upsert(payload, { onConflict: 'id' })
        .select()
        .single();

      if (error) {
        console.warn('API outsource upsert error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        voucher: data ? mapRowToOutsource(data) : null,
      });
    }

    return NextResponse.json({ success: false, error: 'Supabase admin not configured' }, { status: 503 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE: Remove outsource voucher from Supabase
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Outsource ID required' }, { status: 400 });
    }

    if (supabaseAdmin && isSupabaseConfigured()) {
      const { error } = await supabaseAdmin.from('outsource_vouchers').delete().eq('id', id);
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
