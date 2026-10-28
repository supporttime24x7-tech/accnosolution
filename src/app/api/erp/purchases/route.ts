import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { mapRowToPurchaseInvoice } from '@/lib/supabase-sync';

// GET: Fetch purchase invoices from Supabase
export async function GET(req: NextRequest) {
  try {
    if (supabaseAdmin && isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from('purchase_invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        const invoices = data.map(mapRowToPurchaseInvoice);
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

// POST: Add or update purchase invoice in Supabase
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (supabaseAdmin && isSupabaseConfigured()) {
      const purchaseNo = body.billNo || body.purchase_number || `PUR-${Date.now().toString().slice(-4)}`;
      const sub = Number(body.subtotal) || 0;
      const tax = Number(body.taxAmount || body.tax_amount) || 0;
      const grand = Number(body.grandTotal || body.grand_total) || (sub + tax);
      const paid = Number(body.paidAmount || body.paid_amount) || 0;
      const balance = Number(body.balanceDue || body.balance_amount) || Math.max(0, grand - paid);

      const payload = {
        id: body.id || `pinv-${Date.now()}`,
        purchase_number: purchaseNo,
        supplier_invoice_no: body.poRefNo || body.supplier_invoice_no || null,
        supplier_id: body.vendorId || body.supplier_id || null,
        supplier_name: body.vendorName || body.supplier_name || 'Supplier Vendor',
        purchase_date: body.billDate || body.purchase_date || new Date().toISOString().split('T')[0],
        items: Array.isArray(body.items) ? body.items : [],
        subtotal: sub,
        tax_amount: tax,
        grand_total: grand,
        paid_amount: paid,
        balance_amount: balance,
        payment_status: body.paymentStatus || body.payment_status || 'Paid',
        payment_method: body.paymentMethod || body.payment_method || 'BANK_TRANSFER',
        notes: body.remarks || body.notes || null,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabaseAdmin
        .from('purchase_invoices')
        .upsert(payload, { onConflict: 'id' })
        .select()
        .single();

      if (error) {
        console.warn('API purchases upsert error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        invoice: data ? mapRowToPurchaseInvoice(data) : null,
      });
    }

    return NextResponse.json({ success: false, error: 'Supabase admin not configured' }, { status: 503 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE: Remove purchase invoice from Supabase
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Purchase invoice ID required' }, { status: 400 });
    }

    if (supabaseAdmin && isSupabaseConfigured()) {
      const { error } = await supabaseAdmin.from('purchase_invoices').delete().eq('id', id);
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
