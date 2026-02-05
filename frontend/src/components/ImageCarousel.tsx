import { useState, useEffect } from "react";

interface Props {
  images: { url: string }[];
  variant?: "card" | "details";
}

export default function ImageCarousel({
  images,
  variant = "card",
}: Props) {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

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
      <div className="aspect-[4/3] w-full rounded-xl bg-gray-100 flex items-center justify-center">
        No Image
      </div>
    );
  }

  /* ✅ Size control */
  const containerClass =
    variant === "details"
      ? "aspect-[1/1] sm:aspect-[4/3] lg:aspect-[1/1]"
      : "aspect-[4/3]";

  return (
    <div
      className={`relative w-full ${containerClass} overflow-hidden rounded-2xl bg-gray-100 group`}
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
            className="w-full h-full flex-shrink-0 bg-white"
          />
        ))}
      </div>

      {/* Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIndex((i) => (i - 1 + images.length) % images.length);
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow opacity-0 group-hover:opacity-100 transition"
          >
            ‹
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIndex((i) => (i + 1) % images.length);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow opacity-0 group-hover:opacity-100 transition"
          >
            ›
          </button>
        </>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setIndex(i);
              }}
              className={`rounded-full transition-all ${
                i === index
                  ? "w-6 h-2 bg-white"
                  : "w-2 h-2 bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}