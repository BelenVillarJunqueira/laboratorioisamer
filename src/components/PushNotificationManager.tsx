import React, { useState, useEffect } from 'react';
import { Bell, Sparkles, X, Check, Gift, Heart, Send } from 'lucide-react';
import { PushNotification } from '../types';
import { api } from '../services/api';
import { formatDate } from '../utils/formatters';

interface PushNotificationManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationClick?: (url?: string) => void;
}

export const PushNotificationManager: React.FC<PushNotificationManagerProps> = ({
  isOpen,
  onClose,
  onNotificationClick
}) => {
  const [subscribed, setSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(142);
  const [notifications, setNotifications] = useState<PushNotification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    try {
      const data = await api.getPushList();
      setSubscribersCount(data.subscribersCount || 142);
      setNotifications(data.notifications || []);
    } catch {
      // ignore
    }
  };

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      if ('Notification' in window) {
        try {
          await Notification.requestPermission();
        } catch {
          // ignore
        }
      }
      const res = await api.subscribePush();
      setSubscribersCount(res.subscribersCount);
      setSubscribed(true);
    } catch {
      setSubscribed(true);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 my-auto">
        
        {/* Header */}
        <div className="p-6 bg-linear-to-r from-[#E6007E] to-[#8C004B] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <Bell className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="font-bold text-base">Notificaciones Push</h3>
              <p className="text-xs text-pink-100">Ofertas y estado de tus compras en directo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* Permission Card */}
          <div className="bg-pink-50/70 p-4 rounded-2xl border border-pink-100 text-center space-y-3">
            <div className="inline-flex items-center gap-1 bg-[#E6007E] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" />
              <span>{subscribersCount} clientas ya reciben alertas</span>
            </div>

            <p className="text-xs text-gray-700 leading-relaxed">
              Enterate antes que nadie del lanzamiento de promociones flash para el Día de la Madre y el estado de tu pedido sin abrir el correo.
            </p>

            <button
              onClick={handleSubscribe}
              disabled={subscribed || loading}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 ${
                subscribed
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#E6007E] hover:bg-[#C9006B] text-white'
              }`}
            >
              {subscribed ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>¡Notificaciones Activadas!</span>
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  <span>{loading ? 'Activadas...' : 'Activar Notificaciones en mi dispositivo'}</span>
                </>
              )}
            </button>
          </div>

          {/* Recent broadcast history */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center justify-between">
              <span>Mensajes Recientes</span>
              <span className="text-[10px] text-gray-400 font-normal">Bandeja en Vivo</span>
            </h4>

            <div className="space-y-2.5 max-h-60 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-4">No hay notificaciones emitidas aún.</p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (onNotificationClick) {
                        onNotificationClick(n.url);
                        onClose();
                      }
                    }}
                    className="p-3 bg-neutral-50 hover:bg-pink-50/50 rounded-2xl border border-neutral-200/80 transition-colors cursor-pointer text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-[#E6007E]" />
                        {n.title}
                      </span>
                      <span className="text-[10px] text-gray-400">{formatDate(n.sentAt)}</span>
                    </div>
                    <p className="text-gray-600 text-[11px] leading-relaxed">{n.body}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};