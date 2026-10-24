import React from 'react';
import { UtensilsCrossed, CalendarCheck, Sparkles, Star, ShieldCheck, Flame, ArrowRight } from 'lucide-react';

interface HeroProps {
  onOpenReservation: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenReservation }) => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-stone-950 text-stone-100 py-16 lg:py-24">
      {/* Background with Ambient Glow */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80"
          alt="Sofra Restaurant Atmosphere"
          className="w-full h-full object-cover opacity-25 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-stone-950/50" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Premium Badge (Exact user requested pill badge) */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-400 text-xs sm:text-sm font-semibold mb-6 shadow-lg shadow-amber-500/10 animate-in fade-in duration-700">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>O‘zbekistonning eng nufuzli milliy & premium restorani</span>
        </div>

        {/* Main Title */}
        <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 max-w-5xl mx-auto">
          <span className="block text-stone-100">Sharqona Mehmondo‘stlik &</span>
          <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
            Yuksak Gastronomik San’at
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-stone-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Tandirda qizargan qozon kabob, olovda pishirilgan shirali G‘ijduvon shashligi va Gaziantep pista baklavasi.
          Har bir taom qalb mehri bilan tayyorlanadi.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="#menu"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-bold text-base shadow-xl shadow-amber-500/25 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <UtensilsCrossed className="w-5 h-5 text-stone-950" />
            <span>Katta Menyuni Ko‘rish</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <button
            onClick={onOpenReservation}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-stone-200 hover:text-white font-semibold text-base border border-amber-500/30 hover:border-amber-400/60 shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <CalendarCheck className="w-5 h-5 text-amber-400" />
            <span>Stol Bron Qilish</span>
          </button>
        </div>

        {/* Stats & Trust Elements */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-white/10">
          <div className="p-4 rounded-xl bg-stone-900/50 border border-white/5 backdrop-blur-sm text-center">
            <div className="flex items-center justify-center gap-1 text-amber-400 font-bold text-xl sm:text-2xl mb-1">
              <Star className="w-5 h-5 fill-amber-400" />
              <span>4.9 / 5.0</span>
            </div>
            <p className="text-xs text-stone-400">500+ Mamnun Mehmonlar</p>
          </div>

          <div className="p-4 rounded-xl bg-stone-900/50 border border-white/5 backdrop-blur-sm text-center">
            <div className="flex items-center justify-center gap-1 text-emerald-400 font-bold text-xl sm:text-2xl mb-1">
              <ShieldCheck className="w-5 h-5" />
              <span>100% Halol</span>
            </div>
            <p className="text-xs text-stone-400">Sertifikatlangan Go‘sht</p>
          </div>

          <div className="p-4 rounded-xl bg-stone-900/50 border border-white/5 backdrop-blur-sm text-center">
            <div className="flex items-center justify-center gap-1 text-amber-400 font-bold text-xl sm:text-2xl mb-1">
              <Flame className="w-5 h-5" />
              <span>50+ Xil</span>
            </div>
            <p className="text-xs text-stone-400">Shohona Taomlar Menyu</p>
          </div>

          <div className="p-4 rounded-xl bg-stone-900/50 border border-white/5 backdrop-blur-sm text-center">
            <div className="text-stone-100 font-bold text-xl sm:text-2xl mb-1 font-serif">
              15+ Yillik
            </div>
            <p className="text-xs text-stone-400">Ustoz Oshpazlar Tajribasi</p>
          </div>
        </div>
      </div>
    </section>
  );
};
