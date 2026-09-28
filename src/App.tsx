import React, { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { Header } from './components/Header';
import { Sidebar, TabId } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { StudentsView } from './components/StudentsView';
import { ClassesView } from './components/ClassesView';
import { GradesView } from './components/GradesView';
import { AttendanceView } from './components/AttendanceView';
import { AssignmentsView } from './components/AssignmentsView';
import { MaterialsView } from './components/MaterialsView';
import { AnalyticsView } from './components/AnalyticsView';
import { AIAssistantView } from './components/AIAssistantView';
import { SettingsView } from './components/SettingsView';
import { ReviewLinksView } from './components/ReviewLinksView';
import { StudentDetailModal } from './components/StudentDetailModal';

import {
  initialStudents,
  initialClasses,
  initialAssignments,
  initialMaterials,
  initialTeacherProfile,
  initialNotifications,
  initialReviewLinks,
} from './data/mockData';
import { Student, Classroom, Assignment, StudyMaterial, TeacherProfile, ScoreSet, ReviewLink } from './types';

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('thpt_nd_auth') === 'true';
  });

  const [currentUserRole, setCurrentUserRole] = useState<string>(() => {
    return localStorage.getItem('thpt_nd_role') || 'teacher';
  });

  // Active Navigation Tab
  const [currentTab, setCurrentTab] = useState<TabId>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Core Data States with LocalStorage
  const [teacher, setTeacher] = useState<TeacherProfile>(() => {
    const saved = localStorage.getItem('thpt_nd_teacher');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.name && !parsed.name.includes('Nhung')) {
          return {
            ...initialTeacherProfile,
            name: 'Cô Trần Thị Tuyết Nhung',
            academicYear: '2026 - 2027',
          };
        }
        return parsed;
      } catch {
        return initialTeacherProfile;
      }
    }
    return initialTeacherProfile;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('thpt_nd_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [classes, setClasses] = useState<Classroom[]>(() => {
    const saved = localStorage.getItem('thpt_nd_classes');
    return saved ? JSON.parse(saved) : initialClasses;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('thpt_nd_assignments');
    return saved ? JSON.parse(saved) : initialAssignments;
  });

  const [materials, setMaterials] = useState<StudyMaterial[]>(() => {
    const saved = localStorage.getItem('thpt_nd_materials');
    return saved ? JSON.parse(saved) : initialMaterials;
  });

  const [reviewLinks, setReviewLinks] = useState<ReviewLink[]>(() => {
    const saved = localStorage.getItem('thpt_nd_review_links');
    return saved ? JSON.parse(saved) : initialReviewLinks;
  });

  const [notifications, setNotifications] = useState(() => {
    return initialNotifications;
  });

  // Modal Student Detail State
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // AI Assistant Preselected Student
  const [aiTargetStudent, setAiTargetStudent] = useState<Student | null>(null);

  // Grades View Initial Class Selection
  const [gradesInitialClass, setGradesInitialClass] = useState<string>('12A1');

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('thpt_nd_auth', isAuthenticated ? 'true' : 'false');
    localStorage.setItem('thpt_nd_role', currentUserRole);
  }, [isAuthenticated, currentUserRole]);

  useEffect(() => {
    localStorage.setItem('thpt_nd_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('thpt_nd_teacher', JSON.stringify(teacher));
  }, [teacher]);

  useEffect(() => {
    localStorage.setItem('thpt_nd_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('thpt_nd_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('thpt_nd_materials', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem('thpt_nd_review_links', JSON.stringify(reviewLinks));
  }, [reviewLinks]);

  // Handlers
  const handleLoginSuccess = (role: string, username: string) => {
    setIsAuthenticated(true);
    setCurrentUserRole(role);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('thpt_nd_auth');
  };

  const handleAddStudent = (newStudent: Student) => {
    setStudents((prev) => [newStudent, ...prev]);
  };

  const handleAddMultipleStudents = (newStudents: Student[]) => {
    setStudents((prev) => [...newStudents, ...prev]);
  };

  const handleDeleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    if (selectedStudent?.id === id) {
      setSelectedStudent(null);
    }
  };

  const handleDeleteMultipleStudents = (ids: string[]) => {
    setStudents((prev) => prev.filter((s) => !ids.includes(s.id)));
    if (selectedStudent && ids.includes(selectedStudent.id)) {
      setSelectedStudent(null);
    }
  };

  const handleDeleteAllStudents = (className?: string) => {
    if (className && className !== 'all') {
      setStudents((prev) => prev.filter((s) => s.className !== className));
    } else {
      setStudents([]);
    }
    setSelectedStudent(null);
  };

  const handleRestoreDefaultStudents = () => {
    setStudents(initialStudents);
  };

  const handleAddClass = (newClass: Classroom) => {
    setClasses((prev) => [...prev, newClass]);
  };

  const handleDeleteClass = (classId: string, deleteStudents: boolean = false) => {
    const targetClass = classes.find((c) => c.id === classId);
    setClasses((prev) => prev.filter((c) => c.id !== classId));
    if (targetClass && deleteStudents) {
      setStudents((prev) => prev.filter((s) => s.className !== targetClass.name));
    }
  };

  const handleUpdateClass = (updated: Classroom) => {
    setClasses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleRestoreDefaultClasses = () => {
    setClasses(initialClasses);
  };

  const handleUpdateStudent = (updated: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setSelectedStudent(updated);
  };

  const handleUpdateScores = (studentId: string, newScores: ScoreSet) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, scores: newScores } : s))
    );
  };

  const handleUpdateAttendance = (
    studentId: string,
    status: 'present' | 'excused' | 'unexcused' | 'late'
  ) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const currentAtt = { ...s.attendance };
        if (status === 'present') currentAtt.present += 1;
        if (status === 'excused') currentAtt.excused += 1;
        if (status === 'unexcused') currentAtt.unexcused += 1;
        if (status === 'late') currentAtt.late += 1;
        return { ...s, attendance: currentAtt };
      })
    );
  };

  const handleAddAssignment = (newAsg: Assignment) => {
    setAssignments((prev) => [newAsg, ...prev]);
  };

  const handleAddMaterial = (newMat: StudyMaterial) => {
    setMaterials((prev) => [newMat, ...prev]);
  };

  const handleAddReviewLink = (link: ReviewLink) => {
    setReviewLinks((prev) => [link, ...prev]);
  };

  const handleUpdateReviewLink = (link: ReviewLink) => {
    setReviewLinks((prev) => prev.map((l) => (l.id === link.id ? link : l)));
  };

  const handleDeleteReviewLink = (linkId: string) => {
    setReviewLinks((prev) => prev.filter((l) => l.id !== linkId));
  };

  const handleRestoreDefaultReviewLinks = () => {
    setReviewLinks(initialReviewLinks);
  };

  const handleAskAIForStudent = (student: Student) => {
    setAiTargetStudent(student);
    setCurrentTab('ai');
  };

  const handleResetData = () => {
    setStudents(initialStudents);
    setClasses(initialClasses);
    setAssignments(initialAssignments);
    setMaterials(initialMaterials);
    setReviewLinks(initialReviewLinks);
    setTeacher(initialTeacherProfile);
    localStorage.clear();
    alert('Đã khôi phục dữ liệu mẫu ban đầu của trường THPT Nguyễn Dục!');
  };

  // If unauthenticated, show professional login screen
  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F9FF] text-[#17324D]">
      {/* Header */}
      <Header
        teacher={teacher}
        notifications={notifications}
        students={students}
        onSelectStudent={(st) => setSelectedStudent(st)}
        onLogout={handleLogout}
        onNavigate={(tab) => setCurrentTab(tab as TabId)}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />

      {/* Main Workspace: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          onLogout={handleLogout}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Content Viewport */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {currentTab === 'dashboard' && (
            <DashboardView
              classes={classes}
              students={students}
              assignments={assignments}
              onNavigate={(tab) => setCurrentTab(tab)}
              onSelectStudent={(st) => setSelectedStudent(st)}
            />
          )}

          {currentTab === 'students' && (
            <StudentsView
              students={students}
              onSelectStudent={(st) => setSelectedStudent(st)}
              onAddStudent={handleAddStudent}
              onAddMultipleStudents={handleAddMultipleStudents}
              onDeleteStudent={handleDeleteStudent}
              onDeleteMultipleStudents={handleDeleteMultipleStudents}
              onDeleteAllStudents={handleDeleteAllStudents}
              onRestoreDefaultStudents={handleRestoreDefaultStudents}
            />
          )}

          {currentTab === 'classes' && (
            <ClassesView
              classes={classes}
              students={students}
              onSelectStudent={(st) => setSelectedStudent(st)}
              onNavigateToGrades={(className) => {
                setGradesInitialClass(className);
                setCurrentTab('grades');
              }}
              onAddClass={handleAddClass}
              onDeleteClass={handleDeleteClass}
              onUpdateClass={handleUpdateClass}
              onRestoreDefaultClasses={handleRestoreDefaultClasses}
            />
          )}

          {currentTab === 'grades' && (
            <GradesView
              students={students}
              classes={classes}
              initialClass={gradesInitialClass}
              onUpdateScores={handleUpdateScores}
              onSelectStudent={(st) => setSelectedStudent(st)}
            />
          )}

          {currentTab === 'attendance' && (
            <AttendanceView
              students={students}
              classes={classes}
              onUpdateAttendance={handleUpdateAttendance}
              onSelectStudent={(st) => setSelectedStudent(st)}
            />
          )}

          {currentTab === 'assignments' && (
            <AssignmentsView
              assignments={assignments}
              onAddAssignment={handleAddAssignment}
            />
          )}

          {currentTab === 'materials' && (
            <MaterialsView
              materials={materials}
              onAddMaterial={handleAddMaterial}
            />
          )}

          {currentTab === 'review-links' && (
            <ReviewLinksView
              classes={classes}
              reviewLinks={reviewLinks}
              onAddReviewLink={handleAddReviewLink}
              onUpdateReviewLink={handleUpdateReviewLink}
              onDeleteReviewLink={handleDeleteReviewLink}
              onRestoreDefaultReviewLinks={handleRestoreDefaultReviewLinks}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsView
              classes={classes}
              students={students}
              onSelectStudent={(st) => setSelectedStudent(st)}
            />
          )}

          {currentTab === 'ai' && (
            <AIAssistantView
              students={students}
              classes={classes}
              preselectedStudent={aiTargetStudent}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              teacher={teacher}
              onUpdateTeacher={setTeacher}
              onResetData={handleResetData}
            />
          )}
        </main>
      </div>

      {/* Student Detail Modal */}
      <StudentDetailModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onUpdateStudent={handleUpdateStudent}
        onAskAIForStudent={handleAskAIForStudent}
        onDeleteStudent={handleDeleteStudent}
      />
    </div>
  );
}
