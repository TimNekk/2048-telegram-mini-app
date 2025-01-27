import { useLaunchParams, miniApp, useSignal, viewport } from "@telegram-apps/sdk-react";
import { AppRoot } from "@telegram-apps/telegram-ui";
import { Navigate, Route, Routes, HashRouter } from "react-router-dom";
import { routes } from "@/navigation/routes.tsx";
import GameProvider from "@/components/Game/context/game-context";
import eruda from "eruda";
import { useEffect, useRef } from "react";

export function App() {
    const lp = useLaunchParams();
    const isDark = useSignal(miniApp.isDark);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    viewport.expand.ifAvailable();

    useEffect(() => {
        eruda.init();

        // Handle scroll events if needed for other purposes
        const handleScroll = () => {
            // Add any scroll-related logic here if needed
        };

        const container = scrollContainerRef.current;
        container?.addEventListener("scroll", handleScroll);

        return () => {
            container?.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <AppRoot
            appearance={isDark ? "dark" : "light"}
            platform={["macos", "ios"].includes(lp.platform) ? "ios" : "base"}
        >
            <div
                ref={scrollContainerRef}
                style={{
                    overflow: "auto",
                    height: "100%",
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
