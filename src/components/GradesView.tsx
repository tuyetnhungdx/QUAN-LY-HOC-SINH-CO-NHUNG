import React, { useState } from 'react';
import { Student, ScoreSet, AcademicRank, Classroom } from '../types';
import { calculateDTB, calculateRank } from '../data/mockData';
import {
  Save,
  Download,
  Printer,
  Edit3,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface GradesViewProps {
  students: Student[];
  classes?: Classroom[];
  initialClass?: string;
  onUpdateScores: (studentId: string, newScores: ScoreSet) => void;
  onSelectStudent: (student: Student) => void;
}

export const GradesView: React.FC<GradesViewProps> = ({
  students,
  classes = [],
  initialClass = '12A1',
  onUpdateScores,
  onSelectStudent,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>(() => {
    if (classes.length > 0) {
      const found = classes.find((c) => c.name === initialClass);
      return found ? found.name : classes[0].name;
    }
    return initialClass;
  });
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [localScores, setLocalScores] = useState<{ [id: string]: ScoreSet }>({});
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string>('');

  const classStudents = students.filter((s) => s.className === selectedClass);

  const handleScoreChange = (
    studentId: string,
    field: keyof ScoreSet,
    value: string
  ) => {
    const num = value === '' ? null : Math.max(0, Math.min(10, parseFloat(value) || 0));
    
    // Find current or existing edited
    const originalStudent = students.find((s) => s.id === studentId);
    const current = localScores[studentId] || originalStudent?.scores || {
      tx1: null,
      tx2: null,
      tx3: null,
      gk: null,
      ck: null,
      dtb: null,
    };

    const updated: ScoreSet = {
      ...current,
      [field]: num,
    };

    // Recalculate DTB & Rank
    const dtb = calculateDTB(updated.tx1, updated.tx2, updated.tx3, updated.gk, updated.ck);
    const rank = calculateRank(dtb);

    updated.dtb = dtb;
    updated.rank = rank;

    setLocalScores((prev) => ({
      ...prev,
      [studentId]: updated,
    }));
  };

  const handleSaveAll = () => {
    Object.entries(localScores).forEach(([studentId, scores]) => {
      onUpdateScores(studentId, scores);
    });
    setIsEditMode(false);
    setSaveSuccessMessage('Đã lưu bảng điểm thành công!');
    setTimeout(() => setSaveSuccessMessage(''), 3000);
  };

  const exportGradesCSV = () => {
    const headers = ['STT,Họ và tên,Lớp,TX 1,TX 2,TX 3,Giữa kỳ (GK),Cuối kỳ (CK),ĐTB Môn,Xếp loại'];
    const rows = classStudents.map((s, idx) => {
      const sc = localScores[s.id] || s.scores;
      return `"${idx + 1}","${s.name}","${s.className}","${sc.tx1 ?? ''}","${sc.tx2 ?? ''}","${sc.tx3 ?? ''}","${sc.gk ?? ''}","${sc.ck ?? ''}","${sc.dtb ?? ''}","${sc.rank ?? ''}"`;
    });
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Bang_diem_mon_Toan_Lop_${selectedClass}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* Top Controller Bar */}
      <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#17324D]">
              Sổ điểm điện tử
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EAF4FF] text-[#0066CC]">
              Thông tư 22/BGDĐT
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Môn Toán THPT · Học kỳ I · Năm học 2026 - 2027
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Class Selector */}
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setIsEditMode(false);
            }}
            className="px-3.5 py-2 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs font-bold text-[#17324D] focus:ring-2 focus:ring-[#0066CC] outline-none"
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

          {/* Toggle Edit Mode */}
          {isEditMode ? (
            <button
              onClick={handleSaveAll}
              className="px-4 py-2 bg-[#16A34A] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Lưu bảng điểm</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditMode(true)}
              className="px-4 py-2 bg-[#0066CC] hover:bg-[#004A99] text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>Nhập / Sửa điểm</span>
            </button>
          )}

          <button
            onClick={exportGradesCSV}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Xuất Excel</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            title="In bảng điểm"
          >
            <Printer className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {saveSuccessMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* Grade Calculation Formula Reference Note */}
      <div className="p-3 bg-[#EAF4FF]/70 border border-blue-200/80 rounded-2xl flex items-center justify-between text-xs text-[#004A99]">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#0066CC] shrink-0" />
          <span>
            <b>Quy chế tính điểm ĐTB Môn:</b> ĐTB = (Tổng TX + 2×GK + 3×CK) / (Số bài TX + 5). Điểm số tự động làm tròn đến 1 chữ số thập phân.
          </span>
        </div>
        {isEditMode && (
          <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full animate-pulse">
            Chế độ chỉnh sửa đang bật
          </span>
        )}
      </div>

      {/* Grades Table */}
      <div className="bg-white rounded-3xl border border-blue-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F9FF] text-[#17324D] font-bold border-b border-blue-100 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">STT</th>
                <th className="py-3.5 px-4">Họ và tên</th>
                <th className="py-3.5 px-3 text-center bg-slate-50/50">TX 1 (x1)</th>
                <th className="py-3.5 px-3 text-center bg-slate-50/50">TX 2 (x1)</th>
                <th className="py-3.5 px-3 text-center bg-slate-50/50">TX 3 (x1)</th>
                <th className="py-3.5 px-3 text-center bg-blue-50/60 text-[#0066CC]">Giữa kỳ (x2)</th>
                <th className="py-3.5 px-3 text-center bg-blue-50/80 text-[#004A99]">Cuối kỳ (x3)</th>
                <th className="py-3.5 px-4 text-center bg-[#EAF4FF] text-[#004A99] font-bold">
                  ĐTB Môn
                </th>
                <th className="py-3.5 px-3 text-center">Xếp loại</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.map((st, idx) => {
                const sc = localScores[st.id] || st.scores;

                return (
                  <tr key={st.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3 px-4 text-center font-mono font-medium text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => onSelectStudent(st)}
                        className="font-bold text-[#17324D] hover:text-[#0066CC] text-left hover:underline cursor-pointer"
                      >
                        {st.name}
                      </button>
                    </td>

                    {/* TX 1 */}
                    <td className="py-2 px-2 text-center bg-slate-50/30">
                      {isEditMode ? (
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={sc.tx1 ?? ''}
                          onChange={(e) => handleScoreChange(st.id, 'tx1', e.target.value)}
                          className="w-14 text-center py-1 bg-white border border-blue-300 rounded font-mono font-bold text-xs focus:ring-2 focus:ring-[#0066CC] outline-none"
                        />
                      ) : (
                        <span className="font-mono font-semibold text-slate-700">
                          {sc.tx1 !== null ? sc.tx1.toFixed(1) : '--'}
                        </span>
                      )}
                    </td>

                    {/* TX 2 */}
                    <td className="py-2 px-2 text-center bg-slate-50/30">
                      {isEditMode ? (
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={sc.tx2 ?? ''}
                          onChange={(e) => handleScoreChange(st.id, 'tx2', e.target.value)}
                          className="w-14 text-center py-1 bg-white border border-blue-300 rounded font-mono font-bold text-xs focus:ring-2 focus:ring-[#0066CC] outline-none"
                        />
                      ) : (
                        <span className="font-mono font-semibold text-slate-700">
                          {sc.tx2 !== null ? sc.tx2.toFixed(1) : '--'}
                        </span>
                      )}
                    </td>

                    {/* TX 3 */}
                    <td className="py-2 px-2 text-center bg-slate-50/30">
                      {isEditMode ? (
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={sc.tx3 ?? ''}
                          onChange={(e) => handleScoreChange(st.id, 'tx3', e.target.value)}
                          className="w-14 text-center py-1 bg-white border border-blue-300 rounded font-mono font-bold text-xs focus:ring-2 focus:ring-[#0066CC] outline-none"
                        />
                      ) : (
                        <span className="font-mono font-semibold text-slate-700">
                          {sc.tx3 !== null ? sc.tx3.toFixed(1) : '--'}
                        </span>
                      )}
                    </td>

                    {/* GK (x2) */}
                    <td className="py-2 px-2 text-center bg-blue-50/30">
                      {isEditMode ? (
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={sc.gk ?? ''}
                          onChange={(e) => handleScoreChange(st.id, 'gk', e.target.value)}
                          className="w-14 text-center py-1 bg-white border border-[#0066CC] rounded font-mono font-bold text-[#0066CC] text-xs focus:ring-2 focus:ring-[#0066CC] outline-none"
                        />
                      ) : (
                        <span className="font-mono font-bold text-[#0066CC]">
                          {sc.gk !== null ? sc.gk.toFixed(1) : '--'}
                        </span>
                      )}
                    </td>

                    {/* CK (x3) */}
                    <td className="py-2 px-2 text-center bg-blue-50/50">
                      {isEditMode ? (
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={sc.ck ?? ''}
                          onChange={(e) => handleScoreChange(st.id, 'ck', e.target.value)}
                          className="w-14 text-center py-1 bg-white border border-[#004A99] rounded font-mono font-bold text-[#004A99] text-xs focus:ring-2 focus:ring-[#004A99] outline-none"
                        />
                      ) : (
                        <span className="font-mono font-bold text-[#004A99]">
                          {sc.ck !== null ? sc.ck.toFixed(1) : '--'}
                        </span>
                      )}
                    </td>

                    {/* DTB */}
                    <td className="py-3 px-4 text-center bg-[#EAF4FF] font-mono font-bold text-sm text-[#004A99]">
                      {sc.dtb !== null ? sc.dtb.toFixed(1) : '--'}
                    </td>

                    {/* Rank */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          sc.rank === 'Xuất sắc'
                            ? 'bg-purple-100 text-purple-800'
                            : sc.rank === 'Giỏi'
                            ? 'bg-emerald-100 text-emerald-800'
                            : sc.rank === 'Khá'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {sc.rank || 'Chưa đạt'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-[#F5F9FF] border-t border-blue-100 flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] gap-2">
          <span>
            Sĩ số lớp <b>{selectedClass}</b>: {classStudents.length} học sinh
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-500" /> Xuất sắc
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Giỏi
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> Khá
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Đạt
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
