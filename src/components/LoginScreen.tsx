import React, { useState } from 'react';
import { SchoolLogo } from './SchoolLogo';
import { SchoolCampusIllustration } from './SchoolCampusIllustration';
import { Eye, EyeOff, Lock, User, ArrowRight, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (role: string, username: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('gv.nguyenvanan');
  const [password, setPassword] = useState('Thpt@NguyenDuc2025');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [role, setRole] = useState<'teacher' | 'student'>('teacher');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }
    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(role, username);
    }, 600);
  };

  const fillQuickDemo = (demoRole: 'teacher' | 'student') => {
    setRole(demoRole);
    if (demoRole === 'teacher') {
      setUsername('gv.nguyenvanan');
      setPassword('Thpt@NguyenDuc2025');
    } else {
      setUsername('hs.nguyenhoangnam');
      setPassword('HocSinh@2025');
    }
    setError('');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSuccess(true);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F5F9FF] p-4 lg:p-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* Left Panel: Branding & Campus Artwork */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#0066CC] to-[#004A99] p-8 md:p-10 flex flex-col justify-between text-white relative">
          <div className="z-10">
            {/* Header branding */}
            <div className="flex items-center gap-3.5 mb-6">
              <SchoolLogo size="lg" whiteTheme={true} />
              <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white leading-tight">
                  SỔ THEO DÕI HỌC TẬP
                </h1>
                <p className="text-xs md:text-sm font-semibold tracking-wider text-blue-100 uppercase">
                  TRƯỜNG THPT NGUYỄN DỤC
                </p>
              </div>
            </div>

            {/* Slogan */}
            <div className="inline-block bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 mb-6">
              <p className="text-sm md:text-base font-semibold italic text-amber-200">
                “Đồng hành cùng học sinh – Kiến tạo tương lai”
              </p>
            </div>

            <p className="text-xs md:text-sm text-blue-100 leading-relaxed max-w-md hidden md:block">
              Hệ thống quản lý giáo dục trực tuyến toàn diện: cập nhật điểm số theo Thông tư Bộ GD&ĐT, điểm danh chuyên cần tức thời và trợ lý sư phạm AI phân tích học lực.
            </p>
          </div>

          {/* Campus Illustration in Left Panel */}
          <div className="my-4 z-10">
            <SchoolCampusIllustration />
          </div>

          {/* Footer Highlights */}
          <div className="z-10 pt-4 border-t border-white/15 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-white/5">
              <p className="font-bold text-base text-white">100%</p>
              <p className="text-blue-200 text-[11px]">Chuẩn TT22</p>
            </div>
            <div className="p-2 rounded-lg bg-white/5">
              <p className="font-bold text-base text-white">4 Lớp</p>
              <p className="text-blue-200 text-[11px]">Giảng dạy</p>
            </div>
            <div className="p-2 rounded-lg bg-white/5">
              <p className="font-bold text-base text-white">AI</p>
              <p className="text-blue-200 text-[11px]">Sư phạm số</p>
            </div>
          </div>
        </div>

        {/* Right Panel: Login Form */}
        <div className="lg:col-span-6 p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">
            {/* Title */}
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-[#17324D] tracking-tight">
                Đăng nhập
              </h2>
              <p className="text-sm text-[#64748B] mt-1">
                Chào mừng quý Thầy/Cô và Học sinh trở lại cổng thông tin học tập
              </p>
            </div>

            {/* Role Switcher */}
            <div className="flex p-1 bg-[#F5F9FF] border border-blue-100 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => fillQuickDemo('teacher')}
                className={`flex-1 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all ${
                  role === 'teacher'
                    ? 'bg-[#0066CC] text-white shadow-sm'
                    : 'text-[#64748B] hover:text-[#17324D]'
                }`}
              >
                👨‍🏫 Giáo viên
              </button>
              <button
                type="button"
                onClick={() => fillQuickDemo('student')}
                className={`flex-1 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all ${
                  role === 'student'
                    ? 'bg-[#0066CC] text-white shadow-sm'
                    : 'text-[#64748B] hover:text-[#17324D]'
                }`}
              >
                👨‍🎓 Học sinh / Phụ huynh
              </button>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <span className="font-bold">!</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-xs font-semibold text-[#17324D] mb-1.5">
                  Tên đăng nhập
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="VD: cô Nhung hoặc nhung.tran"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F5F9FF] border border-slate-200 rounded-xl text-sm text-[#17324D] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-[#17324D] mb-1.5">
                  Mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-11 py-2.5 bg-[#F5F9FF] border border-slate-200 rounded-xl text-sm text-[#17324D] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#0066CC] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#64748B]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-[#0066CC] border-slate-300 rounded focus:ring-[#0066CC]"
                  />
                  <span>Ghi nhớ đăng nhập</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-semibold text-[#0066CC] hover:text-[#004A99] hover:underline"
                >
                  Quên mật khẩu?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 bg-[#0066CC] hover:bg-[#004A99] active:scale-[0.99] text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Đăng nhập hệ thống</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Access Bar */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-[#64748B] mb-2.5">
                <span>Tài khoản trải nghiệm nhanh:</span>
                <span className="text-[11px] text-[#0066CC] font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> An toàn & Bảo mật
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fillQuickDemo('teacher')}
                  className="px-3 py-2 text-xs bg-[#EAF4FF] hover:bg-blue-100 text-[#004A99] rounded-lg font-medium text-left border border-blue-200 transition-colors flex flex-col"
                >
                  <span className="font-bold">Cô Trần Thị Tuyết Nhung</span>
                  <span className="text-[10px] text-blue-600">GVCN 12A1 (Nhấn để điền)</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickDemo('student')}
                  className="px-3 py-2 text-xs bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg font-medium text-left border border-slate-200 transition-colors flex flex-col"
                >
                  <span className="font-bold">Nguyễn Hoàng Nam</span>
                  <span className="text-[10px] text-slate-500">Lớp trưởng 12A1</span>
                </button>
              </div>
            </div>

            {/* Technical Support Info */}
            <div className="mt-6 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Hỗ trợ kỹ thuật nhà trường: phongcntt@thptnguyenduc.edu.vn</span>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-[#17324D] mb-1">
              Khôi phục mật khẩu
            </h3>
            <p className="text-xs text-[#64748B] mb-4">
              Nhập địa chỉ email nội bộ của trường để nhận liên kết đặt lại mật khẩu.
            </p>

            {forgotSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <p className="text-sm font-semibold text-emerald-800">
                  Đã gửi email khôi phục!
                </p>
                <p className="text-xs text-emerald-700">
                  Vui lòng kiểm tra hộp thư <b>{forgotEmail}</b> để hoàn tất thiết lập mật khẩu mới.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSuccess(false);
                  }}
                  className="mt-3 w-full py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
                >
                  Đóng
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#17324D] mb-1">
                    Email trường cấp (@thptnguyenduc.edu.vn)
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="an.nguyen@thptnguyenduc.edu.vn"
                    className="w-full px-3.5 py-2.5 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs text-[#17324D] focus:ring-2 focus:ring-[#0066CC] outline-none"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-[#64748B] hover:bg-slate-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#0066CC] text-white text-xs font-semibold hover:bg-[#004A99]"
                  >
                    Gửi yêu cầu
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
