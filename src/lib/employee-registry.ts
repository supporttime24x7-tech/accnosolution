// Master Employee Credentials & Access Control Registry
// Only entries that exist or are created within the Employee module can log in.
// Login must be performed using the password associated with the respective employee record.

import fs from 'fs';
import path from 'path';
import { verifyPassword } from './auth';
import { supabaseAdmin } from './supabase';

export interface VerifiedEmployee {
  id: string;
  empCode: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'manager' | 'technician' | 'sales' | 'accounts' | 'customer';
  department: string;
  designation: string;
  activeStatus: 'Active' | 'On Leave' | 'Inactive';
  passwordHashOrPlain: string;
}

const EMPLOYEES_FILE = path.join(process.cwd(), 'src', 'data', 'employees.json');

// Default structural template (passwords & sensitive data stored securely in Supabase cloud)
export const DEFAULT_EMPLOYEES: VerifiedEmployee[] = [
  {
    id: 'emp-1001',
    empCode: 'EMP-1001',
    name: 'Deepak Kumar',
    email: 'admin@accnosolution.com',
    role: 'admin',
    department: 'Admin',
    designation: 'Admin',
    activeStatus: 'Active',
    passwordHashOrPlain: '',
  },
  {
    id: 'emp-1002',
    empCode: 'EMP-1002',
    name: 'Priya Sharma',
    email: 'priya.sharma@accnosolution.com',
    role: 'sales',
    department: 'Billing & POS',
    designation: 'Store Manager & Billing Lead',
    activeStatus: 'Active',
    passwordHashOrPlain: '',
  },
  {
    id: 'emp-1003',
    empCode: 'EMP-1003',
    name: 'Rahul Gupta',
    email: 'rahul.gupta@accnosolution.com',
    role: 'technician',
    department: 'Technical Lab',
    designation: 'Hardware Diagnostic Specialist',
    activeStatus: 'Active',
    passwordHashOrPlain: '',
  },
  {
    id: 'emp-1004',
    empCode: 'EMP-1004',
    name: 'Sonia Mahajan',
    email: 'sonia.m@accnosolution.com',
    role: 'manager',
    department: 'Customer Support',
    designation: 'Customer Support Executive',
    activeStatus: 'On Leave',
    passwordHashOrPlain: '',
  },
];

/**
 * Loads employee records from persistent storage
 */
export function loadEmployeesFromFile(): VerifiedEmployee[] {
  try {
    if (fs.existsSync(EMPLOYEES_FILE)) {
      const raw = fs.readFileSync(EMPLOYEES_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((emp: any) => ({
          id: emp.id || `emp-${Date.now()}`,
          empCode: (emp.empCode || '').trim().toUpperCase(),
          name: emp.name || 'Staff Member',
          email: emp.email || '',
          role: (emp.role || 'technician').toLowerCase() as VerifiedEmployee['role'],
          department: emp.department || 'General',
          designation: emp.designation || 'Staff',
          activeStatus: emp.activeStatus || 'Active',
          passwordHashOrPlain: emp.password || emp.passwordHashOrPlain || '',
        }));
      }
    }
  } catch (err) {
    console.error('Failed to read employees file:', err);
  }
  return DEFAULT_EMPLOYEES;
}

/**
 * Saves employee records to persistent storage
 */
export function saveEmployeesToFile(employees: any[]): void {
  try {
    const dir = path.dirname(EMPLOYEES_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(EMPLOYEES_FILE, JSON.stringify(employees, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write employees file:', err);
  }
}

/**
 * Synchronize employees from client or Employee module updates
 */
export function syncServerEmployees(clientEmployees: Array<{
  id: string;
  empCode: string;
  name: string;
  email: string;
  role?: string;
  department?: string;
  designation?: string;
  activeStatus?: 'Active' | 'On Leave' | 'Inactive';
  password?: string;
  passwordHashOrPlain?: string;
  [key: string]: any;
}>): void {
  if (!Array.isArray(clientEmployees) || clientEmployees.length === 0) return;

  const currentRecords = loadEmployeesFromFile();
  const mergedMap = new Map<string, any>();

  // Index existing
  currentRecords.forEach((r) => mergedMap.set(r.empCode.toUpperCase(), r));

  // Merge client records
  clientEmployees.forEach((emp) => {
    if (!emp.empCode) return;
    const code = emp.empCode.trim().toUpperCase();
    const existing = mergedMap.get(code);

    const updated = {
      ...(existing || {}),
      ...emp,
      empCode: code,
      password: emp.password || emp.passwordHashOrPlain || existing?.password || existing?.passwordHashOrPlain || '',
    };
    mergedMap.set(code, updated);
  });

  const finalArray = Array.from(mergedMap.values());
  saveEmployeesToFile(finalArray);
}

/**
 * Look up employee by Employee ID (empCode) or work email
 */
export function findEmployeeByIdentifier(identifier: string): VerifiedEmployee | null {
  if (!identifier) return null;
  const clean = identifier.trim().toUpperCase();
  const allEmployees = loadEmployeesFromFile();

  return (
    allEmployees.find(
      (e) =>
        e.empCode.toUpperCase() === clean ||
        (e.email && e.email.trim().toUpperCase() === clean)
    ) || null
  );
}

export interface AuthVerificationResult {
  success: boolean;
  user?: {
    id: string;
    empCode: string;
    name: string;
    email: string;
    role: VerifiedEmployee['role'];
    department: string;
    designation: string;
    redirectTo: string;
  };
  error?: string;
  status: number;
}

/**
 * Authenticates an employee strictly using the Employee module records and associated password
 */
export async function authenticateEmployee(
  identifier: string,
  plainPassword: string
): Promise<AuthVerificationResult> {
  const cleanId = (identifier || '').trim();
  const cleanPass = (plainPassword || '').trim();

  if (!cleanId || !cleanPass) {
    return {
      success: false,
      error: 'Please enter both your Employee ID and Password to sign in.',
      status: 400,
    };
  }

  // 1. Direct Supabase Cloud Authentication (Primary & Secure)
  if (supabaseAdmin) {
    try {
      const { data: supaEmp, error: supaErr } = await supabaseAdmin
        .from('employees')
        .select('*')
        .or(`emp_code.ilike.${cleanId},email.ilike.${cleanId}`)
        .maybeSingle();

      if (supaEmp) {
        if (supaEmp.active_status === 'Inactive') {
          return {
            success: false,
            error: 'Security Alert: This employee account has been deactivated. Access is blocked.',
            status: 403,
          };
        }

        if (supaEmp.active_status === 'On Leave') {
          return {
            success: false,
            error: 'Access Restricted: This employee profile is currently registered as On Leave. Please contact the administrator.',
            status: 403,
          };
        }

        if (!supaEmp.password_hash_or_plain) {
          return {
            success: false,
            error: `Access Denied: No login password has been configured for employee ${supaEmp.emp_code}.`,
            status: 401,
          };
        }

        const isPasswordValid = await verifyPassword(cleanPass, supaEmp.password_hash_or_plain);
        if (!isPasswordValid) {
          return {
            success: false,
            error: `Invalid password. Please enter the correct password configured for employee ${supaEmp.emp_code}.`,
            status: 401,
          };
        }

        let redirectTo = '/erp/repairs';
        const roleLower = (supaEmp.role || 'technician').toLowerCase();
        if (roleLower === 'sales' || roleLower === 'accounts') redirectTo = '/erp/pos';
        else if (roleLower === 'manager') redirectTo = '/erp/repairs';
        else if (roleLower === 'admin' || roleLower === 'super_admin') redirectTo = '/erp/repairs';

        return {
          success: true,
          status: 200,
          user: {
            id: supaEmp.id,
            empCode: supaEmp.emp_code,
            name: supaEmp.name,
            email: supaEmp.email || '',
            role: roleLower as any,
            department: supaEmp.department || 'Technical',
            designation: supaEmp.designation || 'Staff',
            redirectTo,
          },
        };
      }
    } catch (err) {
      console.warn('Supabase authentication lookup failed, checking local registry:', err);
    }
  }

  const employee = findEmployeeByIdentifier(cleanId);

  // Requirement: Only those entries that exist or are created within the 'Employee' module should be granted permission
  if (!employee) {
    return {
      success: false,
      error: 'Access Denied: No employee record found matching "' + cleanId + '". Access is restricted to registered staff.',
      status: 401,
    };
  }

  // Account status check
  if (employee.activeStatus === 'Inactive') {
    return {
      success: false,
      error: 'Security Alert: This employee account has been deactivated. Access is blocked.',
      status: 403,
    };
  }

  if (employee.activeStatus === 'On Leave') {
    return {
      success: false,
      error: 'Access Restricted: This employee profile is currently registered as On Leave. Please contact the administrator.',
      status: 403,
    };
  }

  // Requirement: Login must be performed using the password associated with the respective employee record
  if (!employee.passwordHashOrPlain) {
    return {
      success: false,
      error: 'Access Denied: No login password has been set for employee ' + employee.empCode + ' in the Employee module.',
      status: 401,
    };
  }

  const isPasswordValid = await verifyPassword(cleanPass, employee.passwordHashOrPlain);

  if (!isPasswordValid) {
    return {
      success: false,
      error: 'Invalid password. Please enter the correct password configured for employee ' + employee.empCode + '.',
      status: 401,
    };
  }

  // Determine dashboard redirect based on employee role
  let redirectTo = '/erp/dashboard';
  if (employee.role === 'technician') {
    redirectTo = '/erp/repairs';
  } else if (employee.role === 'sales') {
    redirectTo = '/erp/pos';
  } else if (employee.role === 'customer') {
    redirectTo = '/portal';
  }

  return {
    success: true,
    user: {
      id: employee.id,
      empCode: employee.empCode,
      name: employee.name,
      email: employee.email,
      role: employee.role,
      department: employee.department,
      designation: employee.designation,
      redirectTo,
    },
    status: 200,
  };
}
