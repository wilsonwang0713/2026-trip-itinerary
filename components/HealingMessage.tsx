import React from 'react';
import { X, Heart } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const HealingMessage: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-md relative my-auto">
        
        {/* Paper Card */}
        <div className="relative bg-[#fffbf0] px-6 py-10 rounded-2xl shadow-2xl border border-[#eaddcf] overflow-hidden">
            
            {/* Watercolor Texture Effects (CSS only) */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-pink-200/30 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-100/30 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
            
            {/* Paper Noise Texture */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

            {/* Content */}
            <div className="relative z-10 text-slate-700">
                {/* Header Icon */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white p-3 rounded-full shadow-sm border border-pink-100">
                        <Heart size={24} className="text-pink-400 fill-pink-400" />
                    </div>
                </div>
                
                {/* Recipient */}
                <h3 className="text-xl font-bold text-slate-800 mb-6 pl-3 border-l-4 border-pink-300">
                    姵，
                </h3>
                
                {/* Body Text */}
                <div className="space-y-6 text-[15px] leading-8 tracking-wide text-slate-600 font-sans text-justify">
                    <p>
                        這趟即將到來的小旅行，於我而言，更像一次重新把自己交回生活。
                    </p>
                    <p>
                        生病之後，我走得慢，也常需要停下，而你始終在我身旁，沒有催促，也沒有多說，只是陪著。
                        <span className="block mt-3 font-bold text-slate-700 bg-pink-50/80 px-3 py-2 -mx-2 rounded-lg border border-pink-100/50">是因為你，我才敢再往前一步。</span>
                    </p>
                    <p>
                        我心裡明白，能這樣被等待、被理解，是一件難得的事。
                    </p>
                    <p>
                        這次出門，不必遠，也不必特別，只要能和你一起，把時間走得安靜一些，我就已經很滿足。
                    </p>
                </div>

                {/* Footer / Signature */}
                <div className="mt-10 pt-8 border-t border-dashed border-slate-300">
                        <p className="text-right text-sm text-slate-500 leading-relaxed italic">
                        願在往後的日子裡，<br/>
                        我仍能這樣，輕輕地，<br/>
                        <span className="font-bold text-pink-500 not-italic text-base mt-1 inline-block">把自己交給你。</span>
                    </p>
                </div>
            </div>
        </div>
        
        {/* Floating Close Button */}
        <div className="flex justify-center mt-8 pb-4">
            <button 
              onClick={onClose}
              className="group flex items-center gap-2 bg-slate-800 text-white px-8 py-3 rounded-full hover:bg-slate-700 hover:scale-105 transition-all active:scale-95 shadow-lg border border-white/20"
            >
              <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              <span className="text-xs font-bold tracking-[0.2em]">CLOSE</span>
            </button>
        </div>

      </div>
    </div>
  );
};