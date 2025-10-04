import React, { useState, useMemo, useEffect } from 'react';
import type { DirectoryEntry } from '../types';
import { SearchIcon, PencilIcon, TrashIcon, CheckIcon, PlusIcon, XMarkIcon } from './icons/Icons';

interface InternalDirectoryProps {
  entries: DirectoryEntry[];
  isLoggedIn: boolean;
  onAdd: (entry: Omit<DirectoryEntry, 'id'>) => void;
  onUpdate: (entry: DirectoryEntry) => void;
  onDelete: (id: number) => void;
}

const InternalDirectory: React.FC<InternalDirectoryProps> = ({ entries, isLoggedIn, onAdd, onUpdate, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editedEntry, setEditedEntry] = useState<DirectoryEntry | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newEntry, setNewEntry] = useState({ department: '', name: '', extension: '' });

    const filteredEntries = useMemo(() => {
        const sorted = [...entries].sort((a,b) => a.department.localeCompare(b.department) || a.name.localeCompare(b.name));
        if (!searchTerm) return sorted;
        const lowercasedFilter = searchTerm.toLowerCase();
        return sorted.filter(e =>
            e.department.toLowerCase().includes(lowercasedFilter) ||
            e.name.toLowerCase().includes(lowercasedFilter) ||
            e.extension.includes(searchTerm)
        );
    }, [searchTerm, entries]);

    const groupedEntries = useMemo(() => {
        return filteredEntries.reduce((acc, entry) => {
            (acc[entry.department] = acc[entry.department] || []).push(entry);
            return acc;
        }, {} as Record<string, DirectoryEntry[]>);
    }, [filteredEntries]);

    useEffect(() => {
        if (!isLoggedIn) {
            setEditingId(null);
            setIsAdding(false);
        }
    }, [isLoggedIn]);

    const handleEditStart = (entry: DirectoryEntry) => {
        setEditingId(entry.id);
        setEditedEntry({ ...entry });
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditedEntry(null);
    };

    const handleSave = () => {
        if (editedEntry) {
            onUpdate(editedEntry);
            handleCancel();
        }
    };
    
    const handleDelete = (id: number) => {
        if (window.confirm('この内線番号を削除しますか？')) {
            onDelete(id);
        }
    };

    const handleAddStart = () => {
        setIsAdding(true);
    };

    const handleAddCancel = () => {
        setIsAdding(false);
        setNewEntry({ department: '', name: '', extension: '' });
    };
    
    const handleAddSave = () => {
        if (!newEntry.department || !newEntry.name || !newEntry.extension) {
            alert('すべての項目を入力してください。');
            return;
        }
        onAdd(newEntry);
        handleAddCancel();
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <div className="relative flex-grow">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="部署、氏名、内線番号で検索..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full sm:w-80 pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
                {isLoggedIn && !isAdding && (
                    <button onClick={handleAddStart} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-brand-blue rounded-lg hover:bg-brand-blue-dark transition-colors">
                        <PlusIcon className="h-5 w-5 mr-2" />
                        新規追加
                    </button>
                )}
            </div>
            <div className="space-y-8">
                {isAdding && (
                    <div className="p-4 bg-slate-50 rounded-lg border border-dashed mb-6">
                        <h3 className="font-semibold mb-2 text-slate-700">新規内線番号追加</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div>
                                <label htmlFor="new-dept" className="text-xs font-medium text-slate-500">部署</label>
                                <input id="new-dept" value={newEntry.department} onChange={e => setNewEntry({...newEntry, department: e.target.value})} placeholder="例: 事務部" className="w-full mt-1 border-slate-300 rounded-md text-sm" />
                            </div>
                            <div>
                                <label htmlFor="new-name" className="text-xs font-medium text-slate-500">名前・役職</label>
                                <input id="new-name" value={newEntry.name} onChange={e => setNewEntry({...newEntry, name: e.target.value})} placeholder="例: 総務課" className="w-full mt-1 border-slate-300 rounded-md text-sm" />
                            </div>
                            <div>
                                <label htmlFor="new-ext" className="text-xs font-medium text-slate-500">内線番号</label>
                                <input id="new-ext" value={newEntry.extension} onChange={e => setNewEntry({...newEntry, extension: e.target.value})} placeholder="例: 501" className="w-full mt-1 border-slate-300 rounded-md text-sm" />
                            </div>
                            <div className="flex gap-2 justify-end">
                                <button onClick={handleAddCancel} className="flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-slate-200 rounded-lg hover:bg-slate-300 transition-colors">
                                    <XMarkIcon className="h-5 w-5 mr-1" /> キャンセル
                                </button>
                                <button onClick={handleAddSave} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-brand-blue rounded-lg hover:bg-brand-blue-dark transition-colors">
                                    <CheckIcon className="h-5 w-5 mr-1" /> 保存
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {Object.entries(groupedEntries).map(([department, entriesInDept]) => (
                    <div key={department}>
                        <h3 className="text-lg font-bold text-slate-700 mb-3 pb-2 border-b-2 border-brand-blue">{department}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {entriesInDept.map(entry => {
                                const isEditing = editingId === entry.id && editedEntry;
                                return (
                                    <div key={entry.id} className={`p-3 rounded-lg border transition-all duration-200 ${isEditing ? 'bg-blue-50 border-brand-blue shadow-lg' : 'bg-white border-slate-200'}`}>
                                    {isEditing ? (
                                        <div className="space-y-2">
                                            <div>
                                                <label className="text-xs font-medium text-slate-500">部署</label>
                                                <input value={editedEntry.department} onChange={e => setEditedEntry({...editedEntry, department: e.target.value})} className="w-full border-slate-300 rounded-md text-sm p-1 focus:ring-brand-blue focus:border-brand-blue" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-slate-500">名前・役職</label>
                                                <input value={editedEntry.name} onChange={e => setEditedEntry({...editedEntry, name: e.target.value})} className="w-full border-slate-300 rounded-md text-sm p-1 focus:ring-brand-blue focus:border-brand-blue" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-slate-500">内線番号</label>
                                                <input value={editedEntry.extension} onChange={e => setEditedEntry({...editedEntry, extension: e.target.value})} className="w-full border-slate-300 rounded-md text-sm p-1 focus:ring-brand-blue focus:border-brand-blue" />
                                            </div>
                                            <div className="flex gap-2 justify-end pt-2">
                                                <button onClick={handleSave} className="p-2 text-brand-green rounded-md hover:bg-green-100" aria-label="保存"><CheckIcon className="h-5 w-5"/></button>
                                                <button onClick={handleCancel} className="p-2 text-slate-500 rounded-md hover:bg-slate-100" aria-label="キャンセル"><XMarkIcon className="h-5 w-5"/></button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-center group min-h-[56px]">
                                            <div className="flex items-center overflow-hidden">
                                                <div className="w-16 text-center mr-3 flex-shrink-0">
                                                     <p className="text-xl font-bold text-brand-blue truncate">{entry.extension}</p>
                                                </div>
                                                <div className="border-l border-slate-200 pl-3">
                                                     <p className="text-sm font-medium text-slate-800 truncate" title={entry.name}>{entry.name}</p>
                                                </div>
                                            </div>
                                            {isLoggedIn && (
                                                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEditStart(entry)} className="p-1 text-slate-500 rounded-md hover:bg-slate-100 hover:text-brand-blue" aria-label="編集"><PencilIcon className="h-4 w-4"/></button>
                                                    <button onClick={() => handleDelete(entry.id)} className="p-1 text-slate-500 rounded-md hover:bg-slate-100 hover:text-red-600" aria-label="削除"><TrashIcon className="h-4 w-4"/></button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InternalDirectory;
