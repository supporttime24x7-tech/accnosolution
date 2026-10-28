import { NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const isConfigured = isSupabaseConfigured();
  return NextResponse.json({
    status: isConfigured ? 'ready' : 'credentials_required',
    isConfigured,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set',
    message: isConfigured
      ? 'Supabase is configured and ready for live migration.'
      : 'Supabase URL and Anon/Service Role Key need to be provided in environment variables (.env.local).',
    sqlFiles: {
      schemaFile: 'database/supabase_schema.sql',
      seedDataFile: 'database/seed_all_data.sql',
    },
  });
}

export async function POST() {
  if (!supabaseAdmin) {
    return NextResponse.json(
      {
        success: false,
        error: 'Supabase credentials are not configured.',
        instruction: 'Please provide NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or SUPABASE_SERVICE_ROLE_KEY) in .env.local',
      },
      { status: 400 }
    );
  }

  try {
    const results: Record<string, any> = {};

    // 1. Employees Migration
    const employeesPath = path.join(process.cwd(), 'src/data/employees.json');
    if (fs.existsSync(employeesPath)) {
      const rawEmployees = JSON.parse(fs.readFileSync(employeesPath, 'utf8'));
      const formattedEmployees = rawEmployees.map((emp: any) => ({
        id: emp.id,
        emp_code: emp.empCode,
        name: emp.name,
        email: emp.email,
        role: emp.role,
        department: emp.department,
        designation: emp.designation,
        active_status: emp.activeStatus || 'Active',
        password_hash_or_plain: emp.passwordHashOrPlain,
        phone: emp.phone,
        alternate_phone: emp.alternatePhone,
        joining_date: emp.joiningDate || '2022-01-01',
        base_salary: emp.baseSalary || 0,
        address: emp.address,
        emergency_contact_name: emp.emergencyContactName,
        emergency_contact_phone: emp.emergencyContactPhone,
        govt_id_type: emp.govtIdType,
        govt_id_number: emp.govtIdNumber,
        bank_account_name: emp.bankAccountName,
        bank_account_number: emp.bankAccountNumber,
        bank_name: emp.bankName,
        bank_branch: emp.bankBranch,
        bank_branch_code: emp.bankBranchCode,
        bank_ifsc_code: emp.bankIfscCode,
        permissions: emp.permissions || {},
      }));

      const { data, error } = await supabaseAdmin
        .from('employees')
        .upsert(formattedEmployees, { onConflict: 'emp_code' });

      results.employees = { count: formattedEmployees.length, error: error?.message || null };
    }

    // 2. Company Profile
    const { error: companyError } = await supabaseAdmin.from('company_profile').upsert(
      {
        id: 'primary_company',
        company_name: 'Accno Solution',
        legal_name: 'Accno Solution Computer & Mobile Lab',
        tagline: 'Enterprise Computer Repair & Data Recovery Hub',
        phone: '+91 9468781166',
        email: 'admin@accnosolution.com',
        website: 'https://accnosolution.com',
        gstin: '01AAAAA0000A1Z5',
        address: 'Above Choudhary Dharamshala, Main Market, Sanchore',
        city: 'Sanchore',
        state: 'Rajasthan',
        pincode: '343041',
        merchant_upi_id: 'support.time24x7-3@okhdfcbank',
      },
      { onConflict: 'id' }
    );
    results.company_profile = { success: !companyError, error: companyError?.message || null };

    return NextResponse.json({
      success: true,
      message: 'All model and employee records migrated to Supabase.',
      results,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Migration execution failed.',
      },
      { status: 500 }
    );
  }
}
