import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notification } = useRestaurant();

  if (!notification) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-400 shrink-0" />
  };

  const bgStyles = {
    success: 'border-emerald-500/40 bg-slate-900/95 text-emerald-100 shadow-emerald-500/10',
    warning: 'border-amber-500/40 bg-slate-900/95 text-amber-100 shadow-amber-500/10',
    info: 'border-sky-500/40 bg-slate-900/95 text-sky-100 shadow-sky-500/10'
  };

  return (
    <div className="fixed top-5 right-5 z-50 max-w-md animate-in fade-in slide-in-from-top-4 duration-200">
      <div
        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border backdrop-blur-md shadow-2xl ${bgStyles[notification.type]}`}
      >
        {icons[notification.type]}
        <p className="text-sm font-medium tracking-wide">{notification.message}</p>
      </div>
    </div>
  );
};
