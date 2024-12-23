import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export type SwipeInput = { deltaX: number; deltaY: number };

type MobileSwiperProps = PropsWithChildren<{
  onSwipe: (_: SwipeInput) => void;
  disabled?: boolean;
}>;

export default function MobileSwiper({ children, onSwipe, disabled }: MobileSwiperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (disabled || !wrapperRef.current?.contains(e.target as Node)) {
      return;
    }

    e.preventDefault();

    setStartX(e.touches[0].clientX);
    setStartY(e.touches[0].clientY);
  }, [disabled]);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (disabled || !wrapperRef.current?.contains(e.target as Node)) {
        return;
      }

      e.preventDefault();

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;

      onSwipe({ deltaX, deltaY });

      setStartX(0);
      setStartY(0);
    },
    [startX, startY, onSwipe, disabled],
  );

  useEffect(() => {
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd]);

  return <div ref={wrapperRef}>{children}</div>;
}
