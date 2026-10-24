import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Courier, Order, OrderStatus } from '../../types';
import { formatCurrency, formatTimeAgo, formatDateTime } from '../../utils/formatters';
import { 
  Bike, 
  Car, 
  Navigation, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Plus, 
  RefreshCw, 
  Compass, 
  Eye, 
  User, 
  Sparkles, 
  Check, 
  AlertCircle,
  TrendingUp,
  X
} from 'lucide-react';

interface DostavkaViewProps {
  onOpenAddCourier?: () => void;
}

export const DostavkaView: React.FC<DostavkaViewProps> = ({ onOpenAddCourier }) => {
  const {
    orders,
    couriers,
    assignCourier,
    updateOrderStatus,
    openReceiptModal,
    simulateCourierGps,
    addCourier,
    showToast,
  } = useRestaurant();

  const [statusFilter, setStatusFilter] = useState<'barchasi' | 'kutilmoqda' | 'yolda' | 'yetkazildi'>('barchasi');
  const [selectedCourierMap, setSelectedCourierMap] = useState<Record<string, string>>({});
  const [isAddCourierModalOpen, setIsAddCourierModalOpen] = useState(false);

  // New courier form state
  const [newCourierName, setNewCourierName] = useState('');
  const [newCourierPhone, setNewCourierPhone] = useState('+998 ');
  const [newCourierVehicle, setNewCourierVehicle] = useState<'car' | 'scooter' | 'bike'>('car');

  // Filter delivery orders
  const deliveryOrders = orders.filter((o) => o.type === 'delivery');

  const filteredOrders = deliveryOrders.filter((o) => {
    if (statusFilter === 'barchasi') return true;
    if (statusFilter === 'kutilmoqda') {
      return o.status === 'new' || o.status === 'cooking' || o.status === 'ready';
    }
    if (statusFilter === 'yolda') {
      return o.status === 'delivering';
    }
    if (statusFilter === 'yetkazildi') {
      return o.status === 'completed';
    }
    return true;
  });

  const handleAssign = (orderId: string) => {
    const courierId = selectedCourierMap[orderId] || couriers[0]?.id;
    if (!courierId) {
      showToast('Iltimos, avval kuryerni tanlang!', 'warning');
      return;
    }
    assignCourier(orderId, courierId);
  };

  const handleMarkDelivered = (orderId: string) => {
    updateOrderStatus(orderId, 'completed');
    showToast(`Buyurtma yetkazildi deb belgilandi!`, 'success');
  };

  const handleCreateCourierSubmit = (e: React.FormEvent) => {
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
    setIsAddCourierModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-4 border-b border-[#212435]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
            <Bike className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-white tracking-wide flex items-center gap-2">
              <span>DOSTAVKA LOGISTIKASI & KURYERLAR</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono border border-sky-500/30">
                EXPRESS
              </span>
            </h1>
            <p className="text-xs text-neutral-400 font-mono mt-0.5">
              Toshkent bo‘ylab ekspress yetkazib berish nazorati va kuryerlar GPS radari
            </p>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 bg-[#12141d] p-1 rounded-xl border border-[#232637] overflow-x-auto no-scrollbar">
          {(
            [
              { id: 'barchasi', label: `Barchasi (${deliveryOrders.length})` },
              {
                id: 'kutilmoqda',
                label: `Tayyorlanmoqda (${deliveryOrders.filter((o) => o.status === 'new' || o.status === 'cooking' || o.status === 'ready').length})`,
              },
              {
                id: 'yolda',
                label: `Yo‘lda (${deliveryOrders.filter((o) => o.status === 'delivering').length})`,
              },
              {
                id: 'yetkazildi',
                label: `Yetkazildi (${deliveryOrders.filter((o) => o.status === 'completed').length})`,
              },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-[#d4af37] text-neutral-950 font-bold shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Orders (Left 8 cols) & Couriers/GPS (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Orders list */}
        <div className="lg:col-span-8 space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#11131b] border border-[#212433]">
              <Bike className="w-12 h-12 text-neutral-600 mx-auto stroke-1 mb-3" />
              <h4 className="text-base font-serif font-bold text-neutral-200">
                Ushbu holatda dostavka buyurtmalari yo‘q
              </h4>
              <p className="text-xs text-neutral-400 mt-1">
                Yangi dostavka buyurtmasi kelganda bu yerda real vaqtda ko‘rinadi.
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isDelivering = order.status === 'delivering';
              const isCompleted = order.status === 'completed';

              return (
                <div
                  key={order.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[#12141f] border border-[#242839] hover:border-[#d4af37]/40 transition-all flex flex-col gap-4 shadow-xl"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#212435]">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-sm sm:text-base text-white">
                        {order.orderNumber}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          isDelivering
                            ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                            : isCompleted
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {isDelivering
                          ? 'Kuryer yo‘lda'
                          : isCompleted
                          ? 'Yetkazildi'
                          : order.status === 'ready'
                          ? 'Oshxonada tayyor'
                          : 'Oshxonada pishirilmoqda'}
                      </span>
                      <span className="text-[11px] text-neutral-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-neutral-500" />
                        {formatTimeAgo(order.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-[#d4af37] tabular-nums">
                        {formatCurrency(order.total)}
                      </span>
                      <button
                        onClick={() => openReceiptModal(order)}
                        className="p-1.5 rounded-lg bg-[#1c1f2e] text-neutral-400 hover:text-white border border-[#2d3246] transition-colors cursor-pointer"
                        title="Elektron Chekni ko‘rish"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Customer Info & Address */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-neutral-400">
                        <User className="w-3.5 h-3.5 text-neutral-500" />
                        <span className="text-white font-semibold">{order.customerName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-400">
                        <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                        <a
                          href={`tel:${order.customerPhone}`}
                          className="text-[#d4af37] font-mono hover:underline font-bold"
                        >
                          {order.customerPhone || '+998 90 123-45-67'}
                        </a>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-start gap-2 text-neutral-400">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <span className="text-white leading-snug">
                          {order.deliveryAddress || 'Toshkent sh., Yunusobod tumani'}
                        </span>
                      </div>
                      {order.deliveryCoords && (
                        <div className="text-[10px] text-neutral-400 font-mono pl-5.5">
                          Masofa: ~{order.deliveryCoords.distanceKm} km · Taxminiy vaqt: ~{order.deliveryCoords.etaMinutes} daqiqa
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Items Summary */}
                  <div className="p-2.5 rounded-xl bg-[#0e1017] border border-[#1f2231] text-xs font-mono">
                    <div className="text-[11px] text-neutral-400 mb-1 font-sans">
                      Buyurtma tarkibi:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((item, idx) => (
                        <span key={idx} className="text-neutral-300">
                          <strong className="text-amber-400 font-bold">{item.quantity}x</strong>{' '}
                          {item.name}
                          {idx < order.items.length - 1 ? ' · ' : ''}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Courier Assignment & Actions */}
                  <div className="pt-3 border-t border-[#202434] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    {order.courierName ? (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
                        <span className="text-neutral-400">Biriktirilgan kuryer:</span>
                        <span className="font-bold text-white">{order.courierName}</span>
                        {couriers.find((c) => c.name === order.courierName)?.phone && (
                          <span className="text-neutral-400 font-mono text-[11px]">
                            ({couriers.find((c) => c.name === order.courierName)?.phone})
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <select
                          value={selectedCourierMap[order.id] || ''}
                          onChange={(e) =>
                            setSelectedCourierMap({ ...selectedCourierMap, [order.id]: e.target.value })
                          }
                          className="bg-[#0b0c12] border border-[#2a2e41] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                        >
                          <option value="">Kuryer tanlang...</option>
                          {couriers.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name} ({c.vehicle.toUpperCase()} - {c.status === 'available' ? 'Bo‘sh' : 'Band'})
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleAssign(order.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#d4af37] text-neutral-950 font-bold text-xs hover:bg-[#e6c14c] transition-colors cursor-pointer"
                        >
                          Biriktirish
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {isDelivering && (
                        <button
                          onClick={() => handleMarkDelivered(order.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-emerald-600/20"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Yetkazildi deb belgilash</span>
                        </button>
                      )}
                      {!order.courierName && (order.status === 'ready' || order.status === 'cooking') && (
                        <span className="text-xs text-amber-400 font-mono">
                          Taom tayyorlanmoqda, kuryer biriktiring
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Courier Fleet & Live GPS Radar */}
        <div className="lg:col-span-4 space-y-5">
          {/* Couriers Fleet Card */}
          <div className="p-4 rounded-2xl bg-[#12141e] border border-[#232738] shadow-xl">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
              <h3 className="font-serif font-bold text-sm text-white flex items-center gap-2">
                <span>KURYERLAR SAFI</span>
                <span className="text-xs font-mono text-neutral-400">({couriers.length} kuryer)</span>
              </h3>
              <button
                onClick={() => setIsAddCourierModalOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-[#d4af37]/15 hover:bg-[#d4af37]/25 text-[#d4af37] text-[11px] font-bold border border-[#d4af37]/30 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3 h-3 stroke-[3]" />
                <span>Qo‘shish</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {couriers.map((courier) => (
                <div
                  key={courier.id}
                  className="p-3 rounded-xl bg-[#171926] border border-[#272b3c] flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{courier.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-mono uppercase bg-[#242838] text-neutral-300">
                        {courier.vehicle === 'car' ? '🚗 Mashina' : courier.vehicle === 'scooter' ? '🛵 Skuter' : '🚲 Velosiped'}
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                      {courier.phone}
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        courier.status === 'available'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {courier.status === 'available' ? 'Bo‘sh' : 'Band'}
                    </span>
                    <div className="text-[10px] text-neutral-500 mt-1 font-mono">
                      {courier.activeOrdersCount} buyurtma
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live GPS Map Radar Card */}
          <div className="p-4 rounded-2xl bg-[#12141e] border border-[#232738] shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif font-bold text-sm text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#d4af37]" />
                <span>Jonli Xarita Radar</span>
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={simulateCourierGps}
                  className="p-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white"
                  title="GPS signalini yangilash"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  GPS ONLINE
                </span>
              </div>
            </div>

            {/* Radar Canvas Display */}
            <div className="relative aspect-video w-full rounded-xl bg-[#0b0c12] border border-[#202332] overflow-hidden flex items-center justify-center">
              {/* Map Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2438_1px,transparent_1px),linear-gradient(to_bottom,#1f2438_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />
              
              {/* Radial sonar wave */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.12)_0%,transparent_70%)] pointer-events-none" />

              {/* Restaurant HQ Marker */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                <div className="w-5 h-5 rounded-full bg-[#d4af37] border-2 border-white shadow-[0_0_14px_#d4af37] flex items-center justify-center text-[9px] font-bold text-black animate-pulse">
                  ⚜️
                </div>
                <span className="text-[9px] font-mono text-[#d4af37] font-bold mt-1 bg-black/80 px-1.5 py-0.5 rounded border border-[#d4af37]/40 shadow-sm">
                  Sofra HQ
                </span>
              </div>

              {/* Courier 1 Marker */}
              <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-sky-500 border border-white shadow-[0_0_10px_#0284c7] flex items-center justify-center text-[8px] animate-bounce">
                  🛵
                </div>
                <span className="text-[8px] font-mono text-sky-300 bg-black/80 px-1 rounded mt-0.5 whitespace-nowrap">
                  Farxod (Navoiy)
                </span>
              </div>

              {/* Courier 2 Marker */}
              <div className="absolute bottom-1/4 right-1/4 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-emerald-500 border border-white shadow-[0_0_10px_#10b981] flex items-center justify-center text-[8px]">
                  🚗
                </div>
                <span className="text-[8px] font-mono text-emerald-300 bg-black/80 px-1 rounded mt-0.5 whitespace-nowrap">
                  Jasur (Chilonzor)
                </span>
              </div>

              {/* Courier 3 Marker */}
              <div className="absolute top-1/4 right-1/3 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-amber-500 border border-white shadow-[0_0_10px_#f59e0b] flex items-center justify-center text-[8px]">
                  🚲
                </div>
                <span className="text-[8px] font-mono text-amber-300 bg-black/80 px-1 rounded mt-0.5 whitespace-nowrap">
                  Bobur (Yunusobod)
                </span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded-lg bg-[#161826] border border-white/5 text-neutral-300">
                <div className="text-neutral-500 text-[10px]">O‘rtacha yetkazish:</div>
                <div className="text-white font-bold">~28 daqiqa</div>
              </div>
              <div className="p-2 rounded-lg bg-[#161826] border border-white/5 text-neutral-300">
                <div className="text-neutral-500 text-[10px]">Xizmat radiusi:</div>
                <div className="text-[#d4af37] font-bold">15 km (Toshkent)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Courier Modal */}
      {isAddCourierModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-stone-950 border border-amber-500/30 rounded-3xl p-6 shadow-2xl">
            <button
              onClick={() => setIsAddCourierModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Bike className="w-5 h-5 text-amber-400" />
              <span>Yangi Kuryer Qo‘shish</span>
            </h3>
            <p className="text-xs text-stone-400 mb-4">
              Yetkazib berish xizmati uchun yangi kuryer rekvizitlarini kiriting
            </p>

            <form onSubmit={handleCreateCourierSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Kuryer Ismi Familiyasi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Sardor Aliyev"
                  value={newCourierName}
                  onChange={(e) => setNewCourierName(e.target.value)}
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
                  value={newCourierPhone}
                  onChange={(e) => setNewCourierPhone(e.target.value)}
                  className="w-full bg-stone-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Transport Vositasi
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'car', label: '🚗 Mashina' },
                    { id: 'scooter', label: '🛵 Skuter' },
                    { id: 'bike', label: '🚲 Velosiped' },
                  ].map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setNewCourierVehicle(v.id as 'car' | 'scooter' | 'bike')}
                      className={`p-2 rounded-xl text-xs font-semibold border transition-all ${
                        newCourierVehicle === v.id
                          ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold'
                          : 'bg-stone-900 border-white/10 text-stone-400 hover:text-white'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCourierModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-semibold"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md shadow-amber-500/20"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
