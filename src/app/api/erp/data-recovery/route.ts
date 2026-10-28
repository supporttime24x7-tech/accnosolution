import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { mapRowToDataRecovery } from '@/lib/supabase-sync';

// GET: Fetch data recovery cases from Supabase
export async function GET(req: NextRequest) {
  try {
    if (supabaseAdmin && isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from('data_recovery_cases')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        const cases = data.map(mapRowToDataRecovery);
        return NextResponse.json({
          success: true,
          data: cases,
          count: cases.length,
        });
      }
    }

    return NextResponse.json({ success: true, data: [], count: 0 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: Add or update data recovery case in Supabase
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (supabaseAdmin && isSupabaseConfigured()) {
      const recId = body.recoveryIdNumber || `REC-${Date.now().toString().slice(-4)}`;
      const caseNum = body.caseNumber || recId;

      const payload = {
        id: body.id || `dr-${Date.now()}`,
        recovery_id_number: recId,
        case_number: caseNum,
        entry_date: body.entryDate || new Date().toISOString().split('T')[0],
        customer_name: body.customerName || 'Customer',
        customer_phone: body.customerPhone || '+91 99999-00000',
        customer_email: body.customerEmail || null,
        media_type: body.deviceType || body.media_type || 'Hard Drive (HDD)',
        media_brand: body.deviceBrand || body.media_brand || null,
        media_model: body.driveModel || body.media_model || null,
        serial_number: body.driveSerial || body.serial_number || null,
        capacity: body.capacity || '1 TB',
        file_system: body.fileSystem || 'NTFS',
        reported_fault: body.damageType || body.reported_fault || body.symptoms || 'Drive Not Detected',
        cleanroom_status: body.recoveryPhaseStatus || body.cleanroom_status || 'Pending Diagnostic',
        recovery_stage: body.status || body.recovery_stage || 'In Lab Inspection',
        priority: body.priority || 'Normal',
        estimated_quote: Number(body.estimateCost || body.estimated_quote) || 0,
        advance_paid: Number(body.advance || body.advance_paid) || 0,
        technician_name: body.technician || body.technician_name || 'Deepak Kumar',
        status: body.status || 'Received',
        target_media_provided: body.targetDriveDetails || null,
        recovered_data_size_gb: Number(body.recoveredDataGb || body.recovered_data_size_gb) || 0,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabaseAdmin
        .from('data_recovery_cases')
        .upsert(payload, { onConflict: 'id' })
        .select()
        .single();

      if (error) {
        console.warn('API data-recovery upsert error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        dataRecoveryCase: data ? mapRowToDataRecovery(data) : null,
      });
    }

    return NextResponse.json({ success: false, error: 'Supabase admin not configured' }, { status: 503 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE: Remove data recovery case from Supabase
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Data recovery ID required' }, { status: 400 });
    }

    if (supabaseAdmin && isSupabaseConfigured()) {
      const { error } = await supabaseAdmin.from('data_recovery_cases').delete().eq('id', id);
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
