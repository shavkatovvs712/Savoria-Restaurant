import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { KeyRound, X, Delete, UserCheck } from 'lucide-react';

interface WaiterPinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WaiterPinModal: React.FC<WaiterPinModalProps> = ({ isOpen, onClose }) => {
  const { loginWaiter, setMode, waiters } = useRestaurant();
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      setErrorMsg('');

      if (nextPin.length === 4) {
        // Auto-check on 4 digits
        setTimeout(() => {
          const success = loginWaiter(nextPin);
          if (success) {
            setMode('waiter');
            onClose();
            setPin('');
          } else {
            setErrorMsg('Noto‘g‘ri PIN kod! Qayta urinib ko‘ring.');
            setPin('');
          }
        }, 150);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleClear = () => {
    setPin('');
    setErrorMsg('');
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
          <KeyRound className="w-8 h-8" />
        </div>

        <h3 className="font-serif text-2xl font-bold text-stone-100 mb-1">
          Ofitsiant POS Kirish
        </h3>
        <p className="text-xs text-stone-400 text-center mb-6">
          Shaxsiy 4 xonali PIN kodingizni kiriting
        </p>

        {/* PIN Indicators */}
        <div className="flex gap-4 mb-6">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-4 h-4 rounded-full border-2 transition-all ${
                pin.length > idx
                  ? 'bg-amber-400 border-amber-400 scale-125 shadow-md shadow-amber-400/50'
                  : 'border-stone-700 bg-stone-900'
              }`}
            />
          ))}
        </div>

        {errorMsg && (
          <div className="text-xs text-rose-400 font-semibold mb-4 text-center animate-bounce">
            {errorMsg}
          </div>
        )}

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-3 w-full mb-6">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeyPress(digit)}
              className="h-14 rounded-2xl bg-stone-900 border border-white/10 hover:border-amber-400/50 hover:bg-stone-800 text-stone-100 font-bold text-xl active:scale-95 transition-all shadow-md cursor-pointer"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="h-14 rounded-2xl bg-stone-900/50 border border-white/5 text-stone-400 hover:text-white text-xs font-semibold active:scale-95 transition-all cursor-pointer"
          >
            Tozalash
          </button>
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="h-14 rounded-2xl bg-stone-900 border border-white/10 hover:border-amber-400/50 hover:bg-stone-800 text-stone-100 font-bold text-xl active:scale-95 transition-all shadow-md cursor-pointer"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-stone-900/50 border border-white/5 text-stone-400 hover:text-rose-400 flex items-center justify-center active:scale-95 transition-all cursor-pointer"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
