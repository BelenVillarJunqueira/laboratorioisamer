import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { CarouselSlide } from '../types';

interface HeroCarouselProps {
  slides: CarouselSlide[];
  onCtaClick?: (link: string) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ slides, onCtaClick }) => {
  const activeSlides = (slides && slides.length > 0 ? slides : []).filter(s => s.active !== false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const timerRef = useRef<any>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const safeIndex = activeSlides.length > 0 ? currentIndex % activeSlides.length : 0;

  // Auto-play interval
  useEffect(() => {
    if (isPaused || activeSlides.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, activeSlides.length]);

  const handlePrev = () => {
    if (activeSlides.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? activeSlides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (activeSlides.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
  };

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (touchStartXRef.current !== null && touchEndXRef.current !== null) {
      const distance = touchStartXRef.current - touchEndXRef.current;
      const minSwipeDistance = 40;
      if (distance > minSwipeDistance) {
        handleNext();
      } else if (distance < -minSwipeDistance) {
        handlePrev();
      }
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  if (activeSlides.length === 0) {
    return (
      <div className="w-full h-80 bg-neutral-100 flex items-center justify-center text-neutral-500">
        No hay slides activos configurados en el panel.
      </div>
    );
  }

  const currentSlide = activeSlides[safeIndex] || activeSlides[0];

  return (
    <div
      id="hero-carousel-section"
      className="relative w-full h-120 sm:h-135 lg:h-155 overflow-hidden bg-neutral-900 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides rendered with smooth opacity transitions */}
      {activeSlides.map((slide, idx) => {
        const isCurrent = idx === safeIndex;
        return (
          <div
            key={slide.id || idx}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Media: Image or Video */}
            {slide.video ? (
              <video
                src={slide.video}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            )}

            {/* Premium Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/55 to-transparent sm:from-black/75" />

            {/* Video sound toggle if video slide */}
            {slide.video && isCurrent && (
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="absolute top-4 right-4 z-20 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-xs transition-colors"
                title={isMuted ? 'Activar sonido' : 'Silenciar'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            )}

            {/* Content Container - with bottom padding on mobile so controls never overlap */}
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="max-w-7xl mx-auto px-5 sm:px-12 lg:px-14 w-full pb-16 sm:pb-0">
                <div
                  className={`max-w-xl space-y-2.5 sm:space-y-4 ${
                    slide.align === 'center'
                      ? 'mx-auto text-center'
                      : slide.align === 'right'
                      ? 'ml-auto text-right'
                      : 'text-left'
                  }`}
                >
                  {/* Badge */}
                  {slide.badge && (
                    <div className="inline-flex items-center gap-1.5 bg-[#E6007E] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{slide.badge}</span>
                    </div>
                  )}

                  {/* Title */}
                  <h1 className="font-['Playfair_Display'] text-2xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
                    {slide.title}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-xs sm:text-lg text-neutral-200 font-light max-w-lg leading-relaxed line-clamp-3 sm:line-clamp-none">
                    {slide.subtitle}
                  </p>

                  {/* Highlight callout */}
                  {slide.highlightText && (
                    <div className="text-[#FBCFE8] font-semibold text-xs sm:text-sm tracking-wide">
                      ✦ {slide.highlightText}
                    </div>
                  )}

                  {/* CTA Button */}
                  <div className="pt-1.5 sm:pt-2">
                    <a
                      href={slide.buttonLink || '#productos'}
                      onClick={(e) => {
                        if (onCtaClick) {
                          e.preventDefault();
                          onCtaClick(slide.buttonLink || '#productos');
                        }
                      }}
                      className="inline-flex items-center justify-center gap-2 bg-[#E6007E] hover:bg-[#C9006B] text-white font-bold text-xs sm:text-base px-6 sm:px-7 py-3 sm:py-3.5 rounded-full shadow-lg hover:shadow-pink-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <span>{slide.buttonText || 'Comprar Ahora'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows: Relocated to bottom on mobile so they NEVER cover the text */}
      {activeSlides.length > 1 && (
        <>
          <button
            id="carousel-prev-btn"
            onClick={handlePrev}
            className="absolute bottom-3.5 left-3 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:left-6 z-30 p-2 sm:p-3 rounded-full bg-black/50 sm:bg-white/20 hover:bg-black/70 sm:hover:bg-white/40 text-white backdrop-blur-md transition-all shadow-md active:scale-95 focus:outline-none cursor-pointer border border-white/20 sm:border-transparent flex items-center justify-center"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>
          <button
            id="carousel-next-btn"
            onClick={handleNext}
            className="absolute bottom-3.5 right-3 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:right-6 z-30 p-2 sm:p-3 rounded-full bg-black/50 sm:bg-white/20 hover:bg-black/70 sm:hover:bg-white/40 text-white backdrop-blur-md transition-all shadow-md active:scale-95 focus:outline-none cursor-pointer border border-white/20 sm:border-transparent flex items-center justify-center"
            aria-label="Slide siguiente"
          >
            <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>
        </>
      )}

      {/* Slide Dots Indicator */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-3.5 sm:bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/40 backdrop-blur-xs px-3 py-1.5 rounded-full border border-white/10">
          {activeSlides.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setCurrentIndex(dotIdx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                dotIdx === safeIndex
                  ? 'w-6 bg-[#E6007E]'
                  : 'w-2 bg-white/60 hover:bg-white'
              }`}
              aria-label={`Ir al slide ${dotIdx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};