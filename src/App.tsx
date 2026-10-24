import React, { useState } from 'react';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ReceiptModal } from './components/common/ReceiptModal';
import { NotificationToast } from './components/common/NotificationToast';
import { Hero } from './components/customer/Hero';
import { MenuSection } from './components/customer/MenuSection';
import { AboutSection } from './components/customer/AboutSection';
import { ReservationSection } from './components/customer/ReservationSection';
import { ReviewsSection } from './components/customer/ReviewsSection';
import { CartDrawer } from './components/customer/CartDrawer';
import { WaiterPosView } from './components/waiter/WaiterPosView';
import { KitchenKdsView } from './components/kitchen/KitchenKdsView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StaffPortalModal } from './components/common/StaffPortalModal';

const MainContent: React.FC = () => {
  const { mode, setMode, isAdminLoggedIn, currentWaiter } = useRestaurant();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [staffInitialTab, setStaffInitialTab] = useState<'waiter' | 'admin'>('waiter');

  const [tableNumberFromUrl, setTableNumberFromUrl] = useState<number | null>(null);
  const [showTableBanner, setShowTableBanner] = useState(true);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const t = params.get('table');
      if (t) {
        const num = parseInt(t, 10);
        if (!isNaN(num) && num > 0) {
          setTableNumberFromUrl(num);
          if (window.location.hash === '#menu') {
            setTimeout(() => {
              const el = document.getElementById('menu');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 400);
          }
        }
      }
    }
  }, []);

  const scrollToReservation = () => {
    const el = document.getElementById('reservation');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenStaffModal = (tab: 'waiter' | 'admin' = 'waiter') => {
    setStaffInitialTab(tab);
    setIsStaffModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-amber-500 selection:text-stone-950">
      {/* Top Notification Toast */}
      <NotificationToast />

      {/* Global Modals */}
      <ReceiptModal />
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        tableNumber={tableNumberFromUrl}
      />
      <StaffPortalModal
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
        initialTab={staffInitialTab}
      />

      {/* Scanned Table QR Code Banner */}
      {mode === 'customer' && tableNumberFromUrl && showTableBanner && (
        <div className="bg-gradient-to-r from-amber-600 via-[#d4af37] to-amber-700 text-stone-950 px-4 py-2.5 text-xs font-bold shadow-lg sticky top-0 z-40 flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto">
            <span className="text-sm">⚜️</span>
            <span>
              <strong>SAVORIA:</strong> Siz <strong>Stol № {tableNumberFromUrl}</strong> QR kodini skanerladingiz. Shohona raqamli menyumizga xush kelibsiz!
            </span>
          </div>
          <button
            onClick={() => setShowTableBanner(false)}
            className="text-stone-900/70 hover:text-stone-950 text-base leading-none p-1 cursor-pointer"
            title="Yopish"
          >
            ✕
          </button>
        </div>
      )}

      {/* Mode Render Switch with Security Guards */}
      {mode === 'waiter' ? (
        currentWaiter ? (
          <WaiterPosView />
        ) : (
          <div className="min-h-screen bg-[#08090e] flex items-center justify-center p-4">
            <StaffPortalModal
              isOpen={true}
              onClose={() => setMode('customer')}
              initialTab="waiter"
            />
          </div>
        )
      ) : mode === 'kitchen' ? (
        <KitchenKdsView />
      ) : mode === 'admin' ? (
        isAdminLoggedIn ? (
          <AdminDashboard />
        ) : (
          <div className="min-h-screen bg-[#08090e] flex items-center justify-center p-4">
            <StaffPortalModal
              isOpen={true}
              onClose={() => setMode('customer')}
              initialTab="admin"
            />
          </div>
        )
      ) : (
        /* Customer Portal */
        <>
          <Header
            onOpenCart={() => setIsCartOpen(true)}
            onOpenWaiterPinModal={() => handleOpenStaffModal('waiter')}
            onOpenAdminLoginModal={() => handleOpenStaffModal('admin')}
            onOpenStaffModal={handleOpenStaffModal}
          />

          <main className="flex-1">
            <Hero onOpenReservation={scrollToReservation} />
            <MenuSection />
            <AboutSection />
            <ReservationSection />
            <ReviewsSection />
          </main>

          <Footer onOpenStaffModal={handleOpenStaffModal} />
        </>
      )}
    </div>
  );
};

export default function App() {
  return (
    <RestaurantProvider>
      <MainContent />
    </RestaurantProvider>
  );
}
