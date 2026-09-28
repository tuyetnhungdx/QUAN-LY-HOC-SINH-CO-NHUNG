import React, { useState } from 'react';
import { Assignment } from '../types';
import {
  FileEdit,
  Plus,
  Clock,
  CheckCircle2,
  Calendar,
  Users,
  ChevronRight,
  Filter,
  Award,
} from 'lucide-react';

interface AssignmentsViewProps {
  assignments: Assignment[];
  onAddAssignment: (assignment: Assignment) => void;
}

export const AssignmentsView: React.FC<AssignmentsViewProps> = ({
  assignments,
  onAddAssignment,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);

  // Form state
  const [title, setTitle] = useState('');
  const [targetClass, setTargetClass] = useState('12A1');
  const [type, setType] = useState<'homework' | 'quiz_15p' | 'midterm_revision'>('homework');
  const [dueDate, setDueDate] = useState('2025-04-10');
  const [description, setDescription] = useState('');

  const filtered = assignments.filter((a) => {
    return selectedClass === 'all' || a.className === selectedClass;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newAsg: Assignment = {
      id: `asg_${Date.now()}`,
      title,
      className: targetClass,
      type,
      dueDate,
      totalAssigned: targetClass === '12A1' ? 42 : targetClass === '12A2' ? 40 : targetClass === '11B3' ? 38 : 41,
      submittedCount: 0,
      gradedCount: 0,
      averageScore: undefined,
      description,
      status: 'active',
    };

    onAddAssignment(newAsg);
    setIsCreateOpen(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#17324D]">
            Quản lý Bài tập & Kiểm tra
          </h1>
          <p className="text-xs text-[#64748B]">
            Giao bài tập về nhà, bài kiểm tra 15 phút và theo dõi tiến độ nộp bài
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3.5 py-2 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs font-bold text-[#17324D] outline-none"
          >
            <option value="all">Tất cả các lớp</option>
            <option value="12A1">Lớp 12A1</option>
            <option value="12A2">Lớp 12A2</option>
            <option value="11B3">Lớp 11B3</option>
            <option value="10C2">Lớp 10C2</option>
          </select>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2 bg-[#0066CC] hover:bg-[#004A99] text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo bài tập mới</span>
          </button>
        </div>
      </div>

      {/* Assignment Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => {
          const completionRate = Math.round((item.submittedCount / item.totalAssigned) * 100);
          const isPendingGrading = item.submittedCount > item.gradedCount;

          return (
            <div
              key={item.id}
              className="bg-white p-5 rounded-3xl border border-blue-100 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      item.type === 'homework'
                        ? 'bg-blue-100 text-[#0066CC]'
                        : item.type === 'quiz_15p'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.type === 'homework'
                      ? 'Bài tập về nhà'
                      : item.type === 'quiz_15p'
                      ? 'Kiểm tra 15p'
                      : 'Đề ôn tập'}
                  </span>

                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#F5F9FF] text-[#17324D] border border-blue-100">
                    Lớp {item.className}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#17324D] leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-[#64748B] mt-2 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Tiến độ nộp bài:</span>
                    <span className="font-bold text-[#17324D] font-mono">
                      {item.submittedCount} / {item.totalAssigned} học sinh ({completionRate}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#0066CC] to-blue-400 rounded-full transition-all duration-500"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>

                {/* Footer details */}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1 text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Hạn chót: {item.dueDate}</span>
                  </div>

                  {item.averageScore && (
                    <div className="flex items-center gap-1 font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <Award className="w-3 h-3 text-emerald-600" />
                      <span>ĐTB: {item.averageScore}</span>
                    </div>
                  )}
                </div>

                {/* Bottom button */}
                <div className="flex gap-2">
                  <button
                    onClick={() => alert(`Mở danh sách bài làm của học sinh cho bài: ${item.title}`)}
                    className="flex-1 py-2 rounded-xl bg-[#F5F9FF] hover:bg-blue-100 text-[#0066CC] text-xs font-semibold border border-blue-200 transition-colors cursor-pointer"
                  >
                    Xem bài nộp ({item.submittedCount})
                  </button>
                  {isPendingGrading && (
                    <button
                      onClick={() => alert(`Chuyển sang giao diện chấm bài: còn ${item.submittedCount - item.gradedCount} bài chưa chấm.`)}
                      className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Chấm bài ({item.submittedCount - item.gradedCount})
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Assignment Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-[#17324D] mb-1">
              Giao bài tập mới
            </h3>
            <p className="text-xs text-[#64748B] mb-4">
              Tạo bài tập hoặc bài kiểm tra cho học sinh lớp phụ trách
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#17324D] mb-1">
                  Tiêu đề bài tập
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="VD: Bài tập tuần 25 - Chuyên đề Khối đa diện"
                  className="w-full px-3.5 py-2 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs text-[#17324D] focus:ring-2 focus:ring-[#0066CC] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#17324D] mb-1">
                    Giao cho lớp
                  </label>
                  <select
                    value={targetClass}
                    onChange={(e) => setTargetClass(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs text-[#17324D] font-medium outline-none"
                  >
                    <option value="12A1">Lớp 12A1</option>
                    <option value="12A2">Lớp 12A2</option>
                    <option value="11B3">Lớp 11B3</option>
                    <option value="10C2">Lớp 10C2</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17324D] mb-1">
                    Loại bài tập
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs text-[#17324D] font-medium outline-none"
                  >
                    <option value="homework">Bài tập về nhà</option>
                    <option value="quiz_15p">Kiểm tra 15 phút</option>
                    <option value="midterm_revision">Đề ôn tập</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17324D] mb-1">
                  Hạn nộp bài
                </label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs text-[#17324D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17324D] mb-1">
                  Yêu cầu & Nội dung đề bài
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ghi rõ số trang, dạng câu hỏi hoặc hướng dẫn làm bài..."
                  className="w-full p-3 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs text-[#17324D] focus:ring-2 focus:ring-[#0066CC] outline-none"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#0066CC] hover:bg-[#004A99] text-white text-xs font-semibold shadow-sm"
                >
                  Giao bài ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
