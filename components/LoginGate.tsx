import React, { useState, useEffect } from 'react';
import { Lock, Unlock, ArrowRight } from 'lucide-react';

interface LoginGateProps {
  onUnlock: () => void;
}

export const LoginGate: React.FC<LoginGateProps> = ({ onUnlock }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const savedAuth = localStorage.getItem('isItineraryAuth');
    if (savedAuth === 'true') {
      onUnlock();
    }
  }, [onUnlock]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '850619') {
      setIsAnimating(true);
      localStorage.setItem('isItineraryAuth', 'true');
      setTimeout(() => {
        onUnlock();
      }, 800);
    } else {
      setError(true);
      setPasscode('');
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#2d3748] flex items-center justify-center z-[100] px-6">
      <div className={`
        bg-[#fffdf7] w-full max-w-sm rounded-3xl shadow-2xl p-8 relative overflow-hidden
        transition-all duration-700 transform
        ${isAnimating ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}
      `}>
        {/* Tape decoration */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-200/80 w-32 h-8 rotate-[-2deg] shadow-sm"></div>

        <div className="flex flex-col items-center mb-8 mt-4">
          <div className={`
            w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4 border-4 border-slate-200 shadow-inner
            transition-colors duration-300
            ${error ? 'bg-red-50 border-red-200' : ''}
            ${isAnimating ? 'bg-green-100 border-green-200' : ''}
          `}>
            {isAnimating ? (
               <Unlock size={32} className="text-green-500" />
            ) : (
               <Lock size={32} className={error ? 'text-red-400' : 'text-slate-400'} />
            )}
          </div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">旅行手帳</h2>
          <p className="text-slate-500 text-sm mt-1">請輸入密碼解鎖行程</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <input 
              type="password" 
              inputMode="numeric"
              pattern="[0-9]*"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="******"
              className={`
                w-full bg-slate-50 border-2 rounded-2xl px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] text-slate-700 outline-none transition-all
                ${error ? 'border-red-300 bg-red-50 animate-shake' : 'border-slate-200 focus:border-blue-300'}
              `}
              autoFocus
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-lg mt-6 flex items-center justify-center gap-2 hover:bg-slate-700 active:scale-95 transition-all"
          >
            <span>開啟行程</span>
            <ArrowRight size={20} />
          </button>
        </form>
        
        <div className="text-center mt-6 text-xs text-slate-300">
           Protected by W&P
        </div>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};