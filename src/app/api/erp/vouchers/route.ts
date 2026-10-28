import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

// GET: Fetch accounting vouchers from Supabase
export async function GET(req: NextRequest) {
  try {
    if (supabaseAdmin && isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from('accounting_vouchers')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        return NextResponse.json({
          success: true,
          data: data.map((row: any) => ({
            id: row.id,
            voucherNumber: row.voucher_number || '',
            voucherType: row.voucher_type || 'RECEIPT',
            voucherDate: row.voucher_date || '',
            partyType: row.party_type || 'CUSTOMER',
            partyId: row.party_id || '',
            partyName: row.party_name || '',
            partyPhone: row.party_phone || '',
            amount: Number(row.amount) || 0,
            paymentMode: row.payment_mode || 'CASH',
            referenceNo: row.reference_no || '',
            debitAccount: row.debit_account || '',
            creditAccount: row.credit_account || '',
            narration: row.narration || '',
            created_at: row.created_at || new Date().toISOString(),
          })),
          count: data.length,
        });
      }
    }

    return NextResponse.json({ success: true, data: [], count: 0 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: Add or update accounting voucher in Supabase
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (supabaseAdmin && isSupabaseConfigured()) {
      const payload = {
        id: body.id || `vch-${Date.now()}`,
        voucher_number: body.voucherNumber || `VCH-${Date.now().toString().slice(-4)}`,
        voucher_type: body.voucherType || 'RECEIPT',
        voucher_date: body.voucherDate || new Date().toISOString().split('T')[0],
        party_type: body.partyType || 'CUSTOMER',
        party_id: body.partyId || null,
        party_name: body.partyName || 'Party',
        party_phone: body.partyPhone || null,
        amount: Number(body.amount) || 0,
        payment_mode: body.paymentMode || 'CASH',
        reference_no: body.referenceNo || null,
        debit_account: body.debitAccount || null,
        credit_account: body.creditAccount || null,
        narration: body.narration || null,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabaseAdmin
        .from('accounting_vouchers')
        .upsert(payload, { onConflict: 'id' })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, voucher: data });
    }

    return NextResponse.json({ success: false, error: 'Supabase admin not configured' }, { status: 503 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE: Remove accounting voucher from Supabase
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Voucher ID required' }, { status: 400 });
    }

    if (supabaseAdmin && isSupabaseConfigured()) {
      const { error } = await supabaseAdmin.from('accounting_vouchers').delete().eq('id', id);
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
