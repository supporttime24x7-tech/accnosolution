import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { mapRowToInvoice, mapInvoiceToRow } from '@/lib/supabase-sync';

// GET: Fetch repair invoices from Supabase
export async function GET(req: NextRequest) {
  try {
    if (supabaseAdmin && isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from('repair_invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        const invoices = data.map(mapRowToInvoice);
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

// POST: Add or update repair invoice in Supabase
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.invoiceNumber) {
      return NextResponse.json({ success: false, error: 'Invoice number required' }, { status: 400 });
    }

    if (supabaseAdmin && isSupabaseConfigured()) {
      const row = mapInvoiceToRow(body);
      const { data, error } = await supabaseAdmin
        .from('repair_invoices')
        .upsert(row, { onConflict: 'invoice_number' })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        invoice: data ? mapRowToInvoice(data) : null,
      });
    }

    return NextResponse.json({ success: false, error: 'Supabase admin not configured' }, { status: 503 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE: Remove repair invoice from Supabase
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const invoiceNumber = url.searchParams.get('invoiceNumber');

    if (!id && !invoiceNumber) {
      return NextResponse.json({ success: false, error: 'Invoice ID or number required' }, { status: 400 });
    }

    if (supabaseAdmin && isSupabaseConfigured()) {
      let query = supabaseAdmin.from('repair_invoices').delete();
      if (invoiceNumber && id) {
        query = query.or(`id.eq.${id},invoice_number.eq.${invoiceNumber}`);
      } else if (invoiceNumber) {
        query = query.eq('invoice_number', invoiceNumber);
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
