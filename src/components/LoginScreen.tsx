import React, { useState } from 'react';
import { SchoolLogo } from './SchoolLogo';
import { SchoolCampusIllustration } from './SchoolCampusIllustration';
import {
  Eye,
  EyeOff,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  HelpCircle,
  GraduationCap,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { Student, Classroom } from '../types';
import { initialStudents, initialClasses } from '../data/mockData';

interface LoginScreenProps {
  onLoginSuccess: (role: string, username: string, studentId?: string) => void;
  students?: Student[];
  classes?: Classroom[];
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  students = initialStudents,
  classes = initialClasses,
}) => {
  const [role, setRole] = useState<'teacher' | 'student'>('teacher');
  const [username, setUsername] = useState('nhung.tran');
  const [password, setPassword] = useState('CoNhung@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Student specific selector state
  const [studentSelectClass, setStudentSelectClass] = useState<string>('12A1');
  const [studentSelectId, setStudentSelectId] = useState<string>('hs_01');
  const [studentLoginMethod, setStudentLoginMethod] = useState<'select' | 'input'>('select');

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Available students in selected class
  const classStudents = students.filter((s) => s.className === studentSelectClass);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (role === 'teacher') {
      if (!username.trim() || !password.trim()) {
        setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu giáo viên.');
        return;
      }
      setError('');
      setLoading(true);

      setTimeout(() => {
        setLoading(false);
        onLoginSuccess('teacher', username);
      }, 500);
    } else {
      // Student login
      if (studentLoginMethod === 'select') {
        const found = students.find((s) => s.id === studentSelectId) || classStudents[0] || students[0];
        if (!found) {
          setError('Vui lòng chọn học sinh.');
          return;
        }
        setError('');
        setLoading(true);

        setTimeout(() => {
          setLoading(false);
          onLoginSuccess('student', found.name, found.id);
        }, 500);
      } else {
        if (!username.trim()) {
          setError('Vui lòng nhập họ và tên hoặc tài khoản học sinh.');
          return;
        }
        const matched = students.find(
          (s) => s.name.toLowerCase().includes(username.toLowerCase())
        );
        setError('');
        setLoading(true);

        setTimeout(() => {
          setLoading(false);
          onLoginSuccess('student', username, matched?.id || students[0]?.id);
        }, 500);
      }
    }
  };

  const fillQuickDemo = (demoRole: 'teacher' | 'student', studentIndex = 0) => {
    setRole(demoRole);
    if (demoRole === 'teacher') {
      setUsername('nhung.tran');
      setPassword('CoNhung@2026');
    } else {
      const targetStudent = students[studentIndex] || students[0];
      if (targetStudent) {
        setStudentSelectClass(targetStudent.className);
        setStudentSelectId(targetStudent.id);
        setUsername(targetStudent.name);
        setPassword('123456');
      }
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
              Hệ thống tra cứu điểm số, chuyên cần và cổng link ôn tập đề thi trực tuyến (Azota, Quizizz, Drive...) Trường THPT Nguyễn Dục.
            </p>
          </div>

          {/* Campus Illustration in Left Panel */}
          <div className="my-4 z-10">
            <SchoolCampusIllustration />
          </div>

          {/* Footer Highlights */}
          <div className="z-10 pt-4 border-t border-white/15 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-white/5">
              <p className="font-bold text-base text-white">2026-2027</p>
              <p className="text-blue-200 text-[11px]">Năm học mới</p>
            </div>
            <div className="p-2 rounded-lg bg-white/5">
              <p className="font-bold text-base text-white">Tuần 4</p>
              <p className="text-blue-200 text-[11px]">Học kỳ I</p>
            </div>
            <div className="p-2 rounded-lg bg-white/5">
              <p className="font-bold text-base text-white">Cô Nhung</p>
              <p className="text-blue-200 text-[11px]">Môn Toán</p>
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
                {role === 'teacher'
                  ? 'Khu vực quản lý dành cho Cô Trần Thị Tuyết Nhung'
                  : 'Cổng tra cứu điểm số & Link ôn tập dành cho Học sinh / Phụ huynh'}
              </p>
            </div>

            {/* Role Switcher */}
            <div className="flex p-1 bg-[#F5F9FF] border border-blue-100 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => fillQuickDemo('teacher')}
                className={`flex-1 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                  role === 'teacher'
                    ? 'bg-[#0066CC] text-white shadow-sm'
                    : 'text-[#64748B] hover:text-[#17324D]'
                }`}
              >
                👨‍🏫 Giáo viên
              </button>
              <button
                type="button"
                onClick={() => fillQuickDemo('student', 0)}
                className={`flex-1 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
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
              {role === 'teacher' ? (
                /* ================= TEACHER FORM ================= */
                <>
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
                        placeholder="VD: nhung.tran hoặc Cô Trần Thị Tuyết Nhung"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#F5F9FF] border border-slate-200 rounded-xl text-sm text-[#17324D] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0066CC] transition-all"
                      />
                    </div>
                  </div>

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
                        className="w-full pl-10 pr-11 py-2.5 bg-[#F5F9FF] border border-slate-200 rounded-xl text-sm text-[#17324D] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0066CC] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#0066CC] transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* ================= STUDENT FORM ================= */
                <>
                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-2xl text-xs space-y-1 text-slate-700">
                    <p className="font-bold text-[#004A99] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#0066CC]" />
                      <span>Đăng nhập không cần nhớ mã số:</span>
                    </p>
                    <p className="text-[11px] text-slate-600">
                      Học sinh chỉ cần chọn <b>Lớp</b> và <b>Tên của em</b> để xem ngay điểm số và link ôn tập.
                    </p>
                  </div>

                  {studentLoginMethod === 'select' ? (
                    <div className="space-y-3.5">
                      {/* Step 1: Select Class */}
                      <div>
                        <label className="block text-xs font-semibold text-[#17324D] mb-1.5">
                          1. Chọn Lớp học của em
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <GraduationCap className="w-4 h-4" />
                          </div>
                          <select
                            value={studentSelectClass}
                            onChange={(e) => {
                              const newClass = e.target.value;
                              setStudentSelectClass(newClass);
                              const firstInClass = students.find((s) => s.className === newClass);
                              if (firstInClass) setStudentSelectId(firstInClass.id);
                            }}
                            className="w-full pl-10 pr-4 py-2.5 bg-[#F5F9FF] border border-slate-200 rounded-xl text-sm font-semibold text-[#17324D] outline-none focus:ring-2 focus:ring-[#0066CC] cursor-pointer"
                          >
                            {classes.map((c) => (
                              <option key={c.id} value={c.name}>
                                Lớp {c.name} {c.isHomeroom ? '(Chủ nhiệm)' : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Step 2: Select Student Name */}
                      <div>
                        <label className="block text-xs font-semibold text-[#17324D] mb-1.5">
                          2. Chọn Họ và tên học sinh
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <User className="w-4 h-4" />
                          </div>
                          <select
                            value={studentSelectId}
                            onChange={(e) => setStudentSelectId(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-[#F5F9FF] border border-slate-200 rounded-xl text-sm font-bold text-[#004A99] outline-none focus:ring-2 focus:ring-[#0066CC] cursor-pointer"
                          >
                            {classStudents.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name} ({s.gender})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Step 3: Password */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-semibold text-[#17324D]">
                            Mật khẩu
                          </label>
                          <span className="text-[10px] text-slate-400 font-medium">
                            Mặc định: 123456
                          </span>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Lock className="w-4 h-4" />
                          </div>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="123456"
                            className="w-full pl-10 pr-11 py-2.5 bg-[#F5F9FF] border border-slate-200 rounded-xl text-sm text-[#17324D] outline-none focus:ring-2 focus:ring-[#0066CC]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#0066CC] cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <button
                          type="button"
                          onClick={() => setStudentLoginMethod('input')}
                          className="text-xs text-[#0066CC] hover:underline cursor-pointer"
                        >
                          Hoặc gõ họ tên trực tiếp →
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Manual input method */
                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-[#17324D] mb-1.5">
                          Họ và tên học sinh
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <User className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="VD: Nguyễn Hoàng Nam"
                            className="w-full pl-10 pr-4 py-2.5 bg-[#F5F9FF] border border-slate-200 rounded-xl text-sm text-[#17324D] outline-none focus:ring-2 focus:ring-[#0066CC]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#17324D] mb-1.5">
                          Mật khẩu
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Lock className="w-4 h-4" />
                          </div>
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="123456"
                            className="w-full pl-10 pr-4 py-2.5 bg-[#F5F9FF] border border-slate-200 rounded-xl text-sm text-[#17324D] outline-none focus:ring-2 focus:ring-[#0066CC]"
                          />
                        </div>
                      </div>

                      <div className="text-right">
                        <button
                          type="button"
                          onClick={() => setStudentLoginMethod('select')}
                          className="text-xs text-[#0066CC] hover:underline cursor-pointer"
                        >
                          ← Quay lại chọn lớp & tên
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 py-3 px-4 bg-[#0066CC] hover:bg-[#004A99] active:scale-[0.99] text-white font-bold rounded-xl text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>
                      {role === 'teacher'
                        ? 'Đăng nhập giáo viên'
                        : 'Vào xem điểm & Link ôn tập'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick One-Click Student Login Access */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-[#64748B] mb-2.5">
                <span>Tài khoản truy cập nhanh:</span>
                <span className="text-[11px] text-[#0066CC] font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 1-chạm vào ngay
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fillQuickDemo('teacher')}
                  className="px-3 py-2 text-xs bg-[#EAF4FF] hover:bg-blue-100 text-[#004A99] rounded-xl font-medium text-left border border-blue-200 transition-colors flex flex-col cursor-pointer"
                >
                  <span className="font-bold">Cô Trần Thị Tuyết Nhung</span>
                  <span className="text-[10px] text-blue-600">Giáo viên Toán (THPT)</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickDemo('student', 0)}
                  className="px-3 py-2 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl font-medium text-left border border-emerald-200 transition-colors flex flex-col cursor-pointer"
                >
                  <span className="font-bold">Nguyễn Hoàng Nam</span>
                  <span className="text-[10px] text-emerald-700">Học sinh Lớp 12A1</span>
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
    </div>
  );
};
