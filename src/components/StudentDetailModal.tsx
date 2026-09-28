import React, { useState } from 'react';
import { Student } from '../types';
import {
  X,
  Phone,
  Calendar,
  Award,
  Sparkles,
  MapPin,
  User,
  CheckCircle,
  AlertCircle,
  FileText,
  Copy,
  Check,
  Trash2,
} from 'lucide-react';

interface StudentDetailModalProps {
  student: Student | null;
  onClose: () => void;
  onUpdateStudent: (updated: Student) => void;
  onAskAIForStudent: (student: Student) => void;
  onDeleteStudent?: (id: string) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  onClose,
  onUpdateStudent,
  onAskAIForStudent,
  onDeleteStudent,
}) => {
  if (!student) return null;

  const [activeTab, setActiveTab] = useState<'grades' | 'attendance' | 'notes'>('grades');
  const [notes, setNotes] = useState(student.notes);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSaveNotes = () => {
    setIsSavingNotes(true);
    setTimeout(() => {
      onUpdateStudent({ ...student, notes });
      setIsSavingNotes(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-[#004A99] to-[#0066CC] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold text-2xl flex items-center justify-center shrink-0 shadow-md">
              {student.name.charAt(student.name.lastIndexOf(' ') + 1) || 'H'}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {student.name}
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/20 border border-white/30 text-white font-semibold">
                  Lớp {student.className}
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-0.5">
                {student.gender} · Sinh ngày {student.dob} · THPT Nguyễn Dục
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar in Header */}
          <div className="mt-4 pt-4 border-t border-white/15 grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-1.5 rounded-xl bg-white/10">
              <p className="text-[10px] text-blue-200 uppercase font-semibold">ĐTB Môn</p>
              <p className="text-base font-bold font-mono text-white">
                {student.scores.dtb !== null ? student.scores.dtb.toFixed(1) : '--'}
              </p>
            </div>
            <div className="p-1.5 rounded-xl bg-white/10">
              <p className="text-[10px] text-blue-200 uppercase font-semibold">Học lực</p>
              <p className="text-xs font-bold text-amber-200">
                {student.scores.rank || 'Chưa đạt'}
              </p>
            </div>
            <div className="p-1.5 rounded-xl bg-white/10">
              <p className="text-[10px] text-blue-200 uppercase font-semibold">Hạnh kiểm</p>
              <p className="text-xs font-bold text-emerald-200">
                {student.conduct}
              </p>
            </div>
            <div className="p-1.5 rounded-xl bg-white/10">
              <p className="text-[10px] text-blue-200 uppercase font-semibold">Có mặt</p>
              <p className="text-xs font-bold font-mono text-white">
                {student.attendance.present} buổi
              </p>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-100 bg-[#F5F9FF] px-4">
          <button
            onClick={() => setActiveTab('grades')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'grades'
                ? 'border-[#0066CC] text-[#0066CC]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Bảng điểm chi tiết
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'attendance'
                ? 'border-[#0066CC] text-[#0066CC]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Chuyên cần
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'notes'
                ? 'border-[#0066CC] text-[#0066CC]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Ghi chú & Sư phạm
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'grades' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-blue-100 p-4 bg-[#F5F9FF]/50">
                <h4 className="text-xs font-bold text-[#17324D] uppercase tracking-wider mb-3">
                  Điểm thành phần môn Toán (Học kỳ II)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-semibold">TX 1 (x1)</span>
                    <p className="text-lg font-bold font-mono text-[#17324D] mt-0.5">
                      {student.scores.tx1 ?? '--'}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-semibold">TX 2 (x1)</span>
                    <p className="text-lg font-bold font-mono text-[#17324D] mt-0.5">
                      {student.scores.tx2 ?? '--'}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-semibold">TX 3 (x1)</span>
                    <p className="text-lg font-bold font-mono text-[#17324D] mt-0.5">
                      {student.scores.tx3 ?? '--'}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-blue-300 bg-blue-50/30">
                    <span className="text-[10px] text-[#0066CC] font-bold">Giữa kỳ (x2)</span>
                    <p className="text-lg font-bold font-mono text-[#0066CC] mt-0.5">
                      {student.scores.gk ?? '--'}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-blue-400 bg-blue-50/50">
                    <span className="text-[10px] text-[#004A99] font-bold">Cuối kỳ (x3)</span>
                    <p className="text-lg font-bold font-mono text-[#004A99] mt-0.5">
                      {student.scores.ck ?? '--'}
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Recommendation Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-amber-900">
                      Gợi ý nhận xét sư phạm thông minh
                    </h5>
                    <button
                      onClick={() => {
                        onClose();
                        onAskAIForStudent(student);
                      }}
                      className="text-[11px] font-bold text-[#0066CC] hover:underline flex items-center gap-1"
                    >
                      Phân tích sâu bằng AI →
                    </button>
                  </div>
                  <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                    {student.aiRemark || 'Học sinh có ý thức học tập tốt, tinh thần xây dựng bài sôi nổi. Cần chú trọng rèn luyện thêm kỹ năng xử lý các bài toán vận dụng thực tế.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl">
                  <p className="text-xs font-bold text-emerald-800">Có mặt</p>
                  <p className="text-2xl font-bold font-mono text-emerald-700 mt-1">
                    {student.attendance.present}
                  </p>
                  <p className="text-[10px] text-emerald-600">buổi học</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-2xl">
                  <p className="text-xs font-bold text-blue-800">Nghỉ có phép</p>
                  <p className="text-2xl font-bold font-mono text-blue-700 mt-1">
                    {student.attendance.excused}
                  </p>
                  <p className="text-[10px] text-blue-600">có giấy phép</p>
                </div>
                <div className="bg-red-50 border border-red-200 p-3.5 rounded-2xl">
                  <p className="text-xs font-bold text-red-800">Nghỉ không phép</p>
                  <p className="text-2xl font-bold font-mono text-red-700 mt-1">
                    {student.attendance.unexcused}
                  </p>
                  <p className="text-[10px] text-red-600">cần liên hệ</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl">
                  <p className="text-xs font-bold text-amber-800">Đi trễ</p>
                  <p className="text-2xl font-bold font-mono text-amber-700 mt-1">
                    {student.attendance.late}
                  </p>
                  <p className="text-[10px] text-amber-600">lần nhắc nhở</p>
                </div>
              </div>

              {student.attendance.unexcused > 0 && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>
                    Học sinh có buổi vắng không phép. Đề nghị giáo viên chủ nhiệm chủ động thông báo cho gia đình.
                  </span>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-[#17324D]">
                Ghi chú nội bộ của giáo viên bộ môn / GVCN
              </label>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Nhập ghi chú quan sát học sinh, biểu hiện trên lớp, thỏa thuận với phụ huynh..."
                className="w-full p-3.5 bg-[#F5F9FF] border border-slate-200 rounded-2xl text-xs text-[#17324D] focus:ring-2 focus:ring-[#0066CC] outline-none"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes}
                  className="px-4 py-2 bg-[#0066CC] hover:bg-[#004A99] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  {isSavingNotes ? 'Đang lưu...' : 'Lưu ghi chú'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onAskAIForStudent(student);
              }}
              className="px-4 py-2 bg-gradient-to-r from-[#0066CC] to-[#004A99] text-white text-xs font-semibold rounded-xl shadow-sm flex items-center gap-1.5 hover:opacity-90 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Phân tích học lực với Trợ lý AI</span>
            </button>

            {onDeleteStudent && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-600" />
                <span>Xóa học sinh này</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
          >
            Đóng
          </button>
        </div>

        {/* Delete Confirmation In-Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-red-100 space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#17324D]">
                  Xác nhận xóa học sinh?
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Bạn có chắc chắn muốn xóa hồ sơ của học sinh <b className="text-[#17324D]">{student.name}</b> (Lớp {student.className}) khỏi danh sách?
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onDeleteStudent) {
                      onDeleteStudent(student.id);
                    }
                    setShowDeleteConfirm(false);
                    onClose();
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  Xóa học sinh
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
