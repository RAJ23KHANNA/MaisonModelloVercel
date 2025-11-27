import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Circle, Loader } from "lucide-react";

// --- Types ---
interface MediaItemProps {
  media: { id: number; type: "image" | "video"; url: string; alt: string };
  isActive: boolean;
  onLoadComplete: (id: number) => void;
}

interface MediaCarouselProps {
  urls: string[];
}

/**
 * 1. MediaItem Component
 * (Logic: Handles rendering, loading states, and autoplay)
 */
const MediaItem: React.FC<MediaItemProps> = React.memo(({ media, isActive, onLoadComplete }) => {
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.muted = true;
      video.currentTime = 0;
      video.play().catch((e) => console.error(`Video Autoplay Failed for ID ${media.id}:`, e));
    } else {
      video.pause();
    }
  }, [isActive, media.type, media.id]);

  const handleLoad = () => {
    if (isLoading) setIsLoading(false);
    onLoadComplete(media.id);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement | HTMLVideoElement, Event>) => {
    setIsLoading(false);
    onLoadComplete(media.id);
    if (media.type === 'image') {
       const target = e.currentTarget as HTMLImageElement;
       target.onerror = null;
       target.src = `https://placehold.co/400x400/e0e0e0/333333?text=Load+Error`;
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/20 animate-pulse z-10">
          <Loader className="w-6 h-6 text-gray-400 animate-spin" />
        </div>
      )}

      {media.type === "image" ? (
        <img
          src={media.url}
          alt={media.alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          draggable="false"
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
      ) : (
        <video
          ref={videoRef}
          src={media.url}
          controls
          playsInline
          loop
          muted
          className={`w-full h-full object-contain transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoadedData={handleLoad}
          onError={handleError}
        >
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
});

/**
 * 2. Main MediaCarousel Component
 * Logic: Robust Flex/Transform (from Fix)
 * Styling: Exact UI matches Reference (Dots Top-Right, Counter Bottom-Right, Small Buttons)
 */
export default function MediaCarousel({ urls }: MediaCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedMediaIds, setLoadedMediaIds] = useState<Set<number>>(new Set());

  if (!urls || urls.length === 0) return null;

  const media = useMemo(() => urls.map((url, i) => ({
    id: i,
    type: url.match(/\.(mp4|mov|webm|ogg)$/i) ? "video" : "image",
    url,
    alt: `Media slide ${i + 1}`,
  })), [urls]);

  const mediaCount = media.length;

  // --- Navigation Logic (Infinite Loop) ---
  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + mediaCount) % mediaCount);
  }, [mediaCount]);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % mediaCount);
  }, [mediaCount]);

  const handleLoadComplete = useCallback((id: number) => {
    setLoadedMediaIds((prev) => new Set(prev).add(id));
  }, []);

  // --- Touch Swipe Logic ---
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    const swipeThreshold = 50;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) goNext();
      else if (diff < 0) goPrev();
    }
    setTouchStart(null);
  };

  // Inline styles from your reference to ensure exact positioning
  const right3Style = { right: '0.75rem' }; 
  const bottom3Style = { bottom: '0.75rem' };
  const top3Style = { top: '0.75rem' };

  return (
    <div className="relative w-full max-w-lg mx-auto overflow-hidden shadow-xl rounded-xl border border-gray-200">
      <div
        className="relative bg-black overflow-hidden w-full cursor-grab active:cursor-grabbing min-w-0"
        style={{ aspectRatio: "1 / 1" }} 
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Sliding Container Logic (Keeps the bug fix) */}
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${activeIndex * 100}%)`,
          }}
        >
          {media.map((item, i) => {
            const shouldRender =
              i === activeIndex ||
              i === (activeIndex - 1 + mediaCount) % mediaCount ||
              i === (activeIndex + 1) % mediaCount ||
              loadedMediaIds.has(item.id);

            return (
              <div 
                key={item.id} 
                className="min-w-full w-full h-full flex-shrink-0"
              >
                {shouldRender ? (
                  <MediaItem
                    media={item as any}
                    isActive={i === activeIndex}
                    onLoadComplete={handleLoadComplete}
                  />
                ) : (
                  <div className="w-full h-full bg-black" />
                )}
              </div>
            );
          })}
        </div>

        {/* --- Navigation Arrows (Restored to your Styling: w-8 h-8, bg-black/40) --- */}
        {mediaCount > 1 && (
          <>
            <button
              onClick={goPrev}
              aria-label="Previous Media"
              className="absolute left-3 top-1/2 -translate-y-1/2 
                bg-black/40 hover:bg-black/70 text-white w-8 h-8 rounded-full 
                flex items-center justify-center backdrop-blur-sm z-20 transition-all duration-150 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={goNext}
              aria-label="Next Media"
              style={right3Style}
              className="absolute right-3 top-1/2 -translate-y-1/2 
                bg-black/40 hover:bg-black/70 text-white w-8 h-8 rounded-full 
                flex items-center justify-center backdrop-blur-sm z-20 transition-all duration-150 active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* --- Top-Right Dots (Restored to Top Right) --- */}
        {mediaCount > 1 && (
          <div
            className="absolute top-3 right-3 flex gap-1.5 bg-black/40 rounded-full px-2 py-1 backdrop-blur-sm z-20"
            style={{...top3Style, ...right3Style}}
          >
            {media.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className="p-0.5"
                aria-label={`Go to media ${idx + 1}`}
              >
                <Circle
                  className={`w-2 h-2 fill-current transition-colors duration-200 ${
                    idx === activeIndex ? "text-white scale-110" : "text-white/40 hover:text-white/70"
                  }`}
                />
              </button>
            ))}
          </div>
        )}

        {/* --- Bottom-Right Slide Counter (Restored to Bottom Right, Text Only) --- */}
        {mediaCount > 1 && (
          <div
            className="absolute bottom-3 right-3 bg-black/40 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm z-20 font-semibold"
            style={{...bottom3Style, ...right3Style}}
          >
            {activeIndex + 1} / {mediaCount}
          </div>
        )}
      </div>
    </div>
  );
}