import { useLaunchParams, miniApp, useSignal, viewport } from "@telegram-apps/sdk-react";
import { AppRoot } from "@telegram-apps/telegram-ui";
import { Navigate, Route, Routes, HashRouter } from "react-router-dom";
import { useEffect, useRef } from "react"; // Added useRef

import { routes } from "@/navigation/routes.tsx";
import GameProvider from "@/components/Game/context/game-context";
import eruda from "eruda";

export function App() {
    const lp = useLaunchParams();
    const isDark = useSignal(miniApp.isDark);
    const containerRef = useRef<HTMLDivElement>(null); // Added ref

    viewport.expand.ifAvailable();

    useEffect(() => {
        eruda.init();
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let touchStartY = 0;

        const handleTouchStart = (e: TouchEvent) => {
            touchStartY = e.touches[0].clientY;
        };

        const handleTouchMove = (e: TouchEvent) => {
            const currentY = e.touches[0].clientY;
            const deltaY = touchStartY - currentY;
            touchStartY = currentY;

            const threshold = viewport.safeAreaInsetBottom();
            const maxScrollTop = container.scrollHeight - container.clientHeight - threshold;
            const currentScrollTop = container.scrollTop;

            // Prevent scroll down when at bottom
            if (currentScrollTop >= maxScrollTop && deltaY < 0) {
                e.preventDefault();
            }
        };

        const handleWheel = (e: WheelEvent) => {
            const threshold = viewport.safeAreaInsetBottom();
            const maxScrollTop = container.scrollHeight - container.clientHeight - threshold;
            const currentScrollTop = container.scrollTop;

            // Prevent wheel scroll down when at bottom
            if (currentScrollTop >= maxScrollTop && e.deltaY > 0) {
                e.preventDefault();
            }
        };

        // Keep existing scroll handler as fallback
        const handleScroll = () => {
            const threshold = viewport.safeAreaInsetBottom();
            const maxScrollTop = container.scrollHeight - container.clientHeight - threshold;

            if (container.scrollTop > maxScrollTop) {
                container.scrollTop = maxScrollTop;
            }
        };

        container.addEventListener("touchstart", handleTouchStart, { passive: true });
        container.addEventListener("touchmove", handleTouchMove, { passive: false });
        container.addEventListener("wheel", handleWheel, { passive: false });
        container.addEventListener("scroll", handleScroll);

        return () => {
            container.removeEventListener("touchstart", handleTouchStart);
            container.removeEventListener("touchmove", handleTouchMove);
            container.removeEventListener("wheel", handleWheel);
            container.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <AppRoot
            appearance={isDark ? "dark" : "light"}
            platform={["macos", "ios"].includes(lp.platform) ? "ios" : "base"}
        >
            {/* Added scroll container div */}
            <div
                ref={containerRef}
                style={{
                    height: "100dvh",
                    overflowY: "auto",
                    overscrollBehaviorY: "contain",
                }}
            >
                <HashRouter>
                    <GameProvider>
                        <Routes>
                            {routes.map((route) => (
                                <Route key={route.path} {...route} />
                            ))}
                            <Route path="/" element={<Navigate to="/game" />} />
                            <Route path="*" element={<Navigate to="/game" />} />
                        </Routes>
                    </GameProvider>
                </HashRouter>
            </div>
        </AppRoot>
    );
}
