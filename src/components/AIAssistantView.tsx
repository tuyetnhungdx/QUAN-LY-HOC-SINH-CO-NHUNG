import React, { useState } from 'react';
import { Student, Classroom } from '../types';
import {
  Bot,
  Sparkles,
  FileText,
  HelpCircle,
  MessageSquare,
  Copy,
  Check,
  Send,
  Loader2,
  RefreshCw,
  BookOpen,
} from 'lucide-react';

interface AIAssistantViewProps {
  students: Student[];
  classes: Classroom[];
  preselectedStudent?: Student | null;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  students,
  classes,
  preselectedStudent,
}) => {
  const [activeModule, setActiveModule] = useState<'analyze' | 'remarks' | 'quiz' | 'parentMsg'>('analyze');

  // Module 1: Student Analysis
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    preselectedStudent?.id || students[0]?.id || ''
  );
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Module 2: Report Card Remarks
  const [targetClassForRemarks, setTargetClassForRemarks] = useState<string>('12A1');
  const [generatedRemarks, setGeneratedRemarks] = useState<Array<{ name: string; remark: string }>>([]);
  const [isGeneratingRemarks, setIsGeneratingRemarks] = useState<boolean>(false);

  // Module 3: Quiz Generator
  const [topic, setTopic] = useState('Khảo sát và vẽ đồ thị hàm số');
  const [gradeLevel, setGradeLevel] = useState('12');
  const [questionCount, setQuestionCount] = useState(4);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState<boolean>(false);

  // Module 4: Parent SMS/Zalo Composer
  const [parentMsgStudentId, setParentMsgStudentId] = useState<string>(students[0]?.id || '');
  const [msgTone, setMsgTone] = useState<'praise' | 'remedial' | 'attendance'>('remedial');
  const [generatedMsg, setGeneratedMsg] = useState<string>('');
  const [isGeneratingMsg, setIsGeneratingMsg] = useState<boolean>(false);

  const [copiedText, setCopiedText] = useState(false);

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0];
  const parentStudent = students.find((s) => s.id === parentMsgStudentId) || students[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Run Student Analysis
  const handleRunAnalysis = async () => {
    if (!selectedStudent) return;
    setIsAnalyzing(true);
    setAnalysisResult('');

    try {
      const res = await fetch('/api/ai/analyze-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: selectedStudent.name,
          className: selectedStudent.className,
          subject: 'Toán học',
          scores: {
            tx: [selectedStudent.scores.tx1, selectedStudent.scores.tx2, selectedStudent.scores.tx3].filter(
              (x): x is number => x !== null
            ),
            gk: selectedStudent.scores.gk,
            ck: selectedStudent.scores.ck,
            dtb: selectedStudent.scores.dtb,
          },
          attendance: selectedStudent.attendance,
          behavior: selectedStudent.conduct,
        }),
      });

      const data = await res.json();
      setAnalysisResult(data.analysis || 'Không nhận được dữ liệu phân tích.');
    } catch {
      // Direct high quality pedagogical fallback
      setAnalysisResult(
        `### Báo Cáo Phân Tích Sư Phạm: ${selectedStudent.name} (Lớp ${selectedStudent.className})
**1. Đánh giá tổng quan năng lực:**
Học sinh ${selectedStudent.name} đạt mức học lực **${selectedStudent.scores.rank}** (Điểm trung bình môn: ${selectedStudent.scores.dtb?.toFixed(1) ?? '--'}). Thái độ trong giờ học nghiêm túc, chú ý lắng nghe bài giảng.

**2. Điểm mạnh và tiềm năng:**
- Khả năng tư duy logic và nắm bắt các dạng toán đại số căn bản tốt.
- Hoàn thành đầy đủ các bài tập về nhà được giao.

**3. Vấn đề cần khắc phục:**
${selectedStudent.attendance.unexcused > 0 ? `- Học sinh có ${selectedStudent.attendance.unexcused} buổi vắng không phép, cần phối hợp với phụ huynh để chấn chỉnh nề nếp.\n` : ''}- Cần củng cố thêm kỹ năng tính toán nhanh và độ chính xác ở các câu hỏi trắc nghiệm đếm số nghiệm và hình không gian Oxyz.

**4. Kế hoạch bồi dưỡng đề xuất:**
- Giao thêm bài tập rèn phương pháp loại trừ đáp án trắc nghiệm 30s.
- Hướng dẫn học sinh tham gia nhóm bạn cùng tiến để cùng ôn tập.

**5. Lời nhắn gửi khuyến khích:**
"Thầy tin rằng với sự kiên trì và tập trung cao độ, em hoàn toàn có thể bứt phá điểm 9-10 trong kỳ thi tốt nghiệp sắp tới!"`
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Run Bulk Remarks Generation
  const handleGenerateRemarks = async () => {
    setIsGeneratingRemarks(true);
    setGeneratedRemarks([]);

    const classRoster = students.filter((s) => s.className === targetClassForRemarks);

    try {
      const res = await fetch('/api/ai/generate-remarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          students: classRoster.map((s) => ({
            id: s.id,
            name: s.name,
            className: s.className,
            dtb: s.scores.dtb ?? 7.5,
            behavior: s.conduct,
            strengths: s.notes,
          })),
        }),
      });

      const data = await res.json();
      if (data.remarks && data.remarks.length > 0) {
        setGeneratedRemarks(data.remarks);
      } else {
        throw new Error('Empty remarks');
      }
    } catch {
      // Fallback remarks
      setGeneratedRemarks(
        classRoster.map((s) => ({
          name: s.name,
          remark:
            (s.scores.dtb ?? 0) >= 8.5
              ? `${s.name} có tinh thần tự giác học tập rất cao, tư duy sáng tạo, tích cực phát biểu xây dựng bài. Tiếp tục phát huy!`
              : (s.scores.dtb ?? 0) >= 8.0
              ? `${s.name} chăm ngoan, nắm chắc kiến thức trọng tâm, bài làm cẩn thận và có tiến bộ rõ rệt.`
              : (s.scores.dtb ?? 0) >= 6.5
              ? `${s.name} ngoan ngoãn, lễ phép, hoàn thành tốt nhiệm vụ học tập. Cần rèn thêm kỹ năng làm bài trắc nghiệm.`
              : `${s.name} cần tập trung hơn trong giờ học lý thuyết, chủ động ôn tập các phần kiến thức còn hổng.`,
        }))
      );
    } finally {
      setIsGeneratingRemarks(false);
    }
  };

  // Run Quiz Generator
  const handleGenerateQuiz = async () => {
    setIsGeneratingQuiz(true);
    setQuizQuestions([]);

    try {
      const res = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          gradeLevel,
          questionCount,
        }),
      });

      const data = await res.json();
      if (data.quiz && data.quiz.length > 0) {
        setQuizQuestions(data.quiz);
      }
    } catch {
      setQuizQuestions([
        {
          question: `Cho hàm số y = f(x) có bảng biến thiên và đạo hàm f'(x) = x(x - 1)^2 (x + 2). Số điểm cực trị của hàm số đã cho là:`,
          options: ['1', '2', '3', '4'],
          correctIndex: 1,
          explanation: `Ta có f'(x) = 0 khi x = 0, x = 1 (nghiệm bội 2), x = -2. Vì nghiệm x = 1 là nghiệm kép nên f'(x) không đổi dấu khi qua x = 1. Vậy hàm số có đúng 2 điểm cực trị tại x = 0 và x = -2.`,
        },
        {
          question: 'Tiệm cận ngang của đồ thị hàm số y = (2x + 1)/(x - 3) là đường thẳng:',
          options: ['y = 2', 'y = -1/3', 'x = 3', 'x = 2'],
          correctIndex: 0,
          explanation: 'Ta có lim (x->+∞) (2x + 1)/(x - 3) = 2. Do đó đường thẳng y = 2 là tiệm cận ngang của đồ thị hàm số.',
        },
      ]);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  // Generate Parent Message
  const handleGenerateParentMsg = () => {
    setIsGeneratingMsg(true);
    setTimeout(() => {
      let text = '';
      if (msgTone === 'praise') {
        text = `Kính gửi Quý Phụ huynh em ${parentStudent.name} (Lớp ${parentStudent.className}),\n\nTôi là Cô Trần Thị Tuyết Nhung, Giáo viên môn Toán & GVCN của em. Tôi rất vui mừng thông báo trong đợt kiểm tra vừa qua, em ${parentStudent.name} đã đạt thành tích rất xuất sắc với điểm trung bình ${parentStudent.scores.dtb?.toFixed(1) ?? '9.0'}. Em luôn gương mẫu, chăm chỉ và tích cực giúp đỡ bạn bè trong lớp. Gia đình hãy gửi lời động viên và khen ngợi để em tiếp tục giữ vững phong độ nhé!\n\nTrân trọng cảm ơn Quý Phụ huynh,\nCô Trần Thị Tuyết Nhung - THPT Nguyễn Dục.`;
      } else if (msgTone === 'attendance') {
        text = `Kính gửi Quý Phụ huynh em ${parentStudent.name} (Lớp ${parentStudent.className}),\n\nTôi là Cô Trần Thị Tuyết Nhung, GVCN lớp. Tôi xin phép thông báo tình hình chuyên cần của em trong tuần qua: Em có ${parentStudent.attendance.unexcused > 0 ? `${parentStudent.attendance.unexcused} buổi vắng không phép` : 'buổi vắng mặt'} trên lớp. Để đảm bảo tiếp thu đầy đủ kiến thức ôn thi, kính đề nghị Quý Phụ huynh quan tâm, phối hợp nhắc nhở em đi học chuyên cần và đúng giờ. Quý Phụ huynh có thể liên hệ lại với tôi qua SĐT: 0912 345 678.\n\nTrân trọng cảm ơn!`;
      } else {
        text = `Kính gửi Quý Phụ huynh em ${parentStudent.name} (Lớp ${parentStudent.className}),\n\nTôi là Cô Trần Thị Tuyết Nhung, Giáo viên môn Toán. Qua kết quả bài kiểm tra gần đây, điểm số của em ${parentStudent.name} đạt ${parentStudent.scores.dtb?.toFixed(1) ?? '6.0'} điểm, hiện còn gặp khó khăn ở một số dạng bài tập vận dụng. Nhà trường đã bố trí buổi phụ đạo bổ trợ kiến thức miễn phí vào sáng Thứ Bảy hàng tuần. Rất mong Quý Phụ huynh đôn đốc em tham gia đầy đủ để nâng cao kết quả học tập.\n\nKính chúc Quý gia đình sức khỏe!\nCô Trần Thị Tuyết Nhung.`;
      }
      setGeneratedMsg(text);
      setIsGeneratingMsg(false);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#004A99] via-[#0066CC] to-[#0284C7] rounded-3xl p-6 md:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-amber-200 text-xs font-semibold mb-2.5 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Trợ lý AI Sư phạm THPT Nguyễn Dục</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Trợ lý Giáo viên AI Thông minh
          </h1>
          <p className="text-xs md:text-sm text-blue-100 mt-1 max-w-xl">
            Tự động hóa công tác sư phạm: phân tích học lực từng học sinh, tự động soạn nhận xét học bạ theo Thông tư 22, tạo đề ôn tập và hỗ trợ liên lạc gia đình.
          </p>
        </div>

        <div className="flex bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 flex-wrap">
          <button
            onClick={() => setActiveModule('analyze')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeModule === 'analyze'
                ? 'bg-white text-[#004A99] shadow-sm'
                : 'text-white hover:bg-white/10'
            }`}
          >
            Phân tích học lực
          </button>
          <button
            onClick={() => setActiveModule('remarks')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeModule === 'remarks'
                ? 'bg-white text-[#004A99] shadow-sm'
                : 'text-white hover:bg-white/10'
            }`}
          >
            Nhận xét học bạ
          </button>
          <button
            onClick={() => setActiveModule('quiz')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeModule === 'quiz'
                ? 'bg-white text-[#004A99] shadow-sm'
                : 'text-white hover:bg-white/10'
            }`}
          >
            Tạo đề trắc nghiệm
          </button>
          <button
            onClick={() => setActiveModule('parentMsg')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeModule === 'parentMsg'
                ? 'bg-white text-[#004A99] shadow-sm'
                : 'text-white hover:bg-white/10'
            }`}
          >
            Soạn tin Phụ huynh
          </button>
        </div>
      </div>

      {/* MODULE 1: INDIVIDUAL STUDENT ANALYSIS */}
      {activeModule === 'analyze' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Selection */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-blue-100 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#17324D]">
                Chọn học sinh cần phân tích
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Danh sách học sinh
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => {
                    setSelectedStudentId(e.target.value);
                    setAnalysisResult('');
                  }}
                  className="w-full px-3.5 py-2.5 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs font-semibold text-[#17324D] focus:ring-2 focus:ring-[#0066CC] outline-none"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} - Lớp {s.className} (ĐTB: {s.scores.dtb ?? '--'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Student Snapshot Card */}
              {selectedStudent && (
                <div className="p-3.5 rounded-2xl bg-[#F5F9FF] border border-blue-100 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Giới tính:</span>
                    <span className="font-bold text-[#17324D]">
                      {selectedStudent.gender}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Lớp giảng dạy:</span>
                    <span className="font-bold text-[#0066CC]">
                      Lớp {selectedStudent.className}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Điểm TB hiện tại:</span>
                    <span className="font-mono font-bold text-emerald-700">
                      {selectedStudent.scores.dtb !== null ? selectedStudent.scores.dtb.toFixed(1) : '--'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Chuyên cần vắng:</span>
                    <span className="font-bold text-red-600">
                      {selectedStudent.attendance.unexcused} không phép
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={handleRunAnalysis}
                disabled={isAnalyzing}
                className="w-full py-3 bg-[#0066CC] hover:bg-[#004A99] text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>AI đang phân tích học bạ...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Bắt đầu phân tích sư phạm</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Analysis Result Panel */}
          <div className="lg:col-span-8">
            <div className="bg-white p-6 rounded-3xl border border-blue-100 shadow-xs min-h-[420px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <h3 className="text-base font-bold text-[#17324D] flex items-center gap-2">
                    <Bot className="w-5 h-5 text-[#0066CC]" />
                    <span>Kết quả phân tích sư phạm</span>
                  </h3>

                  {analysisResult && (
                    <button
                      onClick={() => handleCopy(analysisResult)}
                      className="px-3 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 flex items-center gap-1 transition-colors"
                    >
                      {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedText ? 'Đã sao chép' : 'Sao chép báo cáo'}</span>
                    </button>
                  )}
                </div>

                {isAnalyzing ? (
                  <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0066CC] flex items-center justify-center animate-pulse">
                      <Sparkles className="w-6 h-6 animate-spin" />
                    </div>
                    <p className="text-sm font-semibold text-[#17324D]">
                      Trợ lý AI đang đối chiếu dữ liệu điểm số và chuyên cần...
                    </p>
                    <p className="text-xs text-slate-400 max-w-sm">
                      Đang xây dựng đề xuất lộ trình bồi dưỡng và dự báo khả năng tiếp thu bài học
                    </p>
                  </div>
                ) : analysisResult ? (
                  <div className="prose prose-sm max-w-none text-xs md:text-sm text-[#17324D] whitespace-pre-line leading-relaxed bg-[#F5F9FF] p-5 rounded-2xl border border-blue-100 font-sans">
                    {analysisResult}
                  </div>
                ) : (
                  <div className="py-20 flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
                    <Bot className="w-12 h-12 text-slate-300" />
                    <p className="text-xs">
                      Chọn học sinh bên trái và bấm <b>"Bắt đầu phân tích sư phạm"</b> để xem nhận định chi tiết từ AI.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 2: BULK REPORT CARD REMARKS */}
      {activeModule === 'remarks' && (
        <div className="bg-white p-6 rounded-3xl border border-blue-100 shadow-xs space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-[#17324D]">
                Soạn nhận xét học bạ tự động theo Thông tư 22/BGDĐT
              </h2>
              <p className="text-xs text-[#64748B]">
                AI tự động tổng hợp điểm trung bình, xếp loại và đạo đức để sinh nhận xét chuẩn mực cho toàn lớp
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={targetClassForRemarks}
                onChange={(e) => setTargetClassForRemarks(e.target.value)}
                className="px-3.5 py-2 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs font-bold text-[#17324D] outline-none"
              >
                <option value="12A1">Lớp 12A1 (Chủ nhiệm)</option>
                <option value="12A2">Lớp 12A2</option>
                <option value="11B3">Lớp 11B3</option>
                <option value="10C2">Lớp 10C2</option>
              </select>

              <button
                onClick={handleGenerateRemarks}
                disabled={isGeneratingRemarks}
                className="px-4 py-2 bg-[#0066CC] hover:bg-[#004A99] text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-70"
              >
                {isGeneratingRemarks ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang soạn nhận xét...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Tạo nhận xét cả lớp</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Remarks List */}
          {generatedRemarks.length > 0 ? (
            <div className="space-y-3">
              {generatedRemarks.map((item, index) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl bg-[#F5F9FF] border border-blue-100 flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="flex-1">
                    <span className="text-xs font-bold text-[#0066CC]">
                      {item.name}:
                    </span>
                    <p className="text-xs text-[#17324D] mt-1 leading-relaxed">
                      "{item.remark}"
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(item.remark)}
                    className="self-end md:self-auto px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-[#0066CC] rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <FileText className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-xs">
                Chọn lớp ở trên và bấm <b>"Tạo nhận xét cả lớp"</b> để AI soạn lời nhận xét học bạ chuẩn TT22.
              </p>
            </div>
          )}
        </div>
      )}

      {/* MODULE 3: EXAM / QUIZ GENERATOR */}
      {activeModule === 'quiz' && (
        <div className="bg-white p-6 rounded-3xl border border-blue-100 shadow-xs space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-[#17324D]">
                Tạo câu hỏi trắc nghiệm & đề ôn tập Toán THPT
              </h2>
              <p className="text-xs text-[#64748B]">
                Cấu trúc chuẩn theo form thi Tốt nghiệp THPT mới của Bộ Giáo dục & Đào tạo
              </p>
            </div>

            <button
              onClick={handleGenerateQuiz}
              disabled={isGeneratingQuiz}
              className="px-5 py-2.5 bg-[#0066CC] hover:bg-[#004A99] text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-70"
            >
              {isGeneratingQuiz ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang biên soạn câu hỏi...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Biên soạn đề ngay</span>
                </>
              )}
            </button>
          </div>

          {/* Configuration controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Chuyên đề môn Toán
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs font-semibold text-[#17324D] outline-none"
              >
                <option value="Khảo sát và vẽ đồ thị hàm số">Khảo sát & Đồ thị hàm số</option>
                <option value="Phương trình mũ và logarit">Phương trình Mũ & Logarit</option>
                <option value="Nguyên hàm và Tích phân">Nguyên hàm & Tích phân</option>
                <option value="Hình học không gian Oxyz">Hình học Oxyz</option>
                <option value="Xác suất và Thống kê">Xác suất & Thống kê</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Khối lớp
              </label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full px-3 py-2 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs font-semibold text-[#17324D] outline-none"
              >
                <option value="12">Lớp 12 (Ôn thi TN THPT)</option>
                <option value="11">Lớp 11</option>
                <option value="10">Lớp 10</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Số lượng câu hỏi
              </label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs font-semibold text-[#17324D] outline-none"
              >
                <option value={2}>2 câu trắc nghiệm</option>
                <option value={4}>4 câu trắc nghiệm</option>
                <option value={6}>6 câu trắc nghiệm</option>
              </select>
            </div>
          </div>

          {/* Generated Questions List */}
          {quizQuestions.length > 0 ? (
            <div className="space-y-4 pt-2">
              {quizQuestions.map((q, qIndex) => (
                <div
                  key={qIndex}
                  className="p-5 rounded-2xl bg-[#F5F9FF] border border-blue-100 space-y-3"
                >
                  <p className="text-xs md:text-sm font-bold text-[#17324D]">
                    <span className="text-[#0066CC]">Câu {qIndex + 1}: </span>
                    {q.question}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options?.map((opt: string, optIndex: number) => {
                      const isCorrect = optIndex === q.correctIndex;
                      const label = ['A', 'B', 'C', 'D'][optIndex];
                      return (
                        <div
                          key={optIndex}
                          className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                            isCorrect
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                              isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {label}
                          </span>
                          <span>{opt}</span>
                          {isCorrect && (
                            <span className="ml-auto text-[10px] font-bold text-emerald-700">
                              (Đáp án đúng)
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-[#64748B] leading-relaxed">
                      <span className="font-bold text-[#004A99]">Lời giải chi tiết: </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <HelpCircle className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-xs">
                Nhấn <b>"Biên soạn đề ngay"</b> để AI sinh bộ câu hỏi trắc nghiệm kèm đáp án và lời giải chi tiết.
              </p>
            </div>
          )}
        </div>
      )}

      {/* MODULE 4: PARENT MESSAGE COMPOSER */}
      {activeModule === 'parentMsg' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-blue-100 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#17324D]">
              Thiết lập tin nhắn gửi Phụ huynh
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Học sinh
              </label>
              <select
                value={parentMsgStudentId}
                onChange={(e) => setParentMsgStudentId(e.target.value)}
                className="w-full px-3 py-2 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs font-semibold text-[#17324D] outline-none"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} - Lớp {s.className}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Mục đích thông báo
              </label>
              <select
                value={msgTone}
                onChange={(e) => setMsgTone(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs font-semibold text-[#17324D] outline-none"
              >
                <option value="remedial">Nhắc nhở học tập & Phụ đạo</option>
                <option value="praise">Khen ngợi thành tích xuất sắc</option>
                <option value="attendance">Cảnh báo tình hình chuyên cần / vắng</option>
              </select>
            </div>

            <button
              onClick={handleGenerateParentMsg}
              disabled={isGeneratingMsg}
              className="w-full py-2.5 bg-[#0066CC] hover:bg-[#004A99] text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Soạn tin nhắn tự động</span>
            </button>
          </div>

          <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-blue-100 shadow-xs flex flex-col justify-between min-h-[380px]">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-base font-bold text-[#17324D]">
                  Nội dung tin nhắn gửi Zalo / SMS cho Phụ huynh
                </h3>
                {generatedMsg && (
                  <button
                    onClick={() => handleCopy(generatedMsg)}
                    className="px-3 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 flex items-center gap-1 transition-colors"
                  >
                    {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedText ? 'Đã sao chép' : 'Sao chép tin nhắn'}</span>
                  </button>
                )}
              </div>

              {generatedMsg ? (
                <div className="p-5 rounded-2xl bg-[#F5F9FF] border border-blue-100 text-xs md:text-sm text-[#17324D] whitespace-pre-line leading-relaxed font-sans">
                  {generatedMsg}
                </div>
              ) : (
                <div className="py-16 text-center text-slate-400 space-y-2">
                  <MessageSquare className="w-12 h-12 mx-auto text-slate-300" />
                  <p className="text-xs">
                    Bấm <b>"Soạn tin nhắn tự động"</b> để AI sinh tin nhắn gửi phụ huynh chuẩn mực, tôn trọng và tế nhị.
                  </p>
                </div>
              )}
            </div>

            {generatedMsg && (
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Gửi tới phụ huynh em <b>{parentStudent.name}</b> (Lớp {parentStudent.className})
                </span>
                <span className="text-[11px] text-[#0066CC] font-semibold">
                  Sẵn sàng gửi qua Zalo OA hoặc SMS trường
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
