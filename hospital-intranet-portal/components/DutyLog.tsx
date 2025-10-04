import React, { useState, useMemo } from 'react';
import type { DutyLogEntry, User, DutyLogCategory } from '../types';
import { DUTY_LOG_CATEGORIES } from '../constants';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, PencilIcon, TrashIcon, CheckIcon, XMarkIcon, SearchIcon } from './icons/Icons';

interface DutyLogProps {
  logEntries: DutyLogEntry[];
  user: User | null;
  addLogEntry: (entry: Omit<DutyLogEntry, 'id' | 'authorId' | 'authorName'>) => void;
  updateLogEntry: (entry: DutyLogEntry) => void;
  deleteLogEntry: (entryId: number) => void;
}

const getCurrentTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

const getTodayAtMidnight = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
};

const DutyLog: React.FC<DutyLogProps> = ({ logEntries, user, addLogEntry, updateLogEntry, deleteLogEntry }) => {
  const [selectedDate, setSelectedDate] = useState(getTodayAtMidnight());
  const [searchTerm, setSearchTerm] = useState('');
  const [newEntryContent, setNewEntryContent] = useState('');
  const [newEntryCategory, setNewEntryCategory] = useState<DutyLogCategory>('その他');
  const [newEntryTime, setNewEntryTime] = useState(getCurrentTime());
  const [editingEntry, setEditingEntry] = useState<DutyLogEntry | null>(null);

  const selectedDateString = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, [selectedDate]);

  const nextDay = useMemo(() => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    return d;
  }, [selectedDate]);

  const dutyPeriodString = useMemo(() => {
    return `${selectedDate.toLocaleDateString('ja-JP')} 17:00 〜 ${nextDay.toLocaleDateString('ja-JP')} 08:30`;
  }, [selectedDate, nextDay]);
  
  const dutyEntries = useMemo(() => {
    return logEntries
      .filter(entry => entry.dutyDate === selectedDateString)
      .filter(entry => entry.content.toLowerCase().includes(searchTerm.toLowerCase()) || entry.authorName.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        const timeA = parseInt(a.time.replace(':', ''), 10);
        const timeB = parseInt(b.time.replace(':', ''), 10);
        // Treat times before 9am as being on the next day for sorting
        const shiftOrderA = timeA < 900 ? timeA + 2400 : timeA;
        const shiftOrderB = timeB < 900 ? timeB + 2400 : timeB;
        return shiftOrderA - shiftOrderB;
      });
  }, [logEntries, selectedDateString, searchTerm]);


  const changeDate = (offset: number) => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + offset);
      return newDate;
    });
  };

  const handleAddEntry = () => {
    if (!newEntryContent.trim() || !user) return;
    addLogEntry({
      dutyDate: selectedDateString,
      time: newEntryTime,
      category: newEntryCategory,
      content: newEntryContent,
    });
    setNewEntryContent('');
    setNewEntryCategory('その他');
    setNewEntryTime(getCurrentTime());
  };

  const handleUpdateEntry = () => {
    if(editingEntry) {
        updateLogEntry(editingEntry);
        setEditingEntry(null);
    }
  }

  const handleDeleteEntry = (id: number) => {
    if(window.confirm('この日誌を削除しますか？')) {
        deleteLogEntry(id);
    }
  }

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm h-full flex flex-col max-w-5xl mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <div className="flex items-center space-x-2">
          <button onClick={() => changeDate(-1)} className="p-2 rounded-full hover:bg-slate-100" aria-label="前の日">
            <ChevronLeftIcon className="h-6 w-6 text-slate-600" />
          </button>
          <div className="text-center">
            <input
              type="date"
              value={selectedDateString}
              onChange={(e) => setSelectedDate(new Date(e.target.value + 'T00:00:00'))}
              className="text-xl sm:text-2xl font-bold text-slate-800 border-none focus:ring-0 bg-transparent text-center"
            />
            <p className="text-sm text-slate-500">{dutyPeriodString}</p>
          </div>
          <button onClick={() => changeDate(1)} className="p-2 rounded-full hover:bg-slate-100" aria-label="次の日">
            <ChevronRightIcon className="h-6 w-6 text-slate-600" />
          </button>
        </div>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="キーワード検索..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
        </div>
      </header>
      
      {user && (
        <div className="p-4 bg-slate-50 rounded-lg border border-dashed mb-6">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                    <label htmlFor="new-duty-log-content" className="sr-only">日誌内容</label>
                    <textarea
                        id="new-duty-log-content"
                        rows={3}
                        value={newEntryContent}
                        onChange={e => setNewEntryContent(e.target.value)}
                        placeholder="日誌の内容を入力..."
                        className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none"
                    />
                </div>
                <div className="flex flex-col gap-2 w-full md:w-48 flex-shrink-0">
                     <div>
                        <label htmlFor="new-duty-log-time" className="sr-only">時間</label>
                        <input
                            type="time"
                            id="new-duty-log-time"
                            value={newEntryTime}
                            onChange={(e) => setNewEntryTime(e.target.value)}
                            className="w-full border-slate-300 rounded-md text-sm"
                        />
                     </div>
                     <div>
                        <label htmlFor="new-duty-log-category" className="sr-only">カテゴリ</label>
                         <select
                            id="new-duty-log-category"
                            value={newEntryCategory}
                            onChange={e => setNewEntryCategory(e.target.value as DutyLogCategory)}
                            className="w-full border-slate-300 rounded-md text-sm"
                         >
                            {DUTY_LOG_CATEGORIES.map(cat => <option key={cat.key} value={cat.key}>{cat.name}</option>)}
                         </select>
                     </div>
                     <button onClick={handleAddEntry} disabled={!newEntryContent.trim()} className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-brand-blue rounded-lg hover:bg-brand-blue-dark transition-colors disabled:bg-slate-400">
                        <PlusIcon className="h-5 w-5 mr-2" />
                        記録する
                    </button>
                </div>
            </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto pr-4 -mr-4 space-y-4">
        {dutyEntries.length > 0 ? (
            <div className="relative pl-8">
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-slate-200"></div>
                {dutyEntries.map(entry => {
                    const categoryInfo = DUTY_LOG_CATEGORIES.find(c => c.key === entry.category);
                    const isEditing = editingEntry?.id === entry.id;
                    const canEdit = user && (user.id === entry.authorId || user.role === '看護部長');
                    return(
                        <div key={entry.id} className="relative mb-6">
                            <div className="absolute -left-[3px] top-1.5 w-4 h-4 bg-white border-2 border-brand-blue rounded-full z-10"></div>
                            <div className="ml-6 flex flex-col sm:flex-row sm:items-start gap-2">
                                <div className="flex-shrink-0 sm:w-36 text-sm">
                                    <p className="font-bold text-slate-800">{entry.time}</p>
                                    <p className="text-slate-500">{entry.authorName}</p>
                                </div>
                                <div className="flex-grow bg-slate-50 p-3 rounded-lg border border-slate-200 w-full">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${categoryInfo?.color}`}>{entry.category}</span>
                                        {canEdit && !isEditing && (
                                            <div className="flex gap-2">
                                                <button onClick={() => setEditingEntry({...entry})} className="p-1 text-slate-500 rounded-md hover:bg-slate-200 hover:text-brand-blue" aria-label="編集"><PencilIcon className="h-4 w-4"/></button>
                                                <button onClick={() => handleDeleteEntry(entry.id)} className="p-1 text-slate-500 rounded-md hover:bg-slate-200 hover:text-red-600" aria-label="削除"><TrashIcon className="h-4 w-4"/></button>
                                            </div>
                                        )}
                                    </div>
                                    {isEditing ? (
                                        <div className="space-y-2">
                                            <textarea
                                                value={editingEntry.content}
                                                onChange={e => setEditingEntry(prev => prev ? {...prev, content: e.target.value} : null)}
                                                className="w-full text-sm p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                                                rows={3}
                                            />
                                            <div className="flex gap-2 justify-end">
                                                <button onClick={handleUpdateEntry} className="p-1 text-green-600 rounded-md hover:bg-green-100"><CheckIcon className="h-5 w-5"/></button>
                                                <button onClick={() => setEditingEntry(null)} className="p-1 text-slate-500 rounded-md hover:bg-slate-200"><XMarkIcon className="h-5 w-5"/></button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-700 whitespace-pre-wrap">{entry.content}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        ) : (
            <div className="text-center text-slate-500 py-16">
                <p>この日の当直日誌はありません。</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default DutyLog;