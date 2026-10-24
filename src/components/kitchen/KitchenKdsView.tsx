import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Order } from '../../types';
import { formatTimeAgo } from '../../utils/formatters';
import { 
  ChefHat, 
  Clock, 
  CheckCircle2, 
  Flame, 
  Bell, 
  UtensilsCrossed, 
  CheckCheck, 
  Receipt, 
  Sparkles, 
  Check, 
  Volume2, 
  AlertTriangle 
} from 'lucide-react';

export const KitchenKdsView: React.FC = () => {
  const { orders, updateOrderStatus, openReceiptModal, playSound, showToast } = useRestaurant();
  const [activeTab, setActiveTab] = useState<'cooking' | 'ready' | 'all'>('cooking');
  const [checkedDishes, setCheckedDishes] = useState<Record<string, boolean>>({});

  // Filter orders for the kitchen
  const cookingOrders = orders.filter((o) => o.status === 'cooking');
  const readyOrders = orders.filter((o) => o.status === 'ready');
  const allKitchenOrders = orders.filter((o) => o.status === 'cooking' || o.status === 'ready');

  const displayedOrders = activeTab === 'cooking'
    ? cookingOrders
    : activeTab === 'ready'
    ? readyOrders
    : allKitchenOrders;

  const handleToggleDish = (orderId: string, idx: number) => {
    const key = `${orderId}-${idx}`;
    setCheckedDishes((prev) => ({ ...prev, [key]: !prev[key] }));
    playSound('click');
  };

  const handleMarkAsReady = (order: Order) => {
    updateOrderStatus(order.id, 'ready');
    playSound('ready');
    showToast(`Oshxona: ${order.orderNumber} taomlari tayyor bo‘ldi! Ofitsiant chaqirildi.`, 'success');
  };

  const handleStartCooking = (order: Order) => {
    updateOrderStatus(order.id, 'cooking');
    showToast(`Oshxona: ${order.orderNumber} pishirishga qabul qilindi.`, 'info');
  };

  const ringChefBell = () => {
    playSound('ready');
    showToast('🔔 Qo‘ng‘iroq chalingan! Ofitsiantlarga ovozli signal yuborildi.', 'info');
  };

  return (
    <div className="bg-stone-950 text-stone-100 rounded-3xl border border-amber-500/30 overflow-hidden shadow-2xl flex flex-col space-y-6 p-6">
      {/* KDS Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xl shadow-lg shadow-amber-500/10">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-100">
                Oshxona KDS (Kitchen Display System)
              </h2>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <p className="text-xs text-stone-400">
              Oshpazlar ish stoli: real vaqt rejimida taom tayyorlash, qovurish va ofitsiantni chaqirish
            </p>
          </div>
        </div>

        {/* Action Controls & Chime */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={ringChefBell}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-md active:scale-95"
          >
            <Bell className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>Ofitsiantni Chaqirish (Ding!)</span>
          </button>

          {/* Tab Filters */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-900 rounded-xl border border-white/10 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('cooking')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'cooking'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Pishirilmoqda ({cookingOrders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('ready')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'ready'
                  ? 'bg-emerald-500 text-stone-950 font-bold shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Tayyor ({readyOrders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-stone-700 text-white font-bold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Barchasi ({allKitchenOrders.length})
            </button>
          </div>
        </div>
      </div>

      {/* Orders Tickets Grid */}
      {displayedOrders.length === 0 ? (
        <div className="text-center py-20 bg-stone-900/40 rounded-3xl border border-white/5 space-y-3">
          <UtensilsCrossed className="w-16 h-16 stroke-1 text-stone-600 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-stone-200">
            Hozirda pishirilayotgan yangi buyurtmalar yo‘q
          </h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            Ofitsiant yoki kassa yangi buyurtma yuborganda, chiptalar avtomatik ravishda bu yerda paydo bo‘ladi.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayedOrders.map((order) => {
            const isCooking = order.status === 'cooking';

            return (
              <div
                key={order.id}
                className={`rounded-2xl border flex flex-col justify-between overflow-hidden shadow-2xl transition-all ${
                  isCooking
                    ? 'bg-stone-900 border-amber-500/40 shadow-amber-500/5'
                    : 'bg-stone-900/60 border-emerald-500/30'
                }`}
              >
                {/* Chipta Sarlavhasi (Ticket Header) */}
                <div
                  className={`p-4 border-b flex items-center justify-between ${
                    isCooking ? 'bg-amber-950/40 border-amber-500/20' : 'bg-emerald-950/25 border-emerald-500/20'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-xl text-stone-100 font-mono">
                        {order.orderNumber}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                          isCooking
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {isCooking ? 'Pishirilmoqda' : 'Tayyor'}
                      </span>
                    </div>

                    <div className="text-xs text-stone-300 font-semibold mt-1">
                      {order.type === 'dine_in'
                        ? `🏛️ Zalda — Stol № ${order.tableNumber}`
                        : order.type === 'delivery'
                        ? `🛵 Yetkazib berish (${order.customerName})`
                        : `🛍️ Olib ketish`}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatTimeAgo(order.createdAt)}</span>
                    </div>
                    {order.waiterName && (
                      <div className="text-[10px] text-stone-400 mt-0.5">
                        Ofitsiant: <strong className="text-stone-200">{order.waiterName}</strong>
                      </div>
                    )}
                  </div>
                </div>

                {/* Taomlar Nazorat Ro'yxati (Interactive Dish Checklist for Line Cooks) */}
                <div className="p-4 flex-1 space-y-2">
                  <div className="text-[11px] text-stone-400 font-semibold uppercase tracking-wider mb-1">
                    Taomlar ro‘yxati (Belgilash uchun bosing):
                  </div>

                  {order.items.map((item, idx) => {
                    const isChecked = checkedDishes[`${order.id}-${idx}`] || false;

                    return (
                      <div
                        key={idx}
                        onClick={() => handleToggleDish(order.id, idx)}
                        className={`p-3 rounded-xl border flex items-start justify-between gap-3 cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-emerald-950/20 border-emerald-500/40 opacity-75'
                            : 'bg-stone-950 border-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 flex-1">
                          <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                              isChecked
                                ? 'bg-emerald-500 border-emerald-400 text-stone-950 font-bold'
                                : 'border-stone-600 bg-stone-900'
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>

                          <div>
                            <div className={`font-bold text-sm ${isChecked ? 'line-through text-stone-400' : 'text-stone-100'}`}>
                              {item.name}
                            </div>
                            {item.note && (
                              <div className="text-xs text-amber-300 font-medium italic mt-0.5">
                                ⚠️ {item.note}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold text-base font-mono shrink-0">
                          x {item.quantity}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Ticket Action Footer */}
                <div className="p-4 border-t border-white/10 bg-stone-950/80 flex items-center justify-between gap-2.5">
                  <button
                    onClick={() => openReceiptModal(order)}
                    className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Chekni ko‘rish"
                  >
                    <Receipt className="w-4 h-4 text-amber-400" />
                    <span>Chek</span>
                  </button>

                  {isCooking ? (
                    <button
                      onClick={() => handleMarkAsReady(order)}
                      className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-stone-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer font-serif"
                    >
                      <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                      <span>TAYYOR BO‘LDI! (OFITSIANTGA XABAR)</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartCooking(order)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-400 font-bold text-xs transition-colors cursor-pointer text-center"
                    >
                      <span>Qayta Pishirishga O‘tkazish</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
