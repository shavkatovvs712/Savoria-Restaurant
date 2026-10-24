import React from 'react';
import { Phone, Clock, MapPin, Instagram, Facebook, Send, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenStaffModal?: (tab?: 'waiter' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenStaffModal }) => {
  return (
    <footer className="bg-stone-950 border-t border-amber-500/20 text-stone-300 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚜️</span>
              <span className="font-serif text-2xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">
                SAVORIA
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              Sharqona mehmondo‘stlik, yuksak gastronomik san’at va unutilmas taassurotlar maskani. 
              Har bir taom qalb mehri bilan tayyorlanadi.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Halol Go‘sht & Mahsulotlar</span>
            </div>
          </div>

          {/* Col 2: Aloqa */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-amber-300">Bog‘lanish</h4>
            <ul className="space-y-3 text-sm text-stone-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <span>Toshkent sh., Chilonzor tumani, Bunyodkor shoh ko‘chasi 45-uy</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-500 shrink-0" />
                <a href="tel:+998712007112" className="hover:text-amber-400 transition-colors">
                  +998 (71) 200-71-12
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-500 shrink-0" />
                <a href="tel:+998901237112" className="hover:text-amber-400 transition-colors">
                  +998 (90) 123-71-12
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Ish Vaqtlari */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-amber-300">Ish Vaqti</h4>
            <div className="space-y-3 text-sm text-stone-400">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-stone-200">Dushanba - Yakshanba</div>
                  <div className="text-xs text-stone-400">10:00 dan 23:30 gacha</div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-stone-900 border border-white/5 text-xs text-stone-400">
                <span className="text-amber-400 font-semibold block mb-1">Jonli Musiqa:</span>
                Har payshanba, juma, shanba va yakshanba soat 19:30 dan 22:30 gacha.
              </div>
            </div>
          </div>

          {/* Col 4: Ijtimoiy tarmoqlar */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-amber-300">Ijtimoiy Tarmoqlar</h4>
            <p className="text-xs text-stone-400">
              Yangi taomlar, aksiyalar va musiqiy oqshomlar haqida xabardor bo‘lib turing:
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-stone-900 border border-white/10 flex items-center justify-center text-stone-400 hover:text-amber-400 hover:border-amber-400 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-stone-900 border border-white/10 flex items-center justify-center text-stone-400 hover:text-amber-400 hover:border-amber-400 transition-colors"
              >
                <Send className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-stone-900 border border-white/10 flex items-center justify-center text-stone-400 hover:text-amber-400 hover:border-amber-400 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
            <div className="text-[11px] text-stone-500 pt-2">
              Kuryerlik orqali tezkor yetkazib berish butun shahar bo‘ylab mavjud.
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Savoria Restaurant. Barcha huquqlar himoyalangan.</p>
          <div className="flex items-center gap-6">
            <span>Maxfiylik siyosati</span>
            <span>Foydalanish shartlari</span>
            <button
              type="button"
              onClick={() => onOpenStaffModal?.('waiter')}
              className="text-stone-500 hover:text-amber-400 transition-colors font-mono cursor-pointer flex items-center gap-1"
              title="Xodimlar tizimiga kirish"
            >
              <span>🔒 Xodimlar Tizimi</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
