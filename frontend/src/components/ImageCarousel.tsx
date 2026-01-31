// ImageCarousel.tsx
import { useState, useEffect } from "react";

interface Props {
  images: { url: string }[];
}

export default function ImageCarousel({ images }: Props) {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-advance carousel when not hovered
  useEffect(() => {
    if (!isHovered && images.length > 1) {
      const timer = setInterval(() => {
        setIndex((prev) => (prev + 1) % images.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [isHovered, images.length]);

  if (!images.length) {
    return (
      <div className="relative w-full h-56 sm:h-64 overflow-hidden rounded-xl bg-gradient-to-br from-violet-50 to-rose-50 flex items-center justify-center">
        <svg className="w-16 h-16 text-violet-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (e: React.MouseEvent, i: number) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex(i);
  };

  return (
    <div
      className="relative w-full h-56 sm:h-64 overflow-hidden rounded-xl bg-gray-100 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Images */}
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((image, i) => (
          <img
            key={i}
            src={`${baseUrl}${image.url}`}
            alt={`Product image ${i + 1}`}
            className="w-full h-full object-cover flex-shrink-0"
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0"
            aria-label="Previous image"
          >
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0"
            aria-label="Next image"
          >
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => goToSlide(e, i)}
              className={`transition-all duration-300 rounded-full ${
                i === index
                  ? "w-6 h-2 bg-white"
                  : "w-2 h-2 bg-white/60 hover:bg-white/80"
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs font-medium">
          {index + 1} / {images.length}
        </div>
      )}
    </div>
  );
}