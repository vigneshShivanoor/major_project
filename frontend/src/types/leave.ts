export type LeaveType = 'CL' | 'HDL' | 'CCL' | 'EL';

export interface LeaveApplication {
  id: string;
  facultyId: string;
  facultyName: string;
  department: string;
  type: LeaveType;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: 'pending' | 'approved_by_hod' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}