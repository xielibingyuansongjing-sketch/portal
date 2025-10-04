
import React from 'react';
import { UserGroupIcon } from './icons/Icons';

const Directory: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="text-center text-slate-500">
        <UserGroupIcon className="h-16 w-16 mx-auto text-slate-400 mb-4" />
        <h2 className="text-2xl font-bold text-slate-700">職員名簿</h2>
        <p className="mt-2">このページは現在開発中です。</p>
      </div>
    </div>
  );
};

export default Directory;
