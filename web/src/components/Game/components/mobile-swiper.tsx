import { PropsWithChildren, useCallback, useEffect, useRef, useState } from "react";

export type SwipeInput = { deltaX: number; deltaY: number };

type MobileSwiperProps = PropsWithChildren<{
    onSwipe: (_: SwipeInput) => void;
    disabled?: boolean;
}>;

export default function MobileSwiper({ children, onSwipe, disabled }: MobileSwiperProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const MIN_SWIPE_THRESHOLD = 30; // minimum pixels to trigger a swipe

    const handleTouchStart = useCallback(
        (e: TouchEvent) => {
            if (disabled || !wrapperRef.current?.contains(e.target as Node)) {
                return;
            }

            e.preventDefault();
            setIsSwiping(true);
            setStartX(e.touches[0].clientX);
            setStartY(e.touches[0].clientY);
        },
        [disabled]
    );

    const handleTouchMove = useCallback(
        (e: TouchEvent) => {
            if (!isSwiping || disabled || !wrapperRef.current?.contains(e.target as Node)) {
                return;
            }

            e.preventDefault();
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const deltaX = currentX - startX;
            const deltaY = currentY - startY;

            // Only trigger swipe if we've moved enough distance
            if (Math.abs(deltaX) > MIN_SWIPE_THRESHOLD || Math.abs(deltaY) > MIN_SWIPE_THRESHOLD) {
                onSwipe({ deltaX, deltaY });
                setIsSwiping(false);
                setStartX(0);
                setStartY(0);
            }
        },
        [isSwiping, startX, startY, onSwipe, disabled]
    );

    const handleTouchEnd = useCallback(
        (e: TouchEvent) => {
            if (!isSwiping || disabled || !wrapperRef.current?.contains(e.target as Node)) {
                return;
            }

            e.preventDefault();
            setIsSwiping(false);
            setStartX(0);
            setStartY(0);
        },
        [isSwiping, disabled]
    );

    useEffect(() => {
        window.addEventListener("touchstart", handleTouchStart, { passive: false });
        window.addEventListener("touchmove", handleTouchMove, { passive: false });
        window.addEventListener("touchend", handleTouchEnd, { passive: false });

        return () => {
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

    return <div ref={wrapperRef}>{children}</div>;
}
