
import React from 'react';
import type { Post } from '../types';
import { EyeIcon, EyeSlashIcon, PaperclipIcon, TrashIcon } from './icons/Icons';

interface AdminProps {
  posts: Post[];
  updatePost: (post: Post) => void;
  deletePost: (postId: number) => void;
}

const Admin: React.FC<AdminProps> = ({ posts, updatePost, deletePost }) => {
  
  const handleVisibilityToggle = (post: Post) => {
    updatePost({ ...post, isVisible: !post.isVisible });
  };
  
  const handleDateChange = (post: Post, dateType: 'start' | 'end', value: string) => {
    if (dateType === 'start') {
        updatePost({ ...post, displayStartDate: value });
    } else {
        updatePost({ ...post, displayEndDate: value });
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">投稿管理</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">タイトル</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">作成者</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">表示期間</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">添付</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">表示状態</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {posts.map((post) => (
              <tr key={post.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">{post.title}</div>
                  <div className="text-sm text-slate-500">{post.category} - {post.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{post.author}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    <div className="flex flex-col space-y-2">
                        <input 
                            type="date" 
                            value={post.displayStartDate || ''}
                            onChange={(e) => handleDateChange(post, 'start', e.target.value)}
                            className="text-sm border-slate-300 rounded-md"
                        />
                        <input 
                            type="date" 
                            value={post.displayEndDate || ''}
                            onChange={(e) => handleDateChange(post, 'end', e.target.value)}
                            className="text-sm border-slate-300 rounded-md"
                        />
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {post.attachments.length > 0 ? (
                    <div className="flex items-center">
                        <PaperclipIcon className="h-5 w-5 text-slate-400 mr-1" /> {post.attachments.length}
                    </div>
                  ) : 'なし'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button onClick={() => handleVisibilityToggle(post)} className="p-2 rounded-full hover:bg-slate-100">
                    {post.isVisible ? 
                        <EyeIcon className="h-5 w-5 text-green-500" /> : 
                        <EyeSlashIcon className="h-5 w-5 text-slate-400" />
                    }
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  {/* In a real app, 'Add' would open a file picker and 'Remove' a modal */}
                  <button className="text-brand-blue hover:text-brand-blue-dark mr-3">添付追加</button>
                  <button onClick={() => deletePost(post.id)} className="text-red-600 hover:text-red-800">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
