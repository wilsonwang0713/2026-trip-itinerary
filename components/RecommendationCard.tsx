import React from 'react';
import { RecommendationGroup } from '../types';
import { Star } from 'lucide-react';

interface Props {
  groups: RecommendationGroup[];
}

export const RecommendationCard: React.FC<Props> = ({ groups }) => {
  return (
    <div className="ml-16 mb-8 mr-1">
      <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl border border-dashed border-slate-300 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-slate-700">
            <Star size={16} className="text-amber-400 fill-current" />
            <h4 className="text-sm font-bold tracking-wide uppercase">W&P 小旅行口袋名單</h4>
        </div>
        
        <div className="space-y-4">
            {groups.map((group, idx) => (
                <div key={idx}>
                    <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded w-fit">
                        <group.icon size={12} />
                        <span>{group.category}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {group.items.map((item, i) => (
                            <span key={i} className="text-xs text-slate-600 border border-slate-200 bg-white px-2 py-1 rounded-md shadow-sm">
                                {item.name}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};