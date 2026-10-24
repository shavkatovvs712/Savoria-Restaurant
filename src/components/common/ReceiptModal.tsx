import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { Printer, X, CheckCircle, QrCode } from 'lucide-react';

export const ReceiptModal: React.FC = () => {
  const { activeReceiptOrder, closeReceiptModal } = useRestaurant();

  if (!activeReceiptOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  const paymentLabels: Record<string, string> = {
    cash: 'Naqd pul',
    click: 'Click Evolution',
    payme: 'Payme',
    uzum: 'Uzum Bank',
    card: 'Bank kartasi (HUMO/Uzcard)'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-stone-900 border border-amber-500/30 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-stone-950/60 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-serif font-bold text-lg">Kassa Cheki</span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
              FISKAL № {activeReceiptOrder.orderNumber}
            </span>
          </div>
          <button
            onClick={closeReceiptModal}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Receipt Body */}
        <div className="p-6 overflow-y-auto">
          {/* Printable Receipt Paper */}
          <div
            id="printable-receipt"
            className="bg-white text-stone-900 p-6 rounded-lg shadow-inner font-mono text-xs border border-dashed border-stone-300 mx-auto"
          >
            {/* Restaurant Title */}
            <div className="text-center pb-4 border-b border-dashed border-stone-400">
              <div className="text-xl font-bold tracking-widest uppercase font-serif text-amber-900">
                ⚜️ SAVORIA ⚜️
              </div>
              <div className="text-[11px] font-semibold tracking-wider text-stone-700 uppercase mt-0.5">
                Premium Restaurant
              </div>
              <div className="text-[10px] text-stone-600 mt-1">
                Toshkent sh., Bunyodkor shoh ko‘chasi 45
              </div>
              <div className="text-[10px] text-stone-600">
                Tel: +998 (71) 200-71-12 | STIR: 308945214
              </div>
            </div>

            {/* Receipt Info */}
            <div className="py-3 border-b border-dashed border-stone-400 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-stone-500">Chek raqami:</span>
                <span className="font-bold">{activeReceiptOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Sana va vaqt:</span>
                <span>{formatDateTime(activeReceiptOrder.completedAt || activeReceiptOrder.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Xizmat turi:</span>
                <span className="font-bold uppercase">
                  {activeReceiptOrder.type === 'dine_in'
                    ? `Zalda (Stol №${activeReceiptOrder.tableNumber})`
                    : activeReceiptOrder.type === 'delivery'
                    ? 'Yetkazib berish'
                    : 'Olib ketish'}
                </span>
              </div>
              {activeReceiptOrder.waiterName && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Ofitsiant:</span>
                  <span className="font-semibold">{activeReceiptOrder.waiterName}</span>
                </div>
              )}
              {activeReceiptOrder.courierName && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Kuryer:</span>
                  <span className="font-semibold">{activeReceiptOrder.courierName}</span>
                </div>
              )}
              {activeReceiptOrder.customerName && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Mijoz:</span>
                  <span>{activeReceiptOrder.customerName}</span>
                </div>
              )}
              {activeReceiptOrder.deliveryAddress && (
                <div className="flex justify-between text-[10px] text-stone-700">
                  <span className="text-stone-500">Manzil:</span>
                  <span className="text-right max-w-[180px] truncate">{activeReceiptOrder.deliveryAddress}</span>
                </div>
              )}
            </div>

            {/* Items Table */}
            <div className="py-3 border-b border-dashed border-stone-400">
              <div className="flex justify-between font-bold text-[10px] text-stone-600 pb-1 border-b border-stone-300">
                <span>Nomi</span>
                <div className="flex gap-4">
                  <span>Miqdor x Narx</span>
                  <span>Jami</span>
                </div>
              </div>
              <div className="divide-y divide-stone-100 my-1">
                {activeReceiptOrder.items.map((item, idx) => (
                  <div key={idx} className="py-1.5 flex justify-between items-start text-[11px]">
                    <div className="pr-2">
                      <div className="font-medium text-stone-900">{item.name}</div>
                      {item.note && <div className="text-[9px] text-stone-500 italic">* {item.note}</div>}
                    </div>
                    <div className="flex gap-3 text-right shrink-0">
                      <span className="text-stone-600">
                        {item.quantity} x {new Intl.NumberFormat('uz-UZ').format(item.price)}
                      </span>
                      <span className="font-bold text-stone-900 w-16">
                        {new Intl.NumberFormat('uz-UZ').format(item.quantity * item.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="py-3 space-y-1.5 text-[11px] border-b border-dashed border-stone-400">
              <div className="flex justify-between text-stone-600">
                <span>Oraliq hisob (Subtotal):</span>
                <span>{formatCurrency(activeReceiptOrder.subtotal)}</span>
              </div>
              {activeReceiptOrder.serviceFee > 0 && (
                <div className="flex justify-between text-stone-600">
                  <span>Xizmat haqi (10%):</span>
                  <span>{formatCurrency(activeReceiptOrder.serviceFee)}</span>
                </div>
              )}
              {activeReceiptOrder.deliveryFee > 0 && (
                <div className="flex justify-between text-stone-600">
                  <span>Yetkazib berish xizmati:</span>
                  <span>{formatCurrency(activeReceiptOrder.deliveryFee)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-stone-950 pt-1 border-t border-stone-300">
                <span>JAMI TO‘LOV:</span>
                <span>{formatCurrency(activeReceiptOrder.total)}</span>
              </div>
              {activeReceiptOrder.cashGiven && activeReceiptOrder.cashGiven > activeReceiptOrder.total && (
                <>
                  <div className="flex justify-between text-stone-600 pt-1">
                    <span>Mijoz bergan naqd summa:</span>
                    <span>{formatCurrency(activeReceiptOrder.cashGiven)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-800 font-bold">
                    <span>Qaytarilgan qaytim:</span>
                    <span>{formatCurrency(activeReceiptOrder.changeDue || 0)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Payment & Fiscal Footer */}
            <div className="pt-3 text-center space-y-2">
              <div className="flex items-center justify-between bg-stone-100 p-2 rounded text-[11px]">
                <span className="text-stone-600 font-semibold">Kassa To‘lov turi:</span>
                <span className="font-bold uppercase text-stone-900">
                  {paymentLabels[activeReceiptOrder.paymentMethod || 'cash'] || 'Naqd pul'}
                </span>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-emerald-700 font-bold text-[11px]">
                <CheckCircle className="w-4 h-4" />
                <span>To‘lov kassa orqali to‘liq qabul qilindi</span>
              </div>

              {/* QR Mockup */}
              <div className="flex items-center justify-center gap-2 pt-1 text-stone-600">
                <QrCode className="w-12 h-12 text-stone-800" />
                <div className="text-left text-[9px] text-stone-500 leading-tight">
                  <p className="font-bold text-stone-700">Fiskal chek tekshirish</p>
                  <p>soliq.uz elektron tizimi</p>
                  <p>FM: 948271039820</p>
                </div>
              </div>

              <div className="text-[10px] text-stone-500 italic pt-1">
                Tashrifingiz uchun samimiy minnatdormiz! Yana kuting!
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-white/10 bg-stone-950/60 rounded-b-2xl flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Printer className="w-5 h-5" />
            <span>Chekni chop etish</span>
          </button>
          <button
            onClick={closeReceiptModal}
            className="py-3 px-5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold transition-colors cursor-pointer"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
};
