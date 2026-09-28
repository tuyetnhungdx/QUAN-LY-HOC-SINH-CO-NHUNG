import React from 'react';
import { Classroom, Student, Assignment } from '../types';
import {
  Users,
  CheckCircle2,
  Award,
  Clock,
  ArrowUpRight,
  Sparkles,
  Calendar,
  AlertCircle,
  TrendingUp,
  FileCheck,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

interface DashboardViewProps {
  classes: Classroom[];
  students: Student[];
  assignments: Assignment[];
  onNavigate: (tabId: any) => void;
  onSelectStudent: (student: Student) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  classes,
  students,
  assignments,
  onNavigate,
  onSelectStudent,
}) => {
  const totalStudents = classes.reduce((sum, c) => sum + c.totalStudents, 0);
  
  // Calculate average score across all students
  const validScores = students
    .map((s) => s.scores.dtb)
    .filter((s): s is number => s !== null);
  const avgSchoolScore = validScores.length > 0
    ? (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1)
    : '7.9';

  // Calculate attendance rate today
  const totalPresent = students.reduce((sum, s) => sum + s.attendance.present, 0);
  const totalAbsences = students.reduce(
    (sum, s) => sum + s.attendance.excused + s.attendance.unexcused,
    0
  );
  const totalSessions = totalPresent + totalAbsences;
  const attendanceRate = totalSessions > 0
    ? Math.round((totalPresent / totalSessions) * 100)
    : 98;

  // Ungraded assignments
  const pendingGradingCount = assignments.reduce(
    (sum, a) => sum + (a.submittedCount - a.gradedCount),
    0
  );

  // Top performing students
  const topStudents = [...students]
    .filter((s) => s.scores.dtb !== null)
    .sort((a, b) => (b.scores.dtb ?? 0) - (a.scores.dtb ?? 0))
    .slice(0, 5);

  // Students needing support (ĐTB < 6.5 or unexcused > 0)
  const studentsNeedingSupport = students
    .filter((s) => (s.scores.dtb !== null && s.scores.dtb < 6.5) || s.attendance.unexcused > 0)
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#004A99] via-[#0066CC] to-[#0284C7] rounded-3xl p-6 md:p-8 text-white shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px] hidden md:block" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-amber-200 text-xs font-semibold mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Năm học 2026 - 2027 · THPT Nguyễn Dục</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight">
            Kính chào Cô Trần Thị Tuyết Nhung
          </h1>
          <p className="text-xs md:text-sm text-blue-100 mt-2 leading-relaxed">
            Hôm nay là Thứ Hai, tuần học thứ 4. Chúc Cô có một tuần giảng dạy hiệu quả và tràn đầy nhiệt huyết cùng các em học sinh!
          </p>

          {/* Quick Actions Bar inside Banner */}
          <div className="flex flex-wrap gap-2.5 mt-5">
            <button
              onClick={() => onNavigate('grades')}
              className="px-4 py-2 bg-white text-[#004A99] hover:bg-blue-50 font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Nhập điểm nhanh</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('attendance')}
              className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white font-semibold text-xs rounded-xl backdrop-blur-md border border-white/20 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Điểm danh hôm nay</span>
            </button>
            <button
              onClick={() => onNavigate('ai')}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Trợ lý AI Sư phạm</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#64748B]">Tổng số học sinh</p>
            <h3 className="text-2xl font-bold text-[#17324D] mt-1 tabular-nums">
              {totalStudents}
            </h3>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
              4 lớp phụ trách giảng dạy
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#EAF4FF] text-[#0066CC] flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#64748B]">Chuyên cần hôm nay</p>
            <h3 className="text-2xl font-bold text-[#17324D] mt-1 tabular-nums">
              {attendanceRate}%
            </h3>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
              Đạt chuẩn duy trì chuyên cần
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#64748B]">Điểm trung bình môn</p>
            <h3 className="text-2xl font-bold text-[#0066CC] mt-1 tabular-nums">
              {avgSchoolScore}
            </h3>
            <p className="text-[11px] text-[#004A99] font-medium mt-0.5">
              Tỷ lệ Khá - Giỏi đạt 88.5%
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#004A99] flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#64748B]">Bài tập chờ chấm</p>
            <h3 className="text-2xl font-bold text-amber-600 mt-1 tabular-nums">
              {pendingGradingCount}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Hạn hoàn thành trước thứ 5
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Schedule & Classes Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 cols: Classes & Urgent Tasks */}
        <div className="lg:col-span-8 space-y-6">
          {/* Class Cards */}
          <div className="bg-white rounded-2xl border border-blue-100 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-[#17324D]">
                  Các lớp phân công giảng dạy
                </h2>
                <p className="text-xs text-[#64748B]">
                  Năm học 2026 - 2027 · Bộ môn Toán THPT
                </p>
              </div>
              <button
                onClick={() => onNavigate('classes')}
                className="text-xs font-semibold text-[#0066CC] hover:text-[#004A99] flex items-center gap-1"
              >
                <span>Xem chi tiết</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {classes.map((cls) => (
                <div
                  key={cls.id}
                  onClick={() => onNavigate('classes')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                    cls.isHomeroom
                      ? 'border-[#0066CC] bg-[#F5F9FF]/80 hover:bg-[#F5F9FF]'
                      : 'border-slate-200 bg-white hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-[#17324D]">
                          Lớp {cls.name}
                        </span>
                        {cls.isHomeroom && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0066CC] text-white">
                            Chủ nhiệm
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        {cls.room} · Sĩ số: {cls.totalStudents} HS
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-[#0066CC] tabular-nums">
                        {cls.averageScore} ĐTB
                      </span>
                      <p className="text-[10px] text-emerald-600 font-medium">
                        Đạt {cls.passRate}%
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#64748B]">
                    <span>Lớp trưởng: {cls.monitorName}</span>
                    <span className="text-[#0066CC] font-medium text-[11px]">
                      {cls.subject}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Urgent Deadlines & Tasks */}
          <div className="bg-white rounded-2xl border border-blue-100 p-5 shadow-xs">
            <h2 className="text-base font-bold text-[#17324D] mb-3">
              Việc cần làm trong tuần
            </h2>

            <div className="space-y-2.5">
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-amber-900">
                      Hoàn thành nhập điểm Giữa kỳ II cho lớp 12A1 và 12A2
                    </p>
                    <p className="text-[11px] text-amber-700">
                      Hạn nộp lên hệ thống: 17h00 Thứ Sáu (28/03/2025)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('grades')}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold"
                >
                  Nhập điểm
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileCheck className="w-5 h-5 text-[#0066CC] shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-[#004A99]">
                      Chấm bài tập chuyên đề Khảo sát hàm số (Lớp 12A1)
                    </p>
                    <p className="text-[11px] text-blue-700">
                      Đã có 40/42 học sinh nộp bài trên hệ thống
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('assignments')}
                  className="px-3 py-1.5 bg-[#0066CC] hover:bg-[#004A99] text-white rounded-lg text-xs font-semibold"
                >
                  Chấm bài
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-emerald-900">
                      Soạn nhận xét học bạ định kỳ bằng Trợ lý AI
                    </p>
                    <p className="text-[11px] text-emerald-700">
                      Tự động hóa theo tiêu chuẩn Thông tư 22/BGDĐT
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('ai')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                >
                  Dùng AI
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 cols: Teaching Schedule & Student Watchlist */}
        <div className="lg:col-span-4 space-y-6">
          {/* Today's Teaching Schedule */}
          <div className="bg-white rounded-2xl border border-blue-100 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3.5">
              <h2 className="text-base font-bold text-[#17324D]">
                Lịch dạy hôm nay
              </h2>
              <span className="text-xs font-semibold text-[#0066CC] bg-[#EAF4FF] px-2.5 py-0.5 rounded-full">
                Thứ Hai
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-[#F5F9FF] border-l-4 border-[#0066CC]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#17324D]">Tiết 1 - 2 (07:00 - 08:35)</span>
                  <span className="text-[11px] font-semibold text-[#0066CC]">Lớp 12A1</span>
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Đại số: Khảo sát sự biến thiên của hàm đa thức
                </p>
                <span className="text-[10px] text-slate-400">Phòng 301 - Dãy A</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F5F9FF] border-l-4 border-blue-400">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#17324D]">Tiết 3 - 4 (08:50 - 10:25)</span>
                  <span className="text-[11px] font-semibold text-[#0066CC]">Lớp 12A2</span>
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Hình học: Hệ tọa độ trong không gian Oxyz
                </p>
                <span className="text-[10px] text-slate-400">Phòng 302 - Dãy A</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F5F9FF] border-l-4 border-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#17324D]">Tiết 5 (10:35 - 11:15)</span>
                  <span className="text-[11px] font-semibold text-slate-700">Lớp 11B3</span>
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Đại số: Hoán vị, Chỉnh hợp và Tổ hợp
                </p>
                <span className="text-[10px] text-slate-400">Phòng 204 - Dãy B</span>
              </div>
            </div>
          </div>

          {/* Student Attention Watchlist */}
          <div className="bg-white rounded-2xl border border-blue-100 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-[#17324D]">
                Cần quan tâm / Phụ đạo
              </h2>
              <span className="text-xs text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded-full">
                {studentsNeedingSupport.length} học sinh
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {studentsNeedingSupport.map((st) => (
                <div
                  key={st.id}
                  onClick={() => onSelectStudent(st)}
                  className="py-2.5 flex items-center justify-between hover:bg-[#F5F9FF] p-2 rounded-lg cursor-pointer transition-colors"
                >
                  <div>
                    <p className="text-xs font-bold text-[#17324D]">{st.name}</p>
                    <p className="text-[11px] text-[#64748B]">
                      Lớp {st.className} · {st.attendance.unexcused > 0 ? `Vắng không phép: ${st.attendance.unexcused}` : 'Hổng kiến thức'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-red-600">
                      {st.scores.dtb ?? '--'} ĐTB
                    </span>
                    <p className="text-[10px] text-slate-400">Xem hồ sơ</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
