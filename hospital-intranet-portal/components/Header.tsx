import React from 'react';
import { BellIcon, SearchIcon } from './icons/Icons';
import type { View } from '../types';
import { NAVIGATION_LINKS } from '../constants';

interface HeaderProps {
    currentView: View;
}

const Header: React.FC<HeaderProps> = ({ currentView }) => {
  const getTitle = () => {
    if (currentView === 'dashboard') return null;
    if (currentView === 'login') return 'ログイン';
    if (currentView === 'new-post') return '新規投稿';
    if (currentView === 'committee') return '委員会資料';
    if (currentView === 'internal-directory') return '院内内線表';
    if (currentView === 'hospital-log') return '病院日誌';
    if (currentView === 'duty-log') return '当直日誌';
    const viewTitle = NAVIGATION_LINKS.find(link => link.id === currentView)?.label;
    return viewTitle;
  }

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center">
        <h2 className="text-2xl font-bold text-slate-800">{getTitle()}</h2>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="検索..."
            className="w-64 pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
        </div>
        <button className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">
          <BellIcon className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;
