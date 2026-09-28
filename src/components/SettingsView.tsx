import React, { useState } from 'react';
import { TeacherProfile } from '../types';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  Database,
  Save,
  CheckCircle2,
  RefreshCw,
  KeyRound,
} from 'lucide-react';

interface SettingsViewProps {
  teacher: TeacherProfile;
  onUpdateTeacher: (updated: TeacherProfile) => void;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  teacher,
  onUpdateTeacher,
  onResetData,
}) => {
  const [name, setName] = useState(teacher.name);
  const [email, setEmail] = useState(teacher.email);
  const [phone, setPhone] = useState(teacher.phone);
  const [subject, setSubject] = useState(teacher.subject);
  const [academicYear, setAcademicYear] = useState(teacher.academicYear);
  const [currentSemester, setCurrentSemester] = useState(teacher.currentSemester);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Security password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTeacher({
      ...teacher,
      name,
      email,
      phone,
      subject,
      academicYear,
      currentSemester,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setTimeout(() => setPasswordSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-xs">
        <h1 className="text-xl font-bold text-[#17324D]">
          Cài đặt hệ thống & Hồ sơ
        </h1>
        <p className="text-xs text-[#64748B]">
          Quản lý thông tin tài khoản giáo viên, cấu hình niên khóa và thiết lập an toàn dữ liệu
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Đã cập nhật thông tin hồ sơ giáo viên thành công!</span>
        </div>
      )}

      {/* Teacher Profile Settings */}
      <div className="bg-white p-6 rounded-3xl border border-blue-100 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#17324D] flex items-center gap-2 pb-3 border-b border-slate-100">
          <User className="w-4 h-4 text-[#0066CC]" />
          <span>Thông tin Giáo viên</span>
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#17324D] mb-1">
                Họ và tên giáo viên
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs font-semibold text-[#17324D] outline-none focus:ring-2 focus:ring-[#0066CC]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17324D] mb-1">
                Bộ môn giảng dạy
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs font-semibold text-[#17324D] outline-none focus:ring-2 focus:ring-[#0066CC]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#17324D] mb-1">
                Địa chỉ email trường cấp
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs font-semibold text-[#17324D] outline-none focus:ring-2 focus:ring-[#0066CC]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17324D] mb-1">
                Số điện thoại liên lạc
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs font-mono font-semibold text-[#17324D] outline-none focus:ring-2 focus:ring-[#0066CC]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#17324D] mb-1">
                Năm học hoạt động
              </label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs font-semibold text-[#17324D] outline-none"
              >
                <option value="2026 - 2027">2026 - 2027</option>
                <option value="2025 - 2026">2025 - 2026</option>
                <option value="2024 - 2025">2024 - 2025</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17324D] mb-1">
                Học kỳ hiện tại
              </label>
              <select
                value={currentSemester}
                onChange={(e) => setCurrentSemester(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs font-semibold text-[#17324D] outline-none"
              >
                <option value="Học kỳ I">Học kỳ I</option>
                <option value="Học kỳ II">Học kỳ II</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#0066CC] hover:bg-[#004A99] text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Lưu thay đổi hồ sơ</span>
            </button>
          </div>
        </form>
      </div>

      {/* Security & Password */}
      <div className="bg-white p-6 rounded-3xl border border-blue-100 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#17324D] flex items-center gap-2 pb-3 border-b border-slate-100">
          <KeyRound className="w-4 h-4 text-[#0066CC]" />
          <span>Đổi mật khẩu tài khoản</span>
        </h3>

        {passwordSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
            Đã thay đổi mật khẩu thành công!
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-3 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-[#17324D] mb-1">
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs text-[#17324D] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17324D] mb-1">
              Mật khẩu mới
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Tối thiểu 8 ký tự..."
              className="w-full px-3.5 py-2 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs text-[#17324D] outline-none"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Cập nhật mật khẩu
          </button>
        </form>
      </div>

      {/* Data Management & Reset */}
      <div className="bg-white p-6 rounded-3xl border border-red-100 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-red-700 flex items-center gap-2 pb-2 border-b border-red-100">
          <Database className="w-4 h-4 text-red-600" />
          <span>Quản lý dữ liệu hệ thống</span>
        </h3>

        <p className="text-xs text-[#64748B]">
          Nếu bạn muốn khôi phục lại toàn bộ dữ liệu mẫu ban đầu của Trường THPT Nguyễn Dục (danh sách học sinh, điểm số chuẩn, các lớp giảng dạy), hãy nhấn nút bên dưới.
        </p>

        <button
          type="button"
          onClick={() => {
            if (confirm('Bạn có chắc chắn muốn đặt lại toàn bộ dữ liệu về trạng thái mẫu ban đầu?')) {
              onResetData();
            }
          }}
          className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Khôi phục dữ liệu mẫu ban đầu</span>
        </button>
      </div>
    </div>
  );
};
