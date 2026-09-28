import React, { useState } from 'react';
import { Classroom, Student } from '../types';
import {
  TrendingUp,
  Award,
  Users,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  PieChart,
  BarChart2,
} from 'lucide-react';

interface AnalyticsViewProps {
  classes: Classroom[];
  students: Student[];
  onSelectStudent: (student: Student) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  classes,
  students,
  onSelectStudent,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('all');

  const filteredStudents = selectedClass === 'all'
    ? students
    : students.filter((s) => s.className === selectedClass);

  // Score distribution buckets
  const bucketExcellent = filteredStudents.filter((s) => s.scores.dtb !== null && s.scores.dtb >= 8.5).length;
  const bucketGood = filteredStudents.filter((s) => s.scores.dtb !== null && s.scores.dtb >= 8.0 && s.scores.dtb < 8.5).length;
  const bucketFair = filteredStudents.filter((s) => s.scores.dtb !== null && s.scores.dtb >= 6.5 && s.scores.dtb < 8.0).length;
  const bucketPass = filteredStudents.filter((s) => s.scores.dtb !== null && s.scores.dtb >= 5.0 && s.scores.dtb < 6.5).length;
  const bucketFail = filteredStudents.filter((s) => s.scores.dtb !== null && s.scores.dtb < 5.0).length;

  const totalEvaluated = filteredStudents.filter((s) => s.scores.dtb !== null).length || 1;

  const pct = (count: number) => Math.round((count / totalEvaluated) * 100);

  // Top 5 rank
  const topStudents = [...filteredStudents]
    .filter((s) => s.scores.dtb !== null)
    .sort((a, b) => (b.scores.dtb ?? 0) - (a.scores.dtb ?? 0))
    .slice(0, 5);

  // Remedial group
  const remedialStudents = [...filteredStudents]
    .filter((s) => (s.scores.dtb !== null && s.scores.dtb < 6.5) || s.attendance.unexcused > 0)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#17324D]">
            Báo cáo Thống kê & Phân tích Học tập
          </h1>
          <p className="text-xs text-[#64748B]">
            Theo dõi phổ điểm, tỷ lệ xếp loại và đối sánh chất lượng giữa các lớp giảng dạy
          </p>
        </div>

        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="px-4 py-2 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs font-bold text-[#17324D] outline-none"
        >
          <option value="all">Tất cả các lớp (Toàn bộ học sinh)</option>
          <option value="12A1">Lớp 12A1 (Chủ nhiệm)</option>
          <option value="12A2">Lớp 12A2</option>
          <option value="11B3">Lớp 11B3</option>
          <option value="10C2">Lớp 10C2</option>
        </select>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-blue-100 shadow-xs">
          <p className="text-xs font-semibold text-slate-500">Tỷ lệ Học sinh Khá - Giỏi</p>
          <h3 className="text-2xl font-bold font-mono text-[#0066CC] mt-1">
            {pct(bucketExcellent + bucketGood + bucketFair)}%
          </h3>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
            Vượt chỉ tiêu đầu năm 4.5%
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-blue-100 shadow-xs">
          <p className="text-xs font-semibold text-slate-500">Tỷ lệ Tốt nghiệp dự kiến</p>
          <h3 className="text-2xl font-bold font-mono text-emerald-600 mt-1">
            {100 - pct(bucketFail)}%
          </h3>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            Dựa trên điểm kiểm tra định kỳ
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-blue-100 shadow-xs">
          <p className="text-xs font-semibold text-slate-500">Số HS cần phụ đạo thêm</p>
          <h3 className="text-2xl font-bold font-mono text-amber-600 mt-1">
            {remedialStudents.length} em
          </h3>
          <p className="text-[11px] text-amber-700 font-medium mt-0.5">
            Cần phụ đạo trước kỳ thi tốt nghiệp
          </p>
        </div>
      </div>

      {/* Grade Distribution Bar Chart */}
      <div className="bg-white p-6 rounded-3xl border border-blue-100 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#17324D]">
              Phổ điểm môn Toán (Học kỳ II)
            </h2>
            <p className="text-xs text-[#64748B]">
              Phân bố điểm trung bình môn của {totalEvaluated} học sinh
            </p>
          </div>
          <span className="text-xs font-semibold text-[#0066CC] bg-[#EAF4FF] px-3 py-1 rounded-full">
            Chuẩn Đánh Giá
          </span>
        </div>

        {/* Custom SVG / Clean CSS Bar Chart */}
        <div className="space-y-4">
          {/* Bar 1: Xuất sắc (8.5 - 10) */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-[#17324D] mb-1">
              <span>Xuất sắc (8.5 - 10.0)</span>
              <span className="font-mono text-purple-700">
                {bucketExcellent} HS ({pct(bucketExcellent)}%)
              </span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500"
                style={{ width: `${pct(bucketExcellent)}%` }}
              />
            </div>
          </div>

          {/* Bar 2: Giỏi (8.0 - 8.4) */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-[#17324D] mb-1">
              <span>Giỏi (8.0 - 8.4)</span>
              <span className="font-mono text-emerald-700">
                {bucketGood} HS ({pct(bucketGood)}%)
              </span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${pct(bucketGood)}%` }}
              />
            </div>
          </div>

          {/* Bar 3: Khá (6.5 - 7.9) */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-[#17324D] mb-1">
              <span>Khá (6.5 - 7.9)</span>
              <span className="font-mono text-[#0066CC]">
                {bucketFair} HS ({pct(bucketFair)}%)
              </span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0066CC] to-blue-400 rounded-full transition-all duration-500"
                style={{ width: `${pct(bucketFair)}%` }}
              />
            </div>
          </div>

          {/* Bar 4: Đạt (5.0 - 6.4) */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-[#17324D] mb-1">
              <span>Đạt / Trung bình (5.0 - 6.4)</span>
              <span className="font-mono text-amber-700">
                {bucketPass} HS ({pct(bucketPass)}%)
              </span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${pct(bucketPass)}%` }}
              />
            </div>
          </div>

          {/* Bar 5: Chưa đạt (< 5.0) */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-[#17324D] mb-1">
              <span>Chưa đạt (&lt; 5.0)</span>
              <span className="font-mono text-red-600">
                {bucketFail} HS ({pct(bucketFail)}%)
              </span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500"
                style={{ width: `${pct(bucketFail)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Two columns: Top Achievers vs Needs Support */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top 5 Students */}
        <div className="bg-white p-5 rounded-3xl border border-blue-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#17324D] flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Top 5 học sinh xuất sắc</span>
            </h3>
            <span className="text-[11px] text-slate-500">Điểm cao nhất</span>
          </div>

          <div className="divide-y divide-slate-100">
            {topStudents.map((st, i) => (
              <div
                key={st.id}
                onClick={() => onSelectStudent(st)}
                className="py-2.5 flex items-center justify-between hover:bg-[#F5F9FF] p-2 rounded-lg cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      i === 0
                        ? 'bg-amber-100 text-amber-800'
                        : i === 1
                        ? 'bg-slate-200 text-slate-800'
                        : i === 2
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-[#17324D]">{st.name}</p>
                    <p className="text-[11px] text-slate-400">Lớp {st.className}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold font-mono text-[#0066CC]">
                    {st.scores.dtb?.toFixed(1)} ĐTB
                  </span>
                  <p className="text-[10px] text-emerald-600 font-semibold">{st.scores.rank}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Needs Remedial Support */}
        <div className="bg-white p-5 rounded-3xl border border-blue-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#17324D] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span>Học sinh cần kèm cặp & phụ đạo</span>
            </h3>
            <span className="text-[11px] text-red-600 font-semibold">Ưu tiên hỗ trợ</span>
          </div>

          <div className="divide-y divide-slate-100">
            {remedialStudents.map((st) => (
              <div
                key={st.id}
                onClick={() => onSelectStudent(st)}
                className="py-2.5 flex items-center justify-between hover:bg-red-50/40 p-2 rounded-lg cursor-pointer transition-colors"
              >
                <div>
                  <p className="text-xs font-bold text-[#17324D]">{st.name}</p>
                  <p className="text-[11px] text-[#64748B]">
                    Lớp {st.className} · {st.attendance.unexcused > 0 ? `Vắng ${st.attendance.unexcused} buổi KP` : 'Học lực còn yếu'}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold font-mono text-red-600">
                    {st.scores.dtb ?? '--'} ĐTB
                  </span>
                  <p className="text-[10px] text-slate-400">Xem hồ sơ →</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
