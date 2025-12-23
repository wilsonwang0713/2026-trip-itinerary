import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { ActivityType } from '../types';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: any) => void;
  selectedDate: string;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose, onAdd, selectedDate }) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState<ActivityType>(ActivityType.ACTIVITY);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !time) return;

    onAdd({
      title,
      time,
      type,
      description: '手動新增項目',
      details: [],
    });
    
    // Reset and close
    setTitle('');
    setTime('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-[#fffdf7] w-full max-w-sm rounded-3xl shadow-2xl p-6 relative z-10 border-4 border-white">
        
        {/* Decorative Tape */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-pink-200/80 rotate-1"></div>

        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
            <X size={24} />
        </button>

        <h3 className="text-xl font-bold text-slate-700 mb-6 text-center mt-2">
           🖊️ 寫入新行程
           <span className="block text-xs font-normal text-slate-400 mt-1">
             Day {selectedDate.split('/')[1]}
           </span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">時間</label>
                <input 
                    type="time" 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-200"
                    required
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">標題</label>
                <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="例如：買伴手禮"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-200"
                    required
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">類型</label>
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { id: ActivityType.ACTIVITY, label: '活動', color: 'bg-green-100 text-green-700' },
                        { id: ActivityType.SIGHTSEEING, label: '景點', color: 'bg-teal-100 text-teal-700' },
                        { id: ActivityType.FOOD, label: '食物', color: 'bg-orange-100 text-orange-700' },
                        { id: ActivityType.TRANSPORT, label: '交通', color: 'bg-blue-100 text-blue-700' },
                        { id: ActivityType.HOTEL, label: '住宿', color: 'bg-purple-100 text-purple-700' },
                        { id: ActivityType.TICKET, label: '票券', color: 'bg-yellow-100 text-yellow-700' },
                    ].map((opt) => (
                        <button
                            key={opt.id}
                            type="button"
                            onClick={() => setType(opt.id)}
                            className={`
                                py-2 rounded-lg text-sm font-bold transition-all
                                ${type === opt.id ? `${opt.color} ring-2 ring-offset-1 ring-slate-200` : 'bg-slate-100 text-slate-400'}
                            `}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            <button 
                type="submit"
                className="w-full bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg mt-4 flex items-center justify-center gap-2 hover:bg-slate-700 active:scale-95 transition-all"
            >
                <Plus size={20} />
                <span>貼上行程</span>
            </button>
        </form>
      </div>
    </div>
  );
};