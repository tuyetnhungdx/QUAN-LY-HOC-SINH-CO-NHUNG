import React, { useState } from 'react';
import { Classroom, Student } from '../types';
import {
  GraduationCap,
  Users,
  Award,
  ChevronRight,
  UserCheck,
  MapPin,
  BookOpen,
  Calendar,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  AlertTriangle,
  CheckCircle2,
  X,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';

interface ClassesViewProps {
  classes: Classroom[];
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onNavigateToGrades: (className: string) => void;
  onAddClass?: (newClass: Classroom) => void;
  onDeleteClass?: (classId: string, deleteStudents?: boolean) => void;
  onUpdateClass?: (updated: Classroom) => void;
  onRestoreDefaultClasses?: () => void;
}

export const ClassesView: React.FC<ClassesViewProps> = ({
  classes,
  students,
  onSelectStudent,
  onNavigateToGrades,
  onAddClass,
  onDeleteClass,
  onUpdateClass,
  onRestoreDefaultClasses,
}) => {
  const [activeClassId, setActiveClassId] = useState<string>(() => classes[0]?.id || '');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteAlsoStudents, setDeleteAlsoStudents] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  // Form states for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    grade: '12' as '10' | '11' | '12',
    homeroomTeacher: 'Cô Trần Thị Tuyết Nhung',
    isHomeroom: false,
    subject: 'Toán học 12',
    room: 'Phòng 303 - Dãy A',
    monitorName: '',
    viceMonitorName: '',
    secretaryName: '',
  });

  const [formError, setFormError] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Keep activeClassId valid
  const currentClass = classes.find((c) => c.id === activeClassId) || classes[0] || null;
  const classStudents = currentClass ? students.filter((s) => s.className === currentClass.name) : [];

  // Stats calculation
  const excellentCount = classStudents.filter((s) => s.scores.rank === 'Xuất sắc' || s.scores.rank === 'Giỏi').length;
  const goodCount = classStudents.filter((s) => s.scores.rank === 'Khá').length;
  const averageCount = classStudents.filter((s) => s.scores.rank === 'Đạt' || s.scores.rank === 'Chưa đạt').length;

  // Open Add Modal
  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      grade: '12',
      homeroomTeacher: 'Cô Trần Thị Tuyết Nhung',
      isHomeroom: false,
      subject: 'Toán học 12',
      room: `Phòng ${300 + classes.length + 1} - Dãy A`,
      monitorName: '',
      viceMonitorName: '',
      secretaryName: '',
    });
    setFormError('');
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = () => {
    if (!currentClass) return;
    setFormData({
      name: currentClass.name,
      grade: currentClass.grade,
      homeroomTeacher: currentClass.homeroomTeacher,
      isHomeroom: currentClass.isHomeroom,
      subject: currentClass.subject,
      room: currentClass.room,
      monitorName: currentClass.monitorName || '',
      viceMonitorName: currentClass.viceMonitorName || '',
      secretaryName: currentClass.secretaryName || '',
    });
    setFormError('');
    setIsEditModalOpen(true);
  };

  // Handle Create Class
  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = formData.name.trim().toUpperCase();

    if (!cleanName) {
      setFormError('Vui lòng nhập tên lớp học (ví dụ: 12A3, 11B1, 10C2).');
      return;
    }

    if (classes.some((c) => c.name.toUpperCase() === cleanName)) {
      setFormError(`Lớp ${cleanName} đã tồn tại trong danh sách! Vui lòng chọn tên khác.`);
      return;
    }

    const newClass: Classroom = {
      id: `class_${cleanName.toLowerCase()}_${Date.now()}`,
      name: cleanName,
      grade: formData.grade,
      totalStudents: 0,
      homeroomTeacher: formData.homeroomTeacher.trim() || 'Cô Trần Thị Tuyết Nhung',
      isHomeroom: formData.isHomeroom,
      subject: formData.subject.trim() || `Toán học ${formData.grade}`,
      monitorName: formData.monitorName.trim() || 'Chưa cập nhật',
      viceMonitorName: formData.viceMonitorName.trim() || 'Chưa cập nhật',
      secretaryName: formData.secretaryName.trim() || 'Chưa cập nhật',
      room: formData.room.trim() || 'Phòng học cố định',
      averageScore: 8.0,
      passRate: 100,
    };

    if (onAddClass) {
      onAddClass(newClass);
    }
    setActiveClassId(newClass.id);
    setIsAddModalOpen(false);
    showToast(`Đã tạo thành công Lớp ${newClass.name}!`);
  };

  // Handle Update Class
  const handleUpdateClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentClass) return;

    const cleanName = formData.name.trim().toUpperCase();
    if (!cleanName) {
      setFormError('Vui lòng nhập tên lớp học.');
      return;
    }

    if (classes.some((c) => c.id !== currentClass.id && c.name.toUpperCase() === cleanName)) {
      setFormError(`Tên lớp ${cleanName} đã bị trùng với lớp khác!`);
      return;
    }

    const updated: Classroom = {
      ...currentClass,
      name: cleanName,
      grade: formData.grade,
      homeroomTeacher: formData.homeroomTeacher.trim() || currentClass.homeroomTeacher,
      isHomeroom: formData.isHomeroom,
      subject: formData.subject.trim() || currentClass.subject,
      room: formData.room.trim() || currentClass.room,
      monitorName: formData.monitorName.trim(),
      viceMonitorName: formData.viceMonitorName.trim(),
      secretaryName: formData.secretaryName.trim(),
    };

    if (onUpdateClass) {
      onUpdateClass(updated);
    }
    setIsEditModalOpen(false);
    showToast(`Đã cập nhật thông tin Lớp ${updated.name}!`);
  };

  // Handle Confirm Delete Class
  const handleConfirmDelete = () => {
    if (!currentClass) return;
    const targetName = currentClass.name;
    const targetId = currentClass.id;

    if (onDeleteClass) {
      onDeleteClass(targetId, deleteAlsoStudents);
    }

    // Set active to remaining class
    const remaining = classes.filter((c) => c.id !== targetId);
    if (remaining.length > 0) {
      setActiveClassId(remaining[0].id);
    } else {
      setActiveClassId('');
    }

    setIsDeleteModalOpen(false);
    showToast(`Đã xóa Lớp ${targetName} ${deleteAlsoStudents ? 'và các học sinh liên quan' : ''}!`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-3.5 bg-emerald-600 text-white rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="bg-white p-5 rounded-3xl border border-blue-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#17324D]">
              Quản lý lớp học
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EAF4FF] text-[#0066CC]">
              {classes.length} Lớp học
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Năm học 2026 - 2027 · Trường THPT Nguyễn Dục
          </p>
        </div>

        {/* Action Buttons: Add Class & Restore */}
        <div className="flex flex-wrap items-center gap-2.5">
          {classes.length < 4 && onRestoreDefaultClasses && (
            <button
              onClick={() => {
                onRestoreDefaultClasses();
                showToast('Đã khôi phục các lớp học mẫu ban đầu!');
              }}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Khôi phục các lớp 12A1, 12A2, 11B3, 10C2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi phục lớp mẫu</span>
            </button>
          )}

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-[#0066CC] hover:bg-[#004A99] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm lớp học</span>
          </button>
        </div>
      </div>

      {/* Class Selection Tabs Bar */}
      {classes.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-2xl border border-blue-100 shadow-xs">
          <span className="text-xs font-bold text-[#17324D] px-2 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-[#0066CC]" />
            <span>Danh sách lớp:</span>
          </span>

          {classes.map((c) => {
            const count = students.filter((s) => s.className === c.name).length;
            const isActive = currentClass?.id === c.id;

            return (
              <button
                key={c.id}
                onClick={() => setActiveClassId(c.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#0066CC] text-white shadow-sm ring-2 ring-blue-300'
                    : 'bg-[#F5F9FF] text-slate-700 hover:bg-blue-50 border border-slate-200'
                }`}
              >
                <span>Lớp {c.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-blue-100 text-[#0066CC]'
                  }`}
                >
                  {count} HS
                </span>
                {c.isHomeroom && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                      isActive ? 'bg-amber-300 text-amber-950' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    Chủ nhiệm
                  </span>
                )}
              </button>
            );
          })}

          <button
            onClick={handleOpenAddModal}
            className="p-2 rounded-xl text-[#0066CC] hover:bg-blue-50 border border-dashed border-blue-300 hover:border-blue-500 transition-colors flex items-center gap-1 text-xs font-bold"
            title="Tạo thêm lớp mới"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Tạo thêm</span>
          </button>
        </div>
      ) : (
        /* Empty state when NO classes exist */
        <div className="bg-white rounded-3xl border border-blue-100 p-12 text-center shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#0066CC] flex items-center justify-center mx-auto">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#17324D]">
              Chưa có lớp học nào trong hệ thống
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Thầy cô có thể tạo thêm lớp học mới hoặc nhấn nút khôi phục các lớp mẫu ban đầu của trường THPT Nguyễn Dục.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 bg-[#0066CC] hover:bg-[#004A99] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo lớp học mới</span>
            </button>
            {onRestoreDefaultClasses && (
              <button
                onClick={() => {
                  onRestoreDefaultClasses();
                  showToast('Đã khôi phục các lớp mẫu thành công!');
                }}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Khôi phục 4 lớp mẫu</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Active Class Highlight Banner */}
      {currentClass && (
        <div className="bg-white rounded-3xl border border-blue-100 p-6 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 5 cols: Class Identity */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0066CC] to-[#004A99] text-white flex items-center justify-center font-bold text-xl shadow-sm">
                  {currentClass.name}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-[#17324D]">
                      Lớp {currentClass.name}
                    </h2>
                    {currentClass.isHomeroom && (
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Lớp Chủ Nhiệm
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#64748B]">
                    Khối {currentClass.grade} · {currentClass.subject}
                  </p>
                </div>
              </div>

              {/* Class Edit and Delete Actions */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleOpenEditModal}
                  className="p-2 text-slate-500 hover:text-[#0066CC] hover:bg-blue-50 rounded-xl border border-slate-200 transition-colors"
                  title="Chỉnh sửa thông tin lớp"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl border border-red-200 transition-colors"
                  title={`Xóa Lớp ${currentClass.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-xs bg-[#F5F9FF] p-4 rounded-2xl border border-blue-100">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Giáo viên chủ nhiệm:</span>
                <span className="font-bold text-[#17324D]">{currentClass.homeroomTeacher}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Phòng học cố định:</span>
                <span className="font-semibold text-slate-800">{currentClass.room}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Sĩ số hiện tại:</span>
                <span className="font-bold font-mono text-[#0066CC]">{classStudents.length} học sinh</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Điểm trung bình lớp:</span>
                <span className="font-bold font-mono text-emerald-700">
                  {classStudents.length > 0
                    ? (() => {
                        const valid = classStudents
                          .map((s) => s.scores.dtb)
                          .filter((d): d is number => d !== null);
                        return valid.length > 0
                          ? (valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(1)
                          : currentClass.averageScore;
                      })()
                    : currentClass.averageScore}{' '}
                  / 10
                </span>
              </div>
            </div>

            {/* Ban Cán Sự Lớp */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0066CC]">
                  Ban cán sự lớp
                </h4>
                <button
                  onClick={handleOpenEditModal}
                  className="text-[11px] text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Sửa</span>
                </button>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Lớp trưởng:</span>
                  <span className="font-bold text-[#17324D]">{currentClass.monitorName || 'Chưa cập nhật'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Lớp phó học tập:</span>
                  <span className="font-semibold text-[#17324D]">{currentClass.viceMonitorName || 'Chưa cập nhật'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Bí thư Chi đoàn:</span>
                  <span className="font-semibold text-[#17324D]">{currentClass.secretaryName || 'Chưa cập nhật'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateToGrades(currentClass.name)}
                className="flex-1 py-2.5 bg-[#0066CC] hover:bg-[#004A99] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Mở sổ điểm Lớp {currentClass.name}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl border border-red-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Xóa lớp này"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xóa lớp</span>
              </button>
            </div>
          </div>

          {/* Right 7 cols: Academic Performance Distribution & Student Preview */}
          <div className="lg:col-span-7 space-y-4">
            {/* Ratio bar */}
            <div className="bg-[#F5F9FF] p-4 rounded-2xl border border-blue-100">
              <h4 className="text-xs font-bold text-[#17324D] mb-2">
                Phân bố xếp loại học lực Lớp {currentClass.name}
              </h4>
              <div className="grid grid-cols-3 gap-3 text-center mb-1">
                <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                  <p className="text-[10px] text-emerald-600 font-semibold">Giỏi & Xuất sắc</p>
                  <p className="text-lg font-bold font-mono text-emerald-700">{excellentCount} HS</p>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-blue-100">
                  <p className="text-[10px] text-[#0066CC] font-semibold">Học lực Khá</p>
                  <p className="text-lg font-bold font-mono text-[#0066CC]">{goodCount} HS</p>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-amber-100">
                  <p className="text-[10px] text-amber-600 font-semibold">Đạt / Chưa đạt</p>
                  <p className="text-lg font-bold font-mono text-amber-700">{averageCount} HS</p>
                </div>
              </div>
            </div>

            {/* Student Roster Preview */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-[#17324D]">
                  Danh sách học sinh ({classStudents.length} em)
                </span>
                <span className="text-[11px] text-slate-500">
                  Nhấp chuột để xem hồ sơ
                </span>
              </div>

              {classStudents.length > 0 ? (
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {classStudents.map((st, index) => (
                    <div
                      key={st.id}
                      onClick={() => onSelectStudent(st)}
                      className="p-3 hover:bg-[#F5F9FF] cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-slate-400 w-5">
                          {index + 1}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-[#EAF4FF] text-[#0066CC] font-bold text-xs flex items-center justify-center">
                          {st.name.charAt(st.name.lastIndexOf(' ') + 1)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#17324D]">{st.name}</p>
                          <p className="text-[11px] text-[#64748B]">
                            {st.gender} · Điểm TB: {st.scores.dtb !== null ? st.scores.dtb.toFixed(1) : '--'}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold font-mono text-[#0066CC]">
                          {st.scores.dtb !== null ? st.scores.dtb.toFixed(1) : '--'}
                        </span>
                        <span
                          className={`ml-2 text-[10px] px-2 py-0.5 rounded-full ${
                            st.scores.rank === 'Xuất sắc' || st.scores.rank === 'Giỏi'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {st.scores.rank}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center space-y-2">
                  <p className="text-xs text-slate-500">
                    Lớp {currentClass.name} hiện chưa có học sinh nào.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Thầy cô có thể vào mục <b>"Quản lý học sinh"</b> để thêm hoặc nhập học sinh từ file Excel/CSV vào lớp này.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: THÊM LỚP HỌC MỚI */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0066CC] flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#17324D]">
                    Tạo lớp học mới
                  </h3>
                  <p className="text-xs text-slate-500">
                    Năm học 2026 - 2027 · THPT Nguyễn Dục
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-4 pt-4">
              {formError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#17324D] mb-1">
                    Tên lớp học <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: 12A3, 11B2, 10C1"
                    value={formData.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      let g: '10' | '11' | '12' = formData.grade;
                      if (val.startsWith('10')) g = '10';
                      else if (val.startsWith('11')) g = '11';
                      else if (val.startsWith('12')) g = '12';
                      setFormData({
                        ...formData,
                        name: val,
                        grade: g,
                        subject: `Toán học ${g}`,
                      });
                    }}
                    className="w-full px-3.5 py-2.5 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs font-bold text-[#17324D] focus:ring-2 focus:ring-[#0066CC] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17324D] mb-1">
                    Khối lớp <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.grade}
                    onChange={(e) => {
                      const g = e.target.value as '10' | '11' | '12';
                      setFormData({
                        ...formData,
                        grade: g,
                        subject: `Toán học ${g}`,
                      });
                    }}
                    className="w-full px-3.5 py-2.5 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs font-bold text-[#17324D] focus:ring-2 focus:ring-[#0066CC] outline-none"
                  >
                    <option value="12">Khối 12</option>
                    <option value="11">Khối 11</option>
                    <option value="10">Khối 10</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17324D] mb-1">
                  Giáo viên chủ nhiệm
                </label>
                <input
                  type="text"
                  value={formData.homeroomTeacher}
                  onChange={(e) => setFormData({ ...formData, homeroomTeacher: e.target.value })}
                  placeholder="Họ và tên GVCN"
                  className="w-full px-3.5 py-2.5 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs text-[#17324D] font-medium focus:ring-2 focus:ring-[#0066CC] outline-none"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200 cursor-pointer">
                <input
                  type="checkbox"
                  id="addIsHomeroom"
                  checked={formData.isHomeroom}
                  onChange={(e) => setFormData({ ...formData, isHomeroom: e.target.checked })}
                  className="w-4 h-4 text-[#0066CC] rounded focus:ring-0 cursor-pointer"
                />
                <label htmlFor="addIsHomeroom" className="text-xs font-bold text-amber-900 cursor-pointer">
                  Đây là lớp chủ nhiệm của tôi (Cô Trần Thị Tuyết Nhung)
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#17324D] mb-1">
                    Môn giảng dạy
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs text-[#17324D] focus:ring-2 focus:ring-[#0066CC] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#17324D] mb-1">
                    Phòng học cố định
                  </label>
                  <input
                    type="text"
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs text-[#17324D] focus:ring-2 focus:ring-[#0066CC] outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <p className="text-[11px] font-bold text-[#0066CC] uppercase tracking-wider">
                  Ban cán sự lớp (Tùy chọn)
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Lớp trưởng"
                    value={formData.monitorName}
                    onChange={(e) => setFormData({ ...formData, monitorName: e.target.value })}
                    className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Lớp phó"
                    value={formData.viceMonitorName}
                    onChange={(e) => setFormData({ ...formData, viceMonitorName: e.target.value })}
                    className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Bí thư"
                    value={formData.secretaryName}
                    onChange={(e) => setFormData({ ...formData, secretaryName: e.target.value })}
                    className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0066CC] hover:bg-[#004A99] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tạo lớp học</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: CHỈNH SỬA THÔNG TIN LỚP */}
      {isEditModalOpen && currentClass && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0066CC] flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#17324D]">
                    Chỉnh sửa Lớp {currentClass.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cập nhật thông tin phòng học, GVCN và ban cán sự
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateClassSubmit} className="space-y-4 pt-4">
              {formError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#17324D] mb-1">
                    Tên lớp học
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs font-bold text-[#17324D] focus:ring-2 focus:ring-[#0066CC] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17324D] mb-1">
                    Khối lớp
                  </label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value as '10' | '11' | '12' })}
                    className="w-full px-3.5 py-2.5 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs font-bold text-[#17324D] focus:ring-2 focus:ring-[#0066CC] outline-none"
                  >
                    <option value="12">Khối 12</option>
                    <option value="11">Khối 11</option>
                    <option value="10">Khối 10</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17324D] mb-1">
                  Giáo viên chủ nhiệm
                </label>
                <input
                  type="text"
                  value={formData.homeroomTeacher}
                  onChange={(e) => setFormData({ ...formData, homeroomTeacher: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs text-[#17324D] font-medium focus:ring-2 focus:ring-[#0066CC] outline-none"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200 cursor-pointer">
                <input
                  type="checkbox"
                  id="editIsHomeroom"
                  checked={formData.isHomeroom}
                  onChange={(e) => setFormData({ ...formData, isHomeroom: e.target.checked })}
                  className="w-4 h-4 text-[#0066CC] rounded focus:ring-0 cursor-pointer"
                />
                <label htmlFor="editIsHomeroom" className="text-xs font-bold text-amber-900 cursor-pointer">
                  Lớp chủ nhiệm của tôi (Cô Trần Thị Tuyết Nhung)
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#17324D] mb-1">
                    Môn giảng dạy
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs text-[#17324D] focus:ring-2 focus:ring-[#0066CC] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#17324D] mb-1">
                    Phòng học cố định
                  </label>
                  <input
                    type="text"
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs text-[#17324D] focus:ring-2 focus:ring-[#0066CC] outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <p className="text-[11px] font-bold text-[#0066CC] uppercase tracking-wider">
                  Ban cán sự lớp
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Lớp trưởng"
                    value={formData.monitorName}
                    onChange={(e) => setFormData({ ...formData, monitorName: e.target.value })}
                    className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Lớp phó"
                    value={formData.viceMonitorName}
                    onChange={(e) => setFormData({ ...formData, viceMonitorName: e.target.value })}
                    className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Bí thư"
                    value={formData.secretaryName}
                    onChange={(e) => setFormData({ ...formData, secretaryName: e.target.value })}
                    className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0066CC] hover:bg-[#004A99] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Lưu thay đổi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: XÁC NHẬN XÓA LỚP HỌC */}
      {isDeleteModalOpen && currentClass && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-red-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-[#17324D]">
              Xác nhận xóa Lớp {currentClass.name}?
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Thầy cô đang chuẩn bị xóa <b>Lớp {currentClass.name}</b> (GVCN: {currentClass.homeroomTeacher}).
            </p>

            <div className="mt-3 p-3.5 bg-red-50 rounded-2xl border border-red-200 space-y-2 text-xs">
              <div className="flex items-center justify-between text-red-900 font-semibold">
                <span>Số học sinh hiện tại của lớp:</span>
                <span className="font-bold font-mono text-sm">{classStudents.length} học sinh</span>
              </div>

              <div className="pt-2 border-t border-red-200/60">
                <label className="flex items-start gap-2 cursor-pointer text-red-800">
                  <input
                    type="checkbox"
                    checked={deleteAlsoStudents}
                    onChange={(e) => setDeleteAlsoStudents(e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-red-600 rounded focus:ring-0 cursor-pointer"
                  />
                  <span>
                    Đồng thời <b>xóa toàn bộ {classStudents.length} học sinh</b> thuộc lớp {currentClass.name} khỏi hệ thống.
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-6">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xóa Lớp {currentClass.name}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
