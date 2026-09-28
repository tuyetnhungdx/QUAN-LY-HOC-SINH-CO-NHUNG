import React, { useState, useRef } from 'react';
import { Student } from '../types';
import {
  Search,
  Plus,
  Download,
  Phone,
  Eye,
  Trash2,
  FileSpreadsheet,
  Upload,
  AlertTriangle,
  CheckCircle2,
  X,
  FileText,
  RotateCcw,
  CheckSquare,
  Square,
  Sparkles,
} from 'lucide-react';

interface StudentsViewProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onAddStudent: (newStudent: Student) => void;
  onAddMultipleStudents?: (newStudents: Student[]) => void;
  onDeleteStudent: (id: string) => void;
  onDeleteMultipleStudents?: (ids: string[]) => void;
  onDeleteAllStudents?: (className?: string) => void;
  onRestoreDefaultStudents?: () => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  onSelectStudent,
  onAddStudent,
  onAddMultipleStudents,
  onDeleteStudent,
  onDeleteMultipleStudents,
  onDeleteAllStudents,
  onRestoreDefaultStudents,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedRank, setSelectedRank] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState<boolean>(false);
  const [showBatchDeleteModal, setShowBatchDeleteModal] = useState<boolean>(false);

  // Selection state for batch deletion
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [successToast, setSuccessToast] = useState<string>('');

  // New Student Manual Form State
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newGender, setNewGender] = useState<'Nam' | 'Nữ'>('Nam');
  const [newDob, setNewDob] = useState('2007-01-01');
  const [newClass, setNewClass] = useState('12A1');
  const [newParentName, setNewParentName] = useState('');
  const [newParentPhone, setNewParentPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');

  // Import from file state
  const [importTargetClass, setImportTargetClass] = useState<string>('12A1');
  const [importMode, setImportMode] = useState<'file' | 'paste'>('file');
  const [pastedText, setPastedText] = useState<string>('');
  const [importedPreview, setImportedPreview] = useState<Partial<Student>[]>([]);
  const [importError, setImportError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter logic
  const filteredStudents = students.filter((s) => {
    const matchClass = selectedClass === 'all' || s.className === selectedClass;
    const matchRank = selectedRank === 'all' || s.scores.rank === selectedRank;
    const matchSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.className.toLowerCase().includes(searchQuery.toLowerCase());
    return matchClass && matchRank && matchSearch;
  });

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  // Toggle selection
  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length && filteredStudents.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents.map((s) => s.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Single Delete
  const handleConfirmDeleteSingle = () => {
    if (!studentToDelete) return;
    onDeleteStudent(studentToDelete.id);
    setSelectedIds((prev) => prev.filter((id) => id !== studentToDelete.id));
    triggerToast(`Đã xóa học sinh ${studentToDelete.name} thành công.`);
    setStudentToDelete(null);
  };

  // Batch Delete
  const handleConfirmBatchDelete = () => {
    if (onDeleteMultipleStudents) {
      onDeleteMultipleStudents(selectedIds);
    } else {
      selectedIds.forEach((id) => onDeleteStudent(id));
    }
    triggerToast(`Đã xóa ${selectedIds.length} học sinh đã chọn thành công.`);
    setSelectedIds([]);
    setShowBatchDeleteModal(false);
  };

  // Delete All
  const handleConfirmDeleteAll = () => {
    if (onDeleteAllStudents) {
      onDeleteAllStudents(selectedClass);
    } else {
      filteredStudents.forEach((s) => onDeleteStudent(s.id));
    }
    setSelectedIds([]);
    setShowDeleteAllModal(false);
    triggerToast(
      selectedClass === 'all'
        ? 'Đã xóa toàn bộ học sinh trong hệ thống.'
        : `Đã xóa toàn bộ học sinh lớp ${selectedClass}.`
    );
  };

  // Manual Add Student Submit
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const student: Student = {
      id: `hs_${Date.now()}`,
      studentCode: `ND-26-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newName.trim(),
      gender: newGender,
      dob: newDob || '2008-01-01',
      className: newClass,
      scores: {
        tx1: 8.0,
        tx2: 8.0,
        tx3: null,
        gk: 8.0,
        ck: null,
        dtb: 8.0,
        rank: 'Giỏi',
      },
      conduct: 'Tốt',
      attendance: { present: 48, excused: 0, unexcused: 0, late: 0 },
      parentName: '',
      parentPhone: '',
      address: newAddress || 'Huyện Tiên Phước, Quảng Nam',
      notes: 'Học sinh mới cập nhật hồ sơ.',
      aiRemark: 'Học sinh mới, đang theo dõi năng lực học tập.',
    };

    onAddStudent(student);
    setIsAddModalOpen(false);
    triggerToast(`Đã thêm học sinh ${student.name} vào lớp ${student.className}.`);
    // Reset form
    setNewName('');
    setNewCode('');
    setNewParentName('');
    setNewParentPhone('');
    setNewAddress('');
  };

  // Parse CSV / TSV File / Text (Intelligently detects Student Name and Class columns)
  const parseCSVText = (text: string) => {
    try {
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length === 0) {
        setImportError('Dữ liệu rỗng, vui lòng chọn file hoặc dán danh sách học sinh.');
        return;
      }

      // Check header or delimiter
      const firstLine = lines[0];
      const delimiter = firstLine.includes('\t') ? '\t' : firstLine.includes(';') ? ';' : ',';
      const rawFirstCols = firstLine.split(delimiter).map((c) => c.replace(/^["']|["']$/g, '').trim());
      const lowerFirstCols = rawFirstCols.map((c) => c.toLowerCase());

      let nameColIdx = -1;
      let classColIdx = -1;
      let codeColIdx = -1;
      let genderColIdx = -1;
      let dobColIdx = -1;
      let parentNameColIdx = -1;
      let parentPhoneColIdx = -1;
      let addressColIdx = -1;

      // Scan header row for key columns
      lowerFirstCols.forEach((h, idx) => {
        if (
          h.includes('họ và tên') ||
          h.includes('tên học sinh') ||
          h.includes('họ tên') ||
          h === 'tên' ||
          h === 'học sinh' ||
          h.includes('student name') ||
          h.includes('name')
        ) {
          nameColIdx = idx;
        } else if (h === 'lớp' || h.includes('lớp') || h.includes('class')) {
          classColIdx = idx;
        } else if (h.includes('mã') || h.includes('code') || h.includes('sbd')) {
          codeColIdx = idx;
        } else if (h.includes('giới') || h.includes('tính') || h.includes('gender')) {
          genderColIdx = idx;
        } else if (h.includes('ngày sinh') || h.includes('sinh') || h.includes('dob')) {
          dobColIdx = idx;
        } else if (h.includes('phụ huynh') || h.includes('bố') || h.includes('mẹ')) {
          parentNameColIdx = idx;
        } else if (h.includes('điện thoại') || h.includes('sđt') || h.includes('phone')) {
          parentPhoneColIdx = idx;
        } else if (h.includes('địa chỉ') || h.includes('address')) {
          addressColIdx = idx;
        }
      });

      // Is there an actual header row?
      const isHeaderPresent = nameColIdx !== -1 || classColIdx !== -1 || codeColIdx !== -1;
      const startIndex = isHeaderPresent ? 1 : 0;

      // If no recognized header names and there are 2 columns:
      if (!isHeaderPresent) {
        if (rawFirstCols.length >= 2) {
          // Check if col 1 or col 0 looks like a class code (e.g. 12A1, 10C2, 11B3)
          const col1Class = /^(10|11|12)[A-Za-z0-9]+$/i.test(rawFirstCols[1]);
          const col0Class = /^(10|11|12)[A-Za-z0-9]+$/i.test(rawFirstCols[0]);
          if (col1Class) {
            nameColIdx = 0;
            classColIdx = 1;
          } else if (col0Class) {
            nameColIdx = 1;
            classColIdx = 0;
          } else {
            nameColIdx = 0;
            classColIdx = 1;
          }
        } else {
          nameColIdx = 0;
        }
      } else {
        // If header was present, ensure name column is at least mapped
        if (nameColIdx === -1) {
          // Fallback to first non-code, non-class column or index 0
          nameColIdx = rawFirstCols.length > 1 && classColIdx === 0 ? 1 : 0;
        }
      }

      const parsed: Partial<Student>[] = [];

      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const rowCols = line.split(delimiter).map((c) => c.replace(/^["']|["']$/g, '').trim());

        const rawName = (nameColIdx >= 0 && rowCols[nameColIdx]) ? rowCols[nameColIdx] : (rowCols[0] || '');
        if (!rawName || rawName === 'Họ và tên' || rawName === 'Tên học sinh') continue;

        const rawClass = (classColIdx >= 0 && rowCols[classColIdx]) ? rowCols[classColIdx] : importTargetClass;

        // Auto-detect gender from Vietnamese name if not specified
        let gender: 'Nam' | 'Nữ' = 'Nam';
        if (genderColIdx >= 0 && rowCols[genderColIdx]) {
          gender = rowCols[genderColIdx].toLowerCase().includes('nữ') ? 'Nữ' : 'Nam';
        } else {
          const lower = rawName.toLowerCase();
          if (
            lower.includes(' thị ') ||
            lower.endsWith(' thị') ||
            lower.includes(' ngọc ') ||
            lower.includes(' mai ') ||
            lower.includes(' phương ') ||
            lower.includes(' hương ') ||
            lower.includes(' trang ') ||
            lower.includes(' thúy ') ||
            lower.includes(' thảo ') ||
            lower.includes(' linh ') ||
            lower.includes(' vy ') ||
            lower.includes(' như ') ||
            lower.includes(' oanh ') ||
            lower.includes(' trâm ') ||
            lower.includes(' anh ')
          ) {
            gender = 'Nữ';
          }
        }

        const studentCode = (codeColIdx >= 0 && rowCols[codeColIdx])
          ? rowCols[codeColIdx]
          : `ND-26-${Math.floor(1000 + Math.random() * 9000)}`;

        parsed.push({
          studentCode,
          name: rawName,
          gender,
          className: rawClass || importTargetClass,
          dob: (dobColIdx >= 0 && rowCols[dobColIdx]) ? rowCols[dobColIdx] : '2008-05-15',
          parentName: (parentNameColIdx >= 0 && rowCols[parentNameColIdx]) ? rowCols[parentNameColIdx] : 'Phụ huynh học sinh',
          parentPhone: (parentPhoneColIdx >= 0 && rowCols[parentPhoneColIdx]) ? rowCols[parentPhoneColIdx] : '0912 345 678',
          address: (addressColIdx >= 0 && rowCols[addressColIdx]) ? rowCols[addressColIdx] : 'Huyện Tiên Phước, Quảng Nam',
        });
      }

      if (parsed.length === 0) {
        setImportError('Không tìm thấy học sinh hợp lệ nào từ dữ liệu. Vui lòng đảm bảo có cột Tên Học sinh và Lớp.');
      } else {
        setImportedPreview(parsed);
        setImportError('');
      }
    } catch (err: any) {
      setImportError('Có lỗi xảy ra khi xử lý dữ liệu: ' + err.message);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      parseCSVText(content);
    };
    reader.onerror = () => {
      setImportError('Không thể đọc file đã chọn.');
    };
    reader.readAsText(file, 'UTF-8');
  };

  // Quick 2-Column Template Sample
  const handleLoadSampleImportData = () => {
    const sample2Col = `Tên học sinh,Lớp
Nguyễn Văn Nam,12A1
Trần Thị Bích,12A1
Lê Hoàng Nam,12A2
Phạm Minh Đức,12A2
Hoàng Hải Yến,11B3
Võ Minh Khang,10C2`;
    parseCSVText(sample2Col);
  };

  // Confirm Import
  const handleConfirmImport = () => {
    if (importedPreview.length === 0) return;

    const newStudents: Student[] = importedPreview.map((item, idx) => ({
      id: `hs_import_${Date.now()}_${idx}`,
      studentCode: item.studentCode || `ND-26-${Math.floor(1000 + Math.random() * 9000)}`,
      name: item.name || 'Học sinh mới',
      gender: item.gender || 'Nam',
      dob: item.dob || '2008-01-01',
      className: item.className || importTargetClass,
      scores: {
        tx1: 8.0,
        tx2: 8.0,
        tx3: null,
        gk: 8.0,
        ck: null,
        dtb: 8.0,
        rank: 'Giỏi',
      },
      conduct: 'Tốt',
      attendance: { present: 48, excused: 0, unexcused: 0, late: 0 },
      parentName: item.parentName || 'Phụ huynh học sinh',
      parentPhone: item.parentPhone || '0900 000 000',
      address: item.address || 'Huyện Tiên Phước, Quảng Nam',
      notes: 'Nhập từ file danh sách.',
      aiRemark: 'Học sinh nhập từ file học bạ.',
    }));

    if (onAddMultipleStudents) {
      onAddMultipleStudents(newStudents);
    } else {
      newStudents.forEach((s) => onAddStudent(s));
    }

    triggerToast(`Đã thêm thành công ${newStudents.length} học sinh vào hệ thống!`);
    setIsImportModalOpen(false);
    setImportedPreview([]);
    setPastedText('');
    setImportError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Download Sample Template CSV (2-Column Minimal & Full)
  const downloadSampleTemplate2Col = () => {
    const headers = 'Tên học sinh,Lớp';
    const sampleRows = [
      'Nguyễn Văn Nam,12A1',
      'Trần Thị Bích,12A1',
      'Lê Hoàng Nam,12A2',
      'Phạm Minh Đức,12A2',
      'Hoàng Hải Yến,11B3',
      'Võ Minh Khang,10C2',
    ];
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...sampleRows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Mau_2_cot_Ten_Hoc_Sinh_va_Lop.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadSampleTemplateFull = () => {
    const headers = 'Mã học sinh,Họ và tên,Giới tính,Lớp,Ngày sinh,Họ tên phụ huynh,Số điện thoại,Địa chỉ';
    const sampleRows = [
      'ND-26-1291,Nguyễn Văn Nam,Nam,12A1,2008-03-15,Nguyễn Văn Ba,0912 345 678,Thị trấn Tiên Kỳ - Tiên Phước',
      'ND-26-1292,Trần Thị Bích,Nữ,12A1,2008-09-22,Trần Văn Bốn,0987 654 321,Xã Tiên Cảnh - Tiên Phước',
      'ND-26-1293,Lê Hoàng Nam,Nam,12A2,2008-11-05,Lê Văn Sáu,0935 123 456,Xã Tiên Thọ - Tiên Phước',
    ];
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...sampleRows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Mau_Day_Du_8_Cot_THPT_NguyenDuc.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export current list to CSV
  const exportCSV = () => {
    const headers = ['STT,Họ và tên,Lớp,Giới tính,Ngày sinh,ĐTB Môn,Xếp loại,Hạnh kiểm'];
    const rows = filteredStudents.map((s, idx) =>
      `"${idx + 1}","${s.name}","${s.className}","${s.gender}","${s.dob}","${s.scores.dtb ?? ''}","${s.scores.rank ?? ''}","${s.conduct}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Danh_sach_hoc_sinh_${selectedClass}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isAllVisibleSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every((s) => selectedIds.includes(s.id));

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 p-3.5 bg-emerald-600 text-white rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top action & filter bar */}
      <div className="bg-white p-4 md:p-5 rounded-3xl border border-blue-100 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-[#17324D]">
              Quản lý học sinh
            </h1>
            <p className="text-xs text-[#64748B]">
              Danh sách học sinh các lớp do giáo viên phụ trách giảng dạy và chủ nhiệm
            </p>
          </div>

          {/* Action Buttons Group */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Import from file button */}
            <button
              onClick={() => {
                setImportedPreview([]);
                setImportError('');
                setIsImportModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-[#EAF4FF] hover:bg-blue-100 text-[#004A99] border border-blue-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Thêm danh sách học sinh từ file Excel hoặc CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#0066CC]" />
              <span>Thêm từ file</span>
            </button>

            {/* Manual Add Student button */}
            <button
              onClick={() => {
                setNewCode(`ND-24-${Math.floor(1000 + Math.random() * 9000)}`);
                setIsAddModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-[#0066CC] hover:bg-[#004A99] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm học sinh</span>
            </button>

            {/* Export CSV button */}
            <button
              onClick={exportCSV}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-[#F5F9FF] hover:border-blue-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Xuất danh sách học sinh hiện tại ra file CSV/Excel"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Xuất danh sách</span>
            </button>

            {/* Delete All Students button */}
            {students.length > 0 && (
              <button
                onClick={() => setShowDeleteAllModal(true)}
                className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Xóa toàn bộ học sinh"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
                <span>
                  {selectedClass === 'all'
                    ? 'Xóa toàn bộ'
                    : `Xóa cả lớp ${selectedClass}`}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          {/* Search */}
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo tên học sinh, lớp..."
              className="w-full pl-9 pr-4 py-2 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs text-[#17324D] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
            />
          </div>

          {/* Filter by class */}
          <div>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedIds([]);
              }}
              className="w-full px-3 py-2 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs text-[#17324D] font-medium focus:ring-2 focus:ring-[#0066CC] outline-none cursor-pointer"
            >
              <option value="all">Tất cả các lớp (4 lớp)</option>
              <option value="12A1">Lớp 12A1 (Chủ nhiệm)</option>
              <option value="12A2">Lớp 12A2</option>
              <option value="11B3">Lớp 11B3</option>
              <option value="10C2">Lớp 10C2</option>
            </select>
          </div>

          {/* Filter by Rank */}
          <div>
            <select
              value={selectedRank}
              onChange={(e) => setSelectedRank(e.target.value)}
              className="w-full px-3 py-2 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs text-[#17324D] font-medium focus:ring-2 focus:ring-[#0066CC] outline-none cursor-pointer"
            >
              <option value="all">Tất cả học lực</option>
              <option value="Xuất sắc">Xuất sắc</option>
              <option value="Giỏi">Giỏi</option>
              <option value="Khá">Khá</option>
              <option value="Đạt">Đạt</option>
            </select>
          </div>
        </div>
      </div>

      {/* Batch Selection Action Bar (Appears when checkboxes are selected) */}
      {selectedIds.length > 0 && (
        <div className="bg-[#EAF4FF] border border-blue-200 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0066CC] animate-pulse" />
            <span className="text-xs font-bold text-[#004A99]">
              Đang chọn {selectedIds.length} học sinh
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Bỏ chọn tất cả
            </button>
            <button
              onClick={() => setShowBatchDeleteModal(true)}
              className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa {selectedIds.length} học sinh đã chọn</span>
            </button>
          </div>
        </div>
      )}

      {/* Students Data Table */}
      <div className="bg-white rounded-3xl border border-blue-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F9FF] text-[#17324D] font-bold border-b border-blue-100 uppercase tracking-wider text-[11px]">
              <tr>
                {/* Select All Checkbox */}
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllVisibleSelected}
                    onChange={handleToggleSelectAll}
                    disabled={filteredStudents.length === 0}
                    className="w-4 h-4 text-[#0066CC] rounded border-slate-300 focus:ring-[#0066CC] cursor-pointer"
                    title="Chọn tất cả học sinh đang hiển thị"
                  />
                </th>
                <th className="py-3 px-3 text-center text-slate-400 font-mono w-12">STT</th>
                <th className="py-3 px-5">Họ và tên</th>
                <th className="py-3 px-3">Lớp</th>
                <th className="py-3 px-3">Giới tính</th>
                <th className="py-3 px-4 text-center">ĐTB môn</th>
                <th className="py-3 px-3 text-center">Xếp loại</th>
                <th className="py-3 px-3 text-center">Hạnh kiểm</th>
                <th className="py-3 px-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((st, index) => {
                  const isChecked = selectedIds.includes(st.id);

                  return (
                    <tr
                      key={st.id}
                      className={`transition-colors group cursor-pointer ${
                        isChecked ? 'bg-blue-50/70' : 'hover:bg-blue-50/40'
                      }`}
                      onClick={() => onSelectStudent(st)}
                    >
                      {/* Checkbox */}
                      <td
                        className="py-3.5 px-3 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelectOne(st.id)}
                          className="w-4 h-4 text-[#0066CC] rounded border-slate-300 focus:ring-[#0066CC] cursor-pointer"
                        />
                      </td>

                      {/* STT */}
                      <td className="py-3.5 px-3 text-center font-mono text-slate-400 font-bold">
                        {index + 1}
                      </td>

                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#0066CC]/10 text-[#0066CC] font-bold text-xs flex items-center justify-center shrink-0">
                            {st.name.charAt(st.name.lastIndexOf(' ') + 1) || 'H'}
                          </div>
                          <div>
                            <p className="font-bold text-[#17324D] group-hover:text-[#0066CC] transition-colors text-sm">
                              {st.name}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              Sinh ngày: {st.dob}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="font-semibold text-[#17324D] px-2.5 py-1 rounded-lg bg-blue-50 text-[#0066CC]">
                          {st.className}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-slate-600 font-medium">{st.gender}</td>

                      <td className="py-3.5 px-4 text-center font-bold font-mono text-base text-[#0066CC]">
                        {st.scores.dtb !== null ? st.scores.dtb.toFixed(1) : '--'}
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                            st.scores.rank === 'Xuất sắc'
                              ? 'bg-purple-100 text-purple-800'
                              : st.scores.rank === 'Giỏi'
                              ? 'bg-emerald-100 text-emerald-800'
                              : st.scores.rank === 'Khá'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {st.scores.rank || 'Chưa đạt'}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-center font-semibold text-slate-700">
                        {st.conduct}
                      </td>

                      {/* Row Action Buttons: View Profile & Delete Single */}
                      <td className="py-3.5 px-5 text-right">
                        <div
                          className="flex items-center justify-end gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => onSelectStudent(st)}
                            className="px-2.5 py-1.5 rounded-lg text-slate-600 bg-slate-50 hover:bg-blue-50 hover:text-[#0066CC] font-semibold text-xs flex items-center gap-1 transition-colors border border-slate-200 cursor-pointer"
                            title="Xem chi tiết hồ sơ học sinh"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Chi tiết</span>
                          </button>

                          <button
                            onClick={() => setStudentToDelete(st)}
                            className="px-2.5 py-1.5 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 font-semibold text-xs flex items-center gap-1 transition-colors border border-red-200 cursor-pointer"
                            title="Xóa học sinh này"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-600" />
                            <span>Xóa</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-bold text-[#17324D]">
                        Không tìm thấy học sinh nào phù hợp
                      </p>
                      <p className="text-xs text-slate-500">
                        {students.length === 0
                          ? 'Danh sách học sinh đang trống. Bạn có thể thêm thủ công, nhập từ file hoặc khôi phục dữ liệu mẫu.'
                          : 'Không có học sinh nào trùng khớp với bộ lọc hoặc từ khóa tìm kiếm.'}
                      </p>
                      {students.length === 0 && onRestoreDefaultStudents && (
                        <div className="pt-2">
                          <button
                            onClick={onRestoreDefaultStudents}
                            className="px-4 py-2 bg-[#0066CC] hover:bg-[#004A99] text-white rounded-xl text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Khôi phục dữ liệu học sinh mẫu</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table summary footer */}
        <div className="p-3.5 bg-[#F5F9FF] border-t border-blue-50 flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] gap-2">
          <span>
            Hiển thị <b>{filteredStudents.length}</b> / {students.length} học sinh
            {selectedIds.length > 0 && ` (Đã chọn ${selectedIds.length} em)`}
          </span>
          <div className="flex items-center gap-3">
            {students.length === 0 && onRestoreDefaultStudents && (
              <button
                onClick={onRestoreDefaultStudents}
                className="text-xs font-bold text-[#0066CC] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Nạp lại học sinh mẫu</span>
              </button>
            )}
            <span>Trường THPT Nguyễn Dục · Năm học 2026 - 2027</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: CONFIRM DELETE SINGLE STUDENT */}
      {/* ========================================================= */}
      {studentToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-red-100 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#17324D]">
                Xác nhận xóa học sinh?
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Bạn có chắc chắn muốn xóa học sinh{' '}
                <b className="text-[#17324D]">{studentToDelete.name}</b> khỏi danh sách?
              </p>
              <div className="mt-2.5 p-2.5 bg-slate-50 rounded-xl text-left text-xs space-y-1 text-slate-600 border border-slate-100">
                <p>• Lớp: <b>{studentToDelete.className}</b></p>
                <p>• ĐTB: <b>{studentToDelete.scores.dtb ?? '--'}</b> ({studentToDelete.scores.rank})</p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
                className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteSingle}
                className="flex-1 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm cursor-pointer"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: CONFIRM BATCH DELETE SELECTED STUDENTS */}
      {/* ========================================================= */}
      {showBatchDeleteModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-red-100 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#17324D]">
                Xác nhận xóa {selectedIds.length} học sinh?
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Tất cả {selectedIds.length} học sinh đã được đánh dấu sẽ bị xóa khỏi hệ thống. Hành động này không thể hoàn tác trực tiếp.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowBatchDeleteModal(false)}
                className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmBatchDelete}
                className="flex-1 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm cursor-pointer"
              >
                Xóa {selectedIds.length} học sinh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: CONFIRM DELETE ALL STUDENTS */}
      {/* ========================================================= */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-red-200 space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-red-700">
                {selectedClass === 'all'
                  ? 'Cảnh báo: Xóa TOÀN BỘ học sinh?'
                  : `Xóa toàn bộ học sinh lớp ${selectedClass}?`}
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {selectedClass === 'all'
                  ? `Bạn sắp xóa tất cả ${students.length} học sinh trong toàn bộ các lớp khỏi hệ thống Sổ theo dõi học tập THPT Nguyễn Dục.`
                  : `Bạn sắp xóa tất cả ${filteredStudents.length} học sinh thuộc lớp ${selectedClass}.`}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                (Lưu ý: Bạn luôn có thể khôi phục lại dữ liệu mẫu bất cứ lúc nào trong phần Cài đặt)
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteAllModal(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteAll}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Đồng ý xóa toàn bộ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: IMPORT STUDENTS FROM FILE (EXCEL / CSV / PASTE) */}
      {/* ========================================================= */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[92vh] flex flex-col justify-between overflow-hidden">
            <div className="space-y-4 overflow-y-auto pr-1">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#EAF4FF] text-[#0066CC] flex items-center justify-center">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#17324D]">
                      Nhập học sinh từ file Excel / CSV
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      Hỗ trợ tự động trích xuất cột <b>Tên Học sinh</b> và <b>Lớp</b>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsImportModalOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Requirement Highlight Banner */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/60 border border-blue-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#004A99]">
                    <CheckCircle2 className="w-4 h-4 text-[#0066CC]" />
                    <span>Hệ thống chỉ cần 2 cột: <u>Tên Học sinh</u> và <u>Lớp</u></span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Thông minh & Tự động
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Dù file của thầy cô có 2 cột hay nhiều cột, hệ thống sẽ tự động lấy đúng 2 cột <b>Tên Học sinh</b> và <b>Lớp</b>. Không yêu cầu mã định danh hay thông tin phụ huynh liên hệ.
                </p>

                {/* Template download buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-blue-100/80">
                  <button
                    type="button"
                    onClick={downloadSampleTemplate2Col}
                    className="px-2.5 py-1.5 bg-white hover:bg-blue-50 text-[#0066CC] border border-blue-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    title="Tải tệp mẫu chỉ có 2 cột: Tên học sinh và Lớp"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Mẫu 2 cột (Tên & Lớp)</span>
                  </button>

                  <button
                    type="button"
                    onClick={downloadSampleTemplateFull}
                    className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <Download className="w-3 h-3 text-slate-400" />
                    <span>Mẫu đầy đủ (8 cột)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLoadSampleImportData}
                    className="px-2.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-amber-950 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer shadow-2xs ml-auto"
                    title="Nạp nhanh 6 học sinh mẫu vào xem trước"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Thử dữ liệu mẫu (1-click)</span>
                  </button>
                </div>
              </div>

              {/* Mode Tabs: File Upload vs Copy-Paste from Excel */}
              <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setImportMode('file')}
                  className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    importMode === 'file' ? 'bg-white text-[#0066CC] shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Cách 1: Tải tệp lên (.csv, .xlsx, .txt)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImportMode('paste')}
                  className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    importMode === 'paste' ? 'bg-white text-[#0066CC] shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Cách 2: Dán trực tiếp từ Excel (Ctrl+V)</span>
                </button>
              </div>

              {/* Mode 1: File Upload */}
              {importMode === 'file' ? (
                <div>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-blue-200 hover:border-[#0066CC] rounded-2xl p-6 text-center bg-[#F5F9FF]/60 hover:bg-[#F5F9FF] transition-colors cursor-pointer group"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv, .txt, .xlsx, .xls"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-2xs text-[#0066CC] flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-[#17324D]">
                      Nhấn vào đây để tải file danh sách từ máy tính
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Hỗ trợ file CSV hoặc tệp xuất từ Excel (chỉ cần cột Tên Học sinh và Lớp)
                    </p>
                  </div>
                </div>
              ) : (
                /* Mode 2: Copy-Paste directly from Excel */
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#17324D]">
                    <span>Dán dữ liệu copy từ Excel (2 cột: Tên và Lớp):</span>
                    <span className="text-[11px] text-slate-500 font-normal">Mỗi học sinh một dòng</span>
                  </div>
                  <textarea
                    rows={4}
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder={`Ví dụ bôi đen 2 cột trong Excel rồi dán (Ctrl+V) vào đây:\nNguyễn Văn Nam\t12A1\nTrần Thị Bích\t12A1\nLê Hoàng Nam\t12A2`}
                    className="w-full p-3 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs font-mono text-[#17324D] focus:ring-2 focus:ring-[#0066CC] outline-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => parseCSVText(pastedText)}
                      className="px-4 py-2 bg-[#0066CC] hover:bg-[#004A99] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Phân tích dữ liệu vừa dán</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Error Alert */}
              {importError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              {/* Step 3: Preview Data Table */}
              {importedPreview.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#17324D]">
                      Đã trích xuất thành công ({importedPreview.length} học sinh)
                    </span>
                    <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      ✓ Đã lấy đúng cột Tên & Lớp
                    </span>
                  </div>

                  <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-2xl">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-[#F5F9FF] text-[#17324D] font-bold border-b border-slate-200 sticky top-0">
                        <tr>
                          <th className="py-2 px-3">STT</th>
                          <th className="py-2 px-3 text-[#0066CC]">Họ và tên học sinh ★</th>
                          <th className="py-2 px-3 text-[#0066CC]">Lớp học ★</th>
                          <th className="py-2 px-3">Giới tính</th>
                          <th className="py-2 px-3">Ngày sinh</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {importedPreview.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-mono text-slate-400">{idx + 1}</td>
                            <td className="py-2 px-3 font-bold text-[#17324D]">{item.name}</td>
                            <td className="py-2 px-3 font-bold text-[#0066CC]">Lớp {item.className}</td>
                            <td className="py-2 px-3 text-slate-600">{item.gender}</td>
                            <td className="py-2 px-3 text-slate-500 font-mono">{item.dob}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Hủy bỏ
              </button>

              <button
                type="button"
                disabled={importedPreview.length === 0}
                onClick={handleConfirmImport}
                className="px-5 py-2.5 rounded-xl bg-[#0066CC] hover:bg-[#004A99] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {importedPreview.length > 0
                    ? `Xác nhận nạp ${importedPreview.length} học sinh vào lớp`
                    : 'Chưa có dữ liệu để nạp'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 5: MANUAL ADD STUDENT MODAL */}
      {/* ========================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-[#17324D] mb-1">
              Thêm học sinh mới vào hệ thống
            </h3>
            <p className="text-xs text-[#64748B] mb-4">
              Nhập thông tin cá nhân và lớp học của học sinh Trường THPT Nguyễn Dục
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#17324D] mb-1">
                  Họ và tên học sinh <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="VD: Nguyễn Văn Hoàng"
                  className="w-full px-3.5 py-2.5 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs text-[#17324D] font-medium focus:ring-2 focus:ring-[#0066CC] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17324D] mb-1">
                  Phân lớp <span className="text-red-500">*</span>
                </label>
                <select
                  value={newClass}
                  onChange={(e) => setNewClass(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs text-[#17324D] font-medium focus:ring-2 focus:ring-[#0066CC] outline-none cursor-pointer"
                >
                  <option value="12A1">12A1 (Chủ nhiệm)</option>
                  <option value="12A2">12A2</option>
                  <option value="11B3">11B3</option>
                  <option value="10C2">10C2</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#17324D] mb-1">
                    Giới tính
                  </label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as 'Nam' | 'Nữ')}
                    className="w-full px-3 py-2 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs text-[#17324D] outline-none cursor-pointer"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#17324D] mb-1">
                    Ngày sinh (Tùy chọn)
                  </label>
                  <input
                    type="date"
                    value={newDob}
                    onChange={(e) => setNewDob(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs text-[#17324D] outline-none cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17324D] mb-1">
                  Địa chỉ thường trú (Tùy chọn)
                </label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Thị trấn Tiên Kỳ, Tiên Phước, Quảng Nam"
                  className="w-full px-3.5 py-2 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs text-[#17324D] outline-none"
                />
              </div>

              <div className="flex gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#0066CC] hover:bg-[#004A99] text-white text-xs font-semibold shadow-sm cursor-pointer"
                >
                  Lưu học sinh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
