import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { ShoppingBag, Utensils, ShieldAlert, User, Menu, X, PhoneCall, Lock } from 'lucide-react';

interface HeaderProps {
  onOpenCart: () => void;
  onOpenWaiterPinModal: () => void;
  onOpenAdminLoginModal: () => void;
  onOpenStaffModal?: (tab?: 'waiter' | 'admin') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCart,
  onOpenWaiterPinModal,
  onOpenAdminLoginModal,
  onOpenStaffModal
}) => {
  const { mode, setMode, cart, currentWaiter, isAdminLoggedIn, orders } = useRestaurant();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const activeKitchenOrdersCount = orders.filter((o) => o.status === 'cooking').length;

  const handleOpenStaff = (tab: 'waiter' | 'admin' = 'waiter') => {
    if (tab === 'admin') {
      if (isAdminLoggedIn) {
        setMode('admin');
      } else if (onOpenStaffModal) {
        onOpenStaffModal('admin');
      } else {
        onOpenAdminLoginModal();
      }
    } else {
      if (currentWaiter) {
        setMode('waiter');
      } else if (onOpenStaffModal) {
        onOpenStaffModal('waiter');
      } else {
        onOpenWaiterPinModal();
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-950/95 backdrop-blur-md border-b border-amber-500/20 text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div
            onClick={() => setMode('customer')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-700 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center border border-amber-400/40">
                <span className="text-xl">⚜️</span>
              </div>
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-wider bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">
                SAVORIA
              </span>
              <span className="block text-[10px] tracking-[0.25em] text-amber-400/70 uppercase font-semibold">
                Premium Restaurant
              </span>
            </div>
          </div>

          {/* Customer Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7">
            <a href="#menu" className="text-sm font-medium text-stone-300 hover:text-amber-400 transition-colors whitespace-nowrap">
              Katta Menyu
            </a>
            <a href="#about" className="text-sm font-medium text-stone-300 hover:text-amber-400 transition-colors whitespace-nowrap">
              Restoran Haqida
            </a>
            <a href="#reservation" className="text-sm font-medium text-stone-300 hover:text-amber-400 transition-colors whitespace-nowrap">
              Stol Bron Qilish
            </a>
            <a href="#reviews" className="text-sm font-medium text-stone-300 hover:text-amber-400 transition-colors whitespace-nowrap">
              Mijozlar Fikrlari
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Authenticated Staff Fast Switcher */}
            {isAdminLoggedIn && (
              <button
                onClick={() => setMode('admin')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] hover:bg-[#d4af37]/25 text-xs font-bold transition-all whitespace-nowrap shadow-sm cursor-pointer"
                title="Admin boshqaruv paneliga o‘tish"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Admin Paneli</span>
                {activeKitchenOrdersCount > 0 && (
                  <span className="px-1.5 py-0.2 text-[9px] bg-rose-500 text-white rounded-full font-mono font-bold">
                    {activeKitchenOrdersCount}
                  </span>
                )}
              </button>
            )}

            {currentWaiter && (
              <button
                onClick={() => setMode('waiter')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-900 border border-emerald-500/40 text-emerald-300 hover:bg-stone-800 text-xs font-bold transition-all whitespace-nowrap shadow-sm cursor-pointer"
                title="Ofitsiant ish stoliga o‘tish"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <User className="w-3.5 h-3.5" />
                <span>Ofitsiant: {currentWaiter.name.split(' ')[0]}</span>
              </button>
            )}

            {/* Discreet Staff Entrance (Customers don't know passwords) */}
            {!isAdminLoggedIn && !currentWaiter && (
              <button
                onClick={() => handleOpenStaff('waiter')}
                className="p-2.5 sm:px-3 sm:py-2 rounded-xl bg-stone-900/90 border border-white/10 text-stone-400 hover:text-[#d4af37] hover:border-[#d4af37]/40 hover:bg-stone-850 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer whitespace-nowrap"
                title="Xodimlar va Boshqaruv (Himoyalangan)"
              >
                <Lock className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#d4af37]" />
                <span className="hidden sm:inline">Xodimlar</span>
              </button>
            )}

            {/* Cart Button (Always visible) */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl bg-stone-900 border border-amber-500/30 text-amber-400 hover:bg-stone-800 hover:border-amber-400 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/5 whitespace-nowrap"
              title="Savatcha"
            >
              <ShoppingBag className="w-5 h-5 shrink-0" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 px-2 py-0.5 text-xs font-extrabold bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 rounded-full shadow-md animate-bounce">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-stone-900 border border-white/10 text-stone-300 hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/10 space-y-3">
            <div className="flex flex-col gap-2.5 text-sm font-medium">
              <a
                href="#menu"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 px-2 rounded-lg text-stone-200 hover:text-amber-400 hover:bg-white/5"
              >
                Katta Menyu
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 px-2 rounded-lg text-stone-200 hover:text-amber-400 hover:bg-white/5"
              >
                Restoran Haqida
              </a>
              <a
                href="#reservation"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 px-2 rounded-lg text-stone-200 hover:text-amber-400 hover:bg-white/5"
              >
                Stol Bron Qilish
              </a>
              <a
                href="#reviews"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 px-2 rounded-lg text-stone-200 hover:text-amber-400 hover:bg-white/5"
              >
                Mijozlar Fikrlari
              </a>
              <a
                href="tel:+998712007112"
                className="flex items-center gap-2 py-1.5 px-2 text-amber-400 font-semibold"
              >
                <PhoneCall className="w-4 h-4" />
                +998 (71) 200-71-12
              </a>
            </div>

            {/* Discreet Staff Portal trigger on mobile */}
            <div className="pt-3 border-t border-white/10">
              {isAdminLoggedIn ? (
                <button
                  onClick={() => {
                    setMode('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] text-xs font-bold flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Admin Boshqaruv Paneliga O‘tish</span>
                </button>
              ) : currentWaiter ? (
                <button
                  onClick={() => {
                    setMode('waiter');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-stone-900 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>Ofitsiant: {currentWaiter.name}</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleOpenStaff('waiter');
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-stone-900/80 border border-white/10 text-stone-400 hover:text-[#d4af37] text-xs font-semibold flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Xodimlar Tizimi (PIN / Parol)</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
