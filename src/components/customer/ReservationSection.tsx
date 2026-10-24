import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Calendar, Clock, Users, MapPin, Sparkles, CheckCircle2, Phone, User } from 'lucide-react';

export const ReservationSection: React.FC = () => {
  const { addReservation } = useRestaurant();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [guests, setGuests] = useState(4);
  const [date, setDate] = useState('Bugun');
  const [time, setTime] = useState('19:00');
  const [zone, setZone] = useState<'main' | 'terrace' | 'vip'>('main');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastBookingCode, setLastBookingCode] = useState('');

  const timeSlots = [
    '11:30', '12:00', '13:00', '14:00', '17:00', 
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const bookingCode = `BRON-${Math.floor(1000 + Math.random() * 9000)}`;
    setLastBookingCode(bookingCode);

    addReservation({
      customerName: name.trim(),
      phone: phone.trim(),
      guestsCount: Number(guests),
      date,
      time,
      zone,
      specialRequests: specialRequests.trim() || undefined,
    });

    setIsSuccess(true);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setName('');
    setPhone('+998 ');
    setGuests(4);
    setSpecialRequests('');
  };

  return (
    <section id="reservation" className="py-24 bg-stone-900/40 border-t border-amber-500/10 text-stone-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Online Stol Bron Qilish</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            O‘zingiz Uchun Eng Shinam Stolni Tanlang
          </h2>
          <p className="text-stone-400 text-xs sm:text-sm">
            Oldindan stol band qilib, kutishlarsiz qulay joy va eng oliy darajali xizmatdan bahramand bo‘ling.
          </p>
        </div>

        {/* Card */}
        <div className="bg-stone-950 border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          {isSuccess ? (
            <div className="text-center py-10 space-y-4 max-w-md mx-auto animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-100">
                Stol Muvaffaqiyatli Band Qilindi!
              </h3>
              <p className="text-stone-300 text-sm leading-relaxed">
                Hurmatli <strong className="text-amber-400">{name}</strong>, sizning broningiz qabul qilindi.
                Restoran ma’muri 5 daqiqa ichida qo‘ng‘iroq qilib, stolingizni tasdiqlaydi.
              </p>
              <div className="p-4 rounded-xl bg-stone-900 border border-white/10 text-xs font-mono text-stone-300 space-y-1">
                <div>Bron kodi: <strong className="text-amber-400">{lastBookingCode}</strong></div>
                <div>Mehmonlar: {guests} kishi | {date}, soat {time}</div>
                <div>Zal: {zone === 'main' ? 'Asosiy zal' : zone === 'terrace' ? 'Yozgi terassa' : 'VIP xona'}</div>
              </div>
              <button
                onClick={handleReset}
                className="mt-4 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors cursor-pointer"
              >
                Yana yangi stol bron qilish
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ism */}
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-2 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ismingiz</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan, Jamshid Aliyev"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-900 border border-white/10 rounded-xl text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Telefon */}
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-2 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>Telefon Raqamingiz</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+998 90 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-900 border border-white/10 rounded-xl text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Zal Tanlash */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Zal Tanlang</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'main', label: 'Asosiy Zal', desc: 'Jonli musiqa va shinam muhit' },
                    { id: 'terrace', label: 'Yozgi Shiypon (Terassa)', desc: 'Toza havo va salqin oqshom' },
                    { id: 'vip', label: 'VIP Alohida Xona', desc: 'Shaxsiy xizmat va tinchlik' },
                  ].map((z) => (
                    <div
                      key={z.id}
                      onClick={() => setZone(z.id as typeof zone)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        zone === z.id
                          ? 'bg-amber-500/10 border-amber-400 text-stone-100 shadow-md shadow-amber-500/10'
                          : 'bg-stone-900 border-white/10 text-stone-400 hover:border-white/20'
                      }`}
                    >
                      <div className="font-semibold text-xs text-amber-300">{z.label}</div>
                      <div className="text-[11px] text-stone-400 mt-1">{z.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mehmonlar soni, Sana va Vaqt */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Guests */}
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    <span>Mehmonlar soni</span>
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-stone-900 border border-white/10 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-amber-400"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20].map((num) => (
                      <option key={num} value={num}>
                        {num} kishi
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Sana</span>
                  </label>
                  <select
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-900 border border-white/10 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="Bugun">Bugun</option>
                    <option value="Ertaga">Ertaga</option>
                    <option value="Indinga">Indinga</option>
                    <option value="Dam olish kuni">Kelgusi dam olish kuni</option>
                  </select>
                </div>

                {/* Time */}
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Vaqt</span>
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-900 border border-white/10 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-amber-400"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Qo'shimcha istaklar */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-2">
                  Qo‘shimcha istaklar (ixtiyoriy)
                </label>
                <input
                  type="text"
                  placeholder="Masalan: Tug‘ilgan kun bezagi, bolalar stulchasi, deraza oldidagi stol..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full px-4 py-3 bg-stone-900 border border-white/10 rounded-xl text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-base shadow-xl shadow-amber-500/20 active:scale-[0.99] transition-all cursor-pointer"
              >
                Stolni Bron Qilish
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
