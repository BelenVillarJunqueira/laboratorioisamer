import React from 'react';
import { ShieldCheck, Heart, Truck, Sparkles, MessageCircle, Instagram, Mail, Lock, PackageCheck } from 'lucide-react';
import { StoreCMS } from '../types';

interface FooterProps {
  cms: StoreCMS;
  onOpenTracking: () => void;
  onOpenAdminAuth: () => void;
}

export const Footer: React.FC<FooterProps> = ({ cms, onOpenTracking, onOpenAdminAuth }) => {
  return (
    <footer className="bg-[#1C1917] text-white pt-14 pb-8 border-t border-[#302B2C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main 4-column footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="font-['Playfair_Display'] text-2xl font-extrabold tracking-tight text-white block">
                {cms.storeName || 'ISAMER'}
              </span>
              <span className="text-[11px] uppercase tracking-[0.35em] text-[#9E8B92] font-bold">
                {cms.storeTagline || 'LAB'}
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {cms.footerAbout ||
                'ISAMER LAB - Laboratorio de alta cosmética y catálogo multimarca: H2Derm, SoftCare, Mimitos y Le Salon. Fórmulas dermatológicas desarrolladas con los más altos estándares de pureza y biotecnología.'}
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-[10px] bg-pink-900/60 text-pink-300 font-bold px-2.5 py-1 rounded-full border border-pink-700/50">
                Cruelty Free Oficial
              </span>
              <span className="text-[10px] bg-neutral-800 text-neutral-300 font-bold px-2.5 py-1 rounded-full">
                Hecho en Argentina
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest text-[#FF80BF]">
              Navegación
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <a href="#productos" className="hover:text-white transition-colors">
                  Línea Rostro (6 Favoritos)
                </a>
              </li>
              <li>
                <a href="#especial-madre" className="hover:text-white transition-colors">
                  Campaña Día de la Madre
                </a>
              </li>
              <li>
                <button onClick={onOpenTracking} className="hover:text-white transition-colors flex items-center gap-1">
                  <PackageCheck className="w-3.5 h-3.5 text-[#E6007E]" />
                  <span>Seguimiento de mi Compra</span>
                </button>
              </li>
              <li>
                <a href="#beneficios" className="hover:text-white transition-colors">
                  Formas de Envío y Pagos
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Attention */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">
              Atención al Cliente
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <a
                  href={`https://wa.me/${cms.whatsappNumber.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>WhatsApp: +{cms.whatsappNumber}</span>
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-pink-400 shrink-0" />
                <span>{cms.instagramHandle || '@isamer.lab'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>{cms.emailContact || 'contacto@isamerlab.com'}</span>
              </li>
              <li className="text-[11px] text-neutral-500 pt-1">
                Lunes a Viernes de 9:00 a 18:00 hs.
              </li>
            </ul>
          </div>

          {/* Payment & Security Badges */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">
              Medios de Pago Seguros
            </h4>
            <p className="text-xs text-neutral-400">
              Aceptamos Mercado Pago, tarjetas de crédito (3 y 6 cuotas) y transferencias bancarias con 10% OFF.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2 py-1 bg-neutral-800 rounded text-[10px] font-bold text-[#009EE3]">
                Mercado Pago
              </span>
              <span className="px-2 py-1 bg-neutral-800 rounded text-[10px] font-bold text-emerald-400">
                Galicia CBU
              </span>
              <span className="px-2 py-1 bg-neutral-800 rounded text-[10px] font-bold text-neutral-200">
                Visa / Mastercard
              </span>
              <span className="px-2 py-1 bg-neutral-800 rounded text-[10px] font-bold text-amber-300">
                Crédito / Débito
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Transacciones 100% Cifradas SSL</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} {cms.storeName}. Todos los derechos reservados.</p>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenTracking}
              className="hover:text-neutral-300 transition-colors"
            >
              Rastrear Pedido
            </button>
            <span>•</span>
            <button
              onClick={onOpenAdminAuth}
              className="hover:text-neutral-300 transition-colors flex items-center gap-1"
              title="Acceso Administración"
            >
              <Lock className="w-3 h-3" />
              <span>Admin</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
