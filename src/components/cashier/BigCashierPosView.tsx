import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Order, PaymentMethod, MenuItem } from '../../types';
import { formatCurrency, formatTimeAgo, formatDateTime } from '../../utils/formatters';
import { 
  Receipt, 
  DollarSign, 
  CheckCircle2, 
  Send, 
  CreditCard, 
  Coins, 
  Clock, 
  Search, 
  Sparkles, 
  Calculator, 
  AlertCircle, 
  ShieldCheck, 
  RefreshCw, 
  Printer, 
  Plus, 
  ChefHat, 
  Check, 
  User, 
  MapPin, 
  Utensils 
} from 'lucide-react';

export const BigCashierPosView: React.FC = () => {
  const {
    orders,
    approveAndSendToKitchenFromCashier,
    processCashierPayment,
    openReceiptModal,
    menuItems,
    tables,
    sendOrderToCashier,
    setMode,
    showToast
  } = useRestaurant();

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'pending' | 'dining' | 'delivery' | 'completed'>('pending');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [cashGiven, setCashGiven] = useState<number | ''>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Quick Walk-in modal or inline puncher
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);
  const [quickTableNum, setQuickTableNum] = useState<number>(1);
  const [quickCart, setQuickCart] = useState<{ dish: MenuItem; qty: number }[]>([]);

  // Filter queues
  const pendingOrders = orders.filter((o) => o.status === 'pending_cashier');
  const diningOrders = orders.filter(
    (o) => o.type === 'dine_in' && (o.status === 'cooking' || o.status === 'ready')
  );
  const deliveryOrders = orders.filter(
    (o) => o.type === 'delivery' && (o.status === 'cooking' || o.status === 'ready' || o.status === 'delivering')
  );
  const completedToday = orders.filter((o) => o.status === 'completed' || o.isPaid);

  // Set default active tab if pending is 0
  useEffect(() => {
    if (pendingOrders.length > 0 && activeCategory !== 'pending') {
      // Keep user choice or default
    } else if (pendingOrders.length === 0 && activeCategory === 'pending') {
      if (diningOrders.length > 0) setActiveCategory('dining');
      else if (deliveryOrders.length > 0) setActiveCategory('delivery');
    }
  }, [pendingOrders.length, diningOrders.length, deliveryOrders.length]);

  // Active list based on category
  const currentList = activeCategory === 'pending'
    ? pendingOrders
    : activeCategory === 'dining'
    ? diningOrders
    : activeCategory === 'delivery'
    ? deliveryOrders
    : completedToday;

  // Filtered by search
  const filteredList = currentList.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.waiterName && o.waiterName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Auto-select first order if none selected or if selected is missing
  const currentOrder = orders.find((o) => o.id === selectedOrderId) ||
    filteredList[0] ||
    pendingOrders[0] ||
    diningOrders[0] ||
    deliveryOrders[0] ||
    orders[0] ||
    null;

  // Totals calculations
  const totalDue = currentOrder ? currentOrder.total : 0;
  const numCashGiven = typeof cashGiven === 'number' ? cashGiven : 0;
  const changeDue = Math.max(0, numCashGiven - totalDue);

  // Payment totals
  const cashTotal = completedToday.filter((o) => !o.paymentMethod || o.paymentMethod === 'cash').reduce((s, o) => s + o.total, 0);
  const electronicTotal = completedToday.filter((o) => o.paymentMethod && o.paymentMethod !== 'cash').reduce((s, o) => s + o.total, 0);
  const grandTotalSales = cashTotal + electronicTotal;

  const handleSelectOrder = (order: Order) => {
    setSelectedOrderId(order.id);
    setCashGiven(order.total);
  };

  const handleApproveKitchen = () => {
    if (!currentOrder) return;
    approveAndSendToKitchenFromCashier(currentOrder.id);
  };

  const handlePayAndPrint = () => {
    if (!currentOrder) return;
    processCashierPayment(currentOrder.id, paymentMethod, numCashGiven || currentOrder.total);
    setCashGiven('');
  };

  const setExactCash = () => {
    if (currentOrder) {
      setCashGiven(currentOrder.total);
    }
  };

  const addCashAmount = (amount: number) => {
    setCashGiven((prev) => (typeof prev === 'number' ? prev + amount : amount));
  };

  // Quick Order submit
  const handleCreateQuickOrder = () => {
    if (quickCart.length === 0) {
      showToast('Kamida bitta taom tanlang!', 'warning');
      return;
    }

    const newOrder = sendOrderToCashier({
      type: 'takeaway',
      customerName: `Kassa Tezkor Chek (#${Math.floor(100 + Math.random() * 900)})`,
      items: quickCart.map((c) => ({
        dishId: c.dish.id,
        name: c.dish.name,
        price: c.dish.price,
        quantity: c.qty,
      })),
    });

    setQuickCart([]);
    setIsQuickOrderOpen(false);
    setSelectedOrderId(newOrder.id);
    setActiveCategory('pending');
  };

  return (
    <div className="bg-stone-950 text-stone-100 rounded-3xl border border-amber-500/30 overflow-hidden shadow-2xl flex flex-col">
      {/* ================= KASSA EXECUTIVE HEADER ================= */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/50 p-5 border-b border-amber-500/20 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Cashier Status */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-0.5 shadow-xl shadow-amber-500/20 shrink-0">
            <div className="w-full h-full bg-stone-950 rounded-[14px] flex items-center justify-center border border-amber-400/40">
              <span className="text-xl">⚜️</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-wide text-stone-100">
                Savoria Asosiy Kassa & To‘lov Markazi
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-bold border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Smena №1 • Ochiq
              </span>
            </div>
            <div className="text-xs text-stone-400 flex items-center gap-3 mt-0.5">
              <span>Kassir: <strong className="text-amber-300">Laziz (Admin)</strong></span>
              <span>•</span>
              <span className="font-mono text-stone-400">Toshkent, Chilonzor • Fiskal № SAVORIA-POS-01</span>
            </div>
          </div>
        </div>

        {/* Live Financial Counters & Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="bg-stone-950/90 px-3.5 py-2 rounded-xl border border-emerald-500/30 shadow-md">
            <span className="text-stone-400 block text-[10px] font-medium">💵 Naqd Pul Balansi:</span>
            <span className="font-serif font-bold text-emerald-400 text-sm sm:text-base font-mono">
              {formatCurrency(cashTotal)}
            </span>
          </div>

          <div className="bg-stone-950/90 px-3.5 py-2 rounded-xl border border-sky-500/30 shadow-md">
            <span className="text-stone-400 block text-[10px] font-medium">📱 Click / Payme / Uzum:</span>
            <span className="font-serif font-bold text-sky-400 text-sm sm:text-base font-mono">
              {formatCurrency(electronicTotal)}
            </span>
          </div>

          <div className="bg-stone-950/90 px-3.5 py-2 rounded-xl border border-amber-500/30 shadow-md">
            <span className="text-stone-400 block text-[10px] font-medium">🧾 Jami Tushum ({completedToday.length} chek):</span>
            <span className="font-serif font-bold text-amber-400 text-sm sm:text-base font-mono">
              {formatCurrency(grandTotalSales)}
            </span>
          </div>

          <button
            onClick={() => setIsQuickOrderOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Tezkor Chek</span>
          </button>
        </div>
      </div>

      {/* ================= 3-COLUMN KASSA WORKSPACE ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[660px]">
        {/* ================= LEFT COLUMN: QUEUE & SEARCH (4 cols) ================= */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-white/10 p-4 space-y-3 bg-stone-900/40 flex flex-col">
          {/* Tab Selection */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-stone-950 rounded-xl border border-white/10 text-xs font-semibold">
            <button
              onClick={() => setActiveCategory('pending')}
              className={`py-2 px-1 rounded-lg text-center transition-all cursor-pointer relative text-[11px] ${
                activeCategory === 'pending'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <span>Ofitsiant</span>
              {pendingOrders.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[9px] font-extrabold animate-pulse">
                  {pendingOrders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveCategory('dining')}
              className={`py-2 px-1 rounded-lg text-center transition-all cursor-pointer text-[11px] ${
                activeCategory === 'dining'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <span>Zalda ({diningOrders.length})</span>
            </button>

            <button
              onClick={() => setActiveCategory('delivery')}
              className={`py-2 px-1 rounded-lg text-center transition-all cursor-pointer text-[11px] ${
                activeCategory === 'delivery'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <span>Dostavka ({deliveryOrders.length})</span>
            </button>

            <button
              onClick={() => setActiveCategory('completed')}
              className={`py-2 px-1 rounded-lg text-center transition-all cursor-pointer text-[11px] ${
                activeCategory === 'completed'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <span>Cheklar ({completedToday.length})</span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500" />
            <input
              type="text"
              placeholder="Chek №, stol yoki ofitsiant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-stone-950 border border-white/10 rounded-xl text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Orders Queue Cards */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[520px]">
            {filteredList.length === 0 ? (
              <div className="text-center py-12 text-stone-500 text-xs space-y-2">
                <Receipt className="w-8 h-8 mx-auto text-stone-600 stroke-1" />
                <p>Ushbu bo‘limda buyurtmalar yo‘q.</p>
                <button
                  onClick={() => setIsQuickOrderOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-400 text-[11px] font-semibold"
                >
                  + Yangi Chek Ochish
                </button>
              </div>
            ) : (
              filteredList.map((order) => {
                const isSelected = currentOrder?.id === order.id;

                return (
                  <div
                    key={order.id}
                    onClick={() => handleSelectOrder(order)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-stone-900 border-amber-400 ring-2 ring-amber-400/50 shadow-lg'
                        : order.status === 'pending_cashier'
                        ? 'bg-amber-950/25 border-amber-500/40 hover:border-amber-400'
                        : 'bg-stone-950/70 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-sm text-stone-100 font-mono">
                          {order.orderNumber}
                        </span>
                        {order.status === 'pending_cashier' ? (
                          <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase animate-pulse">
                            Kassaga yangi
                          </span>
                        ) : order.status === 'cooking' ? (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30 uppercase">
                            Oshxonada
                          </span>
                        ) : order.status === 'ready' ? (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                            Tayyor
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-stone-800 text-stone-300 uppercase">
                            {order.status}
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-stone-200 font-medium truncate mt-0.5">
                        {order.type === 'dine_in'
                          ? `🏛️ Stol № ${order.tableNumber}`
                          : `🛵 Yetkazish (${order.customerName})`}
                      </div>

                      <div className="text-[10px] text-stone-500 flex items-center gap-2 mt-0.5">
                        {order.waiterName && <span>Ofitsiant: <strong>{order.waiterName}</strong></span>}
                        <span>•</span>
                        <span>{formatTimeAgo(order.createdAt)}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-serif font-bold text-sm text-amber-400 font-mono block">
                        {formatCurrency(order.total)}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {order.items.length} xil taom
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ================= CENTER COLUMN: TICKET INSPECTOR (4 cols) ================= */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-white/10 p-5 bg-stone-900/60 flex flex-col justify-between">
          {currentOrder ? (
            <div className="flex-1 flex flex-col justify-between">
              <div>
                {/* Order Header Box */}
                <div className="pb-3 border-b border-white/10 mb-3 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-xl text-stone-100 font-mono">
                        {currentOrder.orderNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        {currentOrder.type === 'dine_in' ? `Stol № ${currentOrder.tableNumber}` : 'Yetkazib berish'}
                      </span>
                    </div>
                    <div className="text-xs text-stone-400 mt-1">
                      Mijoz: <strong className="text-stone-200">{currentOrder.customerName}</strong>
                      {currentOrder.waiterName && ` • Ofitsiant: ${currentOrder.waiterName}`}
                    </div>
                  </div>

                  <button
                    onClick={() => openReceiptModal(currentOrder)}
                    className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-400 transition-colors cursor-pointer"
                    title="Fiskal Chekni chop etish"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>

                {/* Items List */}
                <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                  {currentOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-stone-950 border border-white/5 flex items-center justify-between text-xs"
                    >
                      <div className="flex-1 pr-2">
                        <div className="font-semibold text-stone-100">{item.name}</div>
                        {item.note && <div className="text-[10px] text-amber-300 italic font-medium">⚠️ {item.note}</div>}
                        <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                          {item.quantity} x {formatCurrency(item.price)}
                        </div>
                      </div>
                      <div className="font-mono font-bold text-stone-200 text-sm">
                        {formatCurrency(item.quantity * item.price)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subtotals & Grand Total Banner */}
              <div className="pt-4 border-t border-white/10 space-y-1.5 text-xs text-stone-400">
                <div className="flex justify-between">
                  <span>Oraliq hisob (Subtotal):</span>
                  <span className="text-stone-200 font-mono">{formatCurrency(currentOrder.subtotal)}</span>
                </div>
                {currentOrder.serviceFee > 0 && (
                  <div className="flex justify-between">
                    <span>Restoran xizmat haqi (10%):</span>
                    <span className="text-stone-200 font-mono">{formatCurrency(currentOrder.serviceFee)}</span>
                  </div>
                )}
                {currentOrder.deliveryFee > 0 && (
                  <div className="flex justify-between">
                    <span>Yetkazib berish xizmati:</span>
                    <span className="text-stone-200 font-mono">{formatCurrency(currentOrder.deliveryFee)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-lg font-bold text-stone-100 pt-3 border-t border-white/10 font-serif">
                  <span>JAMI TO‘LOV:</span>
                  <span className="text-amber-400 font-mono text-2xl font-bold bg-stone-950 px-3 py-1 rounded-xl border border-amber-500/30">
                    {formatCurrency(currentOrder.total)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-stone-500 space-y-3">
              <Receipt className="w-12 h-12 stroke-1 text-stone-600" />
              <p className="text-sm font-semibold text-stone-300">Buyurtma tanlanmagan</p>
              <button
                onClick={() => setIsQuickOrderOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
              >
                + Yangi Chek Ochish
              </button>
            </div>
          )}
        </div>

        {/* ================= RIGHT COLUMN: PAYMENT ACTIONS (4 cols) ================= */}
        <div className="lg:col-span-4 p-5 bg-stone-950 flex flex-col justify-between space-y-5">
          {currentOrder ? (
            <div className="space-y-5 flex-1 flex flex-col justify-between">
              <div>
                {/* Workflow Status Banner */}
                {currentOrder.status === 'pending_cashier' ? (
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5 mb-4">
                    <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">Ofitsiantdan kelgan buyurtma!</div>
                      <div className="text-[11px] text-amber-400/80 mt-0.5">
                        Taomlarni tekshirib, quyidagi sarg‘ish tugma orqali oshxonaga jo‘nating.
                      </div>
                    </div>
                  </div>
                ) : currentOrder.isPaid ? (
                  <div className="p-3 rounded-xl bg-stone-900 border border-white/10 text-stone-300 text-xs flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Ushbu buyurtma to‘langan va chek chiqarilgan.</span>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2 mb-4">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Taomlar oshxonada / tayyor. Mijozdan to‘lovni qabul qiling.</span>
                  </div>
                )}

                {/* Payment Methods */}
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-2">
                    To‘lov usulini tanlang:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'cash', label: '💵 Naqd pul' },
                      { id: 'click', label: '📱 Click' },
                      { id: 'payme', label: '💳 Payme' },
                      { id: 'uzum', label: '🍇 Uzum Bank' },
                      { id: 'card', label: '💳 Bank kartasi' },
                    ].map((pm) => (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                        className={`p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center ${
                          paymentMethod === pm.id
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold shadow-md'
                            : 'bg-stone-900 border-white/5 text-stone-400 hover:text-white'
                        }`}
                      >
                        {pm.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cash Calculator (if cash selected) */}
                {paymentMethod === 'cash' && (
                  <div className="space-y-3 pt-4 border-t border-white/10 mt-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-stone-300">Mijoz bergan naqd pul:</span>
                      <button
                        onClick={setExactCash}
                        className="text-[11px] text-amber-400 hover:underline cursor-pointer font-semibold"
                      >
                        Aniq summa ({formatCurrency(currentOrder.total)})
                      </button>
                    </div>

                    <input
                      type="number"
                      step={1000}
                      placeholder="Masalan, 500000"
                      value={cashGiven}
                      onChange={(e) => setCashGiven(e.target.value ? Number(e.target.value) : '')}
                      className="w-full px-4 py-3 bg-stone-900 border border-white/10 rounded-xl text-lg font-mono font-bold text-amber-300 focus:outline-none focus:border-amber-400"
                    />

                    {/* Quick Add Cash Buttons */}
                    <div className="grid grid-cols-4 gap-1.5 text-xs">
                      {[50000, 100000, 200000, 500000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => addCashAmount(amt)}
                          className="py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-white/5 text-stone-300 text-[11px] font-mono cursor-pointer"
                        >
                          +{amt / 1000}k
                        </button>
                      ))}
                    </div>

                    {/* Change Due Box */}
                    <div className="p-3.5 rounded-xl bg-stone-900/90 border border-white/10 flex items-center justify-between shadow-inner">
                      <span className="text-xs text-stone-400 font-semibold">Qaytariladigan Qaytim:</span>
                      <span className={`font-serif font-bold text-xl font-mono ${
                        changeDue > 0 ? 'text-emerald-400' : 'text-stone-500'
                      }`}>
                        {formatCurrency(changeDue)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Big Action Buttons */}
              <div className="space-y-2.5 pt-4 border-t border-white/10">
                {currentOrder.status === 'pending_cashier' && (
                  <button
                    onClick={handleApproveKitchen}
                    className="w-full px-4 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-105 active:scale-98 text-stone-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 text-center"
                  >
                    <Send className="w-4 h-4 shrink-0 stroke-[2.5]" />
                    <span className="font-extrabold whitespace-nowrap">Oshxonaga Jo‘natish (KDS)</span>
                  </button>
                )}

                <button
                  onClick={handlePayAndPrint}
                  disabled={currentOrder.isPaid}
                  className="w-full px-4 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:brightness-105 disabled:opacity-40 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-emerald-600/30 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 text-center"
                >
                  <Receipt className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 stroke-[2.5]" />
                  <span className="font-extrabold whitespace-nowrap">To‘lovni Qabul Qilish & Chek</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-stone-500 space-y-3">
              <Calculator className="w-12 h-12 stroke-1 text-stone-600" />
              <p className="text-xs">Kassir amallari uchun buyurtma tanlang.</p>
            </div>
          )}
        </div>
      </div>

      {/* ================= MODAL: TEZKOR CHEK OCHISH (WALK-IN) ================= */}
      {isQuickOrderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-stone-950 border border-amber-500/30 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <h3 className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2">
                <span>Kassada Yangi Tezkor Chek Ochish</span>
              </h3>
              <button
                onClick={() => setIsQuickOrderOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 flex-1 overflow-y-auto">

              {/* Menu items selector */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Taomlarni tanlang:
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {menuItems.slice(0, 12).map((dish) => (
                    <button
                      key={dish.id}
                      type="button"
                      onClick={() => {
                        setQuickCart((prev) => {
                          const existing = prev.find((p) => p.dish.id === dish.id);
                          if (existing) {
                            return prev.map((p) =>
                              p.dish.id === dish.id ? { ...p, qty: p.qty + 1 } : p
                            );
                          }
                          return [...prev, { dish, qty: 1 }];
                        });
                      }}
                      className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-white/5 text-left flex justify-between items-center text-xs"
                    >
                      <span className="font-medium text-stone-200 truncate pr-2">{dish.name}</span>
                      <span className="font-mono text-amber-400 font-bold shrink-0">{formatCurrency(dish.price)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected in Quick Cart */}
              {quickCart.length > 0 && (
                <div className="p-3 rounded-xl bg-stone-900 border border-white/10 space-y-2 text-xs">
                  <div className="font-bold text-amber-400">Tanlangan taomlar:</div>
                  {quickCart.map((c, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span>{c.dish.name} (x{c.qty})</span>
                      <span className="font-mono text-stone-300">{formatCurrency(c.dish.price * c.qty)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 flex gap-2">
              <button
                onClick={handleCreateQuickOrder}
                className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs cursor-pointer shadow-lg shadow-amber-500/20"
              >
                Chekni Shakllantirish & Kassaga Yuborish
              </button>
              <button
                onClick={() => setIsQuickOrderOpen(false)}
                className="px-4 py-3 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold cursor-pointer"
              >
                Bekor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
