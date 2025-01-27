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
    const containerRef = useRef<HTMLDivElement>(null);

    viewport.expand.ifAvailable();

    useEffect(() => {
        eruda.init();
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = (e: Event) => {
            const element = e.target as HTMLDivElement;
            const scrollBottom = element.scrollHeight - element.scrollTop - element.clientHeight;
            const threshold = viewport.safeAreaInsetBottom();

            if (scrollBottom < threshold) {
                e.preventDefault();
                element.scrollTop = element.scrollHeight - element.clientHeight - threshold;
            }

            if (element.scrollTop < 0) {
                e.preventDefault();
                element.scrollTop = 0;
            }
        };

        container.addEventListener("scroll", handleScroll, { passive: false });
        return () => container.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <AppRoot
            appearance={isDark ? "dark" : "light"}
            platform={["macos", "ios"].includes(lp.platform) ? "ios" : "base"}
        >
            <div
                ref={containerRef}
                style={{
                    height: "100dvh",
                    overflowY: "auto",
                    overscrollBehavior: "none",
                    WebkitOverflowScrolling: "touch",
                    position: "relative",
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
