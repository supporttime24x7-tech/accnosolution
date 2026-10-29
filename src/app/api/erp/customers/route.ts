import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { mapRowToCustomer } from '@/lib/supabase-sync';

// GET: Fetch all customers from Supabase Cloud
export async function GET(req: NextRequest) {
  try {
    if (supabaseAdmin && isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        const customers = data.map(mapRowToCustomer);
        return NextResponse.json({
          success: true,
          data: customers,
          count: customers.length,
        });
      }
    }

    return NextResponse.json({ success: true, data: [], count: 0 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: Add or update a customer in Supabase Cloud
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ success: false, error: 'Customer name is required' }, { status: 400 });
    }

    if (supabaseAdmin && isSupabaseConfigured()) {
      const payload: Record<string, any> = {
        id: body.id || `c-${Date.now()}`,
        code: body.code || '',
        customer_code: body.code || '',
        name: body.name || 'Customer',
        phone: body.mobile || body.phone || '',
        alternate_phone: body.alternateContact || null,
        email: body.email || null,
        website: body.website || null,
        dob: body.dob || null,
        wedding_anniversary: body.weddingAnniversary || null,
        referred_by: body.referredBy || null,
        customer_type: (body.accountGroup || '').includes('Corporate') ? 'CORPORATE' : 'RETAIL',
        company_name: body.companyName || null,
        gstin: body.gstin || null,
        address: body.billingAddress || body.address || null,
        billing_address: body.billingAddress || body.address || null,
        shipping_address: body.shippingAddress || null,
        city: body.city || 'Sanchore',
        state: body.state || 'Rajasthan',
        pincode: body.pinCode || null,
        category: body.category || 'Sundry Debtor',
        account_group: body.accountGroup || 'Retail / Cash',
        pan_number: body.panNumber || null,
        account_status: body.accountStatus || 'Active',
        credit_limit: Number(body.creditLimit) || 0,
        current_balance: Number(body.outstandingBalance) || 0,
        loyalty_points: Number(body.loyaltyPoints) || 0,
        kyc_verified: Boolean(body.kycVerified),
        tier: body.tier || 'Standard',
        total_repairs: Number(body.totalRepairs) || 0,
        notes: body.internalNotes || null,
        updated_at: new Date().toISOString(),
      };

      let { data, error } = await supabaseAdmin
        .from('customers')
        .upsert(payload, { onConflict: 'id' })
        .select()
        .single();

      // Graceful fallback to core columns if new migration columns are not yet in Supabase
      if (error && error.message?.includes('schema cache')) {
        const corePayload = {
          id: body.id || `c-${Date.now()}`,
          customer_code: body.code || '',
          name: body.name || 'Customer',
          phone: body.mobile || body.phone || '',
          alternate_phone: body.alternateContact || null,
          email: body.email || null,
          customer_type: (body.accountGroup || '').includes('Corporate') ? 'CORPORATE' : 'RETAIL',
          company_name: body.companyName || null,
          gstin: body.gstin || null,
          address: body.billingAddress || body.address || null,
          city: body.city || 'Sanchore',
          state: body.state || 'Rajasthan',
          pincode: body.pinCode || null,
          notes: body.internalNotes || null,
          updated_at: new Date().toISOString(),
        };
        const fb = await supabaseAdmin
          .from('customers')
          .upsert(corePayload, { onConflict: 'id' })
          .select()
          .single();
        data = fb.data;
        error = fb.error;
      }

      if (error) {
        console.warn('API customer upsert error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        customer: data ? mapRowToCustomer(data) : null,
      });
    }

    return NextResponse.json({ success: false, error: 'Supabase admin not configured' }, { status: 503 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE: Remove customer from Supabase Cloud
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Customer ID required' }, { status: 400 });
    }

    if (supabaseAdmin && isSupabaseConfigured()) {
      const { error } = await supabaseAdmin.from('customers').delete().eq('id', id);
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
