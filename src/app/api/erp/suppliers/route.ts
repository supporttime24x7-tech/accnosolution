import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { mapRowToVendor } from '@/lib/supabase-sync';

// GET: Fetch suppliers/vendors from Supabase
export async function GET(req: NextRequest) {
  try {
    if (supabaseAdmin && isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from('suppliers')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        const vendors = data.map(mapRowToVendor);
        return NextResponse.json({
          success: true,
          data: vendors,
          count: vendors.length,
        });
      }
    }

    return NextResponse.json({ success: true, data: [], count: 0 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: Add or update supplier/vendor in Supabase
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const vendorName = body.companyName || body.name || 'Vendor';

    if (supabaseAdmin && isSupabaseConfigured()) {
      const payload: Record<string, any> = {
        id: body.id || `v-${Date.now()}`,
        vendor_type: body.vendorType || 'Standard Vendor',
        vendor_code: body.code || null,
        vendor_name: vendorName,
        contact_person: body.contactPerson || null,
        account_group: body.accountGroup || 'Sundry Creditor',
        designation: body.designation || null,
        phone: body.phone || '+91 99999-00000',
        alternate_phone: body.alternatePhone || null,
        email: body.email || null,
        website: body.website || null,
        gstin: body.gstin || null,
        pan_number: body.pan || null,
        address: body.fullAddress || body.address || null,
        city: body.station || body.city || null,
        state: body.state || null,
        pincode: body.pinCode || null,
        bank_name: body.bankName || null,
        bank_account_name: body.bankAccountName || null,
        bank_account_type: body.bankAccountType || 'Current',
        bank_account_number: body.bankAccountNumber || null,
        bank_ifsc: body.bankIfscCode || body.bankIfsc || null,
        bank_branch: body.bankBranch || null,
        upi_id: body.upiId || null,
        payment_terms: body.paymentTerms || 'Net 30 Days',
        opening_balance: Number(body.openingBalance) || 0,
        current_balance: Number(body.outstandingBalance) || 0,
        max_credit_limit: Number(body.maxCreditLimit) || 0,
        category: body.category || 'Components',
        is_active: body.activeStatus !== 'Inactive',
        active_status: body.activeStatus || 'Active',
        internal_notes: body.internalNotes || null,
        updated_at: new Date().toISOString(),
      };

      let { data, error } = await supabaseAdmin
        .from('suppliers')
        .upsert(payload, { onConflict: 'id' })
        .select()
        .single();

      if (error && error.message?.includes('schema cache')) {
        const corePayload = {
          id: body.id || `v-${Date.now()}`,
          vendor_code: body.code || null,
          vendor_name: vendorName,
          contact_person: body.contactPerson || null,
          phone: body.phone || '+91 99999-00000',
          alternate_phone: body.alternatePhone || null,
          email: body.email || null,
          gstin: body.gstin || null,
          pan_number: body.pan || null,
          address: body.fullAddress || body.address || null,
          city: body.station || body.city || null,
          state: body.state || null,
          bank_name: body.bankName || null,
          bank_account_number: body.bankAccountNumber || null,
          bank_ifsc: body.bankIfscCode || body.bankIfsc || null,
          payment_terms: body.paymentTerms || 'Net 30 Days',
          opening_balance: Number(body.openingBalance) || 0,
          current_balance: Number(body.outstandingBalance) || 0,
          category: body.category || 'Components',
          is_active: body.activeStatus !== 'Inactive',
        };
        const fb = await supabaseAdmin.from('suppliers').upsert(corePayload, { onConflict: 'id' }).select().single();
        data = fb.data;
        error = fb.error;
      }

      if (error) {
        console.warn('API suppliers upsert error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        vendor: data ? mapRowToVendor(data) : null,
      });
    }

    return NextResponse.json({ success: false, error: 'Supabase admin not configured' }, { status: 503 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE: Remove supplier/vendor from Supabase
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Vendor ID required' }, { status: 400 });
    }

    if (supabaseAdmin && isSupabaseConfigured()) {
      const { error } = await supabaseAdmin.from('suppliers').delete().eq('id', id);
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
