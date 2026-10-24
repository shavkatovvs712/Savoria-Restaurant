import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Courier, Order } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { 
  Navigation, 
  MapPin, 
  Bike, 
  Battery, 
  Gauge, 
  Phone, 
  RefreshCw, 
  Compass, 
  Clock, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';

export const CourierGpsTracker: React.FC = () => {
  const { couriers, orders, simulateCourierGps } = useRestaurant();
  const [selectedCourierId, setSelectedCourierId] = useState<string | null>(couriers[0]?.id || null);

  const selectedCourier = couriers.find((c) => c.id === selectedCourierId) || couriers[0];

  // Active order assigned to selected courier
  const activeOrder = orders.find(
    (o) => o.courierId === selectedCourier?.id && o.status === 'delivering'
  );

  return (
    <div className="bg-stone-950 text-stone-100 rounded-3xl border border-amber-500/30 overflow-hidden shadow-2xl flex flex-col space-y-6 p-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-100">
              Dostavkachilar GPS Jonli Xaritasi & Kuzatuv
            </h3>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Yetkazib berish xizmati xodimlarining real vaqtdagi geolokatsiyasi, tezligi va yo‘nalishi
          </p>
        </div>

        <button
          onClick={simulateCourierGps}
          className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-white/10 text-stone-300 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
        >
          <RefreshCw className="w-4 h-4 text-amber-400" />
          <span>GPS Signalini Yangilash</span>
        </button>
      </div>

      {/* Courier Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {couriers.map((courier) => {
          const isSelected = selectedCourier?.id === courier.id;
          return (
            <button
              key={courier.id}
              onClick={() => setSelectedCourierId(courier.id)}
              className={`p-3 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-400/30 text-stone-100'
                  : 'bg-stone-900 border-white/5 text-stone-400 hover:text-white'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                {courier.vehicle === 'car' ? '🚗' : courier.vehicle === 'scooter' ? '🛵' : '🚲'}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-stone-200">{courier.name}</div>
                <div className="text-[10px] text-stone-400">
                  {courier.status === 'busy' ? (
                    <span className="text-amber-400 font-semibold">Yetkazmoqda</span>
                  ) : (
                    <span className="text-emerald-400">Bo‘sh</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* GPS Interactive Map Display & Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Visual Map Canvas / Simulation (8 cols) */}
        <div className="lg:col-span-8 bg-stone-900 rounded-2xl border border-white/10 relative overflow-hidden min-h-[420px] shadow-inner flex flex-col justify-between p-4">
          {/* Map Grid Background pattern */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          {/* Map Roads simulation */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-stone-700/40" strokeWidth="2">
            <line x1="10%" y1="20%" x2="90%" y2="80%" strokeDasharray="6,6" />
            <line x1="20%" y1="80%" x2="80%" y2="20%" strokeDasharray="6,6" />
            <line x1="50%" y1="0%" x2="50%" y2="100%" />
            <line x1="0%" y1="50%" x2="100%" y2="50%" />
            <circle cx="50%" cy="50%" r="180" fill="none" stroke="rgba(217, 119, 6, 0.15)" strokeWidth="1" />
          </svg>

          {/* Top Map Badges */}
          <div className="relative z-10 flex justify-between items-center text-xs">
            <span className="bg-stone-950/90 backdrop-blur-md px-3 py-1 rounded-xl border border-white/10 font-mono text-stone-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Toshkent shahri GPS Navigatsiya
            </span>
            <span className="bg-stone-950/90 backdrop-blur-md px-3 py-1 rounded-xl border border-white/10 font-mono text-amber-400">
              Sun’iy yo‘ldosh signali: A’lo
            </span>
          </div>

          {/* Restaurant Base Pin (Center) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center group cursor-pointer">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xl shadow-xl shadow-amber-500/40 border-2 border-amber-300">
                ⚜️
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border border-stone-950" />
            </div>
            <span className="mt-1.5 bg-stone-950 px-2 py-0.5 rounded-md text-[10px] font-bold text-amber-300 border border-amber-500/30 whitespace-nowrap shadow-lg">
              Sofra Restaurant (Baza)
            </span>
          </div>

          {/* Selected Courier Live Pin */}
          {selectedCourier && (
            <div
              className="absolute z-30 flex flex-col items-center transition-all duration-700 ease-out cursor-pointer"
              style={{
                top: selectedCourier.status === 'busy' ? '30%' : '65%',
                left: selectedCourier.status === 'busy' ? '70%' : '32%',
              }}
            >
              {/* Route line to destination */}
              <div className="relative">
                <span className="absolute -inset-2 rounded-full bg-purple-500/30 animate-ping" />
                <div className="w-11 h-11 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-xl shadow-purple-500/50 border-2 border-purple-300 relative z-10">
                  {selectedCourier.vehicle === 'car' ? '🚗' : selectedCourier.vehicle === 'scooter' ? '🛵' : '🚲'}
                </div>
              </div>

              <div className="mt-1 bg-stone-950 px-2 py-0.5 rounded-md text-[10px] font-bold text-purple-300 border border-purple-500/40 whitespace-nowrap shadow-xl">
                {selectedCourier.name} ({selectedCourier.gps?.speedKmH || 35} km/soat)
              </div>
            </div>
          )}

          {/* Delivery Destination Pin (if active delivery) */}
          {activeOrder && (
            <div
              className="absolute z-20 flex flex-col items-center"
              style={{ top: '22%', left: '82%' }}
            >
              <div className="w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold shadow-lg border-2 border-rose-300 animate-bounce">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="mt-1 bg-stone-950 px-2 py-0.5 rounded text-[9px] font-bold text-rose-300 border border-rose-500/30 whitespace-nowrap">
                Mijoz Manzili
              </span>
            </div>
          )}

          {/* Bottom Coordinates & Scale */}
          <div className="relative z-10 flex justify-between items-center text-[10px] text-stone-400 pt-4">
            <span className="font-mono bg-stone-950/80 px-2.5 py-1 rounded-lg border border-white/5">
              Lat: {selectedCourier?.gps?.lat.toFixed(4) || '41.2858'}, Lng: {selectedCourier?.gps?.lng.toFixed(4) || '69.2034'}
            </span>
            <span className="font-mono bg-stone-950/80 px-2.5 py-1 rounded-lg border border-white/5">
              Hudud: {selectedCourier?.gps?.district || 'Chilonzor'}
            </span>
          </div>
        </div>

        {/* Right Telemetry & Courier Details (4 cols) */}
        <div className="lg:col-span-4 bg-stone-900 rounded-2xl border border-white/10 p-5 flex flex-col justify-between space-y-4">
          {selectedCourier ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold text-xl">
                    {selectedCourier.vehicle === 'car' ? '🚗' : selectedCourier.vehicle === 'scooter' ? '🛵' : '🚲'}
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-base text-stone-100">{selectedCourier.name}</h4>
                    <span className="text-xs text-stone-400">{selectedCourier.phone}</span>
                  </div>
                </div>
              </div>

              {/* Telemetry stats */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-stone-950 border border-white/5">
                  <div className="flex items-center gap-1.5 text-stone-400 text-[10px] mb-1">
                    <Gauge className="w-3.5 h-3.5 text-amber-400" />
                    <span>Harakat Tezligi:</span>
                  </div>
                  <div className="font-mono font-bold text-base text-amber-400">
                    {selectedCourier.gps?.speedKmH || 0} km/soat
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-950 border border-white/5">
                  <div className="flex items-center gap-1.5 text-stone-400 text-[10px] mb-1">
                    <Battery className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Batareya:</span>
                  </div>
                  <div className="font-mono font-bold text-base text-emerald-400">
                    {selectedCourier.gps?.batteryPercent || 90}%
                  </div>
                </div>
              </div>

              {/* Active Delivery Card */}
              {activeOrder ? (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-amber-400">Faol Buyurtma: {activeOrder.orderNumber}</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono">
                      Yetkazilmoqda
                    </span>
                  </div>
                  <div className="text-stone-300">
                    Mijoz: <strong>{activeOrder.customerName}</strong>
                  </div>
                  <div className="text-[11px] text-stone-400 truncate">
                    Manzil: {activeOrder.deliveryAddress}
                  </div>
                  <div className="pt-2 border-t border-amber-500/20 flex justify-between text-amber-300 font-mono font-bold">
                    <span>To‘lov: {formatCurrency(activeOrder.total)}</span>
                    <span className="text-emerald-400">ETA: ~15 daq</span>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-stone-950 border border-white/5 text-xs text-stone-400 text-center">
                  Hozirda faol buyurtma yo‘q. Kuryer buyurtma qabul qilishga tayyor.
                </div>
              )}

              {/* Action buttons */}
              <div className="pt-2">
                <a
                  href={`tel:${selectedCourier.phone}`}
                  className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Kuryerga qo‘ng‘iroq qilish</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-stone-500 text-xs">
              Kuryer tanlanmagan
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
