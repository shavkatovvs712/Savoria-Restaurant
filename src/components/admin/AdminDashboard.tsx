import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { 
  Order, 
  OrderStatus, 
  Waiter, 
  Courier, 
  MenuItem, 
  Category, 
  PaymentMethod,
  Table
} from '../../types';
import { formatCurrency, formatDateTime, formatTimeAgo } from '../../utils/formatters';
import { BigCashierPosView } from '../cashier/BigCashierPosView';
import { KitchenKdsView } from '../kitchen/KitchenKdsView';
import { DostavkaView } from '../courier/DostavkaView';
import { WaiterPosView } from '../waiter/WaiterPosView';
import { 
  Receipt, 
  ChefHat, 
  Bike, 
  UtensilsCrossed, 
  BarChart3, 
  ShoppingBag, 
  Users, 
  LayoutGrid, 
  LogOut, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Search, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Menu, 
  X, 
  ShieldCheck, 
  FileText, 
  Download, 
  DollarSign, 
  UserPlus, 
  CreditCard,
  Edit2,
  CalendarDays,
  QrCode
} from 'lucide-react';
import { QrMenuGenerator } from './QrMenuGenerator';

export type AdminTab = 
  | 'kassa'
  | 'oshxona'
  | 'dostafka'
  | 'ofitsiant'
  | 'xisobot'
  | 'menyu'
  | 'xodimlar'
  | 'bronlar'
  | 'qr';

export const AdminDashboard: React.FC = () => {
  const {
    logoutAdmin,
    setMode,
    orders,
    tables,
    addTable,
    deleteTable,
    waiters,
    addWaiter,
    deleteWaiter,
    couriers,
    addCourier,
    deleteCourier,
    menuItems,
    addMenuItem,
    updateMenuItem,
    toggleDishAvailability,
    deleteMenuItem,
    reservations,
    updateReservationStatus,
    showToast,
    playSound,
  } = useRestaurant();

  const [activeTab, setActiveTab] = useState<AdminTab>('kassa');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Sub-tabs in Xodimlar
  const [staffSubTab, setStaffSubTab] = useState<'waiters' | 'couriers' | 'tables' | 'admins'>('waiters');

  // Modals state
  const [isAddTableOpen, setIsAddTableOpen] = useState(false);
  const [isAddCourierOpen, setIsAddCourierOpen] = useState(false);
  const [isAddWaiterOpen, setIsAddWaiterOpen] = useState(false);
  const [isAddDishOpen, setIsAddDishOpen] = useState(false);
  const [isZReportOpen, setIsZReportOpen] = useState(false);

  // New Table Form
  const [newTableNumber, setNewTableNumber] = useState<number>(() => {
    const maxNum = tables.reduce((max, t) => Math.max(max, t.number), 0);
    return maxNum + 1;
  });
  const [newTableSeats, setNewTableSeats] = useState<number>(4);
  const [newTableZone, setNewTableZone] = useState<Table['zone']>('main');

  // New Courier form
  const [newCourierName, setNewCourierName] = useState('');
  const [newCourierPhone, setNewCourierPhone] = useState('+998 ');
  const [newCourierVehicle, setNewCourierVehicle] = useState<'car' | 'scooter' | 'bike'>('car');

  // New Waiter form
  const [newWaiterName, setNewWaiterName] = useState('');
  const [newWaiterPhone, setNewWaiterPhone] = useState('+998 ');
  const [newWaiterPin, setNewWaiterPin] = useState('');

  // New Dish form
  const [newDishName, setNewDishName] = useState('');
  const [newDishCategory, setNewDishCategory] = useState<Category>('national');
  const [newDishPrice, setNewDishPrice] = useState<number>(55000);
  const [newDishDesc, setNewDishDesc] = useState('');
  const [newDishImage, setNewDishImage] = useState('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80');
  const [newDishWeight, setNewDishWeight] = useState('400g');
  const [newDishPrepTime, setNewDishPrepTime] = useState('20 daq');

  // Menu search & filter
  const [menuSearch, setMenuSearch] = useState('');
  const [menuFilterCat, setMenuFilterCat] = useState<string>('all');

  // Report Period Filter
  const [reportPeriod, setReportPeriod] = useState<'bugun' | 'hafta' | 'oy'>('bugun');

  // Stats Calculations
  const openCashierOrdersCount = orders.filter((o) => o.status === 'pending_cashier').length;
  const cookingOrdersCount = orders.filter((o) => o.status === 'cooking' || o.status === 'ready').length;
  const activeDeliveryOrdersCount = orders.filter(
    (o) => o.type === 'delivery' && (o.status === 'delivering' || o.status === 'cooking' || o.status === 'ready')
  ).length;

  const totalRevenue = orders
    .filter((o) => o.status === 'completed' || o.isPaid)
    .reduce((sum, o) => sum + o.total, 0);

  const completedReceipts = orders.filter((o) => o.isPaid || o.status === 'completed');
  const totalReceiptsCount = completedReceipts.length;
  const avgCheck = totalReceiptsCount > 0 ? Math.round(totalRevenue / totalReceiptsCount) : 0;

  // Payment Breakdown
  const paymentTotals = {
    cash: orders.filter((o) => o.isPaid && (!o.paymentMethod || o.paymentMethod === 'cash')).reduce((s, o) => s + o.total, 0),
    card: orders.filter((o) => o.isPaid && o.paymentMethod === 'card').reduce((s, o) => s + o.total, 0),
    click: orders.filter((o) => o.isPaid && o.paymentMethod === 'click').reduce((s, o) => s + o.total, 0),
    payme: orders.filter((o) => o.isPaid && o.paymentMethod === 'payme').reduce((s, o) => s + o.total, 0),
    uzum: orders.filter((o) => o.isPaid && o.paymentMethod === 'uzum').reduce((s, o) => s + o.total, 0),
  };

  // Top Dishes
  const dishCounts: Record<string, { name: string; count: number; total: number }> = {};
  orders.forEach((o) => {
    o.items.forEach((item) => {
      if (!dishCounts[item.name]) {
        dishCounts[item.name] = { name: item.name, count: 0, total: 0 };
      }
      dishCounts[item.name].count += item.quantity;
      dishCounts[item.name].total += item.quantity * item.price;
    });
  });
  const topDishes = Object.values(dishCounts).sort((a, b) => b.count - a.count).slice(0, 6);

  // Tab definitions matching Savoria
  const tabs = [
    {
      id: 'kassa' as AdminTab,
      label: 'Kassa (POS)',
      subLabel: 'Stol hisobi, to‘lovlar va kassa cheki',
      icon: <Receipt className="w-4 h-4" />,
      badge: openCashierOrdersCount > 0 ? openCashierOrdersCount : undefined,
      badgeColor: 'bg-[#d4af37] text-neutral-950 font-bold',
    },
    {
      id: 'oshxona' as AdminTab,
      label: 'Oshxona (KDS)',
      subLabel: 'Oshpazlar monitori va zakas stansiyalari',
      icon: <ChefHat className="w-4 h-4" />,
      badge: cookingOrdersCount > 0 ? cookingOrdersCount : undefined,
      badgeColor: 'bg-rose-500 text-white font-bold',
    },
    {
      id: 'dostafka' as AdminTab,
      label: 'Dostavka',
      subLabel: 'Kuryerlar, jo‘natmalar va logistika',
      icon: <Bike className="w-4 h-4" />,
      badge: activeDeliveryOrdersCount > 0 ? activeDeliveryOrdersCount : undefined,
      badgeColor: 'bg-sky-500 text-white font-bold',
    },
    {
      id: 'ofitsiant' as AdminTab,
      label: 'Ofitsiant Rejimi',
      subLabel: 'Stolni tanlash, buyurtma olish va Kassaga yuborish',
      icon: <UtensilsCrossed className="w-4 h-4" />,
    },
    {
      id: 'xisobot' as AdminTab,
      label: 'Xisobot & Statistika',
      subLabel: 'Kunlik tushum, statistika va tahlil',
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      id: 'menyu' as AdminTab,
      label: 'Taomlar & Narxlar',
      subLabel: 'Taomlar, ichimliklar va narxlar katalogi',
      icon: <ShoppingBag className="w-4 h-4" />,
    },
    {
      id: 'xodimlar' as AdminTab,
      label: 'Xodimlar & Adminlar',
      subLabel: 'Ofitsiantlar, parollar, kuryerlar, stollar va adminlar',
      icon: <Users className="w-4 h-4" />,
      badge: waiters.length + couriers.length + tables.length,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 font-bold',
    },
    {
      id: 'bronlar' as AdminTab,
      label: `Bronlar (${reservations.length})`,
      subLabel: 'Mijozlar stol band qilish so‘rovlari',
      icon: <CalendarDays className="w-4 h-4" />,
    },
    {
      id: 'qr' as AdminTab,
      label: 'QR Menyu',
      subLabel: 'Smartfonlar uchun QR kod va stol stendlari',
      icon: <QrCode className="w-4 h-4" />,
      badge: 'YANGI',
      badgeColor: 'bg-amber-500/20 text-amber-300 font-bold',
    },
  ];

  const currentActiveTabObj = tabs.find((t) => t.id === activeTab) || tabs[0];

  const handleSelectTab = (tabId: AdminTab) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) {
      playSound('order');
      showToast('Ovozli bildirishnomalar yoqildi', 'success');
    } else {
      showToast('Ovozli bildirishnomalar o‘chirildi', 'info');
    }
  };

  // Form Handlers
  const handleCreateTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableNumber || !newTableSeats) return;

    addTable({
      number: Number(newTableNumber),
      seats: Number(newTableSeats),
      zone: newTableZone,
    });

    setIsAddTableOpen(false);
    setNewTableNumber((prev) => prev + 1);
  };

  const handleCreateCourier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourierName.trim() || !newCourierPhone.trim()) return;

    addCourier({
      name: newCourierName.trim(),
      phone: newCourierPhone.trim(),
      vehicle: newCourierVehicle,
      status: 'available',
    });

    setNewCourierName('');
    setNewCourierPhone('+998 ');
    setIsAddCourierOpen(false);
  };

  const handleCreateWaiter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWaiterName.trim() || !newWaiterPin.trim()) return;

    if (newWaiterPin.length !== 4) {
      showToast('PIN kod aynan 4 ta raqam bo‘lishi kerak!', 'warning');
      return;
    }

    addWaiter({
      name: newWaiterName.trim(),
      phone: newWaiterPhone.trim(),
      pin: newWaiterPin.trim(),
      status: 'active',
    });

    setNewWaiterName('');
    setNewWaiterPhone('+998 ');
    setNewWaiterPin('');
    setIsAddWaiterOpen(false);
  };

  const handleCreateDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim() || !newDishPrice) return;

    addMenuItem({
      name: newDishName.trim(),
      category: newDishCategory,
      price: Number(newDishPrice),
      description: newDishDesc.trim() || 'Sofra oshpazlarining maxsus mualliflik taomi.',
      image: newDishImage.trim(),
      weight: newDishWeight.trim() || '350g',
      prepTime: newDishPrepTime.trim() || '15-20 daq',
      ingredients: ['Go‘sht', 'Ziravorlar', 'Sabzavotlar'],
      isAvailable: true,
    });

    setNewDishName('');
    setNewDishPrice(50000);
    setNewDishDesc('');
    setIsAddDishOpen(false);
  };

  const exportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Chek raqami,Mijoz,Turi,Stol,Summa,To‘lov turi,Holati,Sana']
        .concat(
          orders.map(
            (o) =>
              `${o.orderNumber},${o.customerName},${o.type},${o.tableNumber || '-'},${o.total},${o.paymentMethod || 'cash'},${o.status},${o.createdAt}`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Sofra_Restaurant_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Xisobot CSV fayli yuklab olindi!', 'success');
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-[#eaeaea] flex flex-col selection:bg-[#d4af37]/30 selection:text-white">
      {/* 1. TOP ADMIN BAR (Savoria Layout) */}
      <div className="bg-[#10121b] border-b border-[#212435] px-3 sm:px-6 lg:px-8 py-2.5 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Brand Title */}
          <div className="flex items-center gap-3">
            <div
              onClick={() => setMode('customer')}
              className="flex items-center gap-2.5 cursor-pointer group"
              title="Mijoz saytiga o‘tish"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#d4af37] via-amber-500 to-amber-700 p-0.5 shadow-md shadow-[#d4af37]/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#08090d] rounded-[10px] flex items-center justify-center">
                  <span className="text-sm">⚜️</span>
                </div>
              </div>
              <div>
                <span className="font-serif font-bold text-base sm:text-lg tracking-wider text-white flex items-center gap-2">
                  <span>SAVORIA RESTAURANT</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#d4af37]/20 text-[#d4af37] font-mono border border-[#d4af37]/30">
                    ADMIN
                  </span>
                </span>
                <span className="block text-[10px] text-neutral-400 font-mono">
                  POS • KDS • DOSTAVKA • XISOBOT • OFITSIANT
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Module Tabs (Scrollable) */}
          <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#d4af37] text-neutral-950 shadow-md font-bold'
                      : 'text-neutral-400 hover:text-white bg-[#151724] hover:bg-[#1d202e] border border-[#252839]'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                        isActive ? 'bg-black text-[#d4af37]' : tab.badgeColor || 'bg-[#292e42] text-white'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Controls: Sound & Logout & Mobile Drawer Button */}
          <div className="flex items-center gap-2">
            {/* Sound Toggle Button like Savoria */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                soundEnabled
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                  : 'bg-stone-900 border-white/10 text-stone-400 hover:text-white'
              }`}
              title={soundEnabled ? 'Ovoz: ON' : 'Ovoz: OFF'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden xl:inline text-[11px] font-mono">
                {soundEnabled ? 'Ovoz: ON' : 'Ovoz: OFF'}
              </span>
            </button>

            {/* Mobile "Modullar" Button like Savoria */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141624] hover:bg-[#1f2336] border border-[#d4af37]/50 text-[#d4af37] text-xs font-semibold shadow-[0_0_12px_rgba(212,175,55,0.15)] active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <Menu className="w-4 h-4 shrink-0" />
              <span>Modullar</span>
              {(openCashierOrdersCount > 0 || cookingOrdersCount > 0 || activeDeliveryOrdersCount > 0) && (
                <span className="w-4 h-4 bg-[#d4af37] text-neutral-950 font-mono font-bold text-[9px] rounded-full flex items-center justify-center shrink-0">
                  {openCashierOrdersCount + cookingOrdersCount + activeDeliveryOrdersCount}
                </span>
              )}
            </button>

            {/* Logout */}
            <button
              onClick={logoutAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/40 text-rose-300 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
              title="Admin panelidan chiqish"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Chiqish</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. SUB-BAR: Current Module Info (Desktop & Mobile) */}
      <div className="bg-[#0e1017] border-b border-[#1c1f2d] px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-neutral-500">Faol Modul:</span>
          <span className="text-[#d4af37] font-bold flex items-center gap-1.5">
            {currentActiveTabObj.icon}
            {currentActiveTabObj.label}
          </span>
          <span className="hidden sm:inline text-neutral-500 font-mono">
            — {currentActiveTabObj.subLabel}
          </span>
        </div>

        {/* Quick Shortcut Buttons */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            onClick={() => setIsAddTableOpen(true)}
            className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#171a28] hover:bg-[#202438] text-neutral-300 text-[11px] border border-white/5 cursor-pointer"
          >
            <Plus className="w-3 h-3 text-[#d4af37]" />
            <span>Stol qo‘shish</span>
          </button>
          <button
            onClick={() => setIsZReportOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#171a28] hover:bg-[#202438] text-neutral-300 text-[11px] border border-white/5 cursor-pointer"
          >
            <FileText className="w-3 h-3 text-[#d4af37]" />
            <span>Z-Xisobot</span>
          </button>
        </div>
      </div>

      {/* 3. MOBILE MODULLAR DRAWER MODAL */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full sm:max-w-md bg-[#10121c] border border-[#2d3248] rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#212537]">
              <div className="flex items-center gap-2">
                <span className="text-[#d4af37]">⚜️</span>
                <h3 className="font-serif font-bold text-base text-white">
                  Admin Modullari
                </h3>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2 max-h-[70vh] overflow-y-auto pr-1">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleSelectTab(tab.id)}
                    className={`p-3 rounded-2xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'bg-[#d4af37] text-neutral-950 font-bold border-[#d4af37] shadow-lg'
                        : 'bg-[#141624] border-[#222638] text-neutral-200 hover:bg-[#1d2134]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-xl ${
                          isActive ? 'bg-black/10 text-neutral-950' : 'bg-[#1d2030] text-[#d4af37]'
                        }`}
                      >
                        {tab.icon}
                      </div>
                      <div>
                        <div className="font-bold text-sm">{tab.label}</div>
                        <div
                          className={`text-[10px] ${
                            isActive ? 'text-neutral-800' : 'text-neutral-400'
                          }`}
                        >
                          {tab.subLabel}
                        </div>
                      </div>
                    </div>

                    {tab.badge !== undefined && (
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                          isActive ? 'bg-black text-[#d4af37]' : tab.badgeColor || 'bg-[#282d40] text-white'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4. MAIN CONTENT CONTAINER */}
      <div className="flex-1 p-3 sm:p-6 max-w-7xl mx-auto w-full">
        {/* ================= TAB 1: KASSA (POS) ================= */}
        {activeTab === 'kassa' && <BigCashierPosView />}

        {/* ================= TAB 2: OSHXONA (KDS) ================= */}
        {activeTab === 'oshxona' && <KitchenKdsView />}

        {/* ================= TAB 3: DOSTAVKA ================= */}
        {activeTab === 'dostafka' && (
          <DostavkaView onOpenAddCourier={() => setIsAddCourierOpen(true)} />
        )}

        {/* ================= TAB 4: OFITSIANT REJIMI ================= */}
        {activeTab === 'ofitsiant' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
              <span>
                🤵 <strong>Ofitsiant Ish Stoli:</strong> Buyurtma oling va <strong>Kassaga yuboring</strong>. Hisob-kitob va chek chiqarish to‘liq KASSA orqali amalga oshiriladi.
              </span>
            </div>
            <WaiterPosView />
          </div>
        )}

        {/* ================= TAB 5: XISOBOT & STATISTIKA ================= */}
        {activeTab === 'xisobot' && (
          <div className="space-y-6">
            {/* Header with Period & Export */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-[#212435]">
              <div>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-white tracking-wide flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-[#d4af37]" />
                  <span>MOLIYAVIY XISOBOT VA STATISTIKA</span>
                </h2>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">
                  Real vaqtdagi kassa tushumi, o‘rtacha chek va taomlar sotuvi analitikasi
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-[#12141d] p-1 rounded-xl border border-[#232637]">
                  {(
                    [
                      { id: 'bugun', label: 'Bugun' },
                      { id: 'hafta', label: 'Oxirgi 7 kun' },
                      { id: 'oy', label: 'Bu oy' },
                    ] as const
                  ).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setReportPeriod(p.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        reportPeriod === p.id
                          ? 'bg-[#d4af37] text-neutral-950 font-bold'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={exportCSV}
                  className="px-3.5 py-2 rounded-xl bg-[#171a28] hover:bg-[#202438] border border-[#2b3046] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>CSV Eksport</span>
                </button>

                <button
                  onClick={() => setIsZReportOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Z-Xisobot</span>
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-[#12141f] border border-[#242839] flex flex-col justify-between">
                <div className="text-xs text-neutral-400 font-medium">Jami Tushum</div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-[#d4af37] my-2">
                  {formatCurrency(totalRevenue)}
                </div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Barcha to‘langan hisoblar</span>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#12141f] border border-[#242839] flex flex-col justify-between">
                <div className="text-xs text-neutral-400 font-medium">O‘rtacha Chek</div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-white my-2">
                  {formatCurrency(avgCheck)}
                </div>
                <div className="text-[11px] text-neutral-400 font-mono">
                  {totalReceiptsCount} ta chek bo‘yicha
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#12141f] border border-[#242839] flex flex-col justify-between">
                <div className="text-xs text-neutral-400 font-medium">Jami Cheklar</div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-sky-400 my-2">
                  {totalReceiptsCount} ta
                </div>
                <div className="text-[11px] text-neutral-400 font-mono">
                  Fiskal ro‘yxatdan o‘tgan
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#12141f] border border-[#242839] flex flex-col justify-between">
                <div className="text-xs text-neutral-400 font-medium">Faol Xodimlar</div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 my-2">
                  {waiters.length + couriers.length} ta
                </div>
                <div className="text-[11px] text-neutral-400 font-mono">
                  {waiters.length} ofitsiant · {couriers.length} kuryer
                </div>
              </div>
            </div>

            {/* Payment Methods Breakdown & Top Dishes */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Payment Types (5 cols) */}
              <div className="lg:col-span-5 p-5 rounded-2xl bg-[#12141f] border border-[#242839] space-y-4">
                <h3 className="font-serif font-bold text-sm text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#d4af37]" />
                  <span>To‘lov Turlari Bo‘yicha Tushum</span>
                </h3>

                <div className="space-y-3 text-xs">
                  {[
                    { label: 'Naqd Pul', amount: paymentTotals.cash, color: 'bg-emerald-500' },
                    { label: 'Plastik Karta (Humo / Uzcard)', amount: paymentTotals.card, color: 'bg-sky-500' },
                    { label: 'Click Evolution', amount: paymentTotals.click, color: 'bg-blue-500' },
                    { label: 'Payme', amount: paymentTotals.payme, color: 'bg-teal-500' },
                    { label: 'Uzum Bank / Pay', amount: paymentTotals.uzum, color: 'bg-purple-500' },
                  ].map((p, idx) => {
                    const percent = totalRevenue > 0 ? Math.round((p.amount / totalRevenue) * 100) : 0;
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-300 font-medium">{p.label}</span>
                          <span className="font-mono text-white font-bold">
                            {formatCurrency(p.amount)} ({percent}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-stone-900 overflow-hidden">
                          <div
                            className={`h-full ${p.color} transition-all duration-500`}
                            style={{ width: `${Math.max(percent, 2)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Dishes (7 cols) */}
              <div className="lg:col-span-7 p-5 rounded-2xl bg-[#12141f] border border-[#242839] space-y-4">
                <h3 className="font-serif font-bold text-sm text-white flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#d4af37]" />
                    <span>ENG KO‘P SOTILGAN VA DAROMAD KELTIRGAN TAOMLAR</span>
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">TOP {topDishes.length}</span>
                </h3>

                <div className="space-y-2.5">
                  {topDishes.length === 0 ? (
                    <div className="p-8 text-center text-xs text-neutral-500">
                      Hali yetarli buyurtma tarixi mavjud emas
                    </div>
                  ) : (
                    topDishes.map((dish, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-[#171926] border border-[#252839] flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center font-mono font-bold">
                            #{i + 1}
                          </span>
                          <div>
                            <div className="font-semibold text-white">{dish.name}</div>
                            <div className="text-[11px] text-neutral-400 font-mono">
                              Sotilgan miqdor: <strong className="text-amber-400">{dish.count} ta</strong>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-mono text-sm font-bold text-[#d4af37]">
                            {formatCurrency(dish.total)}
                          </div>
                          <div className="text-[10px] text-neutral-500">Keltirilgan daromad</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 6: TAOMLAR & NARXLAR (MENU) ================= */}
        {activeTab === 'menyu' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-[#212435]">
              <div>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-white tracking-wide flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6 text-[#d4af37]" />
                  <span>TAOMLAR VA NARXLAR KATALOGI</span>
                </h2>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">
                  Menyu elementlarini boshqarish, narxlarni o‘zgartirish va stop-list (mavjudlik) nazorati
                </p>
              </div>

              <button
                onClick={() => setIsAddDishOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#e6c14c] text-neutral-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#d4af37]/20 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Yangi Taom Qo‘shish</span>
              </button>
            </div>

            {/* Filter & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#11131c] p-3 rounded-2xl border border-[#212433]">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {[
                  { id: 'all', label: 'Barchasi' },
                  { id: 'national', label: 'Milliy Tansiq' },
                  { id: 'kebabs', label: 'Kabob & Shashlik' },
                  { id: 'steaks', label: 'Steyk & Gril' },
                  { id: 'soups', label: 'Sho‘rvalar' },
                  { id: 'salads', label: 'Salatlar' },
                  { id: 'drinks', label: 'Ichimliklar' },
                  { id: 'desserts', label: 'Desertlar' },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setMenuFilterCat(c.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      menuFilterCat === c.id
                        ? 'bg-[#d4af37] text-neutral-950 font-bold shadow-md'
                        : 'bg-[#161824] text-neutral-400 hover:text-white border border-[#252839]'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Taom qidirish..."
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  className="w-full bg-[#090a10] border border-[#262a3c] rounded-xl pl-8.5 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems
                .filter((d) => menuFilterCat === 'all' || d.category === menuFilterCat)
                .filter((d) => d.name.toLowerCase().includes(menuSearch.toLowerCase()))
                .map((dish) => (
                  <div
                    key={dish.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      dish.isAvailable
                        ? 'bg-[#12141f] border-[#242839]'
                        : 'bg-[#0f1017] border-red-900/30 opacity-70'
                    }`}
                  >
                    <div className="flex gap-3">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-20 h-20 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-semibold text-xs text-white line-clamp-1">{dish.name}</h4>
                          <button
                            onClick={() => deleteMenuItem(dish.id)}
                            className="p-1 text-neutral-500 hover:text-rose-400"
                            title="O‘chirish"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-[11px] text-neutral-400 line-clamp-2 mt-0.5">
                          {dish.description}
                        </div>
                        <div className="text-xs font-mono font-bold text-[#d4af37] mt-1">
                          {formatCurrency(dish.price)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#1e2233] flex items-center justify-between text-xs">
                      <span className="text-[11px] text-neutral-400 font-mono">
                        {dish.weight} · {dish.prepTime}
                      </span>

                      <button
                        onClick={() => toggleDishAvailability(dish.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                          dish.isAvailable
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25'
                            : 'bg-rose-500/15 border-rose-500/30 text-rose-400 hover:bg-rose-500/25'
                        }`}
                      >
                        {dish.isAvailable ? 'Mavjud (Sotuvda)' : 'Stop-List (Tugagan)'}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ================= TAB 7: XODIMLAR & ADMINLAR & STOLLAR ================= */}
        {activeTab === 'xodimlar' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-[#212435]">
              <div>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-white tracking-wide flex items-center gap-2">
                  <Users className="w-6 h-6 text-[#d4af37]" />
                  <span>XODIMLAR, STOLLAR VA ADMINLAR BOSHQARUVI</span>
                </h2>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">
                  Ofitsiantlar, kuryerlar, zaldagi stollar va tizim adminlari ro‘yxati
                </p>
              </div>

              {/* Sub tabs */}
              <div className="flex items-center gap-1.5 bg-[#12141d] p-1 rounded-xl border border-[#232637]">
                {[
                  { id: 'waiters', label: `Ofitsiantlar (${waiters.length})` },
                  { id: 'couriers', label: `Kuryerlar (${couriers.length})` },
                  { id: 'tables', label: `Stollar (${tables.length})` },
                  { id: 'admins', label: 'Adminlar' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStaffSubTab(s.id as typeof staffSubTab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      staffSubTab === s.id
                        ? 'bg-[#d4af37] text-neutral-950 font-bold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-tab: Waiters */}
            {staffSubTab === 'waiters' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-neutral-400 font-mono">
                    Ofitsiantlar PIN kodi orqali buyurtma qabul qilishadi
                  </span>
                  <button
                    onClick={() => setIsAddWaiterOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#d4af37] text-neutral-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Yangi Ofitsiant Qo‘shish</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {waiters.map((waiter) => (
                    <div
                      key={waiter.id}
                      className="p-4 rounded-2xl bg-[#12141f] border border-[#242839] flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-[#d4af37] border border-amber-500/30 flex items-center justify-center font-bold">
                            🤵
                          </div>
                          <div>
                            <div className="font-bold text-sm text-white">{waiter.name}</div>
                            <div className="text-[11px] text-neutral-400 font-mono">{waiter.phone}</div>
                          </div>
                        </div>

                        <span className="text-xs px-2 py-0.5 rounded bg-[#1f2334] text-[#d4af37] font-mono font-bold border border-[#2d334a]">
                          PIN: {waiter.pin}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-[#1d202e]">
                        <div>
                          <span className="text-neutral-500 text-[10px] block">Bugungi tushum:</span>
                          <span className="text-white font-bold">{formatCurrency(waiter.todaySales)}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 text-[10px] block">Choypuli (10%):</span>
                          <span className="text-[#d4af37] font-bold">{formatCurrency(waiter.todayTips)}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <span className="text-[11px] text-neutral-400 font-mono">
                          {waiter.ordersCount} ta buyurtma
                        </span>
                        <button
                          onClick={() => deleteWaiter(waiter.id)}
                          className="text-xs text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>O‘chirish</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-tab: Couriers */}
            {staffSubTab === 'couriers' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-neutral-400 font-mono">
                    Yetkazib berish kuryerlari ro‘yxati
                  </span>
                  <button
                    onClick={() => setIsAddCourierOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#d4af37] text-neutral-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Yangi Kuryer Qo‘shish</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {couriers.map((courier) => (
                    <div
                      key={courier.id}
                      className="p-4 rounded-2xl bg-[#12141f] border border-[#242839] flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold text-lg">
                            {courier.vehicle === 'car' ? '🚗' : courier.vehicle === 'scooter' ? '🛵' : '🚲'}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-white">{courier.name}</div>
                            <div className="text-[11px] text-neutral-400 font-mono">{courier.phone}</div>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                            courier.status === 'available'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {courier.status === 'available' ? 'Bo‘sh' : 'Band'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-[#1d202e] text-xs font-mono">
                        <span className="text-neutral-400">Faol: {courier.activeOrdersCount} buyurtma</span>
                        <button
                          onClick={() => deleteCourier(courier.id)}
                          className="text-xs text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>O‘chirish</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-tab: Tables (Stollar) */}
            {staffSubTab === 'tables' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-neutral-400 font-mono">
                    Restorandagi barcha stollar va ularning holati
                  </span>
                  <button
                    onClick={() => setIsAddTableOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#d4af37] text-neutral-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#d4af37]/20"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Yangi Stol Qo‘shish</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {tables.map((table) => {
                    const isOccupied = table.status !== 'available';
                    return (
                      <div
                        key={table.id}
                        className={`p-3.5 rounded-2xl border flex flex-col justify-between min-h-[120px] transition-all ${
                          table.status === 'pending_cashier'
                            ? 'bg-amber-950/20 border-amber-500/50 ring-1 ring-amber-500/40'
                            : table.status === 'cooking'
                            ? 'bg-sky-950/20 border-sky-500/50'
                            : isOccupied
                            ? 'bg-purple-950/20 border-purple-500/50'
                            : 'bg-[#12141f] border-[#242839]'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="font-mono text-base font-bold text-white">
                            №{table.number}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-400 uppercase">
                            {table.zone === 'vip' ? 'VIP' : table.zone === 'terrace' ? 'Terrasa' : 'Zal'}
                          </span>
                        </div>

                        <div className="my-2 text-xs">
                          <div className="text-neutral-400 text-[11px]">{table.seats} kishilik</div>
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-bold mt-1 uppercase ${
                              table.status === 'available'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : table.status === 'pending_cashier'
                                ? 'bg-amber-500/20 text-amber-400 animate-pulse'
                                : 'bg-purple-500/20 text-purple-300'
                            }`}
                          >
                            {table.status === 'available'
                              ? 'Bo‘sh'
                              : table.status === 'pending_cashier'
                              ? 'Kassada'
                              : 'Band'}
                          </span>
                        </div>

                        <div className="pt-2 border-t border-white/5 flex justify-end">
                          <button
                            onClick={() => deleteTable(table.number)}
                            disabled={table.status !== 'available'}
                            className={`p-1 rounded text-neutral-500 ${
                              table.status === 'available' ? 'hover:text-rose-400 cursor-pointer' : 'opacity-20 cursor-not-allowed'
                            }`}
                            title="O‘chirish"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sub-tab: Admins */}
            {staffSubTab === 'admins' && (
              <div className="space-y-4 max-w-2xl">
                <div className="p-5 rounded-2xl bg-[#12141f] border border-[#242839] space-y-4">
                  <h3 className="font-serif font-bold text-sm text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#d4af37]" />
                    <span>ADMINLAR VA KIRISH HUQUQLARI</span>
                  </h3>

                  <div className="p-4 rounded-xl bg-[#161826] border border-[#2b3046] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-sm">Bosh Admin (Superadmin)</div>
                      <div className="text-xs text-neutral-400 font-mono mt-0.5">
                        Tizimga kirish: <strong className="text-emerald-400">Ochiq rejim (Parol olib tashlangan)</strong>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">
                      OCHIQ KIRISH
                    </span>
                  </div>

                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Admin paneli va Ofitsiant rejimi uchun parol talabi olib tashlandi. Bir bosishda to‘g‘ridan-to‘g‘ri kirish mumkin.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 8: BRONLAR ================= */}
        {activeTab === 'bronlar' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-[#212435]">
              <div>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-white tracking-wide flex items-center gap-2">
                  <CalendarDays className="w-6 h-6 text-[#d4af37]" />
                  <span>STOL BRON QILISH SO‘ROVLARI</span>
                </h2>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">
                  Mijozlar tomonidan saytdan yuborilgan stol band qilish arizalari
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reservations.map((res) => (
                <div
                  key={res.id}
                  className="p-5 rounded-2xl bg-[#12141f] border border-[#242839] space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-base text-white">{res.customerName}</h4>
                      <a href={`tel:${res.phone}`} className="text-xs font-mono text-[#d4af37] hover:underline">
                        {res.phone}
                      </a>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        res.status === 'confirmed'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : res.status === 'cancelled'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {res.status === 'confirmed' ? 'Tasdiqlangan' : res.status === 'cancelled' ? 'Bekor qilingan' : 'Kutilmoqda'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs font-mono p-2.5 rounded-xl bg-[#171926] text-neutral-300">
                    <div>
                      <span className="text-neutral-500 text-[10px] block">Sana & Vaqt:</span>
                      <strong className="text-white">{res.date} · {res.time}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-500 text-[10px] block">Mehmonlar:</span>
                      <strong className="text-white">{res.guestsCount} kishi</strong>
                    </div>
                    <div>
                      <span className="text-neutral-500 text-[10px] block">Zal:</span>
                      <strong className="text-white uppercase">{res.zone}</strong>
                    </div>
                  </div>

                  {res.specialRequests && (
                    <div className="text-xs text-neutral-400 italic">
                      &ldquo;{res.specialRequests}&rdquo;
                    </div>
                  )}

                  <div className="pt-2 border-t border-[#1d202e] flex justify-end gap-2 text-xs">
                    {res.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateReservationStatus(res.id, 'confirmed')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                        >
                          Tasdiqlash
                        </button>
                        <button
                          onClick={() => updateReservationStatus(res.id, 'cancelled')}
                          className="px-3 py-1.5 rounded-lg bg-rose-950 text-rose-300 hover:bg-rose-900 border border-rose-900/40"
                        >
                          Bekor qilish
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 9: QR MENYU YARATISH ================= */}
        {activeTab === 'qr' && <QrMenuGenerator />}
      </div>

      {/* MODAL 1: ADD TABLE */}
      {isAddTableOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-stone-950 border border-amber-500/30 rounded-3xl p-6 shadow-2xl">
            <button
              onClick={() => setIsAddTableOpen(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-lg font-bold text-white mb-1 flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-amber-400" />
              <span>Yangi Stol Qo‘shish</span>
            </h3>
            <p className="text-xs text-stone-400 mb-4">
              Zaldagi yangi stol raqami, o‘rinlar soni va zonasini tanlang
            </p>

            <form onSubmit={handleCreateTable} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Stol Raqami *
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={newTableNumber}
                  onChange={(e) => setNewTableNumber(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  O‘rindiqlar Soni (Kishi) *
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  required
                  value={newTableSeats}
                  onChange={(e) => setNewTableSeats(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Restoran Zonasi
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'main', label: 'Asosiy Zal' },
                    { id: 'terrace', label: 'Terrasa' },
                    { id: 'vip', label: 'VIP Xona' },
                  ].map((z) => (
                    <button
                      key={z.id}
                      type="button"
                      onClick={() => setNewTableZone(z.id as Table['zone'])}
                      className={`p-2 rounded-xl text-xs font-semibold border transition-all ${
                        newTableZone === z.id
                          ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold'
                          : 'bg-stone-900 border-white/10 text-stone-400 hover:text-white'
                      }`}
                    >
                      {z.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddTableOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-stone-900 text-stone-300 text-xs font-semibold"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs"
                >
                  Qo‘shish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD WAITER */}
      {isAddWaiterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-stone-950 border border-amber-500/30 rounded-3xl p-6 shadow-2xl">
            <button
              onClick={() => setIsAddWaiterOpen(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-lg font-bold text-white mb-1 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-amber-400" />
              <span>Yangi Ofitsiant Qo‘shish</span>
            </h3>
            <p className="text-xs text-stone-400 mb-4">
              Ofitsiant ismi va 4 xonali shaxsiy PIN kodini belgilang
            </p>

            <form onSubmit={handleCreateWaiter} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Ofitsiant Ismi Familiyasi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Azizbek Karimov"
                  value={newWaiterName}
                  onChange={(e) => setNewWaiterName(e.target.value)}
                  className="w-full bg-stone-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Telefon Raqami *
                </label>
                <input
                  type="text"
                  required
                  value={newWaiterPhone}
                  onChange={(e) => setNewWaiterPhone(e.target.value)}
                  className="w-full bg-stone-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  4 xonali PIN kod *
                </label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  placeholder="Masalan: 1234"
                  value={newWaiterPin}
                  onChange={(e) => setNewWaiterPin(e.target.value)}
                  className="w-full bg-stone-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono text-center tracking-widest text-lg"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddWaiterOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-stone-900 text-stone-300 text-xs font-semibold"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD DISH */}
      {isAddDishOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-stone-950 border border-amber-500/30 rounded-3xl p-6 shadow-2xl">
            <button
              onClick={() => setIsAddDishOpen(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-400" />
              <span>Yangi Taom Qo‘shish</span>
            </h3>
            <p className="text-xs text-stone-400 mb-4">
              Restoran menyusiga yangi taom, rasm va narx belgilang
            </p>

            <form onSubmit={handleCreateDish} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Taom Nomi *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan: Wagyu Ribeye Steyk"
                    value={newDishName}
                    onChange={(e) => setNewDishName(e.target.value)}
                    className="w-full bg-stone-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Kategoriya *
                  </label>
                  <select
                    value={newDishCategory}
                    onChange={(e) => setNewDishCategory(e.target.value as Category)}
                    className="w-full bg-stone-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="national">Milliy Tansiq</option>
                    <option value="kebabs">Kabob & Shashlik</option>
                    <option value="steaks">Steyk & Gril</option>
                    <option value="soups">Sho‘rvalar</option>
                    <option value="salads">Salatlar</option>
                    <option value="drinks">Ichimliklar</option>
                    <option value="desserts">Desertlar</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Narxi (so‘m) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newDishPrice}
                    onChange={(e) => setNewDishPrice(Number(e.target.value))}
                    className="w-full bg-stone-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Vazni
                  </label>
                  <input
                    type="text"
                    value={newDishWeight}
                    onChange={(e) => setNewDishWeight(e.target.value)}
                    className="w-full bg-stone-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Vaqti
                  </label>
                  <input
                    type="text"
                    value={newDishPrepTime}
                    onChange={(e) => setNewDishPrepTime(e.target.value)}
                    className="w-full bg-stone-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Rasm URL manzili
                </label>
                <input
                  type="url"
                  value={newDishImage}
                  onChange={(e) => setNewDishImage(e.target.value)}
                  className="w-full bg-stone-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Tavsif
                </label>
                <textarea
                  rows={2}
                  value={newDishDesc}
                  onChange={(e) => setNewDishDesc(e.target.value)}
                  className="w-full bg-stone-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddDishOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-stone-900 text-stone-300 text-xs font-semibold"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs"
                >
                  Qo‘shish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Z-REPORT SUMMARY */}
      {isZReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-stone-950 border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <button
              onClick={() => setIsZReportOpen(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-amber-400 pb-2 border-b border-white/10">
              <FileText className="w-5 h-5" />
              <h3 className="font-serif font-bold text-base text-white">
                KASSA Z-XISOBOT (YOPISH DALOLATNOMASI)
              </h3>
            </div>

            <div className="text-xs space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-neutral-400">Restoran:</span>
                <span className="text-white font-bold">SAVORIA RESTAURANT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Sana:</span>
                <span className="text-white">{new Date().toLocaleDateString('uz-UZ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Jami cheklar:</span>
                <span className="text-white font-bold">{totalReceiptsCount} ta</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Naqd tushum:</span>
                <span className="text-white">{formatCurrency(paymentTotals.cash)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Terminal & Online:</span>
                <span className="text-white">
                  {formatCurrency(paymentTotals.card + paymentTotals.click + paymentTotals.payme + paymentTotals.uzum)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10 text-sm">
                <span className="text-amber-400 font-bold">JAMI KASSA TUSHUMI:</span>
                <span className="text-[#d4af37] font-bold">{formatCurrency(totalRevenue)}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-semibold border border-white/10"
              >
                Chop etish
              </button>
              <button
                onClick={() => {
                  showToast('Z-Xisobot muvaffaqiyatli saqlandi va kassa yopildi!', 'success');
                  setIsZReportOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold"
              >
                Tasdiqlash & Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
