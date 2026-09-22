import React from 'react';
import { StoreCMS } from '../types';
import { Sparkles, FlaskConical, PackageCheck, Award, MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface CreateYourBrandSectionProps {
    cms: StoreCMS;
}

export const CreateYourBrandSection: React.FC<CreateYourBrandSectionProps> = ({ cms }) => {
    const brandData = cms.createYourBrand || {
        title: 'Crea tu marca con nosotros',
        subtitle: 'Desarrollo integral de productos cosméticos en nuestro laboratorio',
        description: 'Tu sueño se puede hacer realidad, crea tu propia marca de productos con nuestro laboratorio.',
        image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&q=85',
        whatsappMessage: '¡Hola! Quiero información para crear mi propia marca de productos con el laboratorio.',
        enabled: true
    };

    if (brandData.enabled === false) return null;

    const whatsappPhone = (cms.whatsappNumber || '5493515056742').replace(/\D/g, '');
    const encodedMsg = encodeURIComponent(
        brandData.whatsappMessage || '¡Hola! Quiero información para crear mi propia marca de productos con el laboratorio.'
    );
    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodedMsg}`;

    return (
        <section id="crea-tu-marca" className="py-16 sm:py-20 bg-neutral-900 text-white relative overflow-hidden border-t border-b border-neutral-800">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-1/4 -mt-20 w-96 h-96 bg-[#E6007E]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-10 -mb-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

                    {/* Left Column: Information & Proposition */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-[#FF80BF] font-semibold tracking-wide uppercase">
                            <FlaskConical className="w-3.5 h-3.5 text-[#FF80BF]" />
                            <span>Laboratorio & Marca Blanca</span>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                                {brandData.title || 'Crea tu marca con nosotros'}
                            </h2>
                            <p className="text-lg sm:text-xl text-[#FF80BF] font-medium">
                                {brandData.subtitle || 'Desarrollo integral de productos cosméticos en nuestro laboratorio'}
                            </p>
                            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed font-light pt-1">
                                "{brandData.description || 'Tu sueño se puede hacer realidad, crea tu propia marca de productos con nuestro laboratorio.'}"
                            </p>
                        </div>

                        {/* Value Pillars Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                            <div className="p-3.5 bg-neutral-800/80 rounded-2xl border border-neutral-700/70 flex items-start gap-3">
                                <div className="w-9 h-9 rounded-xl bg-[#E6007E]/20 text-[#FF80BF] flex items-center justify-center shrink-0 mt-0.5">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">Fórmulas Exclusivas</h4>
                                    <p className="text-xs text-neutral-400 mt-0.5">
                                        Dermocosmética, skincare, capilar, corporal o infantil desarrollada a tu medida.
                                    </p>
                                </div>
                            </div>

                            <div className="p-3.5 bg-neutral-800/80 rounded-2xl border border-neutral-700/70 flex items-start gap-3">
                                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                                    <PackageCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">Packaging & Diseño</h4>
                                    <p className="text-xs text-neutral-400 mt-0.5">
                                        Elegí envases, serigrafía y etiquetas con tu propio logo e identidad de marca.
                                    </p>
                                </div>
                            </div>

                            <div className="p-3.5 bg-neutral-800/80 rounded-2xl border border-neutral-700/70 flex items-start gap-3">
                                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                                    <Award className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">Lotes Iniciales Accesibles</h4>
                                    <p className="text-xs text-neutral-400 mt-0.5">
                                        Arrancá con producciones escalables pensadas para emprendedores y profesionales.
                                    </p>
                                </div>
                            </div>

                            <div className="p-3.5 bg-neutral-800/80 rounded-2xl border border-neutral-700/70 flex items-start gap-3">
                                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">Asesoría Técnica y Registro</h4>
                                    <p className="text-xs text-neutral-400 mt-0.5">
                                        Acompañamiento profesional en todo el proceso de producción y calidad.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Direct CTA */}
                        <div className="pt-3 flex flex-wrap items-center gap-3">
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2.5 bg-[#E6007E] hover:bg-[#C9006B] text-white px-7 py-3.5 rounded-2xl font-bold text-sm sm:text-base shadow-xl transition-transform hover:scale-105 active:scale-95"
                            >
                                <MessageCircle className="w-5 h-5 text-white" />
                                <span>Hablar con un Asesor de Laboratorio</span>
                                <ArrowRight className="w-4 h-4 ml-1" />
                            </a>

                            <a
                                href="#productos"
                                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-sm font-medium border border-neutral-700 transition-colors"
                            >
                                <span>Ver Marcas que Fabricamos</span>
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Lab Aesthetic Photo */}
                    <div className="lg:col-span-5 flex justify-center">
                        <div className="relative w-full max-w-md group">
                            <div className="absolute -inset-1.5 bg-linear-to-r from-[#E6007E] to-cyan-500 rounded-3xl blur-md opacity-40 group-hover:opacity-70 transition duration-500" />
                            <div className="relative rounded-3xl overflow-hidden border border-neutral-700 bg-neutral-800 aspect-4/3 sm:aspect-square shadow-2xl">
                                <img
                                    src={brandData.image || 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&q=85'}
                                    alt="Laboratorio cosmético creando marcas"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4 bg-neutral-900/90 backdrop-blur-md p-4 rounded-2xl border border-neutral-700/80">
                                    <div className="flex items-center gap-2 text-xs font-bold text-[#FF80BF] mb-1">
                                        <Sparkles className="w-3.5 h-3.5" />
                                        <span>Tu Línea Cosmética Terminada</span>
                                    </div>
                                    <p className="text-xs text-neutral-300">
                                        Transformamos tu idea en productos terminados de primera categoría listos para comercializar.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};
