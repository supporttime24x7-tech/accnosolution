import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { mapRowToSalesInvoice } from '@/lib/supabase-sync';

// GET: Fetch sales invoices from Supabase
export async function GET(req: NextRequest) {
  try {
    if (supabaseAdmin && isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from('sales_invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        const invoices = data.map(mapRowToSalesInvoice);
        return NextResponse.json({
          success: true,
          data: invoices,
          count: invoices.length,
        });
      }
    }

    return NextResponse.json({ success: true, data: [], count: 0 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: Add or update sales invoice in Supabase
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (supabaseAdmin && isSupabaseConfigured()) {
      const invNumber = body.invoiceNo || body.invoice_number || `INV-${Date.now().toString().slice(-4)}`;
      const sub = Number(body.subtotal) || 0;
      const tax = Number(body.taxAmount || body.taxable_amount) || 0;
      const grand = Number(body.grandTotal || body.grand_total) || (sub + tax);
      const paid = Number(body.paidAmount || body.paid_amount) || 0;
      const due = Number(body.balanceDue || body.due_amount) || Math.max(0, grand - paid);

      const payload = {
        id: body.id || `sinv-${Date.now()}`,
        invoice_number: invNumber,
        invoice_date: body.invoiceDate || body.invoice_date || new Date().toISOString().split('T')[0],
        customer_id: body.customerId || body.customer_id || null,
        customer_name: body.customerName || body.customer_name || 'Retail Customer',
        customer_phone: body.customerPhone || body.customer_phone || '+91 99999-00000',
        customer_gstin: body.customerGst || body.customer_gstin || null,
        billing_address: body.customerAddress || body.billing_address || null,
        items: Array.isArray(body.items) ? body.items : [],
        subtotal: sub,
        discount_amount: Number(body.discount || body.discount_amount) || 0,
        taxable_amount: sub,
        cgst_amount: Math.round(tax / 2),
        sgst_amount: Math.round(tax / 2),
        round_off_adjustment: 0,
        grand_total: grand,
        paid_amount: paid,
        due_amount: due,
        payment_method: body.paymentMethod || body.payment_method || 'CASH',
        payment_status: body.paymentStatus || body.payment_status || 'Paid',
        sales_rep: 'Accno Solution',
        notes: body.remarks || body.notes || null,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabaseAdmin
        .from('sales_invoices')
        .upsert(payload, { onConflict: 'id' })
        .select()
        .single();

      if (error) {
        console.warn('API sales upsert error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        invoice: data ? mapRowToSalesInvoice(data) : null,
      });
    }

    return NextResponse.json({ success: false, error: 'Supabase admin not configured' }, { status: 503 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE: Remove sales invoice from Supabase
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Invoice ID required' }, { status: 400 });
    }

    if (supabaseAdmin && isSupabaseConfigured()) {
      const { error } = await supabaseAdmin.from('sales_invoices').delete().eq('id', id);
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
