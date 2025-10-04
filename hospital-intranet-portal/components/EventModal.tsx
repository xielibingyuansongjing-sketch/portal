import React, { useState, useEffect } from 'react';
import type { ScheduleEvent, User } from '../types';
import { ClockIcon, XMarkIcon, TrashIcon } from './icons/Icons';
import { EVENT_COLORS } from '../constants';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: Omit<ScheduleEvent, 'id' | 'authorId' | 'authorName' | 'date'>) => void;
  onDelete: (eventId: number) => void;
  event: ScheduleEvent | null;
  date: Date | null;
  user: User | null;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave, onDelete, event, date, user }) => {
  const [title, setTitle] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(EVENT_COLORS[0].key);

  const isNewEvent = !event;
  const canEdit = user && (isNewEvent || event.authorId === user.id);
  const startDateString = date ? date.toISOString().split('T')[0] : '';

  useEffect(() => {
    if (isOpen) {
      setTitle(event?.title || '');
      setEndDate(event?.endDate || startDateString);
      setStartTime(event?.startTime || '');
      setEndTime(event?.endTime || '');
      setDescription(event?.description || '');
      setColor(event?.color || EVENT_COLORS[0].key);
    }
  }, [isOpen, event, startDateString]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
        alert('タイトルを入力してください。');
        return;
    }
    if (endDate && startDateString > endDate) {
        alert('終了日は開始日以降に設定してください。');
        return;
    }

    const finalEndDate = endDate === startDateString ? undefined : endDate;
    onSave({ title, endDate: finalEndDate, startTime, endTime, description, color });
  };
  
  const handleDelete = () => {
      if (event && window.confirm('この予定を削除しますか？')) {
          onDelete(event.id);
      }
  }

  if (!isOpen) return null;

  const displayDate = date ? new Intl.DateTimeFormat('ja-JP-u-ca-japanese', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }).format(date) : '';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">{isNewEvent ? '予定の追加' : '予定の詳細'}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100" aria-label="閉じる">
            <XMarkIcon className="h-6 w-6 text-slate-500" />
          </button>
        </div>
        
        {canEdit ? (
          <form onSubmit={handleSubmit} className="space-y-4">
             <div className="flex gap-4">
                 <div className="flex-1">
                    <label htmlFor="start-date" className="block text-sm font-medium text-slate-700">開始日</label>
                    <input
                        id="start-date"
                        type="date"
                        value={startDateString}
                        className="mt-1 block w-full border-slate-300 rounded-md shadow-sm bg-slate-100"
                        readOnly
                    />
                 </div>
                 <div className="flex-1">
                    <label htmlFor="end-date" className="block text-sm font-medium text-slate-700">終了日</label>
                    <input
                        id="end-date"
                        type="date"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        min={startDateString}
                        className="mt-1 block w-full border-slate-300 rounded-md shadow-sm"
                    />
                 </div>
            </div>
            <div>
              <label htmlFor="event-title" className="block text-sm font-medium text-slate-700">タイトル</label>
              <input
                id="event-title"
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="mt-1 block w-full border-slate-300 rounded-md shadow-sm"
                required
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="start-time" className="block text-sm font-medium text-slate-700">開始時間</label>
                <input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="mt-1 block w-full border-slate-300 rounded-md shadow-sm"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="end-time" className="block text-sm font-medium text-slate-700">終了時間</label>
                <input
                  id="end-time"
                  type="time"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  className="mt-1 block w-full border-slate-300 rounded-md shadow-sm"
                />
              </div>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700">詳細 (任意)</label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="mt-1 block w-full border-slate-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">カラー</label>
              <div className="mt-2 flex space-x-3">
                {EVENT_COLORS.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setColor(c.key)}
                    className={`w-8 h-8 rounded-full ${c.bgClass} transition-all duration-150 ${color === c.key ? 'ring-2 ring-offset-2 ring-brand-blue' : 'ring-1 ring-slate-300'}`}
                    aria-label={c.name}
                  >
                    <span className="sr-only">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center pt-4">
              <div>
                {!isNewEvent && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-lg hover:bg-red-200"
                  >
                    <TrashIcon className="h-5 w-5 mr-2" />
                    削除
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200">
                  キャンセル
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-blue rounded-lg hover:bg-brand-blue-dark">
                  保存
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
             <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-slate-900">{event?.title}</h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${EVENT_COLORS.find(c => c.key === event?.color)?.bgClass} ${EVENT_COLORS.find(c => c.key === event?.color)?.textClass}`}>
                    {EVENT_COLORS.find(c => c.key === event?.color)?.name}
                </span>
             </div>
             <p className="font-medium text-slate-600">{displayDate}{event?.endDate && ` 〜 ${new Intl.DateTimeFormat('ja-JP', { month: 'long', day: 'numeric' }).format(new Date(event.endDate))}`}</p>
            <div className="flex items-center text-slate-600">
                <ClockIcon className="h-5 w-5 mr-2"/>
                <span>{event?.startTime ? `${event.startTime}${event.endTime ? ` - ${event.endTime}` : ''}` : '終日'}</span>
            </div>
            {event?.description && <p className="text-slate-700 whitespace-pre-wrap">{event.description}</p>}
            <div className="text-sm text-slate-500 pt-2 border-t mt-4">
                登録者: {event?.authorName}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventModal;