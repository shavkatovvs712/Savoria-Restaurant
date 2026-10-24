import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Table, MenuItem, OrderItem, Category } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { 
  LogOut, 
  User, 
  Coins, 
  Utensils, 
  Plus, 
  Minus, 
  Send, 
  CheckCircle2, 
  Clock, 
  Search, 
  Sparkles, 
  ArrowLeft,
  Receipt,
  AlertCircle,
  X,
  KeyRound
} from 'lucide-react';

export const WaiterPosView: React.FC = () => {
  const {
    currentWaiter,
    waiters,
    loginWaiter,
    logoutWaiter,
    tables,
    menuItems,
    sendOrderToCashier,
    openReceiptModal,
    showToast,
    setMode,
    orders,
  } = useRestaurant();

  // Selected table
  const [selectedTableNumber, setSelectedTableNumber] = useState<number>(() => tables[0]?.number || 1);
  const [guestsCount, setGuestsCount] = useState<number>(2);

  // Draft cart for current table
  const [draftItems, setDraftItems] = useState<{ item: MenuItem; quantity: number }[]>([]);
  const [kitchenNotes, setKitchenNotes] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Post dispatch banner
  const [dispatchedOrder, setDispatchedOrder] = useState<{ id: string; orderNumber: string; total: number; tableNumber: number } | null>(null);

  // Inline login state if currentWaiter is null
  const [selectedWaiterId, setSelectedWaiterId] = useState<string>(waiters[0]?.id || '');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Active waiter
  const activeWaiter = currentWaiter || waiters.find((w) => w.id === selectedWaiterId) || waiters[0];

  // Active table object
  const activeTable = tables.find((t) => t.number === selectedTableNumber) || tables[0];

  // Active order currently at this table if already in progress
  const existingOrder = activeTable?.activeOrderId
    ? orders.find((o) => o.id === activeTable.activeOrderId && o.status !== 'completed' && o.status !== 'cancelled')
    : null;

  // Filter dishes
  const filteredDishes = menuItems.filter((dish) => {
    const matchesCat = selectedCategory === 'all' || dish.category === selectedCategory;
    const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const categories = [
    { id: 'all', label: 'Barchasi' },
    { id: 'national', label: 'Milliy Tansiq' },
    { id: 'kebabs', label: 'Kabob & Shashlik' },
    { id: 'steaks', label: 'Steyk & Gril' },
    { id: 'soups', label: 'Sho‘rvalar' },
    { id: 'salads', label: 'Salatlar' },
    { id: 'drinks', label: 'Ichimliklar & Bar' },
    { id: 'desserts', label: 'Desertlar' },
  ];

  const handleAddDish = (dish: MenuItem) => {
    if (!dish.isAvailable) return;
    setDraftItems((prev) => {
      const idx = prev.findIndex((entry) => entry.item.id === dish.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx].quantity += 1;
        return copy;
      }
      return [...prev, { item: dish, quantity: 1 }];
    });
  };

  const handleUpdateQty = (dishId: string, delta: number) => {
    setDraftItems((prev) =>
      prev
        .map((entry) => (entry.item.id === dishId ? { ...entry, quantity: entry.quantity + delta } : entry))
        .filter((entry) => entry.quantity > 0)
    );
  };

  const subtotal = draftItems.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0);
  const serviceFee = Math.round(subtotal * 0.1); // 10%
  const total = subtotal + serviceFee;
  const totalItemsCount = draftItems.reduce((sum, entry) => sum + entry.quantity, 0);

  const handleSendToCashier = () => {
    if (draftItems.length === 0) {
      showToast('Buyurtmaga kamida bitta taom tanlang!', 'warning');
      return;
    }

    const orderItems: OrderItem[] = draftItems.map(({ item, quantity }) => ({
      dishId: item.id,
      name: item.name,
      price: item.price,
      quantity,
      note: kitchenNotes ? kitchenNotes : undefined,
    }));

    const newOrder = sendOrderToCashier({
      type: 'dine_in',
      tableNumber: selectedTableNumber,
      waiterId: activeWaiter?.id,
      waiterName: activeWaiter?.name || 'Ofitsiant',
      customerName: `Stol ${selectedTableNumber} (${guestsCount} mehmon)`,
      items: orderItems,
    });

    setDispatchedOrder({
      id: newOrder.id,
      orderNumber: newOrder.orderNumber,
      total: newOrder.total,
      tableNumber: selectedTableNumber,
    });

    setDraftItems([]);
    setKitchenNotes('');
  };

  const handleInlineLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) {
      setPinError('Iltimos, PIN kodni kiriting');
      return;
    }
    const success = loginWaiter(pinInput.trim());
    if (success) {
      setPinError('');
      setPinInput('');
    } else {
      setPinError('Noto‘g‘ri PIN kod! Qayta tekshiring.');
    }
  };

  return (
    <div className="min-h-screen bg-[#08090e] text-[#eaeaea] flex flex-col selection:bg-[#d4af37]/30 pb-24">
      {/* Top Waiter Header */}
      <div className="bg-[#10121b] border-b border-[#212435] px-3 sm:px-6 py-3 sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMode('customer')}
            className="p-2 rounded-xl bg-[#141624] text-neutral-400 hover:text-white border border-[#262a3d] transition-colors cursor-pointer"
            title="Mijoz saytiga qaytish"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-base sm:text-lg text-white tracking-wide">
                  {activeWaiter?.name || 'Ofitsiant Ish Stoli'}
                </h1>
              </div>
              <p className="text-[11px] text-neutral-400 font-mono">
                OFITSIANT TERMINALI • Buyurtma olib to‘g‘ridan-to‘g‘ri Kassaga yuboriladi
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 bg-[#141624] px-3 py-1.5 rounded-xl border border-[#252839] text-xs">
            <Coins className="w-4 h-4 text-[#d4af37]" />
            <span className="text-neutral-400">Bugungi choypuli:</span>
            <span className="font-bold text-[#d4af37] font-mono">
              {formatCurrency(activeWaiter?.todayTips || 0)}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 bg-[#141624] px-3 py-1.5 rounded-xl border border-[#252839] text-xs">
            <Utensils className="w-4 h-4 text-sky-400" />
            <span className="text-neutral-400">Buyurtmalar:</span>
            <span className="font-bold text-white font-mono">{activeWaiter?.ordersCount || 0} ta</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full p-3 sm:p-6 space-y-4">
        {/* Waiter Status Bar */}
        <div className="p-3 rounded-2xl bg-[#141622] border border-[#d4af37]/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-neutral-300">
            <User className="w-4 h-4 text-[#d4af37]" />
            <span className="font-medium text-stone-400">Navbatchi Ofitsiant:</span>
            <span className="font-bold text-white bg-[#0c0d13] px-3 py-1.5 rounded-xl border border-[#262a3c]">
              {activeWaiter?.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={logoutWaiter}
              className="px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/50 text-rose-300 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Chiqish</span>
            </button>
          </div>
        </div>

        {/* Dispatched Order Confirmation Banner */}
        {dispatchedOrder && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/70 to-[#121f18] border border-emerald-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-6 h-6 shrink-0" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-white font-mono flex items-center gap-2">
                  <span>BUYURTMA #{dispatchedOrder.orderNumber} KASSAGA YUBORILDI!</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-200 uppercase font-mono">
                    Kassa kutilmoqda
                  </span>
                </div>
                <div className="text-xs text-neutral-300 mt-0.5">
                  Stol №{dispatchedOrder.tableNumber} · Ofitsiant: {activeWaiter?.name} · Summa: {formatCurrency(dispatchedOrder.total)}
                </div>
                <div className="text-[11px] text-emerald-400/80 mt-1">
                  Kassir buyurtmani tasdiqlashi bilan taomlar avtomatik oshxona (KDS) monitoriga uzatiladi.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => {
                  const o = orders.find((ord) => ord.id === dispatchedOrder.id);
                  if (o) openReceiptModal(o);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#1a2e22] text-emerald-300 hover:text-white text-xs font-semibold border border-emerald-500/30 transition-colors cursor-pointer"
              >
                Chekni ko‘rish
              </button>
              <button
                onClick={() => setDispatchedOrder(null)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-stone-950 text-xs font-bold hover:bg-emerald-500 transition-colors cursor-pointer"
              >
                Keyingi Stol
              </button>
            </div>
          </div>
        )}

        {/* 1. TABLE SELECT BAR (Scrollable buttons like Savoria) */}
        <div className="p-3 sm:p-4 rounded-2xl bg-[#11131c] border border-[#212433] space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-semibold text-neutral-300 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-[#d4af37]" />
              <span>Stolni Tanlang *</span>
              <span className="text-[11px] text-neutral-500 font-normal">
                (Zaldagi bo‘sh yoki band stollar)
              </span>
            </label>

            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400">Mehmonlar soni:</span>
              <input
                type="number"
                min={1}
                max={20}
                value={guestsCount}
                onChange={(e) => setGuestsCount(Number(e.target.value))}
                className="w-16 bg-[#090a10] border border-[#262a3c] rounded-xl px-2 py-1 text-xs text-white font-mono text-center focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {tables.map((t) => {
              const isSelected = selectedTableNumber === t.number;
              const isOccupied = t.status === 'occupied' || t.status === 'cooking' || t.status === 'bill_requested';
              const isPending = t.status === 'pending_cashier';

              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedTableNumber(t.number);
                    setDispatchedOrder(null);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[#d4af37] text-neutral-950 shadow-lg shadow-[#d4af37]/20 scale-102 font-extrabold'
                      : isPending
                      ? 'bg-amber-950/40 text-amber-300 border border-amber-500/40'
                      : isOccupied
                      ? 'bg-purple-950/40 text-purple-300 border border-purple-500/30'
                      : 'bg-[#181a28] text-neutral-300 hover:text-white border border-[#262a3d]'
                  }`}
                >
                  <span>Stol #{t.number}</span>
                  <span className="text-[10px] opacity-70">
                    ({t.zone === 'vip' ? 'VIP' : t.zone === 'terrace' ? 'Terrasa' : 'Zal'})
                  </span>
                  {isPending && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />}
                </button>
              );
            })}
          </div>

          {existingOrder && (
            <div className="p-2.5 rounded-xl bg-[#151824] border border-[#2a2e41] text-xs flex items-center justify-between">
              <span className="text-neutral-400">
                Ushbu stolda ochiq buyurtma bor: <strong className="text-white font-mono">{existingOrder.orderNumber}</strong> ({formatCurrency(existingOrder.total)})
              </span>
              <button
                onClick={() => openReceiptModal(existingOrder)}
                className="text-[#d4af37] font-semibold hover:underline"
              >
                Chekni ko‘rish
              </button>
            </div>
          )}
        </div>

        {/* 2. CATEGORY TABS & SEARCH */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#11131c] p-3 rounded-2xl border border-[#212433]">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === c.id
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
              placeholder="Taom yoki ichimlik qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#090a10] border border-[#262a3c] rounded-xl pl-8.5 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>

        {/* 3. DISHES GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredDishes.map((dish) => {
            const inDraft = draftItems.find((d) => d.item.id === dish.id);

            return (
              <div
                key={dish.id}
                onClick={() => handleAddDish(dish)}
                className={`p-3 rounded-2xl border cursor-pointer select-none transition-all flex flex-col justify-between group ${
                  dish.isAvailable
                    ? inDraft
                      ? 'bg-[#1a1c29] border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.15)] ring-1 ring-[#d4af37]'
                      : 'bg-[#12141f] border-[#222535] hover:border-neutral-500'
                    : 'bg-[#0f1017] border-neutral-800 opacity-50 cursor-not-allowed'
                }`}
              >
                <div>
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-2 bg-stone-900">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-black/70 text-amber-300 backdrop-blur-xs">
                      {dish.prepTime}
                    </span>
                  </div>

                  <h4 className="font-semibold text-xs text-white line-clamp-2 leading-snug">
                    {dish.name}
                  </h4>
                  <div className="text-[10px] text-neutral-400 font-mono mt-1">
                    {dish.weight}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-[#1d202d] flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#d4af37] tabular-nums">
                    {formatCurrency(dish.price)}
                  </span>

                  {inDraft ? (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 bg-[#0c0d12] px-1.5 py-0.5 rounded-lg border border-[#d4af37]/60"
                    >
                      <button
                        onClick={() => handleUpdateQty(dish.id, -1)}
                        className="p-1 text-neutral-400 hover:text-white cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-mono font-bold text-[#d4af37] px-1">
                        {inDraft.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQty(dish.id, 1)}
                        className="p-1 text-neutral-400 hover:text-white cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <span className="w-6 h-6 rounded-lg bg-[#1c1f2e] group-hover:bg-[#d4af37] text-neutral-300 group-hover:text-neutral-950 flex items-center justify-center transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 4. BOTTOM BILL SUMMARY & KASSAGA YUBORISH ACTION */}
        {draftItems.length > 0 && (
          <div className="p-4 sm:p-5 rounded-2xl bg-[#11131c] border border-[#d4af37]/50 shadow-2xl space-y-3 sticky bottom-4 z-20 backdrop-blur-md">
            <div className="flex items-center justify-between pb-2 border-b border-[#212433]">
              <div className="font-serif font-bold text-sm text-white flex items-center gap-2">
                <span>Stol Cheki: Stol #{selectedTableNumber}</span>
                <span className="text-xs font-mono text-[#d4af37]">({totalItemsCount} ta taom)</span>
              </div>
              <div className="text-xs font-mono text-neutral-400">
                Ofitsiant: <strong className="text-white">{activeWaiter?.name}</strong>
              </div>
            </div>

            {/* Selected items list */}
            <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 text-xs">
              {draftItems.map(({ item, quantity }) => (
                <div key={item.id} className="flex justify-between items-center py-1 border-b border-[#1c1e2b]">
                  <span className="text-white truncate max-w-[220px]">
                    <strong className="text-amber-400 font-bold">{quantity}x</strong> {item.name}
                  </span>
                  <span className="font-mono text-[#d4af37] font-bold">
                    {formatCurrency(item.price * quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Kitchen Notes */}
            <div>
              <input
                type="text"
                placeholder="Oshxona uchun izoh (masalan: achchiq bo‘lmasin, sous alohida, tuzsiz)..."
                value={kitchenNotes}
                onChange={(e) => setKitchenNotes(e.target.value)}
                className="w-full bg-[#090a10] border border-[#272a3d] rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            {/* Totals & Submit */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-[#202434]">
              <div>
                <div className="text-[11px] text-neutral-400">
                  Oraliq summa: {formatCurrency(subtotal)} + Xizmat haqi (10%): {formatCurrency(serviceFee)}
                </div>
                <div className="text-base sm:text-lg font-bold text-white font-mono flex items-center gap-2">
                  <span>Jami Summa:</span>
                  <span className="text-[#d4af37]">{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDraftItems([])}
                  className="px-3.5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Tozalash
                </button>
                <button
                  onClick={handleSendToCashier}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-amber-400 to-[#d4af37] text-neutral-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#d4af37]/25 hover:brightness-110 active:scale-98 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4 stroke-[2.5]" />
                  <span>Kassaga Yuborish</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
