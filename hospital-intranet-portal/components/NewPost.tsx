
import React, { useState } from 'react';
import type { Post, View } from '../types';
import { ArrowUturnLeftIcon } from './icons/Icons';

interface NewPostProps {
  addPost: (post: Omit<Post, 'id' | 'date' | 'author'>) => void;
  setCurrentView: (view: View) => void;
}

const NewPost: React.FC<NewPostProps> = ({ addPost, setCurrentView }) => {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'重要' | '研修' | '通知' | '一般' | '周知'>('一般');
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        setAttachments(Array.from(e.target.files));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) {
        alert('本文を入力してください。');
        return;
    }

    const generatedTitle = content.length > 20 ? content.substring(0, 20) + '...' : content;

    addPost({
        title: generatedTitle,
        content,
        category,
        attachments: attachments.map(file => ({ name: file.name, url: '#' })), // Placeholder URL
        isVisible: true,
    });
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">新規投稿作成</h2>
            <button
                onClick={() => setCurrentView('dashboard')}
                className="flex items-center px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
                <ArrowUturnLeftIcon className="h-5 w-5 mr-2" />
                ダッシュボードに戻る
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="post-category" className="block text-sm font-medium text-slate-700">カテゴリ</label>
                <select
                    id="post-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm rounded-md"
                >
                    <option>一般</option>
                    <option>重要</option>
                    <option>研修</option>
                    <option>通知</option>
                    <option>周知</option>
                </select>
            </div>

            <div>
                <label htmlFor="post-content" className="block text-sm font-medium text-slate-700">本文</label>
                <textarea
                    id="post-content"
                    rows={8}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                    required
                />
            </div>
            
            <div>
                 <label className="block text-sm font-medium text-slate-700">添付ファイル</label>
                 <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-slate-600">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-brand-blue hover:text-brand-blue-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-blue">
                                <span>ファイルをアップロード</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} />
                            </label>
                            <p className="pl-1">またはドラッグ＆ドロップ</p>
                        </div>
                        <p className="text-xs text-slate-500">PNG, JPG, GIF, PDFなど</p>
                    </div>
                 </div>
                 {attachments.length > 0 && (
                     <div className="mt-4">
                         <p className="text-sm font-medium text-slate-700">選択中のファイル:</p>
                         <ul className="list-disc list-inside text-sm text-slate-600">
                             {attachments.map(file => <li key={file.name}>{file.name}</li>)}
                         </ul>
                     </div>
                 )}
            </div>

            <div className="flex justify-end pt-4">
                 <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-blue hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
                 >
                    投稿する
                </button>
            </div>
        </form>
    </div>
  );
};

export default NewPost;
