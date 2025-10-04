
import React, { useState, useEffect } from 'react';
import type { CommitteesByYear, CommitteeAttachment } from '../types';
import { COMMITTEES_DATA_BY_YEAR } from '../constants';
import { ChevronDownIcon, ChevronUpIcon, DocumentTextIcon, XMarkIcon, PlusIcon, PaperclipIcon } from './icons/Icons';

interface CommitteeProps {
  isLoggedIn: boolean;
}

const Committee: React.FC<CommitteeProps> = ({ isLoggedIn }) => {
  const [committeesData, setCommitteesData] = useState<CommitteesByYear>(COMMITTEES_DATA_BY_YEAR);
  const availableYears = Object.keys(committeesData).map(Number).sort((a, b) => b - a);
  const [selectedYear, setSelectedYear] = useState<number>(availableYears[0] || new Date().getFullYear());
  const [openAttachmentsMenu, setOpenAttachmentsMenu] = useState<string | null>(null);

  const committeesForSelectedYear = committeesData[selectedYear] || [];
  const [expandedCommitteeId, setExpandedCommitteeId] = useState<number | null>(committeesForSelectedYear[0]?.id || null);
  
  useEffect(() => {
    const handleClickOutside = () => {
        setOpenAttachmentsMenu(null);
    };

    if (openAttachmentsMenu !== null) {
        const timerId = setTimeout(() => {
            document.addEventListener('click', handleClickOutside);
        }, 0);

        return () => {
            clearTimeout(timerId);
            document.removeEventListener('click', handleClickOutside);
        };
    }
  }, [openAttachmentsMenu]);


  const handleToggle = (id: number) => {
    setExpandedCommitteeId(expandedCommitteeId === id ? null : id);
  };

  const handleFileUpload = (committeeId: number, month: number, file: File) => {
    const today = new Date().toISOString().split('T')[0];
    const newAttachment: CommitteeAttachment = {
        id: Date.now(),
        fileName: file.name,
        uploadedDate: today,
        url: URL.createObjectURL(file),
    };
    
    setCommitteesData(prevData => {
        const yearData = [...(prevData[selectedYear] || [])];
        const committeeIndex = yearData.findIndex(c => c.id === committeeId);
        if (committeeIndex === -1) return prevData;

        const committee = { ...yearData[committeeIndex] };
        const minuteIndex = committee.minutes.findIndex(m => m.month === month);

        if (minuteIndex > -1) {
            // Add to existing attachments
            const minute = { ...committee.minutes[minuteIndex] };
            minute.attachments = [...minute.attachments, newAttachment];
            committee.minutes = [...committee.minutes];
            committee.minutes[minuteIndex] = minute;
        } else {
            // Create new minute entry for the month
            committee.minutes = [...committee.minutes, { month, attachments: [newAttachment] }];
        }
        
        yearData[committeeIndex] = committee;

        return {
            ...prevData,
            [selectedYear]: yearData,
        };
    });
  };

  const handleFileDelete = (committeeId: number, month: number, attachmentId: number) => {
    if (!window.confirm('この添付ファイルを削除しますか？')) return;

    setCommitteesData(prevData => {
        const yearData = [...(prevData[selectedYear] || [])];
        const committeeIndex = yearData.findIndex(c => c.id === committeeId);
        if (committeeIndex === -1) return prevData;

        const committee = { ...yearData[committeeIndex] };
        const minuteIndex = committee.minutes.findIndex(m => m.month === month);
        if (minuteIndex === -1) return prevData;
        
        const minute = { ...committee.minutes[minuteIndex] };
        minute.attachments = minute.attachments.filter(att => att.id !== attachmentId);

        committee.minutes = [...committee.minutes];
        committee.minutes[minuteIndex] = minute;
        yearData[committeeIndex] = committee;

        return {
            ...prevData,
            [selectedYear]: yearData,
        };
    });
  }
  
  const fiscalYearMonths = [4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3];

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-slate-800">委員会資料 ({selectedYear}年度)</h2>
        <div className="flex-shrink-0">
          <label htmlFor="year-select" className="sr-only">年度選択</label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => {
                const newYear = Number(e.target.value);
                setSelectedYear(newYear);
                setExpandedCommitteeId(committeesData[newYear]?.[0]?.id || null);
            }}
            className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm rounded-md"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year}年度</option>
            ))}
          </select>
        </div>
      </div>
      <div className="space-y-2">
        {committeesForSelectedYear.map((committee) => (
          <div key={committee.id} className="border border-slate-200 rounded-lg">
            <button
              onClick={() => handleToggle(committee.id)}
              className="w-full flex justify-between items-center p-4 text-left font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              aria-expanded={expandedCommitteeId === committee.id}
              aria-controls={`committee-content-${committee.id}`}
            >
              <span>{committee.name}</span>
              {expandedCommitteeId === committee.id ? (
                <ChevronUpIcon className="h-5 w-5 text-slate-500" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-slate-500" />
              )}
            </button>
            {expandedCommitteeId === committee.id && (
              <div
                id={`committee-content-${committee.id}`}
                className="p-4 border-t border-slate-200 bg-slate-50"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {fiscalYearMonths.map((month, index) => {
                    const minute = committee.minutes.find(m => m.month === month);
                    const menuKey = `${committee.id}-${month}`;
                    return (
                      <div key={index} className="p-3 bg-white rounded-md border border-slate-200 flex flex-col">
                        <p className="text-center font-bold text-slate-600 mb-2">{month}月</p>
                        <div className="flex-grow flex flex-col justify-center items-center space-y-2">
                          {minute && minute.attachments.length > 0 ? (
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenAttachmentsMenu(openAttachmentsMenu === menuKey ? null : menuKey);
                                }}
                                className="p-2 rounded-full hover:bg-slate-200 transition-colors"
                                aria-label="添付ファイルを開く"
                                aria-haspopup="true"
                                aria-expanded={openAttachmentsMenu === menuKey}
                              >
                                <PaperclipIcon className="h-6 w-6 text-slate-500" />
                              </button>
                              
                              {openAttachmentsMenu === menuKey && (
                                <div
                                  className="absolute right-1/2 translate-x-1/2 mt-2 w-64 bg-white rounded-md shadow-lg z-20 border border-slate-200 origin-top"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="p-2" role="menu" aria-orientation="vertical">
                                    <p className="text-sm font-semibold text-slate-800 px-2 pb-2 border-b mb-1">{month}月 議事録</p>
                                    <ul className="space-y-1">
                                      {minute.attachments.map(attachment => (
                                        <li key={attachment.id} className="group relative rounded-md hover:bg-slate-50">
                                          <a
                                            href={attachment.url || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex flex-col px-2 py-1.5 text-sm text-slate-700"
                                            role="menuitem"
                                          >
                                            <div className="flex items-center">
                                              <DocumentTextIcon className="w-4 h-4 mr-2 text-slate-500 flex-shrink-0" />
                                              <span className="truncate flex-1 font-medium" title={attachment.fileName}>{attachment.fileName}</span>
                                            </div>
                                            <span className="text-xs text-slate-400 ml-6">{attachment.uploadedDate}</span>
                                          </a>
                                          {isLoggedIn && (
                                            <button
                                              onClick={() => handleFileDelete(committee.id, month, attachment.id)}
                                              className="absolute top-1 right-1 p-0.5 bg-red-100 rounded-full text-red-500 hover:bg-red-200 opacity-0 group-hover:opacity-100 transition-opacity"
                                              aria-label="削除"
                                            >
                                              <XMarkIcon className="w-3 h-3" />
                                            </button>
                                          )}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">資料なし</span>
                          )}
                        </div>
                        {isLoggedIn && (
                          <div className="mt-2 pt-2 border-t border-dashed">
                            <label className="cursor-pointer flex items-center justify-center text-slate-500 hover:text-brand-blue transition-colors text-xs">
                              <PlusIcon className="w-4 h-4 mr-1" />
                              <span>{minute?.attachments.length ? '追加' : 'アップロード'}</span>
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleFileUpload(committee.id, month, e.target.files[0]);
                                  }
                                }}
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Committee;
