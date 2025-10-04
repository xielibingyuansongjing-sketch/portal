
import React, { useState, useEffect } from 'react';
import { QUICK_LINKS } from '../constants';
import type { Post, View } from '../types';
import { ChevronRightIcon, PaperclipIcon, PlusIcon, ArrowRightOnRectangleIcon, DocumentTextIcon, ChevronDownIcon, ChevronUpIcon } from './icons/Icons';

const getCategoryClass = (category: Post['category']) => {
  switch (category) {
    case '重要':
      return 'bg-red-100 text-red-800';
    case '研修':
      return 'bg-blue-100 text-blue-800';
    case '通知':
      return 'bg-green-100 text-green-800';
    case '周知':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-slate-100 text-slate-800';
  }
};

interface BulletinBoardCardProps {
  posts: Post[];
  setCurrentView: (view: View) => void;
  isLoggedIn: boolean;
}

const BulletinBoardCard: React.FC<BulletinBoardCardProps> = ({ posts, setCurrentView, isLoggedIn }) => {
  const [openAttachmentsId, setOpenAttachmentsId] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const INITIAL_DISPLAY_COUNT = 10;

  useEffect(() => {
    const handleClickOutside = () => {
        setOpenAttachmentsId(null);
    };

    if (openAttachmentsId !== null) {
        // Use a timeout to ensure the event listener is added after the current click event has finished.
        const timerId = setTimeout(() => {
            document.addEventListener('click', handleClickOutside);
        }, 0);

        return () => {
            clearTimeout(timerId);
            document.removeEventListener('click', handleClickOutside);
        };
    }
  }, [openAttachmentsId]);

  const canExpand = posts.length > INITIAL_DISPLAY_COUNT;
  const postsToShow = isExpanded ? posts : posts.slice(0, INITIAL_DISPLAY_COUNT);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-800">掲示板</h3>
        {isLoggedIn ? (
          <button 
            onClick={() => setCurrentView('new-post')}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-brand-blue rounded-lg hover:bg-brand-blue-dark transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            新規投稿
          </button>
        ) : (
          <button 
            onClick={() => setCurrentView('login')}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-brand-green rounded-lg hover:bg-brand-green-dark transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
            ログイン
          </button>
        )}
      </div>
      <ul className="space-y-3">
        {postsToShow.map((post) => (
          <li key={post.id} className="flex items-center justify-between p-3 rounded-md hover:bg-slate-50 transition-colors">
            <div className="flex items-center overflow-hidden">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${getCategoryClass(post.category)}`}>
                {post.category}
              </span>
              <span className="text-sm text-slate-500 ml-4 flex-shrink-0">{post.date}</span>
              <p className="text-sm text-slate-700 ml-4 font-medium truncate" title={post.title}>{post.title}</p>
            </div>
            <div className="flex items-center flex-shrink-0 ml-4">
               <div className="relative">
                {post.attachments.length > 0 && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpenAttachmentsId(openAttachmentsId === post.id ? null : post.id);
                        }}
                        className="p-1 rounded-full hover:bg-slate-200 transition-colors"
                        aria-label="添付ファイルを開く"
                        aria-haspopup="true"
                        aria-expanded={openAttachmentsId === post.id}
                    >
                        <PaperclipIcon className="h-5 w-5 text-slate-400" />
                    </button>
                )}
                {openAttachmentsId === post.id && (
                    <div
                        className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-20 border border-slate-200 origin-top-right"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="py-1" role="menu" aria-orientation="vertical">
                            {post.attachments.map((attachment, index) => (
                                <a
                                    key={index}
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                    role="menuitem"
                                >
                                    <DocumentTextIcon className="w-4 h-4 mr-2 text-slate-500 flex-shrink-0" />
                                    <span className="truncate">{attachment.name}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
               </div>
               <span className="text-sm text-slate-500 ml-4 w-24 text-right truncate">{post.author}</span>
              <ChevronRightIcon className="h-5 w-5 text-slate-400 ml-2" />
            </div>
          </li>
        ))}
      </ul>
      {canExpand && (
        <div className="mt-4 text-center">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-brand-blue rounded-lg hover:bg-brand-blue-light transition-colors"
                aria-expanded={isExpanded}
            >
                {isExpanded ? '折りたたむ' : 'さらに表示'}
                {isExpanded ? <ChevronUpIcon className="h-5 w-5 ml-2" /> : <ChevronDownIcon className="h-5 w-5 ml-2" />}
            </button>
        </div>
      )}
    </div>
  );
};

interface QuickLinksCardProps {
  setCurrentView: (view: View) => void;
}

const QuickLinksCard: React.FC<QuickLinksCardProps> = ({ setCurrentView }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm">
    <h3 className="text-lg font-bold text-slate-800 mb-4">クイックリンク</h3>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {QUICK_LINKS.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.id}
            href="#"
            onClick={(e) => {
                if (link.navTarget) {
                    e.preventDefault();
                    setCurrentView(link.navTarget);
                }
            }}
            className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg hover:bg-brand-blue-light hover:text-brand-blue-dark transition-colors"
          >
            <Icon className="h-8 w-8 mb-2 text-slate-600" />
            <span className="text-sm font-semibold text-slate-700 text-center">{link.label}</span>
          </a>
        );
      })}
    </div>
  </div>
);

interface DashboardProps {
  posts: Post[];
  setCurrentView: (view: View) => void;
  isLoggedIn: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ posts, setCurrentView, isLoggedIn }) => {
  return (
    <div className="space-y-4">
      <QuickLinksCard setCurrentView={setCurrentView} />
      <BulletinBoardCard posts={posts} setCurrentView={setCurrentView} isLoggedIn={isLoggedIn} />
    </div>
  );
};

export default Dashboard;
