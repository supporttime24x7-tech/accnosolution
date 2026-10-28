import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { mapRowToInventory } from '@/lib/supabase-sync';

// GET: Fetch inventory items from Supabase
export async function GET(req: NextRequest) {
  try {
    if (supabaseAdmin && isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from('inventory_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        const items = data.map(mapRowToInventory);
        return NextResponse.json({
          success: true,
          data: items,
          count: items.length,
        });
      }
    }

    return NextResponse.json({ success: true, data: [], count: 0 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: Add or update inventory item in Supabase
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ success: false, error: 'Item name is required' }, { status: 400 });
    }

    if (supabaseAdmin && isSupabaseConfigured()) {
      const payload = {
        id: body.id || `i-${Date.now()}`,
        sku: body.code || '',
        name: body.name || 'Inventory Item',
        category: body.category || 'General Hardware',
        item_type: body.itemType === 'Retail Part' ? 'retail_product' : 'service_part',
        unit: body.uom || 'Pcs',
        cost_price: Number(body.costPrice) || 0,
        selling_price: Number(body.sellingPrice) || 0,
        mrp: Number(body.mrp) || 0,
        stock_quantity: Number(body.currentStock) || 0,
        min_stock_alert: Number(body.lowStockAlert) || 2,
        hsn_code: body.hsnCode || '84733020',
        gst_rate: Number(body.gstRate) || 18,
        location: body.storageLocation || body.location || 'Shop Shelf',
        description: body.description || null,
        brand: body.productGroup || null,
        model: body.description || null,
        barcode: body.barcode || null,
        is_active: body.activeStatus === 'Active',
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabaseAdmin
        .from('inventory_items')
        .upsert(payload, { onConflict: 'id' })
        .select()
        .single();

      if (error) {
        console.warn('API inventory upsert error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        item: data ? mapRowToInventory(data) : null,
      });
    }

    return NextResponse.json({ success: false, error: 'Supabase admin not configured' }, { status: 503 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE: Remove inventory item from Supabase
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Item ID required' }, { status: 400 });
    }

    if (supabaseAdmin && isSupabaseConfigured()) {
      const { error } = await supabaseAdmin.from('inventory_items').delete().eq('id', id);
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
