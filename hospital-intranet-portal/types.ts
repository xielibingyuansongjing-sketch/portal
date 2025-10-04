export type View = 'dashboard' | 'ai-assistant' | 'documents' | 'schedule' | 'directory' | 'admin' | 'new-post' | 'login' | 'committee' | 'internal-directory' | 'hospital-log' | 'duty-log';

export interface Post {
  id: number;
  category: '重要' | '研修' | '通知' | '一般' | '周知';
  date: string;
  title: string;
  author: string;
  content: string;
  attachments: { name: string; url: string }[];
  displayStartDate?: string;
  displayEndDate?: string;
  isVisible: boolean;
}

export interface QuickLink {
  id: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  navTarget?: View;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  isTyping?: boolean;
}

export interface User {
    id: number;
    name: string;
    role: string;
    avatarUrl: string;
}

export interface CommitteeAttachment {
  id: number;
  fileName: string;
  uploadedDate: string;
  url: string;
}

export interface CommitteeMinute {
  month: number;
  attachments: CommitteeAttachment[];
}

export interface Committee {
  id: number;
  name: string;
  minutes: CommitteeMinute[];
}

export interface CommitteesByYear {
    [year: number]: Committee[];
}

export interface EventColor {
  key: string;
  name: string;
  bgClass: string;
  textClass: string;
  hoverBgClass: string;
}

export interface ScheduleEvent {
  id: number;
  date: string; // "YYYY-MM-DD"
  endDate?: string; // "YYYY-MM-DD" for multi-day events
  title: string;
  startTime?: string; // "HH:MM"
  endTime?: string;
  description?: string;
  authorId: number;
  authorName: string;
  color: string; // e.g., 'blue', 'green'
}

export interface DirectoryEntry {
    id: number;
    department: string;
    name: string;
    extension: string;
}

export type LogCategory = '申し送り' | '患者イベント' | '設備' | '一般';

export interface HospitalLogEntry {
  id: number;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM"
  authorId: number;
  authorName: string;
  category: LogCategory;
  content: string;
}

export type DutyLogCategory = '申し送り' | '緊急対応' | '電話対応' | '設備トラブル' | 'その他';

export interface DutyLogEntry {
  id: number;
  dutyDate: string; // Start date of the duty shift, "YYYY-MM-DD"
  time: string; // "HH:MM"
  authorId: number;
  authorName: string;
  category: DutyLogCategory;
  content: string;
}
