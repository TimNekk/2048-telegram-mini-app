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

    useEffect(() => {
        viewport.expand.ifAvailable();
        eruda.init();

        setTimeout(() => {
            const handleScroll = () => {};

            const container = scrollContainerRef.current;
            container?.addEventListener("scroll", handleScroll);

            return () => {
                container?.removeEventListener("scroll", handleScroll);
            };
        }, 1000);
    }, []);

    return (
        <AppRoot
            appearance={isDark ? "dark" : "light"}
            platform={["macos", "ios"].includes(lp.platform) ? "ios" : "base"}
            style={{
                height: "100lvh",
                overflow: "hidden",
                position: "relative",
            }}
        >
            <div
                ref={scrollContainerRef}
                style={{
                    overflow: "auto",
                    height: "100%",
                    minHeight: "100%",
                    overscrollBehavior: "contain",
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
