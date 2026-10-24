import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { formatCurrency } from '../../utils/formatters';
import { PaymentMethod } from '../../types';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Bike, 
  ShoppingBag as TakeawayIcon, 
  MapPin, 
  Phone, 
  User, 
  CheckCircle,
  CreditCard
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tableNumber?: number | null;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, tableNumber }) => {
  const { cart, updateCartItemQty, removeFromCart, clearCart, createOrder } = useRestaurant();

  const [orderType, setOrderType] = useState<'dine_in' | 'delivery' | 'takeaway'>(
    tableNumber ? 'dine_in' : 'delivery'
  );
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+998 ');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = orderType === 'delivery' ? 20000 : 0;
  const serviceFee = orderType === 'dine_in' ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + deliveryFee + serviceFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!customerName.trim() || !customerPhone.trim()) return;
    if (orderType === 'delivery' && !deliveryAddress.trim()) return;

    setIsSubmitting(true);

    createOrder({
      type: orderType,
      tableNumber: orderType === 'dine_in' && tableNumber ? tableNumber : undefined,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      deliveryAddress: orderType === 'delivery' ? deliveryAddress.trim() : undefined,
      paymentMethod,
      items: cart,
    });

    clearCart();
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-stone-950 border-l border-amber-500/20 text-stone-100 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-stone-900/60">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="font-serif text-lg font-bold text-stone-100">Savatchangiz</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                {cart.reduce((sum, item) => sum + item.quantity, 0)} ta
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-stone-900 border border-white/5 flex items-center justify-center text-stone-500 mb-4">
                <ShoppingBag className="w-10 h-10 stroke-1" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-stone-200 mb-1">
                Savatchangiz bo‘sh
              </h3>
              <p className="text-xs text-stone-400 max-w-xs mb-6">
                Menyudan sevimli milliy va nozik taomlarni tanlab, savatchaga qo‘shing.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors"
              >
                Menyuni ko‘rish
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitOrder} className="flex-1 flex flex-col justify-between overflow-hidden">
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* Cart Items List */}
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.dishId}
                      className="p-3.5 rounded-xl bg-stone-900/80 border border-white/5 flex items-center justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-xs text-stone-100 truncate">{item.name}</h4>
                        <div className="text-amber-400 font-serif font-bold text-xs mt-0.5">
                          {formatCurrency(item.price)}
                        </div>
                      </div>

                      {/* Quantity buttons */}
                      <div className="flex items-center gap-2 bg-stone-950 px-2 py-1 rounded-lg border border-white/10 shrink-0">
                        <button
                          type="button"
                          onClick={() => updateCartItemQty(item.dishId, -1)}
                          className="text-stone-400 hover:text-white"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-stone-100 min-w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartItemQty(item.dishId, 1)}
                          className="text-stone-400 hover:text-white"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.dishId)}
                        className="text-stone-500 hover:text-rose-400 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Delivery / Dine-in Type Selector */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-stone-300 mb-2">Buyurtma turi:</label>
                  <div className={`grid ${tableNumber ? 'grid-cols-3' : 'grid-cols-2'} gap-2`}>
                    {tableNumber && (
                      <button
                        type="button"
                        onClick={() => setOrderType('dine_in')}
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs font-semibold transition-all ${
                          orderType === 'dine_in'
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                            : 'bg-stone-900 border-white/10 text-stone-400'
                        }`}
                      >
                        <span className="text-sm">⚜️</span>
                        <span className="text-[11px] font-bold">Stol #{tableNumber}</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setOrderType('delivery')}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs font-semibold transition-all ${
                        orderType === 'delivery'
                          ? 'bg-amber-500/10 border-amber-400 text-amber-300'
                          : 'bg-stone-900 border-white/10 text-stone-400'
                      }`}
                    >
                      <Bike className="w-4 h-4" />
                      <span className="text-[11px]">Yetkazish (+20k)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderType('takeaway')}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs font-semibold transition-all ${
                        orderType === 'takeaway'
                          ? 'bg-amber-500/10 border-amber-400 text-amber-300'
                          : 'bg-stone-900 border-white/10 text-stone-400'
                      }`}
                    >
                      <TakeawayIcon className="w-4 h-4" />
                      <span className="text-[11px]">Olib ketish</span>
                    </button>
                  </div>
                </div>

                {/* Customer Details Form */}
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">Ismingiz</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                      <input
                        type="text"
                        required
                        placeholder="Ismingizni kiriting"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-stone-900 border border-white/10 rounded-xl text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">Telefon raqamingiz</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                      <input
                        type="tel"
                        required
                        placeholder="+998 90 123 45 67"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-stone-900 border border-white/10 rounded-xl text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {orderType === 'delivery' && (
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">Yetkazish manzili</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-stone-500" />
                        <textarea
                          required
                          rows={2}
                          placeholder="Tuman, ko‘cha, uy raqami, xonadon..."
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-stone-900 border border-white/10 rounded-xl text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Payment Method */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">To‘lov usuli:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'cash', label: 'Naqd pul' },
                        { id: 'payme', label: 'Payme' },
                        { id: 'click', label: 'Click' },
                      ].map((p) => (
                        <button
                          type="button"
                          key={p.id}
                          onClick={() => setPaymentMethod(p.id as PaymentMethod)}
                          className={`py-2 text-center rounded-lg border text-xs font-semibold ${
                            paymentMethod === p.id
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                              : 'bg-stone-900 border-white/10 text-stone-400'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Order Summary & Button */}
              <div className="p-5 border-t border-white/10 bg-stone-900/80 space-y-3">
                <div className="space-y-1.5 text-xs text-stone-400">
                  <div className="flex justify-between">
                    <span>Taomlar narxi:</span>
                    <span className="text-stone-200">{formatCurrency(subtotal)}</span>
                  </div>
                  {orderType === 'delivery' && (
                    <div className="flex justify-between">
                      <span>Yetkazib berish:</span>
                      <span className="text-stone-200">{formatCurrency(deliveryFee)}</span>
                    </div>
                  )}
                  {orderType === 'dine_in' && (
                    <div className="flex justify-between">
                      <span>Xizmat haqi (10%):</span>
                      <span className="text-stone-200">{formatCurrency(serviceFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold text-stone-100 pt-1 border-t border-white/10 font-serif">
                    <span>Jami to‘lov:</span>
                    <span className="text-amber-400">{formatCurrency(total)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Buyurtmani Rasmiylashtirish</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
