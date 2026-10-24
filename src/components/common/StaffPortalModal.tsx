import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { ShieldAlert, UserCheck, Lock, Eye, EyeOff, X, ArrowRight, Delete, KeyRound } from 'lucide-react';

interface StaffPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'waiter' | 'admin';
}

export const StaffPortalModal: React.FC<StaffPortalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'waiter'
}) => {
  const { loginAdmin, loginWaiter, setMode } = useRestaurant();
  const [activeTab, setActiveTab] = useState<'waiter' | 'admin'>(initialTab);

  // Waiter PIN state
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

  // Admin password state
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [adminError, setAdminError] = useState('');

  useEffect(() => {
    setActiveTab(initialTab);
    setPin('');
    setPassword('');
    setPinError('');
    setAdminError('');
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  // Waiter PIN Keypad
  const handlePinDigit = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setPinError('');

      if (nextPin.length === 4) {
        setTimeout(() => {
          const success = loginWaiter(nextPin);
          if (success) {
            setMode('waiter');
            setPin('');
            onClose();
          } else {
            setPinError('Noto‘g‘ri PIN kod! Qayta tekshiring.');
            setPin('');
          }
        }, 150);
      }
    }
  };

  const handlePinDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setPinError('');
  };

  const handlePinClear = () => {
    setPin('');
    setPinError('');
  };

  // Admin submit
  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setAdminError('Iltimos, admin parolini kiriting');
      return;
    }
    const success = loginAdmin(password.trim());
    if (success) {
      setMode('admin');
      setPassword('');
      setAdminError('');
      onClose();
    } else {
      setAdminError('Noto‘g‘ri parol! Tizimga kirish rad etildi.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-[#0c0d14] border border-[#d4af37]/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-stone-100 flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Yopish"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Crest */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d4af37]/20 to-amber-900/30 border border-[#d4af37]/40 text-[#d4af37] flex items-center justify-center mb-3 shadow-lg shadow-[#d4af37]/10">
          <Lock className="w-7 h-7" />
        </div>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-1 tracking-wide text-center">
          Xodimlar Tizimiga Kirish
        </h3>
        <p className="text-[11px] text-stone-400 text-center mb-5">
          Faqat Savoria restorani vakolatli xodimlari uchun himoyalangan zona
        </p>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-[#141624] rounded-2xl border border-white/10 w-full mb-6">
          <button
            type="button"
            onClick={() => {
              setActiveTab('waiter');
              setPin('');
              setPinError('');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'waiter'
                ? 'bg-[#d4af37] text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 shrink-0" />
            <span>Ofitsiant POS</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              setPassword('');
              setAdminError('');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-[#d4af37] text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span>Admin Paneli</span>
          </button>
        </div>

        {/* TAB 1: WAITER PIN PAD */}
        {activeTab === 'waiter' && (
          <div className="w-full flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2 text-stone-300 text-xs font-medium">
              <KeyRound className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>4 xonali shaxsiy PIN kodingizni tering:</span>
            </div>

            {/* PIN Dots */}
            <div className="flex gap-4 mb-5">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full border-2 transition-all ${
                    pin.length > idx
                      ? 'bg-[#d4af37] border-[#d4af37] scale-125 shadow-md shadow-[#d4af37]/50'
                      : 'border-stone-700 bg-stone-900'
                  }`}
                />
              ))}
            </div>

            {pinError && (
              <div className="text-xs text-rose-400 font-semibold mb-4 text-center animate-bounce">
                {pinError}
              </div>
            )}

            {/* Numeric Keypad */}
            <div className="grid grid-cols-3 gap-2.5 w-full mb-3">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handlePinDigit(digit)}
                  className="h-12 rounded-2xl bg-[#141624] border border-white/10 hover:border-[#d4af37]/60 hover:bg-[#1f2238] text-white font-bold text-lg active:scale-95 transition-all shadow-md cursor-pointer"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={handlePinClear}
                className="h-12 rounded-2xl bg-[#141624]/60 border border-white/5 text-stone-400 hover:text-white text-xs font-semibold active:scale-95 transition-all cursor-pointer whitespace-nowrap"
              >
                Tozalash
              </button>
              <button
                type="button"
                onClick={() => handlePinDigit('0')}
                className="h-12 rounded-2xl bg-[#141624] border border-white/10 hover:border-[#d4af37]/60 hover:bg-[#1f2238] text-white font-bold text-lg active:scale-95 transition-all shadow-md cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                onClick={handlePinDelete}
                className="h-12 rounded-2xl bg-[#141624]/60 border border-white/5 text-stone-400 hover:text-rose-400 flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                title="O‘chirish"
              >
                <Delete className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: ADMIN PASSWORD INPUT */}
        {activeTab === 'admin' && (
          <form onSubmit={handleAdminSubmit} className="w-full space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Boshqaruv Paroli
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
                    setAdminError('');
                  }}
                  className="w-full pl-10 pr-10 py-3 bg-[#141624] border border-white/10 rounded-xl text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-[#d4af37] transition-colors"
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

            {adminError && (
              <div className="text-xs text-rose-400 font-semibold text-center animate-bounce">
                {adminError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-amber-400 to-[#d4af37] hover:brightness-110 text-stone-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-[#d4af37]/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span>Admin Paneliga Kirish</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
