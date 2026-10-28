import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { mapRowToAmc } from '@/lib/supabase-sync';

// GET: Fetch AMC contracts from Supabase
export async function GET(req: NextRequest) {
  try {
    if (supabaseAdmin && isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from('amc_contracts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        const contracts = data.map(mapRowToAmc);
        return NextResponse.json({
          success: true,
          data: contracts,
          count: contracts.length,
        });
      }
    }

    return NextResponse.json({ success: true, data: [], count: 0 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: Add or update AMC contract in Supabase
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (supabaseAdmin && isSupabaseConfigured()) {
      const contractNum = body.contractNumber || `AMC-${Date.now().toString().slice(-4)}`;
      const startDate = body.startDate || body.manualEntryDate || new Date().toISOString().split('T')[0];
      const endDate = body.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const payload = {
        id: body.id || `amc-${Date.now()}`,
        contract_number: contractNum,
        customer_name: body.customerName || 'Customer',
        customer_phone: body.customerPhone || '+91 99999-00000',
        customer_email: body.customerEmail || null,
        customer_gstin: body.customerGst || null,
        customer_address: body.customerAddress || null,
        company_name: body.companyName || null,
        amc_type: body.planOption || body.amc_type || 'Comprehensive AMC',
        billing_cycle: body.serviceType || body.billing_cycle || 'Yearly',
        start_date: startDate,
        end_date: endDate,
        total_devices_covered: Number(body.numberOfDevices) || 1,
        contract_amount: Number(body.contractCost || body.amcAmount) || 0,
        taxable_amount: Number(body.contractCost || body.amcAmount) || 0,
        gst_amount: Number(body.totalAmount ? body.totalAmount - (body.amcAmount || 0) : 0),
        grand_total: Number(body.totalAmount || body.contractCost) || 0,
        advance_paid: Number(body.advancePaid) || 0,
        balance_due: Number(body.balanceDue) || 0,
        status: body.contractStatus || body.status || 'Active',
        payment_status: body.paymentStatus || 'Unpaid',
        payment_mode: 'Cash / UPI / Bank Transfer',
        assigned_technician: body.assignedTechnician || 'Deepak Kumar',
        devices_covered: body.deviceType || 'Desktop PC / Laptop',
        preventative_maintenance_frequency: `${body.totalServiceVisits || 4} Visits/Year`,
        terms_and_conditions: body.coverageScopeDetails || null,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabaseAdmin
        .from('amc_contracts')
        .upsert(payload, { onConflict: 'id' })
        .select()
        .single();

      if (error) {
        console.warn('API amc upsert error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        contract: data ? mapRowToAmc(data) : null,
      });
    }

    return NextResponse.json({ success: false, error: 'Supabase admin not configured' }, { status: 503 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE: Remove AMC contract from Supabase
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Contract ID required' }, { status: 400 });
    }

    if (supabaseAdmin && isSupabaseConfigured()) {
      const { error } = await supabaseAdmin.from('amc_contracts').delete().eq('id', id);
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
