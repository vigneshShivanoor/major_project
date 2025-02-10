export type UserRole = 'faculty' | 'hod' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  designation: string;
  leaveBalance: {
    CL: number;
    HDL: number;
    CCL: number;
    EL: number;
  };
}