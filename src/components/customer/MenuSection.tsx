import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { MenuItem, Category } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { 
  Search, 
  Flame, 
  Clock, 
  Star, 
  Plus, 
  Minus,
  Check,
  MessageSquare, 
  X, 
  Send,
  Sparkles,
  Info
} from 'lucide-react';

export const MenuSection: React.FC = () => {
  const { menuItems, cart, addToCart, updateCartItemQty, reviews, addReview } = useRestaurant();
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');

  // Modal for Dish Details & Reviews
  const [activeDishModal, setActiveDishModal] = useState<MenuItem | null>(null);

  // New Review Form State
  const [newAuthor, setNewAuthor] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  const categories: { id: Category; label: string; icon: string }[] = [
    { id: 'all', label: 'Barchasi', icon: '🍽️' },
    { id: 'national', label: 'Milliy Taomlar', icon: '🍲' },
    { id: 'kebabs', label: 'Shashlik & Kaboblar', icon: '🍢' },
    { id: 'steaks', label: 'Steak & Gril', icon: '🥩' },
    { id: 'soups', label: 'Sho‘rvalar', icon: '🥣' },
    { id: 'salads', label: 'Salatlar', icon: '🥗' },
    { id: 'desserts', label: 'Shirinliklar', icon: '🍰' },
    { id: 'drinks', label: 'Ichimliklar', icon: '☕' },
  ];

  // Filter & Search
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ingredients.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Sort
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (a.isPopular && !b.isPopular) return -1;
    if (!a.isPopular && b.isPopular) return 1;
    return 0;
  });

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim() || !activeDishModal) return;

    addReview({
      menuItemId: activeDishModal.id,
      authorName: newAuthor.trim(),
      rating: newRating,
      comment: newComment.trim(),
    });

    setNewAuthor('');
    setNewComment('');
  };

  const dishReviews = activeDishModal
    ? reviews.filter((r) => r.menuItemId === activeDishModal.id)
    : [];

  return (
    <section id="menu" className="py-20 bg-stone-900/60 border-t border-amber-500/10 text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Katta Menyu & Narxlar</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-stone-100 mb-4">
            Savoria Restorani Shohona Menyusi
          </h2>
          <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
            Har bir taom eng sara yangi masalliqlardan, qadimiy an’analar va xalqaro oshpazlik sirlari asosida tayyorlanadi.
          </p>
        </div>

        {/* Search & Sort Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-stone-950/80 p-4 rounded-2xl border border-white/10 shadow-lg">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Taom nomi yoki masalliq (masalan, go‘sht, palov)..."
              className="w-full pl-10 pr-4 py-2.5 bg-stone-900 border border-white/10 rounded-xl text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400/80 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-xs text-stone-400 hidden sm:inline">Saralash:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-stone-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-stone-300 focus:outline-none focus:border-amber-400"
            >
              <option value="default">Tavsiya etilgan</option>
              <option value="price-asc">Narx: Arzondan qimmatga</option>
              <option value="price-desc">Narx: Qimmatdan arzonga</option>
              <option value="rating">Reyting: Yuqoridan pastga</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold shadow-lg shadow-amber-500/25 scale-105'
                  : 'bg-stone-950/80 border border-white/10 text-stone-400 hover:text-white hover:border-amber-500/40'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        {sortedItems.length === 0 ? (
          <div className="text-center py-16 bg-stone-950/40 rounded-2xl border border-white/5">
            <Info className="w-10 h-10 text-amber-500/50 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-stone-300">Hech qanday taom topilmadi</h3>
            <p className="text-xs text-stone-500 mt-1">Qidiruv so‘zini o‘zgartirib ko‘ring yoki boshqa kategoriyani tanlang.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedItems.map((dish) => {
              const cartItem = cart.find((item) => item.dishId === dish.id);
              const quantityInCart = cartItem?.quantity || 0;

              return (
                <div
                  key={dish.id}
                  className="group relative bg-stone-950 rounded-2xl border border-white/10 overflow-hidden shadow-xl hover:border-amber-500/40 hover:shadow-amber-500/10 transition-all duration-300 flex flex-col"
                >
                {/* Dish Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-900">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/20" />

                  {/* Badges on image */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {dish.isPopular && (
                      <span className="px-2.5 py-1 rounded-md bg-amber-500 text-stone-950 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-md">
                        <Flame className="w-3 h-3 fill-stone-950" />
                        Hit Taom
                      </span>
                    )}
                    {dish.isSpicy && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-600/90 text-white text-[10px] font-bold">
                        🌶️ Achchiq
                      </span>
                    )}
                  </div>

                  {/* Weight & Time */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-stone-300 font-medium">
                    <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                      ⚖️ {dish.weight}
                    </span>
                    <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      {dish.prepTime}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Rating & Reviews */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{dish.rating.toFixed(1)}</span>
                        <span className="text-stone-500 font-normal">({dish.reviewCount || 12} ta sharh)</span>
                      </div>
                      <button
                        onClick={() => setActiveDishModal(dish)}
                        className="text-[11px] text-stone-400 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
                        title="Sharhlarni o‘qish"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Sharhlar</span>
                      </button>
                    </div>

                    {/* Dish Name */}
                    <h3 className="font-serif text-lg font-bold text-stone-100 group-hover:text-amber-300 transition-colors line-clamp-1 mb-1.5">
                      {dish.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed mb-3">
                      {dish.description}
                    </p>

                    {/* Ingredients chips */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {dish.ingredients.slice(0, 3).map((ing, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded bg-stone-900 text-stone-400 border border-white/5"
                        >
                          {ing}
                        </span>
                      ))}
                      {dish.ingredients.length > 3 && (
                        <span className="text-[10px] px-1 py-0.5 text-stone-500">
                          +{dish.ingredients.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price & Add to Cart Action */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <div>
                      {quantityInCart > 0 && (
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mb-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                          Qo‘shildi
                        </span>
                      )}
                      <span className="text-[10px] uppercase text-stone-500 font-medium block">Narxi:</span>
                      <span className="font-bold text-base sm:text-lg text-amber-400 font-serif">
                        {formatCurrency(dish.price)}
                      </span>
                    </div>

                    {quantityInCart > 0 ? (
                      <div className="flex items-center gap-1.5 bg-stone-900 border border-amber-500/60 rounded-xl p-1 shadow-md">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateCartItemQty(dish.id, -1);
                          }}
                          className="w-7 h-7 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                          title="Kamaytirish"
                        >
                          <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>

                        <span className="font-mono text-xs font-extrabold text-amber-400 px-1.5 min-w-[20px] text-center">
                          {quantityInCart}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateCartItemQty(dish.id, 1);
                          }}
                          className="w-7 h-7 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 hover:brightness-110 flex items-center justify-center font-bold transition-all cursor-pointer"
                          title="Ko‘paytirish"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(dish, 1)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>Qo‘shish</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        )}
      </div>

      {/* Dish Details & Reviews Modal */}
      {activeDishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-stone-950 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header Bar */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-stone-900/60">
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-bold text-amber-300">
                  Taom Tafsilotlari & Sharhlar
                </span>
              </div>
              <button
                onClick={() => setActiveDishModal(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-6 space-y-6">
              {/* Dish Overview */}
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <img
                  src={activeDishModal.image}
                  alt={activeDishModal.name}
                  className="w-full sm:w-48 h-48 rounded-xl object-cover border border-white/10 shadow-lg shrink-0"
                />
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold text-sm flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400" />
                      {activeDishModal.rating.toFixed(1)}
                    </span>
                    <span className="text-stone-500 text-xs">({activeDishModal.reviewCount} ta baho)</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-stone-100">
                    {activeDishModal.name}
                  </h3>
                  <p className="text-sm text-stone-300 leading-relaxed">
                    {activeDishModal.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-stone-400 pt-2">
                    <span>Vazni: <strong className="text-stone-200">{activeDishModal.weight}</strong></span>
                    <span>Tayyorlanish: <strong className="text-stone-200">{activeDishModal.prepTime}</strong></span>
                  </div>
                  <div className="pt-2 text-xl font-serif font-bold text-amber-400">
                    {formatCurrency(activeDishModal.price)}
                  </div>
                </div>
              </div>

              {/* Ingredients Details */}
              <div className="p-4 rounded-xl bg-stone-900/50 border border-white/5 space-y-2">
                <h4 className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
                  Tarkibi & Masalliqlar:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeDishModal.ingredients.map((ing, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-stone-800 text-stone-300 text-xs border border-white/10"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reviews Section */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h4 className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-400" />
                  <span>Mijozlar Sharhlari ({dishReviews.length})</span>
                </h4>

                {dishReviews.length === 0 ? (
                  <p className="text-xs text-stone-500 italic">
                    Ushbu taom bo‘yicha hozircha sharhlar yo‘q. Birinchi bo‘lib sharh qoldiring!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {dishReviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-3.5 rounded-xl bg-stone-900/40 border border-white/5 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs text-stone-200">{rev.authorName}</span>
                          <div className="flex items-center gap-1 text-amber-400 text-xs">
                            {Array.from({ length: rev.rating }).map((_, rIdx) => (
                              <Star key={rIdx} className="w-3 h-3 fill-amber-400" />
                            ))}
                            <span className="text-[10px] text-stone-500 ml-1">{rev.date}</span>
                          </div>
                        </div>
                        <p className="text-xs text-stone-300 leading-relaxed">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Submit New Review Form */}
                <form onSubmit={handleAddReview} className="p-4 rounded-xl bg-stone-900 border border-amber-500/20 space-y-3">
                  <div className="font-semibold text-xs text-amber-400 uppercase tracking-wider">
                    Ushbu taomga o‘z sharhingizni qoldiring:
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Ismingiz..."
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      className="px-3 py-2 bg-stone-950 border border-white/10 rounded-lg text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-400"
                    />

                    <div className="flex items-center gap-2 bg-stone-950 px-3 py-1.5 rounded-lg border border-white/10">
                      <span className="text-xs text-stone-400">Baholash:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setNewRating(star)}
                            className="cursor-pointer"
                          >
                            <Star
                              className={`w-4 h-4 ${
                                star <= newRating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-stone-600'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <textarea
                    required
                    rows={2}
                    placeholder="Taom ta’mi, sifati yoki xizmat haqida fikringiz..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-950 border border-white/10 rounded-lg text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-400 resize-none"
                  />

                  <button
                    type="submit"
                    className="w-full py-2 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Sharhni chop etish</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Modal Footer with Add to Cart */}
            <div className="p-4 border-t border-white/10 bg-stone-900/60 flex items-center justify-between">
              <span className="text-base font-bold text-amber-400 font-serif">
                {formatCurrency(activeDishModal.price)}
              </span>
              <button
                onClick={() => {
                  addToCart(activeDishModal, 1);
                  setActiveDishModal(null);
                }}
                className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Savatchaga qo‘shish</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
