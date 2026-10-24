import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Star, MessageSquare, Send, Quote, Sparkles } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const { reviews, addReview } = useRestaurant();
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;

    addReview({
      authorName: authorName.trim(),
      rating,
      comment: comment.trim(),
    });

    setAuthorName('');
    setComment('');
  };

  return (
    <section id="reviews" className="py-20 bg-stone-950 text-stone-100 border-t border-amber-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mehmonlarimiz Fikrlari</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Mijozlarimiz Savoria Restorani Haqida
          </h2>
          <p className="text-stone-400 text-xs sm:text-sm">
            Har bir fikr biz uchun qadrli bo‘lib, xizmat sifatini yanada mukammal qilishga yordam beradi.
          </p>
        </div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {reviews.slice(0, 6).map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-stone-900/60 border border-white/5 relative flex flex-col justify-between hover:border-amber-500/30 transition-all shadow-lg"
            >
              <div>
                <Quote className="w-8 h-8 text-amber-500/20 mb-3" />
                <p className="text-sm text-stone-300 leading-relaxed mb-4 italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-stone-100">{rev.authorName}</h4>
                  <span className="text-[11px] text-stone-500">{rev.date}</span>
                </div>
                <div className="flex gap-1 text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Leave Review Form */}
        <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-2xl bg-stone-900/80 border border-amber-500/20 shadow-xl">
          <h3 className="font-serif text-xl font-bold text-stone-100 mb-1 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            <span>Fikringizni Qoldiring</span>
          </h3>
          <p className="text-xs text-stone-400 mb-6">
            Restoranimizda bo‘lgan taassurotlaringiz bilan bo‘lishing.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">Ismingiz</label>
                <input
                  type="text"
                  required
                  placeholder="Ismingizni kiriting"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-white/10 rounded-xl text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">Baholash</label>
                <div className="flex items-center gap-1.5 h-[42px] bg-stone-950 px-3 rounded-xl border border-white/10">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="cursor-pointer"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          star <= rating ? 'fill-amber-400 text-amber-400' : 'text-stone-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-amber-400 font-bold ml-2">{rating} / 5</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">Fikringiz</label>
              <textarea
                required
                rows={3}
                placeholder="Taomlar, xizmat ko‘rsatish va atmosfera haqida fikringiz..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-950 border border-white/10 rounded-xl text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md shadow-amber-500/20"
            >
              <Send className="w-4 h-4" />
              <span>Sharhni yuborish</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
