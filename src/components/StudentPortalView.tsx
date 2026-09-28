import React, { useState } from 'react';
import { Student, TeacherProfile, Assignment, StudyMaterial, ReviewLink } from '../types';
import { SchoolLogo } from './SchoolLogo';
import {
  GraduationCap,
  BookOpen,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Link2,
  ExternalLink,
  QrCode,
  Copy,
  Check,
  FileText,
  Video,
  HelpCircle,
  LogOut,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Search,
  Filter,
  Globe,
  Pin,
  X,
  User,
  ChevronRight,
} from 'lucide-react';

interface StudentPortalViewProps {
  student: Student;
  teacher: TeacherProfile;
  assignments: Assignment[];
  materials: StudyMaterial[];
  reviewLinks: ReviewLink[];
  onLogout: () => void;
  allStudents?: Student[];
  onSwitchStudent?: (studentId: string) => void;
}

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({
  student,
  teacher,
  assignments,
  materials,
  reviewLinks,
  onLogout,
  allStudents = [],
  onSwitchStudent,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'links' | 'grades' | 'assignments'>(
    'overview'
  );
  const [linkSearch, setLinkSearch] = useState('');
  const [linkCategory, setLinkCategory] = useState<string>('all');
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [qrModalLink, setQrModalLink] = useState<ReviewLink | null>(null);
  const [toastMessage, setToastMessage] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleCopyLink = (link: ReviewLink) => {
    navigator.clipboard.writeText(link.url);
    setCopiedLinkId(link.id);
    showToast(`Đã sao chép liên kết: ${link.title}`);
    setTimeout(() => setCopiedLinkId(null), 2000);
  };

  // Filter review links matching this student's class
  const classReviewLinks = reviewLinks.filter((l) => {
    const matchClass = l.targetClass === 'all' || l.targetClass === student.className;
    const matchGrade =
      l.grade === 'all' ||
      (student.className.startsWith('12') && l.grade === '12') ||
      (student.className.startsWith('11') && l.grade === '11') ||
      (student.className.startsWith('10') && l.grade === '10');

    const matchCategory = linkCategory === 'all' || l.category === linkCategory;
    const matchSearch =
      l.title.toLowerCase().includes(linkSearch.toLowerCase()) ||
      (l.description && l.description.toLowerCase().includes(linkSearch.toLowerCase())) ||
      (l.provider && l.provider.toLowerCase().includes(linkSearch.toLowerCase()));

    return (matchClass || matchGrade) && matchCategory && matchSearch;
  });

  // Class assignments
  const classAssignments = assignments.filter(
    (a) => a.className === student.className || a.className === 'all'
  );

  return (
    <div className="min-h-screen bg-[#F5F9FF] text-[#17324D] flex flex-col">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-3.5 bg-emerald-600 text-white rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Student Header Bar */}
      <header className="bg-white border-b border-blue-100 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SchoolLogo size="md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm md:text-base text-[#004A99]">
                  THPT NGUYỄN DỤC
                </span>
                <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-[#0066CC] font-semibold border border-blue-200">
                  Cổng Học Sinh
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Năm học 2026 - 2027 · Môn Toán · GV: {teacher.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Student Switcher (Useful if previewing or switching students in class) */}
            {allStudents.length > 1 && onSwitchStudent && (
              <div className="hidden md:flex items-center gap-1.5 bg-[#F5F9FF] px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={student.id}
                  onChange={(e) => onSwitchStudent(e.target.value)}
                  className="bg-transparent font-semibold text-[#17324D] outline-none cursor-pointer text-xs"
                >
                  {allStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.className})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Logout button */}
            <button
              onClick={onLogout}
              className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 hover:border-red-200 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Đăng xuất khỏi cổng học sinh"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        {/* Student Profile Hero Banner */}
        <div className="bg-gradient-to-r from-[#0066CC] to-[#004A99] rounded-3xl p-6 md:p-8 text-white shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 transform skew-x-12 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold text-2xl md:text-3xl flex items-center justify-center shrink-0 shadow-inner">
                {student.name.charAt(student.name.lastIndexOf(' ') + 1) || 'H'}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                    {student.name}
                  </h1>
                  <span className="px-3 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold border border-white/30">
                    Lớp {student.className}
                  </span>
                </div>
                <p className="text-xs text-blue-100">
                  {student.gender} · Sinh ngày: {student.dob || '2008-01-01'} · THPT Nguyễn Dục
                </p>
                <p className="text-xs text-amber-200 font-semibold flex items-center gap-1.5 pt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Giáo viên phụ trách & GVCN: {teacher.name}</span>
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 text-center">
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                <p className="text-[10px] text-blue-200 font-semibold uppercase tracking-wider">
                  ĐTB Môn Toán
                </p>
                <p className="text-xl md:text-2xl font-bold font-mono text-white mt-0.5">
                  {student.scores.dtb !== null ? student.scores.dtb.toFixed(1) : '--'}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                <p className="text-[10px] text-blue-200 font-semibold uppercase tracking-wider">
                  Học lực
                </p>
                <p className="text-sm md:text-base font-bold text-amber-200 mt-1">
                  {student.scores.rank || 'Chưa xếp'}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                <p className="text-[10px] text-blue-200 font-semibold uppercase tracking-wider">
                  Hạnh kiểm
                </p>
                <p className="text-sm md:text-base font-bold text-emerald-200 mt-1">
                  {student.conduct || 'Tốt'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-white rounded-2xl p-1.5 border border-blue-100 shadow-2xs gap-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2.5 text-xs md:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#0066CC] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#0066CC] hover:bg-blue-50/50'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Tổng quan</span>
          </button>

          <button
            onClick={() => setActiveTab('links')}
            className={`flex-1 py-2.5 text-xs md:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer relative ${
              activeTab === 'links'
                ? 'bg-[#0066CC] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#0066CC] hover:bg-blue-50/50'
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>Link ôn tập & Đề thi</span>
            {classReviewLinks.length > 0 && (
              <span
                className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                  activeTab === 'links' ? 'bg-white text-[#0066CC]' : 'bg-blue-100 text-[#004A99]'
                }`}
              >
                {classReviewLinks.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('grades')}
            className={`flex-1 py-2.5 text-xs md:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'grades'
                ? 'bg-[#0066CC] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#0066CC] hover:bg-blue-50/50'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Bảng điểm chi tiết</span>
          </button>

          <button
            onClick={() => setActiveTab('assignments')}
            className={`flex-1 py-2.5 text-xs md:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'assignments'
                ? 'bg-[#0066CC] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#0066CC] hover:bg-blue-50/50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Bài tập về nhà</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: OVERVIEW */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Announcement / Teacher Remark Card */}
            <div className="bg-white rounded-3xl border border-blue-100 p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5 text-[#004A99] font-bold text-sm">
                <Sparkles className="w-4 h-4 text-[#0066CC]" />
                <span>Nhận xét sư phạm từ {teacher.name}</span>
              </div>
              <p className="text-xs md:text-sm text-slate-700 leading-relaxed bg-[#F5F9FF] p-4 rounded-2xl border border-blue-100 italic">
                "{student.aiRemark || student.notes || 'Em có tinh thần học tập nghiêm túc, tích cực chú ý nghe giảng. Cần tiếp tục duy trì và luyện thêm các bài tập trắc nghiệm vận dụng cao.'}"
              </p>
            </div>

            {/* Review Links Spotlight for Student's Class */}
            <div className="bg-white rounded-3xl border border-blue-100 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-[#17324D] flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-[#0066CC]" />
                    <span>Link ôn tập đề xuất cho lớp {student.className}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Các bài tập online, đề thi trắc nghiệm và tài liệu cô Nhung đã đăng tải
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('links')}
                  className="text-xs font-bold text-[#0066CC] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Xem tất cả ({classReviewLinks.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {classReviewLinks.slice(0, 4).map((link) => (
                  <div
                    key={link.id}
                    className="p-4 rounded-2xl border border-blue-100 hover:border-blue-300 hover:shadow-sm transition-all bg-[#F5F9FF]/40 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            link.category === 'quiz'
                              ? 'bg-purple-100 text-purple-800'
                              : link.category === 'video'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {link.provider || 'Đề ôn tập'}
                        </span>
                        {link.deadline && (
                          <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                            Hạn: {link.deadline}
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-xs md:text-sm text-[#17324D] line-clamp-2">
                        {link.title}
                      </h4>
                      {link.description && (
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                          {link.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => handleCopyLink(link)}
                        className="text-slate-400 hover:text-[#0066CC] text-xs flex items-center gap-1 cursor-pointer"
                        title="Sao chép link"
                      >
                        {copiedLinkId === link.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedLinkId === link.id ? 'Đã chép' : 'Chép link'}</span>
                      </button>

                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-[#0066CC] hover:bg-[#004A99] text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>Vào làm bài</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Attendance & Performance Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Attendance Card */}
              <div className="bg-white rounded-3xl border border-blue-100 p-5 shadow-xs space-y-3">
                <h3 className="font-bold text-sm text-[#17324D] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#0066CC]" />
                  <span>Tình hình chuyên cần học kỳ I</span>
                </h3>

                <div className="grid grid-cols-4 gap-2 text-center pt-1">
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                    <p className="text-[10px] text-emerald-700 font-semibold">Có mặt</p>
                    <p className="text-base font-bold font-mono text-emerald-900 mt-0.5">
                      {student.attendance.present}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100">
                    <p className="text-[10px] text-blue-700 font-semibold">Có phép</p>
                    <p className="text-base font-bold font-mono text-blue-900 mt-0.5">
                      {student.attendance.excused}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-red-50 border border-red-100">
                    <p className="text-[10px] text-red-700 font-semibold">Không phép</p>
                    <p className="text-base font-bold font-mono text-red-900 mt-0.5">
                      {student.attendance.unexcused}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100">
                    <p className="text-[10px] text-amber-700 font-semibold">Đi trễ</p>
                    <p className="text-base font-bold font-mono text-amber-900 mt-0.5">
                      {student.attendance.late}
                    </p>
                  </div>
                </div>

                {student.attendance.unexcused === 0 && (
                  <p className="text-xs text-emerald-700 font-medium flex items-center gap-1 pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Em luôn đi học chuyên cần và đầy đủ, hãy tiếp tục phát huy nhé!</span>
                  </p>
                )}
              </div>

              {/* Assignment Summary Card */}
              <div className="bg-white rounded-3xl border border-blue-100 p-5 shadow-xs space-y-3">
                <h3 className="font-bold text-sm text-[#17324D] flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#0066CC]" />
                  <span>Bài tập tuần 4</span>
                </h3>

                {classAssignments.length > 0 ? (
                  <div className="space-y-2">
                    {classAssignments.slice(0, 2).map((asg) => (
                      <div
                        key={asg.id}
                        className="p-3 rounded-xl bg-[#F5F9FF] border border-slate-100 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-[#17324D]">{asg.title}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            Hạn nộp: {asg.dueDate} · Lớp {asg.className}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Đang mở
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">Chưa có bài tập mới cho tuần này.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: REVIEW LINKS (LINK ÔN TẬP CHO HỌC SINH) */}
        {/* ========================================================= */}
        {activeTab === 'links' && (
          <div className="space-y-5">
            {/* Filter and Search */}
            <div className="bg-white p-4 md:p-5 rounded-3xl border border-blue-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm kiếm link ôn tập, đề trắc nghiệm, Azota, Quizizz, video..."
                  value={linkSearch}
                  onChange={(e) => setLinkSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs text-[#17324D] outline-none focus:ring-2 focus:ring-[#0066CC]"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={linkCategory}
                  onChange={(e) => setLinkCategory(e.target.value)}
                  className="px-3 py-2 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs font-semibold text-[#17324D] outline-none cursor-pointer"
                >
                  <option value="all">Tất cả thể loại</option>
                  <option value="quiz">Đề thi & Trắc nghiệm online</option>
                  <option value="document">Tài liệu & Google Drive</option>
                  <option value="video">Video bài giảng</option>
                  <option value="website">Công cụ / Website</option>
                </select>
              </div>
            </div>

            {/* Links Grid */}
            {classReviewLinks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {classReviewLinks.map((link) => (
                  <div
                    key={link.id}
                    className={`bg-white rounded-3xl border p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                      link.isPinned
                        ? 'border-blue-300 ring-2 ring-blue-100/50 bg-gradient-to-b from-blue-50/20 to-white'
                        : 'border-blue-100'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                              link.category === 'quiz'
                                ? 'bg-purple-100 text-purple-800'
                                : link.category === 'video'
                                ? 'bg-red-100 text-red-800'
                                : link.category === 'document'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {link.category === 'quiz' && <HelpCircle className="w-3 h-3" />}
                            {link.category === 'video' && <Video className="w-3 h-3" />}
                            {link.category === 'document' && <FileText className="w-3 h-3" />}
                            {link.category === 'website' && <Globe className="w-3 h-3" />}
                            <span>{link.provider || 'Đề ôn tập'}</span>
                          </span>

                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-[#0066CC]">
                            Lớp {student.className}
                          </span>
                        </div>

                        {link.deadline && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                            Hạn: {link.deadline}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-sm text-[#17324D] leading-snug line-clamp-2">
                        {link.title}
                      </h3>

                      {link.description && (
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                          {link.description}
                        </p>
                      )}

                      {/* URL box */}
                      <div className="mt-3 p-2 bg-[#F5F9FF] rounded-xl border border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500 overflow-hidden">
                        <span className="truncate pr-2">{link.url}</span>
                        <button
                          onClick={() => handleCopyLink(link)}
                          className="shrink-0 text-slate-400 hover:text-[#0066CC] p-1 rounded cursor-pointer"
                          title="Sao chép link"
                        >
                          {copiedLinkId === link.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => setQrModalLink(link)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-blue-50 hover:text-[#0066CC] flex items-center gap-1 cursor-pointer"
                        title="Quét mã QR bằng điện thoại"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Mã QR</span>
                      </button>

                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-[#0066CC] hover:bg-[#004A99] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <span>Mở làm bài</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-blue-100 p-12 text-center space-y-3">
                <Link2 className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="font-bold text-sm text-[#17324D]">
                  Không tìm thấy link ôn tập phù hợp
                </h4>
                <p className="text-xs text-slate-500">
                  Thử đổi bộ lọc hoặc từ khóa tìm kiếm để xem thêm tài liệu của cô giáo.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: DETAILED GRADES */}
        {/* ========================================================= */}
        {activeTab === 'grades' && (
          <div className="bg-white rounded-3xl border border-blue-100 p-6 md:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="font-bold text-base text-[#17324D]">
                Bảng điểm thành phần môn Toán (Học kỳ II)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Áp dụng tính điểm trung bình theo Thông tư Bộ GD&ĐT (TX hệ số 1, Giữa kỳ hệ số 2, Cuối kỳ hệ số 3)
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <div className="p-3.5 rounded-2xl bg-[#F5F9FF] border border-slate-200">
                <p className="text-[11px] font-semibold text-slate-500">TX 1 (x1)</p>
                <p className="text-xl font-bold font-mono text-[#17324D] mt-1">
                  {student.scores.tx1 !== null ? student.scores.tx1.toFixed(1) : '--'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F5F9FF] border border-slate-200">
                <p className="text-[11px] font-semibold text-slate-500">TX 2 (x1)</p>
                <p className="text-xl font-bold font-mono text-[#17324D] mt-1">
                  {student.scores.tx2 !== null ? student.scores.tx2.toFixed(1) : '--'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F5F9FF] border border-slate-200">
                <p className="text-[11px] font-semibold text-slate-500">TX 3 (x1)</p>
                <p className="text-xl font-bold font-mono text-[#17324D] mt-1">
                  {student.scores.tx3 !== null ? student.scores.tx3.toFixed(1) : '--'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200">
                <p className="text-[11px] font-bold text-[#0066CC]">Giữa kỳ (x2)</p>
                <p className="text-xl font-bold font-mono text-[#0066CC] mt-1">
                  {student.scores.gk !== null ? student.scores.gk.toFixed(1) : '--'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-100/60 border border-blue-300">
                <p className="text-[11px] font-bold text-[#004A99]">Cuối kỳ (x3)</p>
                <p className="text-xl font-bold font-mono text-[#004A99] mt-1">
                  {student.scores.ck !== null ? student.scores.ck.toFixed(1) : '--'}
                </p>
              </div>
            </div>

            {/* Final Result Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#EAF4FF] to-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs text-[#004A99] font-bold uppercase tracking-wider">
                  Điểm trung bình môn Toán (ĐTB)
                </p>
                <p className="text-3xl font-extrabold font-mono text-[#004A99] mt-1">
                  {student.scores.dtb !== null ? student.scores.dtb.toFixed(1) : '--'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-xl bg-white border border-blue-200 text-center">
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Xếp loại</p>
                  <p className="text-sm font-bold text-[#0066CC]">{student.scores.rank || 'Chưa đạt'}</p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-white border border-blue-200 text-center">
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Hạnh kiểm</p>
                  <p className="text-sm font-bold text-emerald-700">{student.conduct || 'Tốt'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: ASSIGNMENTS */}
        {/* ========================================================= */}
        {activeTab === 'assignments' && (
          <div className="bg-white rounded-3xl border border-blue-100 p-6 md:p-8 shadow-xs space-y-5">
            <div>
              <h3 className="font-bold text-base text-[#17324D]">
                Danh sách bài tập và chuyên đề ôn tập
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Các nhiệm vụ học tập tuần 4 được giao bởi {teacher.name}
              </p>
            </div>

            {classAssignments.length > 0 ? (
              <div className="space-y-3">
                {classAssignments.map((asg) => (
                  <div
                    key={asg.id}
                    className="p-4 rounded-2xl border border-blue-100 bg-[#F5F9FF]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#0066CC]">
                          {asg.type === 'quiz_15p' ? 'Kiểm tra 15p' : 'Bài tập tuần'}
                        </span>
                        <span className="text-[10px] px-2 py-0.2 rounded-md bg-slate-100 text-slate-600 font-mono">
                          Hạn chót: {asg.dueDate}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-[#17324D] mt-1">{asg.title}</h4>
                      <p className="text-xs text-slate-600 mt-1">{asg.description}</p>
                    </div>

                    <button
                      onClick={() => showToast('Em hãy làm bài và nộp lại theo hướng dẫn của Cô!')}
                      className="px-4 py-2 rounded-xl bg-[#0066CC] hover:bg-[#004A99] text-white text-xs font-bold shrink-0 cursor-pointer"
                    >
                      Chi tiết bài tập
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-6 text-center">
                Không có bài tập nào đang giao cho lớp {student.className}.
              </p>
            )}
          </div>
        )}
      </main>

      {/* QR Code Modal for Mobile Phone */}
      {qrModalLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0066CC] flex items-center justify-center mx-auto mb-3">
              <QrCode className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-[#17324D]">
              Mã QR quét trên điện thoại
            </h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              {qrModalLink.title}
            </p>

            <div className="p-4 my-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                  qrModalLink.url
                )}`}
                alt="QR Code"
                className="w-44 h-44 rounded-lg mx-auto"
              />
            </div>

            <p className="text-[11px] text-slate-500 mb-4">
              Em dùng camera điện thoại hoặc ứng dụng Zalo để quét và mở link làm bài ngay.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setQrModalLink(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  handleCopyLink(qrModalLink);
                  setQrModalLink(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#0066CC] text-white text-xs font-bold hover:bg-[#004A99] cursor-pointer"
              >
                Sao chép link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
