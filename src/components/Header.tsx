import React, { useState, useRef, useEffect } from 'react';
import { SchoolLogo } from './SchoolLogo';
import { TeacherProfile, SchoolNotification, Student } from '../types';
import { Search, Bell, Menu, X, ChevronDown, Check, UserCheck, ShieldAlert, LogOut, Settings as SettingsIcon } from 'lucide-react';

interface HeaderProps {
  teacher: TeacherProfile;
  notifications: SchoolNotification[];
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onLogout: () => void;
  onNavigate: (tabId: string) => void;
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  teacher,
  notifications,
  students,
  onSelectStudent,
  onLogout,
  onNavigate,
  toggleSidebar,
  sidebarOpen,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [localNotifications, setLocalNotifications] = useState(notifications);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const unreadCount = localNotifications.filter((n) => n.unread).length;

  // Filter students based on search query
  const filteredStudents = searchQuery.trim()
    ? students.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.className.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setLocalNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-xs">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Left: Mobile hamburger & School Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl text-slate-600 hover:text-[#0066CC] hover:bg-blue-50 md:hidden transition-colors"
            title="Mở menu"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            className="flex items-center cursor-pointer"
            onClick={() => onNavigate('dashboard')}
          >
            <SchoolLogo size="md" showText={true} />
          </div>
        </div>

        {/* Center: Search input */}
        <div className="flex-1 max-w-md mx-4 hidden md:block relative" ref={searchRef}>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Tìm kiếm học sinh theo tên, lớp..."
              className="w-full pl-10 pr-4 py-2 bg-[#F5F9FF] border border-blue-100 rounded-xl text-xs md:text-sm text-[#17324D] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Search Results Dropdown */}
          {isSearchOpen && searchQuery.trim() && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in duration-150">
              <div className="p-2 bg-slate-50 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Kết quả tìm kiếm ({filteredStudents.length})
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((st) => (
                    <div
                      key={st.id}
                      onClick={() => {
                        onSelectStudent(st);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="p-3 hover:bg-[#F5F9FF] cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#0066CC]/10 text-[#0066CC] font-bold text-xs flex items-center justify-center">
                          {st.name.charAt(st.name.lastIndexOf(' ') + 1) || 'H'}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[#17324D]">{st.name}</p>
                          <p className="text-[11px] text-[#64748B]">
                            Lớp {st.className} · {st.gender}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#0066CC]">
                          ĐTB: {st.scores.dtb?.toFixed(1) ?? '--'}
                        </span>
                        <p className="text-[10px] text-slate-400">{st.scores.rank}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-slate-500">
                    Không tìm thấy học sinh phù hợp với từ khóa "{searchQuery}"
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Zone: Academic Year, Notifications & Teacher Profile */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Academic Semester Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EAF4FF] text-[#004A99] text-xs font-semibold border border-blue-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{teacher.currentSemester} · {teacher.academicYear}</span>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="relative p-2.5 rounded-xl text-slate-600 hover:text-[#0066CC] hover:bg-blue-50 transition-colors"
              title="Thông báo"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#DC2626] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in duration-150">
                <div className="p-3.5 bg-gradient-to-r from-[#0066CC] to-[#004A99] text-white flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider">Thông báo nhà trường</h3>
                    <p className="text-[11px] text-blue-100">{unreadCount} thông báo chưa đọc</p>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[11px] bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded-md transition-colors flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" /> Đã đọc hết
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {localNotifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3.5 transition-colors ${
                        n.unread ? 'bg-[#F5F9FF]' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                            n.unread ? 'bg-[#0066CC]' : 'bg-slate-300'
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-[#17324D] leading-snug">
                            {n.title}
                          </p>
                          <p className="text-[11px] text-[#64748B] mt-1 leading-relaxed">
                            {n.content}
                          </p>
                          <span className="inline-block mt-1 text-[10px] text-slate-400">
                            {n.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Teacher Profile Lockup */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-2.5 p-1.5 md:pr-3 rounded-xl hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100"
            >
              {/* Teacher Avatar with Academic Indigo Accent */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#004A99] to-[#0066CC] text-white flex items-center justify-center font-bold text-xs shadow-xs border border-white">
                <span>
                  {(() => {
                    const cleanName = teacher.name.replace(/^(Thầy|Cô)\s+/i, '').trim();
                    const words = cleanName.split(/\s+/);
                    if (words.length >= 2) {
                      return `${words[words.length - 2][0]}${words[words.length - 1][0]}`.toUpperCase();
                    }
                    return cleanName.slice(0, 2).toUpperCase() || 'TN';
                  })()}
                </span>
              </div>

              {/* Teacher Name and Role */}
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-[#17324D] leading-tight">
                  {teacher.name}
                </span>
                <span className="text-[11px] font-medium text-[#64748B] leading-tight">
                  Vai trò: Giáo viên
                </span>
              </div>

              <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
            </button>

            {/* Profile Menu Dropdown */}
            {showProfileDropdown && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in duration-150">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-xs font-bold text-[#17324D]">{teacher.name}</p>
                  <p className="text-[11px] text-[#0066CC] font-medium">{teacher.role}</p>
                  <p className="text-[10px] text-slate-400 truncate">{teacher.email}</p>
                </div>

                <button
                  onClick={() => {
                    onNavigate('settings');
                    setShowProfileDropdown(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#17324D] hover:bg-[#F5F9FF] hover:text-[#0066CC] transition-colors"
                >
                  <SettingsIcon className="w-4 h-4 text-slate-500" />
                  <span>Cài đặt hệ thống</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('classes');
                    setShowProfileDropdown(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#17324D] hover:bg-[#F5F9FF] hover:text-[#0066CC] transition-colors"
                >
                  <UserCheck className="w-4 h-4 text-slate-500" />
                  <span>Lớp chủ nhiệm (12A1)</span>
                </button>

                <div className="my-1 border-t border-slate-100" />

                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#DC2626] hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
