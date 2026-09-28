import React, { useState } from 'react';
import { StudyMaterial } from '../types';
import {
  FolderOpen,
  FileText,
  Video,
  FileCheck2,
  Download,
  Upload,
  Play,
  Search,
  ExternalLink,
  Plus,
  Link2,
  Copy,
  Check,
  CheckCircle2,
  Globe,
} from 'lucide-react';

interface MaterialsViewProps {
  materials: StudyMaterial[];
  onAddMaterial: (mat: StudyMaterial) => void;
}

export const MaterialsView: React.FC<MaterialsViewProps> = ({
  materials,
  onAddMaterial,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'document' | 'video' | 'exam' | 'link'>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [previewVideo, setPreviewVideo] = useState<StudyMaterial | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string>('');

  // Upload form state
  const [newTitle, setNewTitle] = useState('');
  const [newGrade, setNewGrade] = useState<'10' | '11' | '12'>('12');
  const [newCat, setNewCat] = useState<'document' | 'video' | 'exam' | 'link'>('document');
  const [newUrl, setNewUrl] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const filtered = materials.filter((m) => {
    const matchCat = activeCategory === 'all' || m.category === activeCategory;
    const matchGrade = selectedGrade === 'all' || m.grade === selectedGrade;
    const matchSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.url && m.url.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchGrade && matchSearch;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    let formattedUrl = newUrl.trim();
    if (newCat === 'link' && formattedUrl && !formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const newMaterial: StudyMaterial = {
      id: `mat_${Date.now()}`,
      title: newTitle.trim(),
      grade: newGrade,
      subject: 'Toán học',
      category: newCat,
      fileSize: newCat === 'document' || newCat === 'exam' ? '3.2 MB (PDF)' : undefined,
      duration: newCat === 'video' ? '25 phút' : undefined,
      url: formattedUrl || (newCat === 'link' ? 'https://azota.vn' : undefined),
      uploadDate: new Date().toISOString().split('T')[0],
      downloadCount: 1,
      description: newDesc.trim() || (newCat === 'link' ? 'Link ôn tập bổ trợ kiến thức môn Toán cho học sinh.' : 'Tài liệu do giáo viên biên soạn cho học sinh THPT Nguyễn Dục.'),
    };

    onAddMaterial(newMaterial);
    setIsUploadOpen(false);
    showToast(newCat === 'link' ? 'Đã thêm Link ôn tập thành công!' : 'Đã tải lên học liệu mới thành công!');
    setNewTitle('');
    setNewUrl('');
    setNewDesc('');
  };

  const handleCopyLink = (mat: StudyMaterial) => {
    const linkToCopy = mat.url || window.location.href;
    navigator.clipboard.writeText(linkToCopy);
    setCopiedId(mat.id);
    showToast('Đã sao chép link ôn tập vào bộ nhớ tạm!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-5">
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
          <h1 className="text-xl font-bold text-[#17324D]">
            Tài liệu & Video Học liệu số
          </h1>
          <p className="text-xs text-[#64748B]">
            Kho lưu trữ đề thi, giáo án điện tử, bài giảng và link ôn tập trực tuyến môn Toán THPT Nguyễn Dục
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setNewCat('link');
              setIsUploadOpen(true);
            }}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Link2 className="w-4 h-4" />
            <span>+ Thêm Link ôn tập</span>
          </button>

          <button
            onClick={() => {
              setNewCat('document');
              setIsUploadOpen(true);
            }}
            className="px-3.5 py-2 bg-[#0066CC] hover:bg-[#004A99] text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Tải lên tài liệu</span>
          </button>
        </div>
      </div>

      {/* Filter and Category Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-blue-100 shadow-xs">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-[#0066CC] text-white'
                : 'bg-[#F5F9FF] text-slate-700 hover:bg-blue-50'
            }`}
          >
            Tất cả học liệu
          </button>

          <button
            onClick={() => setActiveCategory('document')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'document'
                ? 'bg-[#0066CC] text-white'
                : 'bg-[#F5F9FF] text-slate-700 hover:bg-blue-50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Tài liệu & Chuyên đề</span>
          </button>

          <button
            onClick={() => setActiveCategory('video')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'video'
                ? 'bg-[#0066CC] text-white'
                : 'bg-[#F5F9FF] text-slate-700 hover:bg-blue-50'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Video bài giảng</span>
          </button>

          <button
            onClick={() => setActiveCategory('exam')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'exam'
                ? 'bg-[#0066CC] text-white'
                : 'bg-[#F5F9FF] text-slate-700 hover:bg-blue-50'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Đề thi thử</span>
          </button>

          {/* Tab Link ôn tập */}
          <button
            onClick={() => setActiveCategory('link')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'link'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <Link2 className="w-3.5 h-3.5 text-current" />
            <span>Link ôn tập</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-mono">
              {materials.filter((m) => m.category === 'link').length}
            </span>
          </button>
        </div>

        {/* Right filters */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tài liệu, link ôn tập..."
              className="pl-8 pr-3 py-1.5 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs text-[#17324D] outline-none"
            />
          </div>

          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-3 py-1.5 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs font-medium text-[#17324D] outline-none"
          >
            <option value="all">Tất cả khối</option>
            <option value="12">Khối 12</option>
            <option value="11">Khối 11</option>
            <option value="10">Khối 10</option>
          </select>
        </div>
      </div>

      {/* Materials Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((mat) => (
            <div
              key={mat.id}
              className={`bg-white p-5 rounded-3xl border shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between ${
                mat.category === 'link' ? 'border-emerald-200 hover:border-emerald-300' : 'border-blue-100'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      mat.category === 'link'
                        ? 'bg-emerald-100 text-emerald-800'
                        : mat.category === 'video'
                        ? 'bg-rose-100 text-rose-800'
                        : mat.category === 'exam'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-[#0066CC]'
                    }`}
                  >
                    {mat.category === 'link' ? (
                      <>
                        <Link2 className="w-3 h-3" /> Link ôn tập
                      </>
                    ) : mat.category === 'video' ? (
                      <>
                        <Video className="w-3 h-3" /> Video bài giảng
                      </>
                    ) : mat.category === 'exam' ? (
                      <>
                        <FileCheck2 className="w-3 h-3" /> Đề thi
                      </>
                    ) : (
                      <>
                        <FileText className="w-3 h-3" /> Tài liệu
                      </>
                    )}
                  </span>

                  <span className="text-[11px] font-bold px-2 py-0.5 bg-slate-100 rounded-md text-slate-700">
                    Lớp {mat.grade}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#17324D] leading-snug line-clamp-2">
                  {mat.title}
                </h3>

                <p className="text-xs text-[#64748B] mt-2 line-clamp-3 leading-relaxed">
                  {mat.description}
                </p>

                {/* If it's a Link, show the URL domain badge */}
                {mat.category === 'link' && mat.url && (
                  <div className="mt-3 p-2 bg-emerald-50/70 rounded-xl border border-emerald-100 flex items-center gap-1.5 text-[11px] text-emerald-800 font-mono overflow-hidden">
                    <Globe className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="truncate">{mat.url}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400 font-mono">
                  {mat.category === 'link'
                    ? `${mat.downloadCount} lượt truy cập`
                    : mat.fileSize || mat.duration}
                </span>

                {mat.category === 'link' ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopyLink(mat)}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                      title="Sao chép link gửi cho học sinh"
                    >
                      {copiedId === mat.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Đã chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Chép link</span>
                        </>
                      )}
                    </button>

                    <a
                      href={mat.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <span>Mở link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ) : mat.category === 'video' ? (
                  <button
                    onClick={() => setPreviewVideo(mat)}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Xem video</span>
                  </button>
                ) : (
                  <button
                    onClick={() => alert(`Tải về thành công file: ${mat.title}`)}
                    className="px-3 py-1.5 bg-[#EAF4FF] hover:bg-blue-100 text-[#004A99] rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải về</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-blue-100 p-12 text-center shadow-xs space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Link2 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-[#17324D]">
            {activeCategory === 'link' ? 'Chưa có Link ôn tập nào' : 'Không tìm thấy tài liệu phù hợp'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {activeCategory === 'link'
              ? 'Thầy cô có thể thêm các link đề ôn tập online từ Azota, Google Forms, Quizizz để học sinh làm bài tập.'
              : 'Hãy thử đổi bộ lọc hoặc thêm tài liệu mới vào hệ thống.'}
          </p>
          {activeCategory === 'link' && (
            <button
              onClick={() => {
                setNewCat('link');
                setIsUploadOpen(true);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Link ôn tập mới</span>
            </button>
          )}
        </div>
      )}

      {/* Video Preview Modal */}
      {previewVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-[#17324D]">
                  {previewVideo.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Thời lượng: {previewVideo.duration} · Khối {previewVideo.grade}
                </p>
              </div>
              <button
                onClick={() => setPreviewVideo(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {/* Video Player Mockup Container */}
            <div className="aspect-video bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-white relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
              <div className="w-16 h-16 rounded-full bg-[#0066CC] text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform cursor-pointer">
                <Play className="w-8 h-8 ml-1" />
              </div>
              <p className="text-xs text-slate-300 mt-3 z-10">
                Nhấn để phát video bài giảng trực tuyến
              </p>
            </div>

            <p className="text-xs text-[#64748B] mt-4 leading-relaxed">
              {previewVideo.description}
            </p>
          </div>
        </div>
      )}

      {/* Upload Material & Add Link Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center gap-2.5 mb-1">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                newCat === 'link' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-[#0066CC]'
              }`}>
                {newCat === 'link' ? <Link2 className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-[#17324D]">
                  {newCat === 'link' ? 'Thêm Link ôn tập trực tuyến' : 'Tải lên tài liệu / Video mới'}
                </h3>
                <p className="text-xs text-[#64748B]">
                  {newCat === 'link' ? 'Chia sẻ link làm bài thi online, Google Form, Azota' : 'Chia sẻ học liệu với học sinh THPT Nguyễn Dục'}
                </p>
              </div>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-semibold text-[#17324D] mb-1">
                  Loại học liệu
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewCat('link')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                      newCat === 'link'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                        : 'bg-[#F5F9FF] text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    <span>Link ôn tập</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewCat('document')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                      newCat === 'document'
                        ? 'bg-[#0066CC] text-white border-[#0066CC] shadow-2xs'
                        : 'bg-[#F5F9FF] text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Tài liệu (PDF/Word)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewCat('exam')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                      newCat === 'exam'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                        : 'bg-[#F5F9FF] text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>Đề thi thử</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewCat('video')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                      newCat === 'video'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                        : 'bg-[#F5F9FF] text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Video bài giảng</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17324D] mb-1">
                  Tiêu đề {newCat === 'link' ? 'bài ôn tập' : 'tài liệu'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={
                    newCat === 'link'
                      ? 'VD: Đề trắc nghiệm ôn tập Hàm số 40 câu (Azota)'
                      : 'VD: Đề cương ôn tập kiểm tra giữa kỳ'
                  }
                  className="w-full px-3.5 py-2 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs text-[#17324D] outline-none focus:ring-2 focus:ring-[#0066CC]"
                />
              </div>

              {/* URL input when category is 'link' */}
              {newCat === 'link' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-[#17324D]">
                      Đường dẫn liên kết (Link / URL) <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400">Azota, Google Form, Quizizz...</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://azota.vn/de-thi/... hoặc https://forms.gle/..."
                    className="w-full px-3.5 py-2 bg-[#F5F9FF] border border-emerald-300 rounded-xl text-xs font-mono text-[#17324D] outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {['https://azota.vn/', 'https://forms.gle/', 'https://quizizz.com/', 'https://drive.google.com/'].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setNewUrl(preset)}
                        className="text-[10px] px-2 py-0.5 bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-800 rounded-md font-mono transition-colors"
                      >
                        +{preset.replace('https://', '').replace('/', '')}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#17324D] mb-1">
                    Áp dụng cho khối lớp
                  </label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs text-[#17324D] outline-none"
                  >
                    <option value="12">Khối 12</option>
                    <option value="11">Khối 11</option>
                    <option value="10">Khối 10</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17324D] mb-1">
                    Môn học
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Toán học THPT"
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17324D] mb-1">
                  Mô tả / Hướng dẫn học sinh
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Ghi chú thời gian làm bài, yêu cầu hoàn thành..."
                  className="w-full p-2.5 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs text-[#17324D] outline-none"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-2.5 rounded-xl text-white text-xs font-bold shadow-sm transition-colors cursor-pointer ${
                    newCat === 'link' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-[#0066CC] hover:bg-[#004A99]'
                  }`}
                >
                  {newCat === 'link' ? 'Lưu Link ôn tập' : 'Tải lên ngay'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
