import React from 'react';
import type { View, User } from '../types';
import { NAVIGATION_LINKS } from '../constants';
import { HospitalIcon, ArrowLeftOnRectangleIcon } from './icons/Icons';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  user: User | null;
  onLogout: () => void;
  isLoggedIn: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, user, onLogout, isLoggedIn }) => {
  return (
    <aside className="w-64 bg-white flex-shrink-0 border-r border-slate-200 flex flex-col">
      <div className="h-16 flex items-center justify-center border-b border-slate-200 px-4">
        <HospitalIcon className="h-8 w-8 text-brand-blue" />
        <h1 className="text-xl font-bold text-slate-800 ml-2">協立ポータル</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {NAVIGATION_LINKS.map((link) => {
          if (link.id === 'admin' && !isLoggedIn) {
            return null;
          }
          const Icon = link.icon;
          const isActive = currentView === link.id;
          return (
            <a
              key={link.id}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentView(link.id as View);
              }}
              className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-brand-blue-light text-brand-blue-dark'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {link.label}
            </a>
          );
        })}
      </nav>
      {isLoggedIn && user && (
        <div className="px-4 py-4 border-t border-slate-200">
            <div className="flex items-center">
                <img className="h-10 w-10 rounded-full object-cover" src={user.avatarUrl} alt="User Avatar" />
                <div className="ml-3 flex-1">
                    <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.role}</p>
                </div>
                <button onClick={onLogout} className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800" aria-label="ログアウト">
                    <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
      )}
      <div className="px-4 py-2 text-center">
        <p className="text-xs text-slate-400">Ver3.00</p>
      </div>
    </aside>
  );
};

export default Sidebar;