import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { useRestaurant } from '../../context/RestaurantContext';
import { 
  QrCode, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Layers, 
  Smartphone, 
  Wifi, 
  Maximize2,
  RefreshCw,
  Palette
} from 'lucide-react';

interface QrMenuGeneratorProps {
  onClose?: () => void;
}

export const QrMenuGenerator: React.FC<QrMenuGeneratorProps> = () => {
  const { tables, showToast } = useRestaurant();

  // Target mode: 'general' (all guests) | 'table' (specific table) | 'custom' (custom URL)
  const [targetType, setTargetType] = useState<'general' | 'table' | 'custom'>('general');
  const [selectedTableNumber, setSelectedTableNumber] = useState<number>(1);
  const [customUrl, setCustomUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [cardStyle, setCardStyle] = useState<'premium' | 'classic' | 'minimal'>('premium');
  const [includeWifi, setIncludeWifi] = useState(true);
  const [wifiName, setWifiName] = useState('SAVORIA_GUEST');
  const [wifiPass, setWifiPass] = useState('savoria2025');
  const [viewMode, setViewMode] = useState<'single' | 'batch'>('single');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Compute base URL
  const baseUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${window.location.pathname}` 
    : 'https://savoria.uz/';

  // Get active link based on selection
  const getQrUrl = (tableNum?: number) => {
    if (targetType === 'custom' && customUrl.trim()) {
      return customUrl.trim();
    }
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    if (targetType === 'table' || tableNum !== undefined) {
      const num = tableNum !== undefined ? tableNum : selectedTableNumber;
      return `${cleanBase}?table=${num}#menu`;
    }
    return `${cleanBase}#menu`;
  };

  const currentUrl = getQrUrl();

  // Generate QR code data URL whenever currentUrl or style changes
  useEffect(() => {
    let isMounted = true;
    setIsGenerating(true);

    const darkColor = cardStyle === 'classic' ? '#000000' : '#10141e';
    const lightColor = '#ffffff';

    QRCode.toDataURL(currentUrl, {
      width: 480,
      margin: 2,
      color: {
        dark: darkColor,
        light: lightColor,
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => {
        if (isMounted) {
          setQrDataUrl(url);
          setIsGenerating(false);
        }
      })
      .catch((err) => {
        console.error('Failed to generate QR code:', err);
        setIsGenerating(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentUrl, cardStyle]);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      showToast('Menyu havolasi nusxalandi!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Nusxalashda xatolik yuz berdi', 'warning');
    }
  };

  const handleDownloadPng = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = `savoria-qr-${targetType === 'table' ? `stol-${selectedTableNumber}` : 'menyu'}.png`;
    link.href = qrDataUrl;
    link.click();
    showToast('QR kod PNG formatida yuklab olindi!', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero description */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/20 via-[#d4af37]/10 to-stone-900 border border-[#d4af37]/30 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Raqamli Menyu Tizimi
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-white tracking-tight">
              Smartfonlar uchun QR Menyu Yaratish
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Mijozlar restoranga tashrif buyurganda stol ustidagi QR kodni telefon kamerasiga yo‘naltirib, 
              <strong> SAVORIA</strong> ning shohona menyusini to‘liq ko‘rishlari, taomlar suratlari, narxlari va tarkibi bilan tanishishlari mumkin.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setViewMode(viewMode === 'single' ? 'batch' : 'single')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                viewMode === 'batch'
                  ? 'bg-[#d4af37] text-neutral-950 border-[#d4af37] shadow-lg shadow-amber-500/20'
                  : 'bg-stone-900/80 text-stone-200 border-stone-700 hover:bg-stone-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              {viewMode === 'batch' ? 'Yakka Tartibga Qaytish' : 'Barcha Stollar To‘plami (16 ta)'}
            </button>

            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              Chop Etish (Print)
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {viewMode === 'single' ? (
        /* SINGLE GENERATOR LAYOUT: Controls on left, Stand Preview on right */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: Controls & Settings (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* 1. Target Selector */}
            <div className="bg-[#121520] border border-[#22283a] rounded-3xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <QrCode className="w-4 h-4 text-[#d4af37]" />
                1. QR Kod Qayerga Yo‘naltirilsin?
              </h3>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTargetType('general')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    targetType === 'general'
                      ? 'bg-[#d4af37]/15 border-[#d4af37] text-[#d4af37] font-bold shadow-md'
                      : 'bg-[#181c2b] border-[#252b40] text-stone-400 hover:text-white hover:bg-[#1f2438]'
                  }`}
                >
                  <Smartphone className="w-4 h-4 mx-auto mb-1.5" />
                  <span className="text-xs block">Umumiy Menyu</span>
                  <span className="text-[10px] opacity-70 block font-normal">Kirish & Bar</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetType('table')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    targetType === 'table'
                      ? 'bg-[#d4af37]/15 border-[#d4af37] text-[#d4af37] font-bold shadow-md'
                      : 'bg-[#181c2b] border-[#252b40] text-stone-400 hover:text-white hover:bg-[#1f2438]'
                  }`}
                >
                  <Layers className="w-4 h-4 mx-auto mb-1.5" />
                  <span className="text-xs block">Aynan Stol</span>
                  <span className="text-[10px] opacity-70 block font-normal">Stol 1 - 16</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetType('custom')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    targetType === 'custom'
                      ? 'bg-[#d4af37]/15 border-[#d4af37] text-[#d4af37] font-bold shadow-md'
                      : 'bg-[#181c2b] border-[#252b40] text-stone-400 hover:text-white hover:bg-[#1f2438]'
                  }`}
                >
                  <ExternalLink className="w-4 h-4 mx-auto mb-1.5" />
                  <span className="text-xs block">Maxsus Havola</span>
                  <span className="text-[10px] opacity-70 block font-normal">Custom Link</span>
                </button>
              </div>

              {/* Table Selector if 'table' mode */}
              {targetType === 'table' && (
                <div className="space-y-2 pt-2 border-t border-[#22283a]">
                  <label className="text-xs font-semibold text-stone-300 flex items-center justify-between">
                    <span>Stolni tanlang:</span>
                    <span className="text-amber-400 font-bold">Stol № {selectedTableNumber}</span>
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 max-h-44 overflow-y-auto pr-1">
                    {tables.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTableNumber(t.number)}
                        className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedTableNumber === t.number
                            ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 shadow-md shadow-amber-500/20'
                            : 'bg-[#1a1f30] text-stone-300 hover:bg-[#242b44] border border-[#29324e]'
                        }`}
                      >
                        #{t.number}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom URL Input if 'custom' mode */}
              {targetType === 'custom' && (
                <div className="space-y-2 pt-2 border-t border-[#22283a]">
                  <label className="text-xs font-semibold text-stone-300">
                    Maxsus havola manzilini kiriting:
                  </label>
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://savoria.uz/#menu"
                    className="w-full bg-[#181c2b] border border-[#2a3045] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}

              {/* Active URL display with Copy Button */}
              <div className="pt-2">
                <div className="text-[11px] text-stone-400 mb-1">Hosil bo‘lgan to‘g‘ridan-to‘g‘ri havola:</div>
                <div className="flex items-center gap-2 bg-[#0c0e17] border border-[#23283c] rounded-xl p-2">
                  <span className="text-[11px] font-mono text-amber-300 truncate flex-1 select-all">
                    {currentUrl}
                  </span>
                  <button
                    onClick={handleCopyUrl}
                    className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-all cursor-pointer"
                    title="Nusxalash"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <a
                    href={currentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-all"
                    title="Menyuni ochish"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* 2. Visual Styling Options */}
            <div className="bg-[#121520] border border-[#22283a] rounded-3xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#d4af37]" />
                2. Stend Dizayni & Bezaklari
              </h3>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setCardStyle('premium')}
                  className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                    cardStyle === 'premium'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                      : 'bg-[#181c2b] border-[#252b40] text-stone-400 hover:text-white'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-amber-500 mx-auto mb-1" />
                  <span className="text-xs">Shohona Gold</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCardStyle('classic')}
                  className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                    cardStyle === 'classic'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                      : 'bg-[#181c2b] border-[#252b40] text-stone-400 hover:text-white'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-stone-200 mx-auto mb-1" />
                  <span className="text-xs">Klassik Oq</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCardStyle('minimal')}
                  className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                    cardStyle === 'minimal'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                      : 'bg-[#181c2b] border-[#252b40] text-stone-400 hover:text-white'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-stone-800 border border-stone-600 mx-auto mb-1" />
                  <span className="text-xs">Minimal Qora</span>
                </button>
              </div>

              {/* Wi-Fi badge inclusion */}
              <div className="space-y-3 pt-2 border-t border-[#22283a]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeWifi}
                    onChange={(e) => setIncludeWifi(e.target.checked)}
                    className="rounded accent-amber-500 w-4 h-4"
                  />
                  <span className="text-xs text-stone-300 font-medium flex items-center gap-1.5">
                    <Wifi className="w-3.5 h-3.5 text-amber-400" />
                    Stendga Wi-Fi ma'lumotlarini qo‘shish
                  </span>
                </label>

                {includeWifi && (
                  <div className="grid grid-cols-2 gap-2 pl-6">
                    <div>
                      <span className="text-[10px] text-stone-400 block mb-1">Tarmoq (SSID):</span>
                      <input
                        type="text"
                        value={wifiName}
                        onChange={(e) => setWifiName(e.target.value)}
                        className="w-full bg-[#181c2b] border border-[#2a3045] rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 block mb-1">Parol:</span>
                      <input
                        type="text"
                        value={wifiPass}
                        onChange={(e) => setWifiPass(e.target.value)}
                        className="w-full bg-[#181c2b] border border-[#2a3045] rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Export Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleDownloadPng}
                disabled={!qrDataUrl || isGenerating}
                className="flex-1 py-3 rounded-2xl bg-[#1a1f30] hover:bg-[#252c44] border border-[#2e3752] text-stone-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-amber-400" />
                PNG Yuklab Olish
              </button>

              <button
                onClick={handlePrint}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-lg shadow-amber-500/20"
              >
                <Printer className="w-4 h-4" />
                Stendni Chop Etish
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Realistic Table Stand Card Live Preview (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            <div className="w-full max-w-md">
              <div className="text-center mb-3">
                <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                  Jonli Chop Etish Ko‘rinishi (Print Preview)
                </span>
                <p className="text-[11px] text-stone-400">
                  Ushbu stend stol ustiga vertikal yoki teyk-tent akril stendiga joylashtiriladi.
                </p>
              </div>

              {/* THE PRINTABLE STAND CARD (Matched by print CSS) */}
              <div
                id="printable-qr-card"
                className={`relative mx-auto w-full rounded-3xl p-6 sm:p-8 shadow-2xl transition-all duration-300 border ${
                  cardStyle === 'classic'
                    ? 'bg-stone-50 text-stone-900 border-stone-300 shadow-stone-900/40'
                    : cardStyle === 'minimal'
                    ? 'bg-[#0f111a] text-white border-stone-800 shadow-black'
                    : 'bg-gradient-to-b from-[#151926] via-[#10131d] to-[#0a0c13] text-white border-[#d4af37]/40 shadow-amber-950/20'
                }`}
              >
                {/* Gold Frame Ornaments if Premium */}
                {cardStyle === 'premium' && (
                  <>
                    <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#d4af37]" />
                    <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#d4af37]" />
                    <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#d4af37]" />
                    <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#d4af37]" />
                  </>
                )}

                {/* Header with Crest */}
                <div className="text-center space-y-1.5 pb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#d4af37]/20 to-amber-500/10 border border-[#d4af37]/40 text-[#d4af37] shadow-inner">
                    <span className="text-2xl">⚜️</span>
                  </div>
                  <h4 className="font-serif font-black tracking-widest text-lg sm:text-xl uppercase bg-gradient-to-r from-[#edd37e] via-[#d4af37] to-[#b38e22] bg-clip-text text-transparent">
                    SAVORIA RESTAURANT
                  </h4>
                  <p className="text-[10px] tracking-widest uppercase text-stone-400 font-medium">
                    O‘zbekistonning Eng Nufuzli Milliy & Premium Restorani
                  </p>
                </div>

                {/* Table Number Badge if table mode */}
                {targetType === 'table' ? (
                  <div className="my-2 text-center">
                    <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-500/30 to-amber-500/20 border border-amber-400/50 text-amber-300 font-bold text-xs uppercase tracking-wider">
                      ✦ STOL № {selectedTableNumber} ✦
                    </span>
                  </div>
                ) : (
                  <div className="my-2 text-center">
                    <span className="inline-block px-4 py-1 rounded-full bg-stone-800/60 border border-stone-700 text-stone-300 font-semibold text-[11px] uppercase tracking-wider">
                      ✦ SHOXONA RAQAMLI MENYU ✦
                    </span>
                  </div>
                )}

                {/* Scannable High-Contrast QR Code Container */}
                <div className="my-4 flex justify-center">
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-white shadow-xl shadow-black/40 border-2 border-amber-400/30 relative flex items-center justify-center">
                    {qrDataUrl ? (
                      <div className="relative">
                        <img
                          src={qrDataUrl}
                          alt="SAVORIA Raqamli Menyu QR Kodi"
                          className="w-52 h-52 sm:w-60 sm:h-60 object-contain rounded-lg"
                        />
                        {/* Center Logo Crest inside the QR */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-11 h-11 rounded-xl bg-neutral-950 border-2 border-[#d4af37] flex items-center justify-center shadow-lg">
                            <span className="text-sm">⚜️</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-52 h-52 sm:w-60 sm:h-60 flex flex-col items-center justify-center gap-2 text-stone-500">
                        <RefreshCw className="w-6 h-6 animate-spin text-amber-500" />
                        <span className="text-xs">QR yaratilmoqda...</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Instructions */}
                <div className="text-center space-y-1 pt-1">
                  <div className="text-xs font-bold text-stone-200">
                    Smartfon kamerasini yo‘naltiring
                  </div>
                  <p className="text-[11px] text-stone-400 max-w-xs mx-auto leading-tight">
                    Taomlar, ichimliklar, fotosuratlar va batafsil narxlar bilan tanishing
                  </p>
                </div>

                {/* Optional Wi-Fi info */}
                {includeWifi && (
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-around text-[10px] text-stone-400 font-mono">
                    <div className="flex items-center gap-1.5">
                      <Wifi className="w-3 h-3 text-amber-400" />
                      <span>Wi-Fi: <strong className="text-stone-200">{wifiName}</strong></span>
                    </div>
                    <div>
                      <span>Parol: <strong className="text-stone-200">{wifiPass}</strong></span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* BATCH MODE: Grid of all 16 tables ready to print in a single click */
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-[#121520] border border-[#22283a] p-4 rounded-2xl">
            <div>
              <h3 className="font-bold text-white text-sm">
                Barcha Stollar QR Stendlari (1 - {tables.length})
              </h3>
              <p className="text-xs text-stone-400">
                Chop etish tugmasini bosganingizda barcha stollar uchun chiroyli stiker va stendlar qator bo‘lib chop qilinadi.
              </p>
            </div>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4" />
              Barchasini Chop Etish
            </button>
          </div>

          <div id="printable-qr-batch" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {tables.map((table) => {
              const tableQrUrl = getQrUrl(table.number);
              return (
                <BatchTableCard
                  key={table.id}
                  tableNumber={table.number}
                  targetUrl={tableQrUrl}
                  cardStyle={cardStyle}
                  includeWifi={includeWifi}
                  wifiName={wifiName}
                  wifiPass={wifiPass}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Batch card component with its own QR code state
const BatchTableCard: React.FC<{
  tableNumber: number;
  targetUrl: string;
  cardStyle: 'premium' | 'classic' | 'minimal';
  includeWifi: boolean;
  wifiName: string;
  wifiPass: string;
}> = ({ tableNumber, targetUrl, cardStyle, includeWifi, wifiName, wifiPass }) => {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    QRCode.toDataURL(targetUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: cardStyle === 'classic' ? '#000000' : '#10141e',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    }).then(setDataUrl).catch(console.error);
  }, [targetUrl, cardStyle]);

  return (
    <div
      className={`rounded-2xl p-4 border text-center relative overflow-hidden transition-all ${
        cardStyle === 'classic'
          ? 'bg-white text-stone-900 border-stone-300'
          : 'bg-[#121624] text-white border-[#d4af37]/30'
      }`}
    >
      <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
        <span className="font-serif font-black text-xs text-amber-400 tracking-wider">SAVORIA</span>
        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px]">
          STOL #{tableNumber}
        </span>
      </div>

      <div className="flex justify-center my-2">
        <div className="p-2 bg-white rounded-xl shadow-md border border-amber-500/20 relative">
          {dataUrl ? (
            <div className="relative">
              <img src={dataUrl} alt={`Stol ${tableNumber} QR`} className="w-36 h-36 object-contain" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-6 h-6 rounded bg-neutral-950 border border-[#d4af37] flex items-center justify-center">
                  <span className="text-[10px]">⚜️</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-36 h-36 flex items-center justify-center">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
            </div>
          )}
        </div>
      </div>

      <div className="text-[11px] font-semibold text-stone-300">
        Menyuni ko‘rish uchun skanerlang
      </div>

      {includeWifi && (
        <div className="mt-2 pt-2 border-t border-white/10 text-[9px] text-stone-400 font-mono flex justify-between">
          <span>Wi-Fi: {wifiName}</span>
          <span>Parol: {wifiPass}</span>
        </div>
      )}
    </div>
  );
};
