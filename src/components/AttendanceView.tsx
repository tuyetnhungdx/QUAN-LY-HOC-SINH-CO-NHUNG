import React, { useState } from 'react';
import { Student, Classroom } from '../types';
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertOctagon,
  Save,
  CheckCheck,
  Send,
  UserCheck,
} from 'lucide-react';

interface AttendanceViewProps {
  students: Student[];
  classes?: Classroom[];
  onUpdateAttendance: (studentId: string, status: 'present' | 'excused' | 'unexcused' | 'late') => void;
  onSelectStudent: (student: Student) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  students,
  classes = [],
  onUpdateAttendance,
  onSelectStudent,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>(() => {
    if (classes.length > 0) return classes[0].name;
    return '12A1';
  });
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [sessionPeriod, setSessionPeriod] = useState<'morning' | 'afternoon'>('morning');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Local daily status state
  const classStudents = students.filter((s) => s.className === selectedClass);
  const [dailyStatus, setDailyStatus] = useState<{
    [id: string]: 'present' | 'excused' | 'unexcused' | 'late';
  }>(() => {
    const initial: any = {};
    students.forEach((s) => {
      initial[s.id] = 'present';
    });
    return initial;
  });

  const handleStatusChange = (
    studentId: string,
    status: 'present' | 'excused' | 'unexcused' | 'late'
  ) => {
    setDailyStatus((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const markAllPresent = () => {
    const updated: any = { ...dailyStatus };
    classStudents.forEach((s) => {
      updated[s.id] = 'present';
    });
    setDailyStatus(updated);
  };

  const handleSaveAttendance = () => {
    classStudents.forEach((s) => {
      const status = dailyStatus[s.id] || 'present';
      onUpdateAttendance(s.id, status);
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Metric counts today
  const presentCount = classStudents.filter((s) => (dailyStatus[s.id] || 'present') === 'present').length;
  const excusedCount = classStudents.filter((s) => dailyStatus[s.id] === 'excused').length;
  const unexcusedCount = classStudents.filter((s) => dailyStatus[s.id] === 'unexcused').length;
  const lateCount = classStudents.filter((s) => dailyStatus[s.id] === 'late').length;

  return (
    <div className="space-y-5">
      {/* Top Header & Filter Controls */}
      <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#17324D]">
            Điểm danh & Chuyên cần
          </h1>
          <p className="text-xs text-[#64748B]">
            Theo dõi tình hình đi học của học sinh theo từng buổi giảng dạy
          </p>
        </div>

        {/* Date & Class Selectors */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3.5 py-2 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs font-bold text-[#17324D] outline-none"
          >
            {classes.length > 0 ? (
              classes.map((c) => (
                <option key={c.id} value={c.name}>
                  Lớp {c.name} {c.isHomeroom ? '(Chủ nhiệm)' : ''}
                </option>
              ))
            ) : (
              <>
                <option value="12A1">Lớp 12A1 (Chủ nhiệm)</option>
                <option value="12A2">Lớp 12A2</option>
                <option value="11B3">Lớp 11B3</option>
                <option value="10C2">Lớp 10C2</option>
              </>
            )}
          </select>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs text-[#17324D] font-medium outline-none"
          />

          <div className="flex bg-[#F5F9FF] p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setSessionPeriod('morning')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                sessionPeriod === 'morning' ? 'bg-[#0066CC] text-white' : 'text-slate-600'
              }`}
            >
              Buổi Sáng
            </button>
            <button
              onClick={() => setSessionPeriod('afternoon')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                sessionPeriod === 'afternoon' ? 'bg-[#0066CC] text-white' : 'text-slate-600'
              }`}
            >
              Buổi Chiều
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-emerald-100 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs font-semibold text-emerald-700">Có mặt</p>
            <h3 className="text-2xl font-bold font-mono text-emerald-800 mt-0.5">
              {presentCount}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-100 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs font-semibold text-[#0066CC]">Có phép</p>
            <h3 className="text-2xl font-bold font-mono text-[#004A99] mt-0.5">
              {excusedCount}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0066CC] flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-red-100 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs font-semibold text-red-600">Không phép</p>
            <h3 className="text-2xl font-bold font-mono text-red-700 mt-0.5">
              {unexcusedCount}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-100 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs font-semibold text-amber-700">Đi trễ</p>
            <h3 className="text-2xl font-bold font-mono text-amber-800 mt-0.5">
              {lateCount}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertOctagon className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Action Controls for Batch Marking */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200">
        <button
          onClick={markAllPresent}
          className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <CheckCheck className="w-4 h-4 text-emerald-600" />
          <span>Điểm danh tất cả Có mặt</span>
        </button>

        <button
          onClick={handleSaveAttendance}
          className="px-5 py-2 bg-[#0066CC] hover:bg-[#004A99] text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Lưu điểm danh ngày {selectedDate}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Đã lưu kết quả điểm danh lớp {selectedClass} ngày {selectedDate}!</span>
        </div>
      )}

      {/* Attendance Roster Table */}
      <div className="bg-white rounded-3xl border border-blue-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F9FF] text-[#17324D] font-bold border-b border-blue-100 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 w-12 text-center">STT</th>
                <th className="py-3 px-4">Họ và tên học sinh</th>
                <th className="py-3 px-4 text-center">Trạng thái điểm danh hôm nay</th>
                <th className="py-3 px-4 text-center">Tổng vắng trong kỳ</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.map((st, idx) => {
                const currentStatus = dailyStatus[st.id] || 'present';

                return (
                  <tr key={st.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-3 px-4 text-center font-mono text-slate-400 font-bold">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => onSelectStudent(st)}
                        className="font-bold text-[#17324D] hover:text-[#0066CC] text-left cursor-pointer hover:underline"
                      >
                        {st.name}
                      </button>
                    </td>

                    {/* Status Toggle Buttons */}
                    <td className="py-2 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleStatusChange(st.id, 'present')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            currentStatus === 'present'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                        >
                          Có mặt
                        </button>
                        <button
                          onClick={() => handleStatusChange(st.id, 'excused')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            currentStatus === 'excused'
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                          }`}
                        >
                          Phép
                        </button>
                        <button
                          onClick={() => handleStatusChange(st.id, 'unexcused')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            currentStatus === 'unexcused'
                              ? 'bg-red-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-700'
                          }`}
                        >
                          Không phép
                        </button>
                        <button
                          onClick={() => handleStatusChange(st.id, 'late')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            currentStatus === 'late'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                          }`}
                        >
                          Trễ
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center font-mono font-medium">
                      <span className="text-slate-600">{st.attendance.excused} P</span>
                      {' · '}
                      <span
                        className={
                          st.attendance.unexcused > 0 ? 'text-red-600 font-bold' : 'text-slate-400'
                        }
                      >
                        {st.attendance.unexcused} KP
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onSelectStudent(st)}
                        className="px-2.5 py-1 rounded-lg text-slate-600 bg-slate-50 hover:bg-blue-50 hover:text-[#0066CC] font-semibold text-xs transition-colors border border-slate-200 cursor-pointer"
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
