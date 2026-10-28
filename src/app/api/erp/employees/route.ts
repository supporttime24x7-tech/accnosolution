import { NextRequest, NextResponse } from 'next/server';
import { loadEmployeesFromFile, saveEmployeesToFile, VerifiedEmployee } from '@/lib/employee-registry';
import { verifyAuthToken } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

async function verifyAdminSession(req: NextRequest) {
  const token = req.cookies.get('accno_erp_token')?.value || req.cookies.get('omnicrm_token')?.value;
  if (!token) {
    return null;
  }
  const session = await verifyAuthToken(token);
  if (!session || !session.empCode) {
    return null;
  }
  return session;
}

// GET: Fetch all employees from Supabase Cloud (with safe password stripping)
export async function GET(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Access to employee database is restricted to authenticated sessions.' }, { status: 401 });
    }

    if (supabaseAdmin) {
      const { data: supaEmployees, error } = await supabaseAdmin
        .from('employees')
        .select('*')
        .order('emp_code', { ascending: true });

      if (!error && supaEmployees && supaEmployees.length > 0) {
        // Strip sensitive password hashes from the client response to prevent any potential theft
        const safeEmployees = supaEmployees.map((e: any) => ({
          id: e.id,
          empCode: e.emp_code,
          name: e.name,
          email: e.email,
          role: e.role,
          department: e.department,
          designation: e.designation,
          activeStatus: e.active_status,
          phone: e.phone,
          alternatePhone: e.alternate_phone,
          joiningDate: e.joining_date,
          baseSalary: e.base_salary,
          address: e.address,
          emergencyContactName: e.emergency_contact_name,
          emergencyContactPhone: e.emergency_contact_phone,
          govtIdType: e.govt_id_type,
          bankAccountName: e.bank_account_name,
          bankAccountNumber: e.bank_account_number ? `****${e.bank_account_number.slice(-4)}` : '',
          bankName: e.bank_name,
          bankBranch: e.bank_branch,
          bankBranchCode: e.bank_branch_code,
          bankIfscCode: e.bank_ifsc_code,
          permissions: e.permissions,
        }));
        return NextResponse.json({ success: true, employees: safeEmployees });
      }
    }

    const employees = loadEmployeesFromFile().map(({ passwordHashOrPlain, ...safe }) => safe);
    return NextResponse.json({ success: true, employees });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Add new employee (with exact portal login password)
export async function POST(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Creating employee records requires an authenticated admin session.' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.empCode || !body.name) {
      return NextResponse.json({ success: false, error: 'Employee ID and Name are required.' }, { status: 400 });
    }

    const cleanCode = body.empCode.trim().toUpperCase();
    const cleanPassword = (body.password || '').trim();

    if (supabaseAdmin) {
      const { error: supaError } = await supabaseAdmin.from('employees').upsert({
        id: body.id || `emp-${Date.now()}`,
        emp_code: cleanCode,
        name: body.name.trim(),
        phone: body.phone || '',
        alternate_phone: body.alternatePhone || '',
        email: body.email || `${cleanCode.toLowerCase()}@accnosolution.com`,
        password_hash_or_plain: cleanPassword,
        address: body.address || '',
        department: body.department || 'General',
        designation: body.designation || 'Staff',
        base_salary: body.baseSalary || 0,
        joining_date: body.joiningDate || new Date().toISOString().split('T')[0],
        active_status: body.activeStatus || 'Active',
        govt_id_type: body.govtIdType || 'Aadhaar Card',
        govt_id_number: body.govtIdNumber || '',
        role: body.role || 'technician',
        permissions: body.permissions || {},
      }, { onConflict: 'emp_code' });

      if (supaError) {
        console.error('Supabase employee insert error:', supaError);
      }
    }

    const employees = loadEmployeesFromFile();
    // Check duplicate
    if (employees.some((e) => e.empCode === cleanCode)) {
      return NextResponse.json({ success: false, error: `Employee ID ${cleanCode} already exists.` }, { status: 400 });
    }

    const newEmp = {
      id: body.id || `emp-${Date.now()}`,
      empCode: cleanCode,
      name: body.name.trim(),
      phone: body.phone || '',
      alternatePhone: body.alternatePhone || '',
      email: body.email || `${cleanCode.toLowerCase()}@accnosolution.com`,
      password: cleanPassword,
      passwordHashOrPlain: cleanPassword,
      address: body.address || '',
      department: body.department || 'General',
      designation: body.designation || 'Staff',
      baseSalary: body.baseSalary || 0,
      joiningDate: body.joiningDate || new Date().toISOString().split('T')[0],
      activeStatus: body.activeStatus || 'Active',
      govtIdType: body.govtIdType || 'Aadhaar Card',
      govtIdNumber: body.govtIdNumber || '',
      role: body.role || 'technician',
    };

    employees.push(newEmp as any);
    saveEmployeesToFile(employees);

    return NextResponse.json({
      success: true,
      message: `Employee ${cleanCode} created successfully with login password.`,
      employee: newEmp,
      employees,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT: Update existing employee (updates portal login password immediately)
export async function PUT(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Updating employee records requires an authenticated admin session.' }, { status: 401 });
    }

    const body = await req.json();
    const id = body.id;
    const cleanCode = (body.empCode || '').trim().toUpperCase();

    if (!id && !cleanCode) {
      return NextResponse.json({ success: false, error: 'Employee ID is required.' }, { status: 400 });
    }

    const cleanPassword = body.password !== undefined && body.password !== '' 
      ? body.password.trim() 
      : undefined;

    if (supabaseAdmin) {
      const updatePayload: Record<string, any> = {
        name: body.name,
        email: body.email,
        phone: body.phone,
        alternate_phone: body.alternatePhone,
        department: body.department,
        designation: body.designation,
        active_status: body.activeStatus,
        role: body.role,
        base_salary: body.baseSalary,
        address: body.address,
        permissions: body.permissions,
      };
      if (cleanPassword) {
        updatePayload.password_hash_or_plain = cleanPassword;
      }
      await supabaseAdmin.from('employees').update(updatePayload).eq('emp_code', cleanCode);
    }

    const employees = loadEmployeesFromFile();
    const index = employees.findIndex((e) => e.id === id || e.empCode === cleanCode);

    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Employee record not found.' }, { status: 404 });
    }

    const existing = employees[index] as any;
    const updated = {
      ...existing,
      ...body,
      empCode: cleanCode || existing.empCode,
      password: cleanPassword || existing.password || '',
      passwordHashOrPlain: cleanPassword || existing.passwordHashOrPlain || '',
    };

    employees[index] = updated;
    saveEmployeesToFile(employees);

    return NextResponse.json({
      success: true,
      message: `Employee ${updated.empCode} updated successfully with new login credentials.`,
      employee: updated,
      employees,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Remove employee (revokes login permission)
export async function DELETE(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Deleting employee records requires an authenticated admin session.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required for deletion.' }, { status: 400 });
    }

    if (supabaseAdmin) {
      await supabaseAdmin.from('employees').delete().or(`id.eq.${id},emp_code.eq.${id.toUpperCase()}`);
    }

    let employees = loadEmployeesFromFile();
    const target = employees.find((e) => e.id === id || e.empCode === id.toUpperCase());
    employees = employees.filter((e) => e.id !== id && e.empCode !== id.toUpperCase());
    saveEmployeesToFile(employees);

    return NextResponse.json({
      success: true,
      message: `Employee ${target?.empCode || id} deleted and login access revoked.`,
      employees,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
