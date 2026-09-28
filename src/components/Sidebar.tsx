import React from 'react';
import {
  Home,
  Users,
  GraduationCap,
  BarChart3,
  CalendarCheck2,
  FileEdit,
  FolderOpen,
  TrendingUp,
  Bot,
  Settings,
  LogOut,
  X,
  BookOpen,
  Link2,
} from 'lucide-react';

export type TabId =
  | 'dashboard'
  | 'students'
  | 'classes'
  | 'grades'
  | 'attendance'
  | 'assignments'
  | 'materials'
  | 'review-links'
  | 'analytics'
  | 'ai'
  | 'settings';

interface SidebarProps {
  currentTab: TabId;
  onSelectTab: (tab: TabId) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
  unreadAssignmentCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onLogout,
  isOpen,
  onClose,
  unreadAssignmentCount = 2,
}) => {
  const menuItems = [
    {
      id: 'dashboard' as TabId,
      name: 'Trang chủ',
      icon: Home,
      badge: null,
    },
    {
      id: 'students' as TabId,
      name: 'Quản lý học sinh',
      icon: Users,
      badge: null,
    },
    {
      id: 'classes' as TabId,
      name: 'Quản lý lớp',
      icon: GraduationCap,
      badge: '4 lớp',
    },
    {
      id: 'grades' as TabId,
      name: 'Điểm số',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'attendance' as TabId,
      name: 'Chuyên cần',
      icon: CalendarCheck2,
      badge: null,
    },
    {
      id: 'assignments' as TabId,
      name: 'Bài tập',
      icon: FileEdit,
      badge: unreadAssignmentCount > 0 ? `${unreadAssignmentCount}` : null,
    },
    {
      id: 'materials' as TabId,
      name: 'Tài liệu & Video',
      icon: FolderOpen,
      badge: null,
    },
    {
      id: 'review-links' as TabId,
      name: 'Link ôn tập',
      icon: Link2,
      badge: 'Mới',
    },
    {
      id: 'analytics' as TabId,
      name: 'Thống kê',
      icon: TrendingUp,
      badge: null,
    },
    {
      id: 'ai' as TabId,
      name: 'AI hỗ trợ',
      icon: Bot,
      badge: 'Mới',
      highlight: true,
    },
    {
      id: 'settings' as TabId,
      name: 'Cài đặt',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-blue-100 flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Mobile Title Bar */}
        <div className="flex items-center justify-between p-4 border-b border-blue-50 md:hidden">
          <div className="flex items-center gap-2 text-[#0066CC] font-bold text-sm">
            <BookOpen className="w-5 h-5" />
            <span>DANH MỤC CHỨC NĂNG</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Academic Badge */}
        <div className="p-4 hidden md:block">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-[#EAF4FF] to-blue-50/60 border border-blue-100">
            <p className="text-[11px] font-bold text-[#004A99] uppercase tracking-wider">
              Năm học 2026 - 2027
            </p>
            <p className="text-xs text-[#17324D] font-semibold mt-0.5">
              Học kỳ I · Tuần thứ 4
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-[#0066CC] text-white shadow-sm shadow-blue-500/25'
                    : 'text-[#17324D] hover:bg-[#F5F9FF] hover:text-[#0066CC]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : item.highlight ? 'text-[#0066CC]' : 'text-slate-500'
                    }`}
                  />
                  <span className="truncate">{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.highlight
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout Bottom Button */}
        <div className="p-3 border-t border-blue-50">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-semibold text-[#DC2626] hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>
    </>
  );
};
