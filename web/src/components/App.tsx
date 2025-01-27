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

    // Added scroll control effect
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollBottom =
                container.scrollHeight - container.scrollTop - container.clientHeight;
            const threshold = viewport.safeAreaInsetBottom();

            if (scrollBottom < threshold) {
                container.scrollTop = container.scrollHeight - container.clientHeight - threshold;
            }
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
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
