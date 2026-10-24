import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { ShieldCheck, Lock, Eye, EyeOff, X, ArrowRight } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose }) => {
  const { loginAdmin, setMode } = useRestaurant();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(password);
    if (success) {
      setMode('admin');
      setPassword('');
      setErrorMsg('');
      onClose();
    } else {
      setErrorMsg('Xato admin paroli! Iltimos, qayta urinib ko‘ring.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-stone-950 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-stone-100 flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4 shadow-lg shadow-amber-500/10">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <h3 className="font-serif text-2xl font-bold text-stone-100 mb-1">
          Admin Tizimiga Kirish
        </h3>
        <p className="text-xs text-stone-400 text-center mb-6">
          Savoria Restaurant boshqaruv paneliga kirish uchun parolni kiriting
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">
              Admin Paroli
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                placeholder="Admin parolini kiriting"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full pl-10 pr-10 py-3 bg-stone-900 border border-white/10 rounded-xl text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="text-xs text-rose-400 font-semibold text-center animate-bounce">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-xl shadow-amber-500/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Boshqaruv Paneliga Kirish</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
