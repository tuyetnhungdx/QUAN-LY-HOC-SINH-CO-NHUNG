export type AcademicRank = 'Xuất sắc' | 'Giỏi' | 'Khá' | 'Đạt' | 'Chưa đạt';
export type ConductRank = 'Tốt' | 'Khá' | 'Đạt' | 'Chưa đạt';

export interface ScoreSet {
  tx1: number | null;
  tx2: number | null;
  tx3: number | null;
  gk: number | null;
  ck: number | null;
  dtb: number | null;
  rank?: AcademicRank;
}

export interface Student {
  id: string;
  studentCode: string; // VD: ND-2024-001
  name: string;
  gender: 'Nam' | 'Nữ';
  dob: string;
  className: string;
  scores: ScoreSet;
  conduct: ConductRank;
  attendance: {
    present: number;
    excused: number;
    unexcused: number;
    late: number;
  };
  parentName: string;
  parentPhone: string;
  address: string;
  notes: string;
  avatarSeed?: string;
  aiRemark?: string;
}

export interface Classroom {
  id: string;
  name: string;
  grade: '10' | '11' | '12';
  totalStudents: number;
  homeroomTeacher: string;
  isHomeroom: boolean; // Có phải lớp chủ nhiệm của thầy An không
  subject: string;
  monitorName: string; // Lớp trưởng
  viceMonitorName: string; // Lớp phó
  secretaryName: string; // Bí thư
  room: string;
  averageScore: number;
  passRate: number;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  className: string;
  records: {
    studentId: string;
    studentName: string;
    status: 'present' | 'excused' | 'unexcused' | 'late';
    note?: string;
  }[];
}

export interface Assignment {
  id: string;
  title: string;
  className: string;
  type: 'homework' | 'quiz_15p' | 'midterm_revision';
  dueDate: string;
  totalAssigned: number;
  submittedCount: number;
  gradedCount: number;
  averageScore?: number;
  description: string;
  status: 'active' | 'closed';
}

export interface StudyMaterial {
  id: string;
  title: string;
  grade: '10' | '11' | '12';
  subject: string;
  category: 'document' | 'video' | 'exam' | 'link';
  fileSize?: string;
  duration?: string;
  uploadDate: string;
  downloadCount: number;
  url?: string;
  description: string;
}

export interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  role: string;
  schoolName: string;
  homeroomClass: string;
  academicYear: string;
  currentSemester: string;
}

export interface SchoolNotification {
  id: string;
  title: string;
  content: string;
  time: string;
  unread: boolean;
  type: 'academic' | 'system' | 'student';
}

export interface ReviewLink {
  id: string;
  title: string;
  url: string;
  category: 'quiz' | 'document' | 'video' | 'website';
  targetClass: string; // 'all' hoặc tên lớp cụ thể: '12A1', '12A2', '11B3', '10C2'
  grade: '10' | '11' | '12' | 'all';
  description?: string;
  provider?: string; // VD: 'Azota', 'Quizizz', 'Google Drive', 'YouTube', 'Google Forms', 'Website'
  createdAt: string;
  deadline?: string;
  isPinned?: boolean;
}
