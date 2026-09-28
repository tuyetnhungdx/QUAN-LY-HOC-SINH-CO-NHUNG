import React, { useState } from 'react';
import { Classroom, ReviewLink } from '../types';
import {
  Link2,
  ExternalLink,
  Plus,
  Copy,
  Check,
  Trash2,
  Edit3,
  Search,
  Filter,
  Sparkles,
  FileText,
  Video,
  Globe,
  HelpCircle,
  Pin,
  Calendar,
  Layers,
  GraduationCap,
  RotateCcw,
  CheckCircle2,
  QrCode,
  X,
  Share2,
} from 'lucide-react';
import { initialReviewLinks } from '../data/mockData';

interface ReviewLinksViewProps {
  classes: Classroom[];
  reviewLinks: ReviewLink[];
  onAddReviewLink: (link: ReviewLink) => void;
  onUpdateReviewLink: (link: ReviewLink) => void;
  onDeleteReviewLink: (linkId: string) => void;
  onRestoreDefaultReviewLinks: () => void;
}

export const ReviewLinksView: React.FC<ReviewLinksViewProps> = ({
  classes,
  reviewLinks,
  onAddReviewLink,
  onUpdateReviewLink,
  onDeleteReviewLink,
  onRestoreDefaultReviewLinks,
}) => {
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<ReviewLink | null>(null);
  const [qrModalLink, setQrModalLink] = useState<ReviewLink | null>(null);
  const [deleteConfirmLink, setDeleteConfirmLink] = useState<ReviewLink | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form states for Add / Edit
  const [formTitle, setFormTitle] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formCategory, setFormCategory] = useState<'quiz' | 'document' | 'video' | 'website'>('quiz');
  const [formTargetClass, setFormTargetClass] = useState('all');
  const [formGrade, setFormGrade] = useState<'10' | '11' | '12' | 'all'>('12');
  const [formProvider, setFormProvider] = useState('Azota');
  const [formDescription, setFormDescription] = useState('');
  const [formDeadline, setFormDeadline] = useState('');
  const [formIsPinned, setFormIsPinned] = useState(false);

  // Batch paste state
  const [batchText, setBatchText] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleCopyLink = (link: ReviewLink) => {
    navigator.clipboard.writeText(link.url);
    setCopiedId(link.id);
    showToast(`Đã sao chép liên kết: ${link.title}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Auto-detect provider and category when URL is pasted
  const handleUrlChange = (url: string) => {
    setFormUrl(url);
    const lower = url.toLowerCase();
    if (lower.includes('youtube.com') || lower.includes('youtu.be')) {
      setFormProvider('YouTube');
      setFormCategory('video');
    } else if (lower.includes('azota.vn')) {
      setFormProvider('Azota');
      setFormCategory('quiz');
    } else if (lower.includes('quizizz.com')) {
      setFormProvider('Quizizz');
      setFormCategory('quiz');
    } else if (lower.includes('forms.gle') || lower.includes('docs.google.com/forms')) {
      setFormProvider('Google Forms');
      setFormCategory('quiz');
    } else if (lower.includes('drive.google.com')) {
      setFormProvider('Google Drive');
      setFormCategory('document');
    } else if (lower.includes('geogebra.org') || lower.includes('desmos.com')) {
      setFormProvider('Website');
      setFormCategory('website');
    }
  };

  const handleOpenAddModal = () => {
    setEditingLink(null);
    setFormTitle('');
    setFormUrl('');
    setFormCategory('quiz');
    setFormTargetClass('all');
    setFormGrade('12');
    setFormProvider('Azota');
    setFormDescription('');
    setFormDeadline('');
    setFormIsPinned(false);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (link: ReviewLink) => {
    setEditingLink(link);
    setFormTitle(link.title);
    setFormUrl(link.url);
    setFormCategory(link.category);
    setFormTargetClass(link.targetClass);
    setFormGrade(link.grade);
    setFormProvider(link.provider || 'Website');
    setFormDescription(link.description || '');
    setFormDeadline(link.deadline || '');
    setFormIsPinned(link.isPinned || false);
    setIsAddModalOpen(true);
  };

  const handleSaveLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formUrl.trim()) return;

    let formattedUrl = formUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    if (editingLink) {
      const updated: ReviewLink = {
        ...editingLink,
        title: formTitle.trim(),
        url: formattedUrl,
        category: formCategory,
        targetClass: formTargetClass,
        grade: formGrade,
        provider: formProvider,
        description: formDescription.trim(),
        deadline: formDeadline || undefined,
        isPinned: formIsPinned,
      };
      onUpdateReviewLink(updated);
      showToast('Cập nhật link ôn tập thành công!');
    } else {
      const newLink: ReviewLink = {
        id: `link_${Date.now()}`,
        title: formTitle.trim(),
        url: formattedUrl,
        category: formCategory,
        targetClass: formTargetClass,
        grade: formGrade,
        provider: formProvider,
        description: formDescription.trim(),
        deadline: formDeadline || undefined,
        createdAt: new Date().toISOString().split('T')[0],
        isPinned: formIsPinned,
      };
      onAddReviewLink(newLink);
      showToast('Đã tải lên link ôn tập mới thành công!');
    }

    setIsAddModalOpen(false);
  };

  // Handle batch import from text
  const handleBatchImport = () => {
    if (!batchText.trim()) return;

    const lines = batchText.split('\n').map((l) => l.trim()).filter(Boolean);
    let count = 0;

    lines.forEach((line) => {
      let title = '';
      let url = '';

      if (line.includes('|')) {
        const parts = line.split('|');
        title = parts[0].trim();
        url = parts[1].trim();
      } else if (line.includes('\t')) {
        const parts = line.split('\t');
        title = parts[0].trim();
        url = parts[1].trim();
      } else if (line.startsWith('http')) {
        url = line;
        title = `Tài liệu ôn tập #${Date.now().toString().slice(-4)}`;
      }

      if (url) {
        if (!url.startsWith('http')) {
          url = 'https://' + url;
        }
        const newLink: ReviewLink = {
          id: `link_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          title: title || 'Liên kết ôn tập',
          url,
          category: url.includes('youtube') ? 'video' : url.includes('drive') ? 'document' : 'quiz',
          targetClass: 'all',
          grade: '12',
          provider: url.includes('azota') ? 'Azota' : url.includes('quizizz') ? 'Quizizz' : 'Website',
          createdAt: new Date().toISOString().split('T')[0],
        };
        onAddReviewLink(newLink);
        count++;
      }
    });

    setBatchText('');
    setIsBatchModalOpen(false);
    showToast(`Đã thêm thành công ${count} link ôn tập!`);
  };

  // Toggle pin
  const handleTogglePin = (link: ReviewLink) => {
    onUpdateReviewLink({
      ...link,
      isPinned: !link.isPinned,
    });
    showToast(link.isPinned ? 'Đã bỏ ghim link' : 'Đã ghim link lên đầu danh sách');
  };

  // Filtered links
  const filteredLinks = reviewLinks
    .filter((l) => {
      const matchSearch =
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (l.description && l.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (l.provider && l.provider.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory = selectedCategory === 'all' || l.category === selectedCategory;
      const matchClass =
        selectedClass === 'all' || l.targetClass === 'all' || l.targetClass === selectedClass;
      const matchGrade =
        selectedGrade === 'all' || l.grade === 'all' || l.grade === selectedGrade;

      return matchSearch && matchCategory && matchClass && matchGrade;
    })
    .sort((a, b) => {
      // Pinned items first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Category counts
  const totalCount = reviewLinks.length;
  const quizCount = reviewLinks.filter((l) => l.category === 'quiz').length;
  const docCount = reviewLinks.filter((l) => l.category === 'document').length;
  const videoCount = reviewLinks.filter((l) => l.category === 'video').length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-3.5 bg-emerald-600 text-white rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header and Hero Actions */}
      <div className="bg-white p-5 md:p-6 rounded-3xl border border-blue-100 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF4FF] text-[#004A99] text-xs font-bold mb-2">
              <Link2 className="w-3.5 h-3.5 text-[#0066CC]" />
              <span>Cổng ôn tập & Đề thi trực tuyến</span>
            </div>
            <h1 className="text-2xl font-bold text-[#17324D] tracking-tight">
              Link ôn tập
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Tải link lên, chia sẻ đề trắc nghiệm Azota, Quizizz, Google Form, tài liệu Drive và video bài giảng cho học sinh
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 rounded-xl bg-[#0066CC] hover:bg-[#004A99] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tải link lên</span>
            </button>

            <button
              onClick={() => setIsBatchModalOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-[#EAF4FF] hover:bg-blue-100 text-[#004A99] border border-blue-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-[#0066CC]" />
              <span>Thêm hàng loạt</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Khôi phục danh sách link ôn tập mẫu chuẩn môn Toán THPT Nguyễn Dục?')) {
                  onRestoreDefaultReviewLinks();
                  showToast('Đã khôi phục danh sách link ôn tập mẫu.');
                }
              }}
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Khôi phục link mẫu"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Khôi phục mẫu</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-100">
            <div className="flex items-center justify-between text-xs text-[#004A99] font-semibold mb-1">
              <span>Tổng số link</span>
              <Link2 className="w-4 h-4 text-[#0066CC]" />
            </div>
            <p className="text-xl font-bold font-mono text-[#17324D]">{totalCount}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50/50 border border-purple-100">
            <div className="flex items-center justify-between text-xs text-purple-800 font-semibold mb-1">
              <span>Đề thi & Trắc nghiệm</span>
              <HelpCircle className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-xl font-bold font-mono text-purple-900">{quizCount}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50/50 border border-amber-100">
            <div className="flex items-center justify-between text-xs text-amber-800 font-semibold mb-1">
              <span>Tài liệu PDF / Drive</span>
              <FileText className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-xl font-bold font-mono text-amber-900">{docCount}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-red-50 to-rose-50/50 border border-red-100">
            <div className="flex items-center justify-between text-xs text-red-800 font-semibold mb-1">
              <span>Video bài giảng</span>
              <Video className="w-4 h-4 text-red-600" />
            </div>
            <p className="text-xl font-bold font-mono text-red-900">{videoCount}</p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm link theo tiêu đề, nội dung, Azota, Quizizz, Google Form..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs text-[#17324D] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category filter */}
            <div className="flex items-center gap-1.5 bg-[#F5F9FF] px-2.5 py-1.5 rounded-xl border border-slate-200">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent text-xs font-semibold text-[#17324D] outline-none cursor-pointer"
              >
                <option value="all">Tất cả loại link</option>
                <option value="quiz">Đề thi / Trắc nghiệm</option>
                <option value="document">Tài liệu / Drive</option>
                <option value="video">Video bài giảng</option>
                <option value="website">Công cụ / Website</option>
              </select>
            </div>

            {/* Class filter */}
            <div className="flex items-center gap-1.5 bg-[#F5F9FF] px-2.5 py-1.5 rounded-xl border border-slate-200">
              <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-transparent text-xs font-semibold text-[#17324D] outline-none cursor-pointer"
              >
                <option value="all">Tất cả các lớp</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.name}>
                    Lớp {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Grade filter */}
            <div className="flex items-center gap-1.5 bg-[#F5F9FF] px-2.5 py-1.5 rounded-xl border border-slate-200">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="bg-transparent text-xs font-semibold text-[#17324D] outline-none cursor-pointer"
              >
                <option value="all">Mọi khối lớp</option>
                <option value="12">Khối 12</option>
                <option value="11">Khối 11</option>
                <option value="10">Khối 10</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Links List Cards */}
      <div className="space-y-3">
        {filteredLinks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLinks.map((link) => {
              const isCopied = copiedId === link.id;

              return (
                <div
                  key={link.id}
                  className={`bg-white rounded-3xl border p-5 transition-all shadow-xs hover:shadow-md flex flex-col justify-between relative ${
                    link.isPinned
                      ? 'border-blue-300 ring-2 ring-blue-100/60 bg-gradient-to-b from-blue-50/20 to-white'
                      : 'border-blue-100 hover:border-blue-200'
                  }`}
                >
                  {/* Card Header Top Badges */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {/* Provider / Platform badge */}
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
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
                          <span>{link.provider || 'Liên kết'}</span>
                        </span>

                        {/* Class target badge */}
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-[#0066CC]">
                          {link.targetClass === 'all' ? 'Tất cả lớp' : `Lớp ${link.targetClass}`}
                        </span>

                        {/* Grade badge */}
                        {link.grade !== 'all' && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                            Khối {link.grade}
                          </span>
                        )}
                      </div>

                      {/* Pin button */}
                      <button
                        onClick={() => handleTogglePin(link)}
                        className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                          link.isPinned
                            ? 'text-amber-500 bg-amber-50'
                            : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'
                        }`}
                        title={link.isPinned ? 'Bỏ ghim' : 'Ghim ưu tiên lên đầu'}
                      >
                        <Pin className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-sm text-[#17324D] leading-snug line-clamp-2 hover:text-[#0066CC] transition-colors">
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        {link.title}
                      </a>
                    </h3>

                    {/* Description */}
                    {link.description && (
                      <p className="text-xs text-[#64748B] mt-1.5 line-clamp-2 leading-relaxed">
                        {link.description}
                      </p>
                    )}

                    {/* URL display box */}
                    <div className="mt-3 p-2 bg-[#F5F9FF] rounded-xl border border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500 overflow-hidden">
                      <span className="truncate pr-2">{link.url}</span>
                      <button
                        onClick={() => handleCopyLink(link)}
                        className="shrink-0 text-slate-400 hover:text-[#0066CC] p-1 rounded transition-colors cursor-pointer"
                        title="Sao chép đường dẫn"
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Deadline or Date info */}
                    <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Ngày đăng: {link.createdAt}
                      </span>
                      {link.deadline && (
                        <span className="flex items-center gap-1 text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded">
                          Hạn chót: {link.deadline}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(link)}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Chỉnh sửa link"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setQrModalLink(link)}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-blue-50 hover:text-[#0066CC] transition-colors cursor-pointer"
                        title="Xem mã QR để học sinh quét"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setDeleteConfirmLink(link)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Xóa link này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Open link button */}
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-[#EAF4FF] hover:bg-blue-100 text-[#004A99] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Mở link ôn tập</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-blue-100 p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0066CC] flex items-center justify-center mx-auto">
              <Link2 className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-[#17324D]">
              Không tìm thấy link ôn tập nào
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Chưa có link ôn tập nào phù hợp với bộ lọc tìm kiếm. Thầy cô có thể tải lên link mới hoặc khôi phục danh sách mẫu.
            </p>
            <div className="pt-2">
              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2 bg-[#0066CC] text-white rounded-xl text-xs font-bold hover:bg-[#004A99] transition-colors cursor-pointer"
              >
                + Tải link lên ngay
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: ADD / EDIT REVIEW LINK */}
      {/* ========================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0066CC] flex items-center justify-center">
                  <Link2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#17324D]">
                    {editingLink ? 'Chỉnh sửa link ôn tập' : 'Tải lên link ôn tập mới'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cung cấp liên kết để học sinh tự luyện thi và ôn bài
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLink} className="space-y-4 pt-4">
              {/* Link URL */}
              <div>
                <label className="block text-xs font-semibold text-[#17324D] mb-1">
                  Đường dẫn liên kết (URL) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="https://azota.vn/... hoặc https://quizizz.com/... hoặc drive.google.com/..."
                    className="w-full px-3.5 py-2.5 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs font-mono text-[#17324D] focus:ring-2 focus:ring-[#0066CC] outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Hỗ trợ: Azota, Quizizz, Google Form, Google Drive, YouTube, VietJack, OLM...
                </p>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-[#17324D] mb-1">
                  Tiêu đề link ôn tập <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="VD: Đề ôn tập trắc nghiệm trực tuyến: Đạo hàm & Khảo sát hàm số"
                  className="w-full px-3.5 py-2.5 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs text-[#17324D] font-medium focus:ring-2 focus:ring-[#0066CC] outline-none"
                />
              </div>

              {/* Category & Platform */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#17324D] mb-1">
                    Phân loại nội dung
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) =>
                      setFormCategory(e.target.value as 'quiz' | 'document' | 'video' | 'website')
                    }
                    className="w-full px-3 py-2.5 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs text-[#17324D] font-medium outline-none cursor-pointer"
                  >
                    <option value="quiz">Đề thi & Trắc nghiệm online</option>
                    <option value="document">Tài liệu PDF / Google Drive</option>
                    <option value="video">Video bài giảng / Hướng dẫn</option>
                    <option value="website">Website / Công cụ học tập</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17324D] mb-1">
                    Nền tảng / Đơn vị cung cấp
                  </label>
                  <input
                    type="text"
                    value={formProvider}
                    onChange={(e) => setFormProvider(e.target.value)}
                    placeholder="VD: Azota, Quizizz, Drive..."
                    className="w-full px-3 py-2.5 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs text-[#17324D] outline-none"
                  />
                </div>
              </div>

              {/* Class target & Grade */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#17324D] mb-1">
                    Áp dụng cho lớp
                  </label>
                  <select
                    value={formTargetClass}
                    onChange={(e) => setFormTargetClass(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs text-[#17324D] outline-none cursor-pointer"
                  >
                    <option value="all">Tất cả các lớp</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.name}>
                        Lớp {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17324D] mb-1">
                    Khối học
                  </label>
                  <select
                    value={formGrade}
                    onChange={(e) =>
                      setFormGrade(e.target.value as '10' | '11' | '12' | 'all')
                    }
                    className="w-full px-3 py-2.5 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs text-[#17324D] outline-none cursor-pointer"
                  >
                    <option value="12">Khối 12</option>
                    <option value="11">Khối 11</option>
                    <option value="10">Khối 10</option>
                    <option value="all">Mọi khối lớp</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#17324D] mb-1">
                  Mô tả / Hướng dẫn ôn tập (Tùy chọn)
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Ghi chú hướng dẫn học sinh làm bài, thời gian làm, dạng bài trọng tâm..."
                  className="w-full px-3.5 py-2.5 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs text-[#17324D] outline-none resize-none"
                />
              </div>

              {/* Deadline & Pin toggle */}
              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-xs font-semibold text-[#17324D] mb-1">
                    Hạn chót làm bài (Tùy chọn)
                  </label>
                  <input
                    type="date"
                    value={formDeadline}
                    onChange={(e) => setFormDeadline(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F5F9FF] border border-slate-200 rounded-xl text-xs text-[#17324D] outline-none"
                  />
                </div>

                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formIsPinned}
                      onChange={(e) => setFormIsPinned(e.target.checked)}
                      className="w-4 h-4 text-[#0066CC] rounded border-slate-300 focus:ring-[#0066CC]"
                    />
                    <span className="text-xs font-semibold text-[#17324D]">
                      Ghim ưu tiên lên đầu
                    </span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#0066CC] hover:bg-[#004A99] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  {editingLink ? 'Lưu thay đổi' : 'Tải link lên'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: BATCH IMPORT LINKS FROM TEXT */}
      {/* ========================================================= */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#17324D]">
                Thêm nhiều link ôn tập cùng lúc
              </h3>
              <button
                onClick={() => setIsBatchModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 pt-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                Dán danh sách các link ôn tập vào ô bên dưới. Mỗi dòng một link theo định dạng:
                <br />
                <code className="text-xs font-mono text-[#0066CC] bg-blue-50 px-1 py-0.5 rounded">
                  Tiêu đề link | Đường dẫn URL
                </code>
              </p>

              <textarea
                rows={6}
                value={batchText}
                onChange={(e) => setBatchText(e.target.value)}
                placeholder="VD:
Đề ôn tập Khảo sát hàm số | https://azota.vn/de-thi-01
Mini-game Quizizz Ôn tập Oxyz | https://quizizz.com/join?gc=123456
Tài liệu Tích phân PDF | https://drive.google.com/..."
                className="w-full p-3.5 bg-[#F5F9FF] border border-slate-200 rounded-2xl text-xs font-mono text-[#17324D] focus:ring-2 focus:ring-[#0066CC] outline-none"
              />

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBatchModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleBatchImport}
                  disabled={!batchText.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-[#0066CC] hover:bg-[#004A99] text-white text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  Nạp các link này
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: QR CODE PREVIEW MODAL */}
      {/* ========================================================= */}
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

            {/* QR Code visual preview */}
            <div className="p-4 my-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                  qrModalLink.url
                )}`}
                alt="QR Code"
                className="w-44 h-44 rounded-lg mx-auto"
                onError={(e) => {
                  // Fallback
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            <p className="text-[11px] text-slate-500 mb-4">
              Học sinh dùng camera điện thoại hoặc Zalo để quét và mở bài ôn tập ngay.
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

      {/* ========================================================= */}
      {/* MODAL 4: DELETE CONFIRMATION */}
      {/* ========================================================= */}
      {deleteConfirmLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-[#17324D]">
              Xác nhận xóa link ôn tập?
            </h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              Bạn có chắc chắn muốn xóa link <b className="text-slate-800">{deleteConfirmLink.title}</b> khỏi danh sách?
            </p>

            <div className="flex gap-2 pt-4">
              <button
                onClick={() => setDeleteConfirmLink(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  onDeleteReviewLink(deleteConfirmLink.id);
                  setDeleteConfirmLink(null);
                  showToast('Đã xóa link ôn tập thành công.');
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 cursor-pointer shadow-sm"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
