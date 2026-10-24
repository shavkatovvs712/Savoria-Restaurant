import React from 'react';
import { 
  Sparkles, 
  Award, 
  HeartHandshake, 
  Music, 
  ShieldCheck, 
  Users, 
  MapPin, 
  Clock, 
  PhoneCall, 
  Wifi, 
  Car 
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const chefs = [
    {
      name: 'Alisher Zokirov',
      role: 'Bosh Oshpaz (Brand Chef)',
      experience: '22 yillik tajriba',
      desc: 'O‘zbek milliy oshxonasining xalqaro elchisi, Istanbul va Toshkent nufuzli restoranlari yetakchi oshpazi.',
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Elchinbek Turdiyev',
      role: 'Grill & Steyk Ustasi',
      experience: '14 yillik tajriba',
      desc: 'Marmar go‘shtlar, ochiq olovda pishiriladigan shashlik va qozon kaboblar bo‘yicha professional mutaxassis.',
      image: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Madina Karimova',
      role: 'Bosh Qandolatchi',
      experience: '11 yillik tajriba',
      desc: 'Sharqona nozik paxlavalar, San Sebastian chizkeyki va mualliflik desertlari ustasi.',
      image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const features = [
    { icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />, title: '100% Halol Kafolati', desc: 'Faqat sertifikatlangan, eng yangi halol go‘sht va sof masalliqlar.' },
    { icon: <Music className="w-5 h-5 text-amber-400" />, title: 'Jonli Musiqa Oqshomi', desc: 'Har hafta payshanba-yakshanba kunlari sokin mumtoz va sharqona jonli musiqa.' },
    { icon: <Users className="w-5 h-5 text-sky-400" />, title: 'VIP Xonalar & Zallar', desc: 'Oilaviy tadbirlar, to‘y oshi va biznes uchrashuvlar uchun maxsus 10-30 kishilik xonalar.' },
    { icon: <HeartHandshake className="w-5 h-5 text-rose-400" />, title: 'Oliy Darajali Xizmat', desc: 'Ofitsiantlarimiz har bir mehmonni oila a’zosidek iliq kutib oladi.' },
    { icon: <Car className="w-5 h-5 text-indigo-400" />, title: 'Qulay Avtoturargoh', desc: '50+ avtomobil uchun bepul, xavfsiz va qo‘riqlanadigan to‘xtash joyi.' },
    { icon: <Wifi className="w-5 h-5 text-teal-400" />, title: 'Namozxona & Wi-Fi', desc: 'Erkaklar va ayollar uchun shinam tahoratxona, namozxona va tezyurar Wi-Fi.' },
  ];

  const gallery = [
    {
      title: 'Asosiy Hashamatli Zal',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Tandir & Ochiq Oshxona',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'VIP Shodlik Xonasi',
      image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Yozgi Shiypon & Terassa',
      image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <section id="about" className="py-24 bg-stone-950 text-stone-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Falsafamiz & Tariximiz</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight mb-4">
            Savoria Restaurant — Nafislik va Mehmondo‘stlik Makoni
          </h2>
          <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
            «Savoria» — bu shunchaki dasturxon emas, balki aziz mehmonlar jam bo‘ladigan, 
            mehr va baraka ulashiladigan qutlug‘ maskan timsoli. Bizning maqsadimiz — 
            har bir tashrifingizni unutilmas taassurotga aylantirishdir.
          </p>
        </div>

        {/* Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-amber-300">
              An’analarimiz va Asl Ta’mlar Uyg‘unligi
            </h3>
            <p className="text-stone-300 text-sm leading-relaxed">
              2011-yildan buyon faoliyat yuritib kelayotgan Savoria restorani o‘zining haqiqiy to‘y oshi,
              tandirda qovurilgan qozon kabobi va G‘ijduvonning shirali qiyma shashliklari bilan yurtimiz ahlining
              sevimli maskaniga aylangan.
            </p>
            <p className="text-stone-400 text-sm leading-relaxed">
              Biz taom tayyorlashda faqat tabiiy o‘t-o‘lanlar bilan boqilgan tog‘ qo‘zichoqlari go‘shti,
              sarxil sabzavotlar va qadimiy sopol ko‘zalardan foydalanamiz. Hech qanday sun’iy ta’m kuchaytirgichlarsiz —
              faqat asl tabiat tuhfasi!
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-stone-900 border border-white/5">
                <div className="text-2xl font-serif font-bold text-amber-400 mb-1">100% Halol</div>
                <div className="text-xs text-stone-400">Har bir xom-ashyo qat’iy nazorat qilinadi</div>
              </div>
              <div className="p-4 rounded-xl bg-stone-900 border border-white/5">
                <div className="text-2xl font-serif font-bold text-amber-400 mb-1">200+ O‘rin</div>
                <div className="text-xs text-stone-400">Asosiy zal, terassa va shinam VIP xonalar</div>
              </div>
            </div>
          </div>

          {/* Interactive atmosphere cards */}
          <div className="grid grid-cols-2 gap-4">
            {gallery.map((item, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl overflow-hidden border border-white/10 aspect-[4/3] shadow-lg"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
                <span className="absolute bottom-3 left-3 right-3 text-xs font-semibold text-stone-100 group-hover:text-amber-300 transition-colors">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Features / Amenities */}
        <div className="mb-20">
          <h3 className="font-serif text-2xl font-bold text-center mb-8 text-stone-100">
            Siz Uchun Yaratilgan Barcha Qulayliklar
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-stone-900/60 border border-white/5 hover:border-amber-500/30 transition-all flex items-start gap-4"
              >
                <div className="p-2.5 rounded-xl bg-stone-950 border border-white/10 shrink-0">
                  {feat.icon}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-stone-100 mb-1">{feat.title}</h4>
                  <p className="text-xs text-stone-400 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chefs Team */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 uppercase font-semibold tracking-wider mb-2">
              <Award className="w-4 h-4" />
              <span>Mahoratli Ustozlar</span>
            </div>
            <h3 className="font-serif text-3xl font-bold text-stone-100 mb-2">
              Bizning Professional Oshpazlarimiz
            </h3>
            <p className="text-xs sm:text-sm text-stone-400">
              Har bir taom orqasida o‘n yillik mahorat va haqiqiy san’atkorona yondashuv turadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {chefs.map((chef, idx) => (
              <div
                key={idx}
                className="bg-stone-900/40 rounded-2xl border border-white/10 overflow-hidden shadow-xl hover:border-amber-500/40 transition-all group"
              >
                <div className="aspect-[3/3] overflow-hidden bg-stone-800">
                  <img
                    src={chef.image}
                    alt={chef.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                      {chef.experience}
                    </span>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-stone-100">{chef.name}</h4>
                  <div className="text-xs font-semibold text-stone-400">{chef.role}</div>
                  <p className="text-xs text-stone-400 leading-relaxed pt-1">{chef.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
