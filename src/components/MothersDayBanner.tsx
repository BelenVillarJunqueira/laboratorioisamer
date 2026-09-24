import React from 'react';
import { Gift, Heart, Sparkles, Truck, CreditCard, ShieldCheck } from 'lucide-react';
import { StoreCMS } from '../types';

interface MothersDayBannerProps {
  cms: StoreCMS;
  onExplorePack: () => void;
}

export const MothersDayBanner: React.FC<MothersDayBannerProps> = ({ cms, onExplorePack }) => {
  return (
    <section id="especial-madre" className="py-12 sm:py-16 bg-linear-to-b from-[#FFF5F8] to-[#FFFDFB] border-b border-[#FCE7F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Banner Box */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#2B091B] via-[#4A0E30] to-[#2B091B] text-white shadow-xl p-8 sm:p-12 lg:p-14">
          {/* Subtle floral/glamour glow decoration */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-[#E6007E]/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-60 h-60 bg-[#FF80BF]/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Copy side */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2 bg-[#E6007E] text-white text-xs uppercase font-extrabold tracking-widest px-3.5 py-1.5 rounded-full shadow-xs">
                <Heart className="w-3.5 h-3.5 fill-white" />
                <span>Edición Especial Día de la Madre</span>
              </div>

              <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {cms.mothersDayPromoTitle || 'Celebrá a Mamá con Belleza Auténtica'}
              </h2>

              <p className="text-neutral-200 text-sm sm:text-base leading-relaxed max-w-xl">
                {cms.mothersDayPromoSubtitle || 'Sorprendela con nuestra línea para el rostro formulada para realzar su belleza natural con máxima duración y confort.'}
              </p>

              {/* Promo highlights pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/10">
                  <Gift className="w-5 h-5 text-[#FF80BF] shrink-0" />
                  <span className="text-xs sm:text-sm text-neutral-100 font-medium">
                    Packaging de Regalo
                  </span>
                </div>
                <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/10">
                  <CreditCard className="w-5 h-5 text-[#FF80BF] shrink-0" />
                  <span className="text-xs sm:text-sm text-neutral-100 font-medium">
                    3 y 6 Cuotas con todas las tarjetas
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  id="mothers-day-explore-btn"
                  onClick={onExplorePack}
                  className="bg-[#E6007E] hover:bg-[#C9006B] text-white font-bold text-sm sm:text-base px-8 py-3.5 rounded-full shadow-lg hover:shadow-pink-500/30 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Ver Set Rutina Facial Mamá</span>
                </button>
                <span className="text-xs text-pink-200 font-medium tracking-wide">
                  {cms.mothersDayPromoDiscount || '10% de descuento extra abonando por Transferencia'}
                </span>
              </div>
            </div>

            {/* Media side */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group max-w-sm sm:max-w-md w-full">
                <div className="absolute -inset-1 bg-linear-to-r from-pink-500 to-rose-400 rounded-2xl blur-sm opacity-50 group-hover:opacity-80 transition duration-500" />
                <div className="relative overflow-hidden rounded-2xl border border-white/20 aspect-4/3 sm:aspect-square">
                  <img
                    src={cms.mothersDayPromoBanner || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=85'}
                    alt="Set Día de la Madre Rutina Facial ISAMER LAB"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md rounded-xl p-3 text-center border border-white/15">
                    <span className="text-xs font-bold text-amber-300 block">✦ Pack de lujo Listo Para Regalar ✦</span>
                    <span className="text-[11px] text-neutral-300">Crema Hidratante + Serum Liposomado + Contorno + Gel Limpiador + Agua Micelar</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Value badges below banner */}
        <div id="beneficios" className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-4">
          <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-[#F3E7EC] shadow-xs">
            <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-[#E6007E] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900">Envíos a Todo el País</h4>
              <p className="text-[11px] text-gray-500">No Te lo pierdas</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-[#F3E7EC] shadow-xs">
            <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-[#E6007E] shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900">3 y 6 Cuotas</h4>
              <p className="text-[11px] text-gray-500">Mercado Pago & Tarjetas</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-[#F3E7EC] shadow-xs">
            <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-[#E6007E] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900">Calidad Dermatológica</h4>
              <p className="text-[11px] text-gray-500">100% Cruelty Free Oficial</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-[#F3E7EC] shadow-xs">
            <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-[#E6007E] shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900">10% OFF Transferencia</h4>
              <p className="text-[11px] text-gray-500">Descuento automático</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
